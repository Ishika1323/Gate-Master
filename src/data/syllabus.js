export const SYLLABUS_DATA = [
    {
        id: '1',
        title: 'Engineering Mathematics (Common Core)',
        topics: [
            { id: '1-1', title: 'Discrete Mathematics', subtopics: ['Propositional logic', 'First order logic', 'Sets, relations, functions', 'Partial orders, lattices', 'Groups', 'Graphs', 'Trees', 'Combinatorics', 'Recurrence relations', 'Generating functions'] },
            { id: '1-2', title: 'Linear Algebra', subtopics: ['Matrices and determinants', 'System of linear equations', 'Vector spaces', 'Basis and dimension', 'Eigenvalues and eigenvectors', 'Rank, nullity', 'Orthogonality'] },
            { id: '1-3', title: 'Calculus', subtopics: ['Limits, continuity', 'Differentiation', 'Mean value theorem', 'Maxima and minima', 'Integration', 'Partial derivatives', 'Multiple integrals'] },
            { id: '1-4', title: 'Probability & Statistics', subtopics: ['Probability axioms', 'Conditional probability', 'Bayes theorem', 'Random variables', 'Expectation and variance', 'Standard distributions', 'Sampling', 'Estimation'] }
        ]
    },
    {
        id: '2',
        title: 'Programming (Separated)',
        topics: [
            { id: '2-1', title: 'Core Programming Concepts', subtopics: ['Variables and data types', 'Operators', 'Control structures', 'Functions', 'Recursion', 'Parameter passing', 'Scope & lifetime', 'Modular programming'] },
            { id: '2-2', title: 'Programming Paradigms', subtopics: ['Procedural', 'Object-oriented basics', 'Abstract data types', 'Pointers & references', 'Memory allocation'] },
            { id: '2-3', title: '[DA-Specific] Programming for Data Science', subtopics: ['Python fundamentals', 'Lists, dictionaries, sets', 'NumPy basics', 'Pandas basics', 'Data preprocessing code patterns'] }
        ]
    },
    {
        id: '3',
        title: 'Data Structures (Separated)',
        topics: [
            { id: '3-1', title: 'Linear Structures', subtopics: ['Arrays', 'Linked lists', 'Stacks', 'Queues', 'Deques'] },
            { id: '3-2', title: 'Tree Structures', subtopics: ['Trees', 'Binary trees', 'Binary search trees', 'AVL trees', 'Heaps', 'Priority queues', 'Tries'] },
            { id: '3-3', title: 'Graph Structures', subtopics: ['Graph representation', 'Adjacency list/matrix'] },
            { id: '3-4', title: 'Hashing', subtopics: ['Hash functions', 'Collision handling', 'Hash tables'] },
            { id: '3-5', title: '[DA-Specific]', subtopics: ['Sparse matrices', 'Data frame structures', 'Feature storage formats'] }
        ]
    },
    {
        id: '4',
        title: 'Algorithms',
        topics: [
            { id: '4-1', title: 'Analysis', subtopics: ['Time complexity', 'Space complexity', 'Asymptotic notation', 'Recurrence solving'] },
            { id: '4-2', title: 'Design Techniques', subtopics: ['Divide & conquer', 'Greedy', 'Dynamic programming', 'Backtracking', 'Branch & bound'] },
            { id: '4-3', title: 'Graph Algorithms', subtopics: ['BFS', 'DFS', 'Shortest paths', 'Minimum spanning tree', 'Topological sort'] },
            { id: '4-4', title: 'Complexity Theory', subtopics: ['NP completeness', 'Reductions', 'Approximation algorithms'] },
            { id: '4-5', title: '[DA-Specific]', subtopics: ['Optimization algorithms', 'Gradient descent basics', 'Convex optimization basics'] }
        ]
    },
    {
        id: '5',
        title: 'Digital Logic',
        topics: [
            { id: '5-1', title: 'Core Concepts', subtopics: ['Boolean algebra', 'Logic gates', 'K-maps', 'Combinational circuits', 'Sequential circuits', 'Flip-flops', 'Counters', 'FSM'] }
        ]
    },
    {
        id: '6',
        title: 'Computer Organization & Architecture',
        topics: [
            { id: '6-1', title: 'Core Architecture', subtopics: ['Instruction sets', 'Addressing modes', 'CPU organization', 'Control unit', 'Pipelining', 'Hazards', 'Cache', 'Virtual memory', 'I/O systems'] }
        ]
    },
    {
        id: '7',
        title: 'Operating Systems',
        topics: [
            { id: '7-1', title: 'Core Concepts', subtopics: ['Processes & threads', 'Scheduling', 'Synchronization', 'Deadlocks', 'Memory management', 'Paging & segmentation', 'File systems', 'Disk scheduling'] }
        ]
    },
    {
        id: '8',
        title: 'Databases (DBMS)',
        topics: [
            { id: '8-1', title: 'Core DBMS', subtopics: ['ER model', 'Relational model', 'SQL', 'Relational algebra', 'Functional dependencies', 'Normalization', 'Transactions', 'Concurrency control', 'Recovery', 'Indexing'] },
            { id: '8-2', title: '[DA-Specific Extensions]', subtopics: ['Data warehousing basics', 'OLAP vs OLTP', 'Data cleaning', 'ETL concepts'] }
        ]
    },
    {
        id: '9',
        title: 'Computer Networks',
        topics: [
            { id: '9-1', title: 'Core Networking', subtopics: ['OSI model', 'TCP/IP', 'Routing', 'Congestion control', 'Error control', 'IP addressing', 'DNS', 'HTTP', 'Transport layer protocols'] }
        ]
    },
    {
        id: '10',
        title: 'Theory of Computation',
        topics: [
            { id: '10-1', title: 'Automata Theory', subtopics: ['DFA/NFA', 'Regular languages', 'CFG', 'PDA', 'Turing machines', 'Decidability', 'Pumping lemma', 'Closure properties'] }
        ]
    },
    {
        id: '11',
        title: 'Compiler Design',
        topics: [
            { id: '11-1', title: 'Compiler Phases', subtopics: ['Lexical analysis', 'Parsing', 'Syntax directed translation', 'Intermediate code', 'Optimization', 'Code generation'] }
        ]
    },
    {
        id: '12',
        title: 'GATE DA — Data Science & AI Specific Subjects',
        topics: [
            { id: '12-1', title: 'Machine Learning', subtopics: ['Supervised learning', 'Unsupervised learning', 'Regression', 'Classification', 'Clustering', 'Overfitting & regularization', 'Model evaluation', 'Bias–variance tradeoff'] },
            { id: '12-2', title: 'Artificial Intelligence', subtopics: ['Search algorithms', 'Heuristics', 'Knowledge representation', 'Reasoning', 'Planning'] },
            { id: '12-3', title: 'Data Science', subtopics: ['Data preprocessing', 'Feature engineering', 'Data visualization', 'Statistical inference', 'Hypothesis testing'] },
            { id: '12-4', title: 'Linear Models', subtopics: ['Linear regression', 'Logistic regression', 'Loss functions'] },
            { id: '12-5', title: 'Probability for ML', subtopics: ['Conditional independence', 'Bayesian models', 'Markov chains'] }
        ]
    },
    {
        id: '13',
        title: 'General Aptitude (Common)',
        topics: [
            { id: '13-1', title: 'Verbal', subtopics: ['Reading comprehension', 'Grammar', 'Sentence correction'] },
            { id: '13-2', title: 'Quantitative', subtopics: ['Ratios', 'Percentages', 'Averages', 'Time & work'] }
        ]
    }
];

// Helper to flatten topics for easier ID lookup
export const getAllSyllabusIds = () => {
    const ids = [];
    SYLLABUS_DATA.forEach(section => {
        section.topics.forEach(topic => {
            topic.subtopics.forEach((sub, idx) => {
                // Generate a unique ID for each subtopic
                // Format: sectionId-topicId-subtopicIndex
                ids.push(`${section.id}-${topic.id}-${idx}`);
            })
        })
    });
    return ids;
};
