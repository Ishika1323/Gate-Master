// 32-day study plan - dates are dynamically calculated from today's date
// Updated: 6-Session Structure (A, B, C: Main | D: Math | E: Aptitude | F: Revision)

const getJobPrepTopic = (day) => {
    const topics = [
        'Resume Building & Optimization', 'Speed Math Tricks', 'Puzzle Solving (Seating Arrangement)',
        'Coding Interview Pattern: Sliding Window', 'HR Qs: "Tell me about yourself"', 'Quantitative: Percentages',
        'Logical Reasoning: Blood Relations', 'Verbal: Reading Comprehension', 'Coding Interview: Two Pointers',
        'System Design: Scalability Basics', 'Behavioral: STAR Method', 'Quantitative: Time & Work',
        'Logical Reasoning: Syllogisms', 'Verbal: Grammar Correction', 'Coding Interview: DFS/BFS Patterns',
        'System Design: Caching Strategies', 'HR Qs: Strengths & Weaknesses', 'Quantitative: Profit & Loss',
        'Logical Reasoning: Data Sufficiency', 'Verbal: Vocabulary Building', 'Coding Interview: DP Patterns',
        'System Design: Database Sharding', 'Mock Interview Practice (Self)', 'Quantitative: Permutation & Combination',
        'Logical Reasoning: Series Completion', 'Verbal: Critical Reasoning', 'Coding Interview: Graph Patterns',
        'System Design: Load Balancing', 'HR Qs: Handling Conflict', 'Quantitative: Probability (Aptitude)',
        'Logical Reasoning: Clocks & Calendars', 'Final Resume Polish'
    ];
    return topics[(day - 1) % topics.length];
};

const getMathTopic = (day) => {
    // Rotating GATE CS Math Syllabus
    const topics = [
        'Linear Algebra: Matrices & Determinants', 'Linear Algebra: Eigenvalues & Vectors', 'Linear Algebra: LU Decomposition',
        'Calculus: Limits & Continuity', 'Calculus: Differentiability', 'Calculus: Mean Value Theorems',
        'Calculus: Definite Integrals', 'Probability: Axioms & Cond. Probability', 'Probability: Random Variables',
        'Probability: Distributions (Binomial, Poisson)', 'Probability: Distributions (Normal, Exp)', 'Probability: Statistics (Mean, Mode, Median)',
        'Discrete Math: Prop. Logic', 'Discrete Math: Predicate Logic', 'Discrete Math: Set Theory',
        'Discrete Math: Relations & Functions', 'Discrete Math: Partial Orders & Lattices', 'Discrete Math: Groups & Monoids',
        'Discrete Math: Graph Theory Basics', 'Discrete Math: Graph Connectivity', 'Discrete Math: Graph Coloring',
        'Linear Algebra: Vector Spaces', 'Linear Algebra: Basis & Dimension', 'Calculus: Maxima & Minima',
        'Probability: Bayes Theorem', 'Probability: Correlation & Regression', 'Discrete Math: Combinatorics',
        'Discrete Math: Recurrence Relations', 'Discrete Math: Generating Functions', 'Math Revision: Formula Sheet 1',
        'Math Revision: Formula Sheet 2', 'Math Full Mock'
    ];
    return topics[(day - 1) % topics.length];
};

// Calculate start date as today
const getStartDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    return today;
};

export const STUDY_PLAN = Array.from({ length: 32 }, (_, i) => {
    const day = i + 1;
    const startDate = getStartDate();
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    const jobTopic = getJobPrepTopic(day);
    const mathTopic = getMathTopic(day);

    let mainSubject = 'ds';
    let mainTopics = [];

    // Map main subjects based on the original Phase Plan
    if (day <= 3) { mainSubject = 'ds'; mainTopics = ['Data Structures Core', 'Advanced Trees', 'Graphs']; }
    else if (day <= 6) { mainSubject = 'algo'; mainTopics = ['Sorting & Searching', 'Greedy Algorithms', 'Dynamic Programming']; }
    else if (day === 7) { mainSubject = 'c_prog'; mainTopics = ['Pointers & Arrays', 'Recursion', 'Memory Management']; }
    else if (day <= 9) { mainSubject = 'math'; mainTopics = ['Discrete Mathematics', 'Boolean Algebra', 'Digital Logic']; } // Overlap with Math session is fine, extra focus
    else if (day <= 12) { mainSubject = 'os'; mainTopics = ['Process Management', 'Deadlocks & Sync', 'Memory Management']; }
    else if (day <= 14) { mainSubject = 'dbms'; mainTopics = ['SQL & Relational Algebra', 'Normalization & Transactions', 'Indexing & File Org']; }
    else if (day === 15) { mainSubject = 'cn'; mainTopics = ['IP Addressing & Subnetting', 'TCP/UDP', 'Application Layer']; }
    else if (day <= 17) { mainSubject = 'coa'; mainTopics = ['Cache Memory', 'Pipelining', 'Instruction Cycle']; }
    else if (day <= 19) { mainSubject = 'toc'; mainTopics = ['Finite Automata', 'Context Free Grammars', 'Turing Machines']; }
    else if (day === 20) { mainSubject = 'compiler'; mainTopics = ['Parsing Techniques', 'Syntax Directed Translation', 'Code Optimization']; }
    else if (day <= 24) { mainSubject = 'all'; mainTopics = [`BARC Set ${day - 20}`, 'Weak Area Analysis', 'Topic Repair']; } // BARC Sets
    else if (day === 25) { mainSubject = 'all'; mainTopics = ['Weak Area Deep Dive', 'Concept Patching', 'Wrong PYQ Re-solve']; }
    else if (day <= 27) { mainSubject = 'all'; mainTopics = [`BARC Full Paper ${day - 25}`, 'Deep Analysis', 'Mistake Review']; }
    else if (day <= 30) { mainSubject = 'all'; mainTopics = ['Rapid Revision: Set A', 'Rapid Revision: Set B', 'Rapid Revision: Set C']; }
    else { mainSubject = 'all'; mainTopics = ['Final Formula Revision', 'Light Reading', 'Relaxation']; }

    // On exam day (Day 32), strict exam schedule
    if (day === 32) {
        return {
            day, date: dateString,
            sessions: [
                { id: 'A', duration: 180, subject: 'all', topics: ['GATE EXAM'], type: 'exam' },
            ]
        };
    }

    return {
        day,
        date: dateString,
        sessions: [
            { id: 'A', duration: 120, subject: mainSubject, topics: [mainTopics[0] || 'Concept Review'], type: 'study' },
            { id: 'B', duration: 120, subject: mainSubject, topics: [mainTopics[1] || 'PYQ Solving'], type: 'pyq' },
            { id: 'C', duration: 120, subject: mainSubject, topics: [mainTopics[2] || 'Advanced Problems'], type: 'pyq' },
            { id: 'D', duration: 180, subject: 'math', topics: [mathTopic], type: 'practice' },
            { id: 'E', duration: 60, subject: 'aptitude', topics: ['GATE Aptitude', `Job Prep: ${jobTopic}`], type: 'practice' },
            { id: 'F', duration: 30, subject: 'all', topics: ['Mistake Notebook', 'Error Analysis'], type: 'revision' },
        ],
    };
});

export const getDayPlan = (dayNumber) => {
    return STUDY_PLAN.find(d => d.day === dayNumber);
};

export const getPlanByDate = (dateString) => {
    return STUDY_PLAN.find(d => d.date === dateString);
};
