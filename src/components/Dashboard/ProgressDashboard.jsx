import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';
import { aiCoach } from '../../ai/aiCoach';
import { adaptiveEngine } from '../../ai/adaptiveEngine';
import { useMasterStudyPlan } from '../../hooks/useMasterStudyPlan';
import { useGateExamDates } from '../../hooks/useGateExamDates';
import { getDaysLeftLabel } from '../../utils/gateExamDates';
import { getEffectiveToday } from '../../utils/dayBoundary';
import { getAllSyllabusIds } from '../../data/syllabus';
import { SUBJECTS } from '../../data/subjects';
import { buildSubjectPriority, getPrioritizedWeakSubjects } from '../../ai/prioritization';

import TodaySchedulePanel from './TodaySchedulePanel';
import SubjectProgressGrid from './SubjectProgressGrid';
import SyllabusHeatmap from './SyllabusHeatmap';
import PYQTrackerPanel from './PYQTrackerPanel';
import ScheduleProjectionChart from './ScheduleProjectionChart';

const SUBJECT_LIST = Object.values(SUBJECTS);
const subjectName = (id) => SUBJECT_LIST.find((s) => s.id === id)?.name || id;
const dayKey = (d) => (d ? String(d).slice(0, 10) : null);

// Accuracy → semantic meter color.
function accColor(acc) {
    if (acc < 55) return 'var(--deck-bad)';
    if (acc < 68) return 'var(--deck-warn)';
    if (acc < 78) return 'var(--deck-gold)';
    return 'var(--deck-green)';
}

const HEAT_PALETTE = ['#0f1a17', '#173a30', '#2f7d5f', '#37d399'];
const MISSION_XP = { study: 40, pyq: 60, test: 60, exam: 80, practice: 40, revision: 30 };

