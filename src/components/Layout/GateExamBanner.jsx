import { format } from 'date-fns';
import { getDaysLeftLabel } from '../../utils/gateExamDates';

export default function GateExamBanner({ gateCse, gateDa, className = '' }) {
    const cse = getDaysLeftLabel(gateCse);
    const da = getDaysLeftLabel(gateDa);

    const lineCls =
        'flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-[11px] sm:text-xs leading-snug text-slate-600 dark:text-slate-400';

    return (
        <div
            className={`space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/80 ${className}`}
            aria-live="polite"
        >
            <div className={lineCls}>
                <span className="font-semibold text-slate-800 dark:text-slate-200 shrink-0">GATE CSE</span>
                <span className="text-slate-400">·</span>
                <time dateTime={gateCse.toISOString().slice(0, 10)} className="tabular-nums">
                    {format(gateCse, 'EEE, d MMM yyyy')}
                </time>
                <span className="text-slate-400">·</span>
                <span className="font-medium text-brand-600 dark:text-brand-400 tabular-nums">
                    {cse.text}
                </span>
            </div>
            <div className={lineCls}>
                <span className="font-semibold text-slate-800 dark:text-slate-200 shrink-0">GATE DA</span>
                <span className="text-slate-400">·</span>
                <time dateTime={gateDa.toISOString().slice(0, 10)} className="tabular-nums">
                    {format(gateDa, 'EEE, d MMM yyyy')}
                </time>
                <span className="text-slate-400">·</span>
                <span className="font-medium text-brand-600 dark:text-brand-400 tabular-nums">
                    {da.text}
                </span>
            </div>
        </div>
    );
}
