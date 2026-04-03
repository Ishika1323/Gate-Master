# Cursor task prompt: AI-driven adaptive study schedule + syllabus/PYQ sync + visualization

Copy everything below the line into a new Cursor chat (or use as the task description).

---

## Project context

I have a **GATE exam prep web app** (React + Vite, Zustand, Tailwind, existing 32-day `STUDY_PLAN` in `src/data/studyPlan.js`, syllabus data, PYQ pages, tasks, IndexedDB + optional Supabase in `src/services/`). The app already shows **per-day schedules** and **subject/topic-oriented** work. I want to evolve it so that:

1. **Schedule is personalized per user per calendar day** — not static text only: it should **reflect what they already finished** on previous days and **reallocate** remaining work realistically.
2. **Everything stays in sync** across:
   - **32-day / daily plan** (session completion, `planProgress` in the store)
   - **Syllabus** (`completedSyllabusTopics`, `syllabus_progress` in DB)
   - **PYQ coverage** (`completedPyqTopics`, PYQ attempts/logs)
   - **Tasks** (optional: generated or linked tasks from AI blocks)
3. **Visualization** must show **how syllabus (and PYQ coverage) is advancing over time** — clear charts or timelines (reuse Recharts or similar), not just lists. Prefer: progress by subject, “planned vs completed” hours/topics, PYQ milestones, and a compact **week or multi-day** view when useful.
4. **Detail-oriented, subject-wise output**: each day’s plan should name **subjects, topics, estimated time, type of work** (theory / PYQ / revision), and **dependencies** (e.g. “because syllabus topic X is incomplete, prioritize Y”).
5. **AI-first for the heavy lifting**: use **Google Gemini API** (env e.g. `VITE_GEMINI_API_KEY` or a small serverless proxy if keys must stay off the client) to:
   - Ingest **current state** (completed plan sessions, syllabus IDs, PYQ topics, recent PYQ accuracy, weak subjects).
   - Generate **structured JSON** for the **next days** (or rolling window) — not uncontrolled prose — so the UI can render cards, schedules, and charts reliably.
   - **Refresh** when the user marks items complete or adds PYQ attempts (debounced or on explicit “Regenerate plan”).

### Non-negotiables

- **Local-first**: respect existing `useAppStore` + `localDb`/`db.js`; AI output should **merge** into persisted state, not replace user data silently without confirmation where destructive.
- **Deterministic fallbacks**: if Gemini fails or quota hits, show **rule-based** schedule derived from `STUDY_PLAN` + completion gaps (existing adaptive logic in `src/ai/` can be extended).
- **Typed/clean boundaries**: one module e.g. `src/ai/schedulePipeline.js` (validate + normalize AI JSON → store shape).
- **Security**: do not commit API keys; document `.env.example` for Gemini.

### Suggested deliverables (implement in this repo)

1. **State extensions** (if needed): e.g. `adaptiveScheduleByDay`, `lastScheduleGeneratedAt`, `scheduleSource: 'gemini' | 'fallback'`.
2. **Gemini client**: `src/ai/geminiSchedule.js` — builds prompt from store snapshot; parses JSON; handles errors.
3. **Prompt template** that forces **JSON schema** (day index, blocks with `subjectId`, `topic`, `minutes`, `kind`, `syllabusTopicIds[]`, `pyqTopicIds[]`, `rationale` short string).
4. **UI**:
   - Enhanced **Study Plan** page: day view shows AI-optimized blocks + link to mark syllabus/PYQ from block actions where appropriate.
   - **Dashboard or Analytics**: new charts — syllabus % by subject, PYQ coverage trend, “schedule adherence” (planned minutes vs timer sessions).
5. **Sync rules**: when user completes a syllabus topic or PYQ topic, **update charts**; when AI regenerates schedule, **do not uncheck** completed items; only **adjust future** days.
6. **Tests or manual checklist** in PR description.

### Out of scope / be careful

- Don’t remove the existing static `STUDY_PLAN` — use it as **ground truth** unless user opts into full AI replacement.
- Avoid duplicate conflicting sources of truth; pick one **merged “effective schedule”** representation.

---

**Start by** reading `README.md`, `src/data/studyPlan.js`, `src/store/useAppStore.js`, `src/components/StudyPlan/StudyPlanPage.jsx`, syllabus/PYQ components, and existing `src/ai/*.js`. Then propose a short plan, then implement with minimal unrelated refactors.

---

**End of paste**