export default function ProgressDashboard() {
    const navigate = useNavigate();
    const { gateCse } = useGateExamDates();
    const {
        currentDay,
        planStartDate,
        activePlanId,
        user,
        tasks,
        pyqAttempts,
        sessions,
        mistakes,
        dailyTip,
        setDailyTip,
        completedSyllabusTopics,
        completedPyqTopics,
        planProgress,
        topicStrengths,
        subjectStats,
        settings,
    } = useAppStore();
    const weakAreaFocus = settings?.weakAreaFocus;

    const studyPlan = useMasterStudyPlan();
    const totalPlanDays = studyPlan.length;
    const dayPlan = useMemo(
        () => studyPlan.find((d) => d.day === currentDay) || studyPlan[0],
        [studyPlan, currentDay]
    );

    // Custom plans (e.g. Ishika's weekly battle plan) drive the AI coach off
    // the plan's own phases instead of the built-in 311-day phase model.
    const planContext = useMemo(() => (
        activePlanId
            ? { totalDays: totalPlanDays, phase: dayPlan?.phase, phaseSubtitle: dayPlan?.phaseSubtitle }
            : null
    ), [activePlanId, totalPlanDays, dayPlan]);

    const allIds = useMemo(() => getAllSyllabusIds(), []);
    const syllabusCount = completedSyllabusTopics.filter((id) => allIds.includes(id)).length;

    useEffect(() => {
        const tip = aiCoach.generateDailyTip(currentDay, tasks, pyqAttempts);
        setDailyTip(tip);
    }, [currentDay, planStartDate, tasks, pyqAttempts, setDailyTip]);

    const cseCountdown = getDaysLeftLabel(gateCse);
    const daysUntilExam = cseCountdown.days < 0 ? '—' : cseCountdown.days;
    const completedTasks = tasks.filter((t) => t.completed).length;

    const readinessScore = adaptiveEngine.calculateReadinessScore(
        sessions, pyqAttempts, mistakes, currentDay, tasks
    );

    // Plan-phase strategy (custom plans surface their own phases via planContext)
    const recommendation = aiCoach.getDailyRecommendation(currentDay, {}, tasks, planStartDate, planContext);
    const strategicAdvice = aiCoach.getStrategicAdvice(currentDay, planStartDate, planContext);

    // ---- weak-area priority (reuses the tunable focus engine) ----
    const priorityMap = useMemo(
        () => buildSubjectPriority({
            topicStrengths, pyqAttempts, subjectStats,
            completedSyllabusTopics, focus: weakAreaFocus,
        }),
        [topicStrengths, pyqAttempts, subjectStats, completedSyllabusTopics, weakAreaFocus]
    );
    const weakRanked = useMemo(() => getPrioritizedWeakSubjects(priorityMap), [priorityMap]);
    const topWeakSubject = weakRanked[0]?.subjectId;

    // ---- XP / level / streak / today's XP (derived from real activity) ----
    const { totalXP, todayXP, level, xpToNext, streak, daysLogged } = useMemo(() => {
        const byDate = {};
        const bump = (iso, amt) => {
            const k = dayKey(iso);
            if (!k) return;
            byDate[k] = (byDate[k] || 0) + amt;
        };
        sessions.forEach((s) => bump(s.date, Math.max(3, Math.round((s.duration || 0) / 6))));
        pyqAttempts.forEach((a) =>
            bump(a.timestamp, (a.correct || 0) * 3 + Math.max(0, (a.total || 0) - (a.correct || 0)))
        );
        const activity = Object.values(byDate).reduce((a, b) => a + b, 0);
        const total = activity + completedTasks * 15 + syllabusCount * 5;

        const todayK = dayKey(getEffectiveToday().toISOString());
        const today = byDate[todayK] || 0;

        // consecutive-day streak ending today (or yesterday if today empty)
        const active = new Set(Object.keys(byDate));
        pyqAttempts.forEach((a) => active.add(dayKey(a.timestamp)));
        mistakes.forEach((m) => active.add(dayKey(m.timestamp)));
        active.delete(null);
        let st = 0;
        const cursor = new Date(getEffectiveToday());
        if (!active.has(dayKey(cursor.toISOString()))) cursor.setDate(cursor.getDate() - 1);
        while (active.has(dayKey(cursor.toISOString()))) {
            st += 1;
            cursor.setDate(cursor.getDate() - 1);
        }

        return {
            totalXP: total,
            todayXP: today,
            level: Math.floor(total / 500) + 1,
            xpToNext: 500 - (total % 500),
            streak: st,
            daysLogged: active.size,
        };
    }, [sessions, pyqAttempts, mistakes, completedTasks, syllabusCount]);

    // ---- subject accuracy meters (weak-first) ----
    const meters = useMemo(() => {
        const g = {};
        pyqAttempts.forEach((a) => {
            if (!a?.subject || !a.total) return;
            if (!g[a.subject]) g[a.subject] = { correct: 0, total: 0 };
            g[a.subject].correct += a.correct || 0;
            g[a.subject].total += a.total || 0;
        });
        return Object.entries(g)
            .map(([id, v]) => ({ id, acc: Math.round((v.correct / v.total) * 100) }))
            .sort((a, b) => a.acc - b.acc)
            .slice(0, 6);
    }, [pyqAttempts]);

    // ---- 52-week consistency heatmap ----
    const heat = useMemo(() => {
        const active = {};
        const add = (iso) => {
            const k = dayKey(iso);
            if (k) active[k] = (active[k] || 0) + 1;
        };
        sessions.forEach((s) => add(s.date));
        pyqAttempts.forEach((a) => add(a.timestamp));
        const today = new Date(getEffectiveToday());
        const cells = [];
        for (let w = 0; w < 52; w++) {
            let daysActive = 0;
            for (let d = 0; d < 7; d++) {
                const dt = new Date(today);
                dt.setDate(dt.getDate() - ((51 - w) * 7 + (6 - d)));
                if (active[dayKey(dt.toISOString())]) daysActive += 1;
            }
            const level = daysActive === 0 ? 0 : daysActive <= 2 ? 1 : daysActive <= 4 ? 2 : 3;
            cells.push(HEAT_PALETTE[level]);
        }
        return cells;
    }, [sessions, pyqAttempts]);

    // ---- mistake taxonomy ----
    const taxonomy = useMemo(() => {
        const g = {};
        mistakes.forEach((m) => {
            const cat = (m.category || m.type || m.errorType || 'conceptual').toLowerCase();
            g[cat] = (g[cat] || 0) + 1;
        });
        const total = mistakes.length;
        const colors = ['#ff6b7a', '#f5b64e', '#7c5cff', '#35e0d0'];
        return {
            total,
            rows: Object.entries(g)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4)
                .map(([label, n], i) => ({
                    label,
                    pct: total ? Math.round((n / total) * 100) : 0,
                    color: colors[i % colors.length],
                })),
        };
    }, [mistakes]);

    // ---- today's missions (weak-first) ----
    const missions = useMemo(() => {
        const prog = (planProgress || []).find((p) => p.day === currentDay);
        const rows = (dayPlan?.sessions || []).map((s) => {
            const done = prog?.sessions?.find((x) => x.id === s.id)?.completed;
            const isBoss = s.subject === topWeakSubject;
            const weak = priorityMap[s.subject]?.isWeak;
            let tag = 'grn', tagLabel = 'Study';
            if (done) { tag = 'grn'; tagLabel = 'Done'; }
            else if (s.type === 'test' || s.type === 'exam') { tag = 'grn'; tagLabel = 'Mock'; }
            else if (isBoss) { tag = 'red'; tagLabel = 'Priority'; }
            else if (weak) { tag = 'amb'; tagLabel = 'Weak'; }
            return {
                id: s.id,
                done,
                tag,
                tagLabel,
                subject: s.subject === 'all' ? 'Full Syllabus' : subjectName(s.subject),
                title: s.topics?.[0] || s.id,
                xp: MISSION_XP[s.type] || 40,
                rank: done ? 3 : isBoss ? 0 : weak ? 1 : 2,
            };
        });
        rows.sort((a, b) => a.rank - b.rank);
        const available = rows.filter((r) => !r.done).reduce((a, r) => a + r.xp, 0);
        return { rows: rows.slice(0, 6), available };
    }, [dayPlan, planProgress, currentDay, priorityMap, topWeakSubject]);

    // ---- rank quest projection ----
    const projectedRank = Math.max(50, Math.round(5000 * Math.pow(1 - readinessScore / 100, 2.8)));
    const rankProgress = Math.min(100, Math.max(4, readinessScore));
    const percentile = (100 - projectedRank / 1500).toFixed(2);
    const gapText = projectedRank > 100
        ? `${projectedRank - 100} ranks to AIR 100`
        : 'Target reached — hold the line';

    // readiness ring geometry
    const R = 42, CIRC = 2 * Math.PI * R;
    const ringFill = (readinessScore / 100) * CIRC;

    return (
        <div className="space-y-3.5 animate-fade-in pb-10 deck-mono">
            {/* terminal topbar */}
            <div className="deck-topbar">
                <span className="deck-dots">
                    <i style={{ background: '#ff6b7a' }} />
                    <i style={{ background: '#f5b64e' }} />
                    <i style={{ background: '#37d399' }} />
                </span>
                <span className="text-deck-cyan">gatemaster</span>
                <span className="text-deck-muted">
                    @{user?.user_metadata?.full_name
                        ? user.user_metadata.full_name.split(' ')[0].toLowerCase()
                        : 'air100'}
                </span>
                <span className="text-deck-muted">:~$</span>
                <span className="text-deck-muted2">./climb --today</span>
                <span className="flex-1" />
                <span className="deck-pill">Day&nbsp;<b className="text-deck-inkb">{currentDay}</b>/{totalPlanDays}</span>
                <span className="deck-pill flame">🔥 {streak}d</span>
                <span className="deck-pill xp">⚡ {totalXP.toLocaleString()} XP</span>
                <span className="deck-pill text-deck-muted2">{daysUntilExam} to GATE</span>
            </div>

            {/* row 1: rank quest + readiness ring */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-3.5">
                <div className="deck-panel deck-quest">
                    <div className="deck-lbl"><span className="b">▲</span> Rank Quest · projected all-india rank</div>
                    <div className="flex items-baseline gap-3 mt-2 flex-wrap">
                        <span className="deck-rankbig deck-tnum">{projectedRank}</span>
                        <span className="text-deck-muted2 text-sm">──►</span>
                        <span className="deck-target">AIR 100</span>
                        <span className="ml-auto text-[11px] text-deck-gold">{gapText}</span>
                    </div>
                    <div className="deck-progress"><i style={{ width: `${rankProgress}%` }} /></div>
                    <div className="flex justify-between text-[11px] text-deck-muted2 mt-2">
                        <span>{Math.round(rankProgress)}% readiness to close the gap</span>
                        <span>percentile ~{percentile}</span>
                    </div>
                    <svg className="mt-1.5 w-full" height="88" viewBox="0 0 560 88" preserveAspectRatio="none">
                        <g stroke="var(--deck-line2)" strokeWidth="1" opacity=".6">
                            <line x1="0" y1="22" x2="560" y2="22" />
                            <line x1="0" y1="44" x2="560" y2="44" />
                            <line x1="0" y1="66" x2="560" y2="66" />
                        </g>
                        <path d="M4,80 C90,76 170,60 250,46 C330,32 430,20 512,10" fill="none"
                            stroke="var(--deck-muted2)" strokeWidth="1.4" strokeDasharray="4 4" opacity=".6" />
                        <path d="M4,80 C90,78 150,66 230,54 C300,44 380,34 470,22" fill="none"
                            stroke="url(#climbg)" strokeWidth="3" strokeLinecap="round" />
                        <defs>
                            <linearGradient id="climbg" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0" stopColor="#7c5cff" />
                                <stop offset=".6" stopColor="#ff4f9e" />
                                <stop offset="1" stopColor="#ffd76a" />
                            </linearGradient>
                        </defs>
                        <circle cx="470" cy="22" r="4.5" fill="#ffd76a" />
                        <circle cx="470" cy="22" r="9" fill="none" stroke="#ffd76a" strokeOpacity=".4" strokeWidth="2" />
                        <text x="516" y="14" fontSize="11" fill="var(--deck-gold)">★ 100</text>
                    </svg>
                </div>

                <div className="deck-panel">
                    <div className="deck-lbl">Readiness · today’s XP</div>
                    <div className="flex items-center gap-4 mt-3.5">
                        <svg width="104" height="104" viewBox="0 0 104 104">
                            <circle cx="52" cy="52" r={R} fill="none" stroke="rgba(140,150,170,.14)" strokeWidth="9" />
                            <circle cx="52" cy="52" r={R} fill="none" stroke="url(#rg)" strokeWidth="9"
                                strokeLinecap="round" strokeDasharray={`${ringFill} ${CIRC}`}
                                transform="rotate(-90 52 52)" />
                            <defs>
                                <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0" stopColor="#35e0d0" />
                                    <stop offset="1" stopColor="#7c5cff" />
                                </linearGradient>
                            </defs>
                            <text x="52" y="50" textAnchor="middle" fontSize="27" fontWeight="800"
                                fill="var(--deck-ink-b)" fontFamily="system-ui, sans-serif">{readinessScore}%</text>
                            <text x="52" y="66" textAnchor="middle" fontSize="9.5" fill="var(--deck-muted)">READY</text>
                        </svg>
                        <div>
                            <div className="deck-khero deck-tnum">+{todayXP} <small>XP today</small></div>
                            <div className="text-[11px] text-deck-muted2 mt-0.5">Level {level} · {xpToNext} to Lv {level + 1}</div>
                            <div className="flex gap-1.5 flex-wrap mt-3">
                                <span className="deck-badge g">⚡ {pyqAttempts.length} PYQ sets</span>
                                {topWeakSubject && <span className="deck-badge v">🎯 {subjectName(topWeakSubject)} focus</span>}
                                <span className="deck-badge">🔥 {streak}d streak</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-[11px] text-deck-muted2 mt-4 leading-relaxed border-t border-deck-line pt-3">
                        {dailyTip}
                    </p>
                </div>
            </div>

            {/* current strategy: active plan phase + AI focus (plan-aware for custom plans) */}
            <div className="deck-panel">
                <div className="deck-lbl">Current strategy · {activePlanId ? 'personal plan phase' : 'roadmap phase'}</div>
                <div className="mt-2 text-[13px] font-bold text-deck-inkb">{recommendation.phase}</div>
                <p className="text-[11.5px] text-deck-muted2 mt-1.5 leading-relaxed">{recommendation.focus}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="deck-badge v">◆ {recommendation.priority}</span>
                    <span className="deck-badge">{strategicAdvice}</span>
                </div>
            </div>

            {/* row 2: subject meters + heatmap | mistake donut */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3.5">
                <div className="deck-panel">
                    <div className="deck-lbl">Subject accuracy · PYQ · <span className="text-deck-muted2">weak-first</span></div>
                    {meters.length ? (
                        <div className="flex flex-col gap-2.5 mt-3">
                            {meters.map((m, i) => (
                                <div key={m.id} className="deck-meter">
                                    <span className="nm">
                                        {subjectName(m.id).toLowerCase()}
                                        {i === 0 && m.acc < 65 && <span className="deck-boss">BOSS</span>}
                                    </span>
                                    <span className="deck-track"><i style={{ width: `${m.acc}%`, background: accColor(m.acc) }} /></span>
                                    <span className="text-right" style={{ color: accColor(m.acc) }}>{m.acc}%</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-3 text-[12px] text-deck-muted2">
                            No PYQ sets logged yet — <button className="text-deck-cyan underline" onClick={() => navigate('/pyq')}>log a set</button> to unlock accuracy telemetry.
                        </div>
                    )}

                    <div className="deck-lbl mt-4">52-week consistency · {daysLogged} days logged</div>
                    <div className="deck-heat">
                        {heat.map((c, i) => <i key={i} style={{ background: c }} />)}
                    </div>
                    <div className="deck-legendh">
                        less
                        {HEAT_PALETTE.map((c) => <i key={c} style={{ background: c }} />)}
                        more
                    </div>
                </div>

                <div className="deck-panel">
                    <div className="deck-lbl">Mistake taxonomy · {taxonomy.total} logged</div>
                    {taxonomy.total ? (
                        <>
                            <div className="grid place-items-center mt-2.5">
                                <svg width="132" height="132" viewBox="0 0 132 132">
                                    <circle cx="66" cy="66" r="50" fill="none" stroke="rgba(140,150,170,.12)" strokeWidth="14" />
                                    {(() => {
                                        const r = 50, circ = 2 * Math.PI * r;
                                        let offset = 0;
                                        return taxonomy.rows.map((row) => {
                                            const len = (row.pct / 100) * circ;
                                            const el = (
                                                <circle key={row.label} cx="66" cy="66" r={r} fill="none"
                                                    stroke={row.color} strokeWidth="14"
                                                    strokeDasharray={`${len} ${circ}`}
                                                    strokeDashoffset={-offset}
                                                    transform="rotate(-90 66 66)" strokeLinecap="butt" />
                                            );
                                            offset += len;
                                            return el;
                                        });
                                    })()}
                                    <text x="66" y="62" textAnchor="middle" fontSize="22" fontWeight="800"
                                        fill="var(--deck-ink-b)" fontFamily="system-ui, sans-serif">{taxonomy.rows[0]?.pct}%</text>
                                    <text x="66" y="78" textAnchor="middle" fontSize="9" fill="var(--deck-muted)">{taxonomy.rows[0]?.label}</text>
                                </svg>
                            </div>
                            <div className="flex flex-col gap-1.5 mt-2 text-[11.5px]">
                                {taxonomy.rows.map((row) => (
                                    <div key={row.label} className="flex gap-2 items-center">
                                        <i style={{ width: 9, height: 9, borderRadius: 2, background: row.color, display: 'inline-block' }} />
                                        <span className="capitalize">{row.label}</span>
                                        <span className="ml-auto text-deck-inkb">{row.pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="mt-3 text-[12px] text-deck-muted2">
                            Mistake notebook empty. Log errors after PYQ drills to map your failure taxonomy.
                        </div>
                    )}
                </div>
            </div>

            {/* row 3: today's missions */}
            <div className="deck-panel">
                <div className="deck-lbl">
                    <span className="b">›</span> Today’s missions · reordered weak-first ·
                    <span className="text-deck-gold"> +{missions.available} XP available</span>
                </div>
                <div className="flex flex-col gap-2 mt-3">
                    {missions.rows.length ? missions.rows.map((m) => (
                        <div key={m.id} className={`deck-mrow${m.tag === 'red' && !m.done ? ' pri' : ''}`}>
                            <span style={{ color: m.done ? 'var(--deck-green)' : m.tag === 'red' ? 'var(--deck-bad)' : m.tag === 'amb' ? 'var(--deck-warn)' : 'var(--deck-violet)' }}>
                                {m.done ? '✓' : '›'}
                            </span>
                            <span className={`tag ${m.tag}`}>{m.tagLabel}</span>
                            <span className="text-deck-ink truncate">
                                <b className="text-deck-inkb">{m.subject}</b> — {m.title}
                            </span>
                            {m.done
                                ? <span className="done">+{m.xp} XP</span>
                                : <span className="xp">+{m.xp} XP</span>}
                        </div>
                    )) : (
                        <div className="text-[12px] text-deck-muted2">No missions scheduled for today.</div>
                    )}
                </div>
                <div className="deck-footkeys">
                    <span><kbd>P</kbd> study plan</span>
                    <span><kbd>A</kbd> analytics</span>
                    <span><kbd>Q</kbd> pyq log</span>
                    <span><kbd>T</kbd> focus timer</span>
                    <span><kbd>M</kbd> missions</span>
                </div>
            </div>

            {/* ---- deep telemetry (existing detailed panels) ---- */}
            <div className="mt-8 pt-6 border-t border-deck-line">
                <div className="deck-lbl mb-1"><span className="b">◈</span> Deep telemetry</div>
                <p className="text-[12px] text-deck-muted2">Schedule projection, execution heatmap & subject mastery.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
                <div className="lg:col-span-1">
                    <TodaySchedulePanel
                        currentDay={currentDay}
                        dayPlan={dayPlan}
                        planProgress={planProgress}
                        studyPlan={studyPlan}
                    />
                </div>
                <div className="lg:col-span-2">
                    <SubjectProgressGrid
                        completedSyllabusTopics={completedSyllabusTopics}
                        completedPyqTopics={completedPyqTopics}
                    />
                </div>
            </div>

            <ScheduleProjectionChart
                currentDay={currentDay}
                planProgress={planProgress}
                totalDays={totalPlanDays}
            />

            <SyllabusHeatmap
                totalDays={totalPlanDays}
                currentDay={currentDay}
                planProgress={planProgress}
            />

            <PYQTrackerPanel pyqAttempts={pyqAttempts} />
        </div>
    );
}
