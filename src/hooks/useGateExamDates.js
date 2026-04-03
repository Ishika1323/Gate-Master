import { useEffect, useState } from 'react';
import {
    getUpcomingComputedDates,
    resolveGateExamDatesAsync,
} from '../utils/gateExamDates';

export function useGateExamDates() {
    const [state, setState] = useState(() => {
        const formula = getUpcomingComputedDates();
        return {
            loading: true,
            gateCse: formula.gateCse,
            gateDa: formula.gateDa,
            source: 'formula',
        };
    });

    useEffect(() => {
        let cancel = false;
        (async () => {
            const next = await resolveGateExamDatesAsync();
            if (!cancel) {
                setState({
                    loading: false,
                    gateCse: next.gateCse,
                    gateDa: next.gateDa,
                    source: next.source,
                });
            }
        })();
        return () => {
            cancel = true;
        };
    }, []);

    return state;
}
