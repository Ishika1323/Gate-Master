/**
 * Ishika Bhatnagar's personal "GATE CSE + DA 2027 Weekly Battle Plan".
 *
 * Imported from her 28 weekly plan PDFs (W01 · Jul 27 2026 → W28 · Feb 6 2027).
 * Fixed daily frame: 05:15–06:45 Math dawn · 06:55–09:30 Technical dawn ·
 * 19:00–20:45 Evening burn · GA 15'/day · sleep 22:00–05:00.
 *
 * The builder converts the weekly tables into the planner's canonical
 * day-node format ({ day, date, phase, phaseSubtitle, sessions[] }) so every
 * existing feature — progress tracking, AI backlog redistribution, analytics,
 * Gemini overrides — works on this plan unchanged.
 */

export const ISHIKA_PLAN_ID = 'ishika-gate-2027';
export const ISHIKA_PLAN_START = '2026-07-27';
export const ISHIKA_PLAN_NAME = 'GATE CSE + DA 2027 · Weekly Battle Plan';

const FRAME_MATH = '⏰ 05:15–06:45 · Math dawn';
const FRAME_TECH = '⏰ 06:55–09:30 · Technical dawn';
const FRAME_EVE = '⏰ 19:00–20:45 · Evening burn';

const SUNDAY_ENGINE =
    'AM: Error Ledger triage (sort by cause tag) » re-solve all flagged to >=85% » update formula sheets » send week data to coaching thread + "Generate my next week". PM OFF — non-negotiable.';

/**
 * Weeks 1–16 run Mon»Sun; weeks 17–28 run Sun»Sat (Nov 15 belongs to both
 * W16 and W17 in the PDFs — the builder dedupes by date, later week wins).
 * Day cells may override the week-level subject via mathSub/techSub/eveSub.
 */
export const ISHIKA_WEEKS = [
    {
        week: 1,
        start: '2026-07-27',
        phase: 'Phase 1 · Shared Core — Launch Week',
        mathTrack: 'Linear Algebra I — matrices » eigenvalues (both papers)',
        techTrack: 'C Programming — the CSE language, full core pass',
        eveningFocus: 'Timed output-prediction + determinant PYQs on each day\'s topics',
        subjects: { math: 'math', tech: 'c_prog', eve: 'c_prog' },
        days: [
            {
                math: 'Matrix algebra, determinants + properties; special matrices: symmetric, skew, orthogonal, idempotent, projection, partition',
                tech: 'C: types, operators, precedence, control flow, functions, storage classes, scope/lifetime',
                eve: 'Determinant + C-fundamentals output PYQs',
            },
            {
                math: 'Rank, row-echelon form, Gaussian elimination, consistency of systems (homogeneous vs non-homogeneous)',
                tech: 'Pointers: arithmetic, pointers vs arrays, double pointers, pointer-to-function reads',
                eve: 'Rank/consistency + pointer-trace PYQs',
            },
            {
                math: 'Vector spaces: subspace, linear independence, basis, dimension, rank-nullity theorem',
                tech: 'Recursion: stack frames, call-tree tracing, classic "what does this print" patterns',
                eve: 'Recursion output PYQs (heavy zone)',
            },
            {
                math: 'Eigenvalues + eigenvectors: characteristic equation, key properties (trace/det, powers, shifts)',
                tech: 'Arrays + strings; 2D arrays; row-major vs column-major address arithmetic',
                eve: 'Eigen + address-calculation PYQs',
            },
            {
                math: 'Cayley-Hamilton; diagonalization + when it fails',
                tech: 'Structs, unions, typedef, malloc/free + common traps; quick Python-equivalents glance for DA',
                eve: 'Mixed C PYQ set; ledger sweep',
            },
            {
                math: 'LU decomposition + 60-min timed LA mini-set',
                tech: 'Linked lists: singly/doubly/circular — insert, delete, reverse, detect loop',
                techSub: 'ds',
                eve: 'Weekend Mission: first timed mixed set — LA + C/linked-list PYQs; every miss into the ledger with a cause tag',
            },
            { math: null, tech: SUNDAY_ENGINE, eve: null },
        ],
        mission:
            'SAT PM: first timed mixed set — LA + C/linked-list PYQs; every miss into the ledger with a cause tag. SUN AM: full triage, re-solve flagged to >=85%, LA formula sheet v1, 15-min preview of Week 2 topics. SUN PM: OFF.',
        metrics: [
            '6/6 Math dawns + 6/6 Technical dawns completed',
            '>= 100 PYQs attempted across both tracks',
            'Every miss logged same-day with cause tag',
            'Sunday re-solve accuracy >= 85%',
            'LA formula sheet v1 exists',
        ],
    },
    {
        week: 2,
        start: '2026-08-03',
        phase: 'Phase 1 · Shared Core',
        mathTrack: 'Linear Algebra II — the DA half: definiteness » SVD. LA closes Sat',
        techTrack: 'Data Structures I — stacks » heaps (heaviest shared PYQ zone)',
        eveningFocus: 'Timed DS PYQ sets; Saturday: LA marathon post-mortem',
        subjects: { math: 'math', tech: 'ds', eve: 'ds' },
        days: [
            {
                math: 'Quadratic forms; positive definite / semidefinite tests (principal minors, eigenvalue test); Hessian link',
                tech: 'Stacks: array + list implementations; parenthesis matching, infix-to-postfix, postfix evaluation',
                eve: 'Stack-application PYQs',
            },
            {
                math: 'Orthogonality: orthonormal sets, projections onto subspaces, projection matrices (idempotent + symmetric)',
                tech: 'Queues: circular-queue front/rear arithmetic (perennial PYQ), deque, queue via two stacks + inverse',
                eve: 'Queue-arithmetic PYQs',
            },
            {
                math: 'Least squares via projections; normal equations; straight line to linear regression (DA bridge)',
                tech: 'Binary trees: node/height/leaf counting, all four traversals, tree reconstruction from traversal pairs',
                eve: 'Traversal + reconstruction PYQs',
            },
            {
                math: 'SVD: construction, singular values vs eigenvalues, rank from SVD, low-rank / PCA intuition',
                tech: 'BST: insert/delete/search, successor/predecessor, counting BSTs (Catalan), validity checks',
                eve: 'BST PYQs',
            },
            {
                math: 'Full-LA mixed drill targeted at ledger weak spots',
                tech: 'Hash tables: chaining, linear/quadratic probing, double hashing, probe sequences, load factor; AVL rotations intro',
                eve: 'Probe-sequence PYQs (both papers love these)',
            },
            {
                math: 'LA PYQ MARATHON — timed, 60–75 Qs, CS + DA mixed, 2010–2025 » LA CLOSED',
                tech: 'Binary heaps: array representation, heapify, build-heap O(n), insert/extract, heapsort link',
                eve: 'LA marathon post-mortem part 1',
            },
            { math: null, tech: SUNDAY_ENGINE, eve: null },
        ],
        mission:
            'SAT PM: marathon post-mortem — every wrong AND every lucky guess re-solved + cause-tagged. SUN AM: two-week triage, re-solve to >=85%, FINALIZE the LA master formula sheet, 20-min Probability preview. SUN PM: OFF.',
        metrics: [
            'LA marathon: >=60 Qs timed, >=70% first-pass',
            'LA master formula sheet finalized + frozen',
            '>=120 PYQs total this week',
            'Sunday re-solve >= 85%',
        ],
    },
    {
        week: 3,
        start: '2026-08-10',
        phase: 'Phase 1 · Shared Core',
        mathTrack: 'Probability & Statistics I — counting » expectation (both papers)',
        techTrack: 'Data Structures II + Python bridge — AVL, graphs, BFS/DFS + DA idioms',
        eveningFocus: 'Bayes-trap PYQs + timed DS sets; Saturday: DS marathon',
        subjects: { math: 'math', tech: 'ds', eve: 'ds' },
        days: [
            {
                math: 'Counting-based probability, axioms, sample spaces, events (mutually exclusive vs exhaustive)',
                tech: 'AVL trees: balance factors, all four rotations, insertion cost; why balanced beats plain BST',
                eve: 'Counting + AVL PYQs',
            },
            {
                math: 'Conditional probability, law of total probability, Bayes theorem',
                tech: 'Graph representations: adjacency matrix vs list — space/time trade-offs, degree sums, handshake facts',
                eve: 'Bayes-trap PYQs (classic GATE ambush zone)',
            },
            {
                math: 'Independence: pairwise vs mutual; independent vs mutually exclusive (the eternal confusion — kill it today)',
                tech: 'BFS: mechanics, queue behaviour, shortest path in unweighted graphs, level structure',
                eve: 'Independence + BFS PYQs',
            },
            {
                math: 'Random variables; PMF / PDF / CDF; discrete vs continuous mechanics',
                tech: 'DFS: mechanics, stack behaviour, edge classification intro, connected components',
                eve: 'RV + DFS PYQs',
            },
            {
                math: 'Expectation, variance, standard deviation, moments; linearity of expectation (exam workhorse)',
                tech: 'Python bridge for DA: lists/dicts/sets/tuples, slicing, comprehensions, common output-question idioms',
                techSub: 'c_prog',
                eve: 'Expectation PYQs + Python output set',
            },
            {
                math: 'Mixed P&S-I drill (ledger-weighted)',
                tech: 'DS PYQ MARATHON — timed, mixed W2 + W3 topics, CS + DA',
                eve: 'DS marathon post-mortem part 1',
            },
            { math: null, tech: SUNDAY_ENGINE, eve: null },
        ],
        mission:
            'SAT PM: DS marathon post-mortem, cause-tag everything. SUN AM: triage, re-solve to >=85%, DS short-notes v1, distribution-week preview. SUN PM: OFF.',
        metrics: [
            'Bayes/conditional accuracy >= 80%',
            'DS marathon >= 65–70% first-pass',
            '>=110 PYQs this week',
            'DS short notes v1 done',
        ],
    },
    {
        week: 4,
        start: '2026-08-17',
        phase: 'Phase 1 · Shared Core',
        mathTrack: 'Probability & Statistics II — the distribution zoo + joint distributions',
        techTrack: 'Algorithms I — asymptotics, recurrences, divide & conquer, sorting',
        eveningFocus: 'Distribution-parameter PYQs; sorting/recurrence timed sets',
        subjects: { math: 'math', tech: 'algo', eve: 'algo' },
        days: [
            {
                math: 'Uniform + Bernoulli + binomial: PMFs, mean/variance, when each applies',
                tech: 'Asymptotic notation: O/Theta/Omega, growth-rate ordering, limit comparisons',
                eve: 'Notation-ordering PYQs',
            },
            {
                math: 'Poisson + exponential: parameters, memorylessness, Poisson-binomial link',
                tech: 'Recurrences: substitution, recursion tree, Master theorem (all cases + the gaps it cannot handle)',
                eve: 'Master-theorem drill set',
            },
            {
                math: 'Normal + standard normal: z-scores, symmetry tricks, empirical intuition',
                tech: 'Divide & conquer: merge sort + quicksort — full analysis, best/worst/average, pivot behaviour',
                eve: 'Sort-analysis PYQs',
            },
            {
                math: 't and chi-square distributions: shape, when used (bridge to W5 inference)',
                tech: 'Remaining sorts: heap/insertion/selection/bubble/counting; stability; comparison lower bound Omega(n log n)',
                eve: 'Stability + lower-bound PYQs',
            },
            {
                math: 'Joint distributions; covariance + correlation; conditional expectation',
                tech: 'Binary search + variants (rotated arrays, boundaries); k-th order statistic / selection',
                eve: 'Covariance + search-variant PYQs',
            },
            {
                math: 'Distribution mixed drill — parameter recall under time',
                tech: 'Sorting + recurrence timed set (mixed)',
                eve: 'Ledger sweep on the week',
            },
            { math: null, tech: SUNDAY_ENGINE, eve: null },
        ],
        mission:
            'SAT PM: timed mixed set (distributions + sorting). SUN AM: triage, re-solve >=85%, one-page distribution table (name » PMF/PDF » mean » variance » use-case). SUN PM: OFF.',
        metrics: [
            'Master theorem: 10/10 on a self-set drill',
            'Distribution table memorized (self-test blind)',
            '>=110 PYQs this week',
            'Sunday re-solve >= 85%',
        ],
    },
    {
        week: 5,
        start: '2026-08-24',
        phase: 'Phase 1 · Shared Core',
        mathTrack: 'Probability & Statistics III — inference (DA-heavy). P&S closes Sat',
        techTrack: 'Algorithms II — greedy + graph algorithms',
        eveningFocus: 'Hypothesis-testing drills; greedy/graph PYQs; Sat marathon post-mortem',
        subjects: { math: 'math', tech: 'algo', eve: 'algo' },
        days: [
            {
                math: 'Central Limit Theorem + sampling distributions (mean, proportion)',
                tech: 'Greedy paradigm: activity selection, fractional knapsack, exchange argument — when greedy is provably right',
                eve: 'CLT + greedy PYQs',
            },
            {
                math: 'Confidence intervals: z vs t, interpretation traps, width drivers',
                tech: 'Huffman coding: construction, average code length, prefix property',
                eve: 'CI + Huffman PYQs',
            },
            {
                math: 'Hypothesis testing I: null/alternative, Type I/II errors, p-value logic, z-test',
                tech: 'MST: Prim + Kruskal, cut property, uniqueness conditions',
                eve: 'z-test + MST PYQs',
            },
            {
                math: 'Hypothesis testing II: t-test, chi-square test — when each applies',
                tech: 'Dijkstra: mechanics, complexity by structure, why negative edges break it',
                eve: 't/chi-square + Dijkstra PYQs',
            },
            {
                math: 'Full inference drill: pick-the-right-test under time (DA-critical skill)',
                tech: 'BFS/DFS applications: topological sort, cycle detection, ordering questions',
                eve: 'Topo-sort PYQs',
            },
            {
                math: 'P&S PYQ MARATHON — timed, CS + DA mixed » P&S CLOSED',
                tech: 'Greedy/graph timed set',
                eve: 'Marathon post-mortem part 1',
            },
            { math: null, tech: SUNDAY_ENGINE, eve: null },
        ],
        mission:
            'SAT PM: marathon post-mortem. SUN AM: triage, re-solve >=85%, FREEZE the P&S formula sheet, calculus preview. SUN PM: OFF.',
        metrics: [
            'P&S marathon >= 70% first-pass',
            'P&S formula sheet frozen',
            'Right-test selection: >= 9/10 on drill',
            'Sunday re-solve >= 85%',
        ],
    },
    {
        week: 6,
        start: '2026-08-31',
        phase: 'Phase 1 · Shared Core',
        mathTrack: 'Calculus I — limits » Taylor + basic integration',
        techTrack: 'Algorithms III — dynamic programming. DS+Algo closes Sat',
        eveningFocus: 'DP tracing PYQs (heavy zone); calculus limit drills',
        subjects: { math: 'math', tech: 'algo', eve: 'algo' },
        days: [
            {
                math: 'Limits + continuity: standard forms, L\'Hopital, piecewise checks',
                tech: 'DP principles: overlapping subproblems, optimal substructure, memoization vs tabulation; Fibonacci » grid paths warm-up',
                eve: 'Limit PYQs + DP warm-ups',
            },
            {
                math: 'Differentiability; mean value theorem + Rolle (favourite CSE 1-markers)',
                tech: 'LCS + edit-distance pattern: table filling, traceback, complexity',
                eve: 'MVT + LCS table PYQs',
            },
            {
                math: 'Maxima/minima single variable: critical points, second-derivative test',
                tech: '0/1 knapsack + subset-sum: state design, table tracing',
                eve: 'Max/min + knapsack PYQs',
            },
            {
                math: 'Taylor / Maclaurin series: standard expansions, truncation error intuition',
                tech: 'Matrix-chain multiplication: parenthesization states, cost recurrence',
                eve: 'Taylor + matrix-chain PYQs',
            },
            {
                math: 'Basic integration: standard forms, definite-integral properties (CSE side)',
                tech: 'Bellman-Ford + Floyd-Warshall; DP vs greedy discrimination (when Dijkstra fails)',
                eve: 'Shortest-path comparison PYQs',
            },
            {
                math: 'Calculus mixed drill',
                tech: 'ALGORITHMS PYQ MARATHON — timed, full W4–W6 span » DS + ALGORITHMS CLOSED',
                eve: 'Marathon post-mortem part 1',
            },
            { math: null, tech: SUNDAY_ENGINE, eve: null },
        ],
        mission:
            'SAT PM: marathon post-mortem. SUN AM: triage, re-solve >=85%, Algorithms short-notes v1, optimization-week preview. SUN PM: OFF.',
        metrics: [
            'Algo marathon >= 70% first-pass',
            'DP trace accuracy >= 75%',
            'Algorithms short notes v1 done',
            'Sunday re-solve >= 85%',
        ],
    },
    {
        week: 7,
        start: '2026-09-07',
        phase: 'Phase 1 · Shared Core',
        mathTrack: 'Calculus II + Optimization — DA math core closes Sat (100%)',
        techTrack: 'DBMS I — ER » SQL deep dive',
        eveningFocus: 'SQL output PYQs (both papers love these); optimization drills',
        subjects: { math: 'math', tech: 'dbms', eve: 'dbms' },
        days: [
            {
                math: 'Single-variable optimization: stationary points, boundary checks, word problems (DA-tested)',
                tech: 'ER model: entities, relationships, cardinality, participation; ER-to-relational mapping',
                eve: 'Optimization + ER PYQs',
            },
            {
                math: 'Convex functions: definitions, first/second-order conditions, why convexity makes optimization easy',
                tech: 'Relational model: keys (super/candidate/primary/foreign), integrity constraints',
                eve: 'Convexity + key-identification PYQs',
            },
            {
                math: 'Gradient + Hessian intuition (ML support: descent direction, curvature)',
                tech: 'Relational algebra: select/project/join family, division, query reading',
                eve: 'Relational-algebra PYQs',
            },
            {
                math: 'Optimization problem drill: mixed single-variable + convexity classification',
                tech: 'Tuple relational calculus: safe expressions, algebra-calculus equivalence reads',
                eve: 'Calculus-of-queries PYQs',
            },
            {
                math: 'Mixed calculus recap (ledger-weighted)',
                tech: 'SQL deep: joins (inner/outer/self), nested queries, aggregation, GROUP BY / HAVING traps, NULL behaviour',
                eve: 'SQL output-prediction set A',
            },
            {
                math: 'Calc/Opt PYQ set — timed » DA MATH CORE 100% (LA + P&S + Calc/Opt all closed)',
                tech: 'SQL output-prediction set B + relational algebra mixed set',
                eve: 'Ledger sweep',
            },
            { math: null, tech: SUNDAY_ENGINE, eve: null },
        ],
        mission:
            'SAT PM: timed Calc/Opt + SQL mixed set. SUN AM: triage, re-solve >=85%, Calc/Opt formula sheet, DM preview. SUN PM: OFF. Milestone: DA math core = 100% — celebrate with the evening off after triage.',
        metrics: [
            'DA math core audit: zero open items',
            'SQL output accuracy >= 80%',
            'Calc/Opt sheet frozen',
            '>=110 PYQs this week',
        ],
    },
    {
        week: 8,
        start: '2026-09-14',
        phase: 'Phase 1 · Shared Core — Final Week',
        mathTrack: 'Discrete Math I (CSE-only) — logic » lattices',
        techTrack: 'DBMS II + Warehousing — shared core completes Sat Sep 20',
        eveningFocus: 'Normalization + serializability PYQs; logic drills',
        subjects: { math: 'math', tech: 'dbms', eve: 'dbms' },
        days: [
            {
                math: 'Propositional logic: connectives, truth tables, equivalences, inference rules, validity',
                tech: 'Functional dependencies: closure, attribute closure, minimal cover',
                eve: 'Logic-validity + FD-closure PYQs',
            },
            {
                math: 'First-order logic: quantifiers, translation to/from English, negating quantified statements',
                tech: 'Decomposition: 1NF » 2NF » 3NF » BCNF; lossless join + dependency preservation',
                eve: 'Normal-form classification PYQs',
            },
            {
                math: 'Sets, relations, functions: injective/surjective/bijective counting',
                tech: 'Indexing: B-tree vs B+ tree structure/order arithmetic; file organization',
                eve: 'B+ tree order-arithmetic PYQs',
            },
            {
                math: 'Relation properties: reflexive/symmetric/transitive counting; equivalence relations, partitions',
                tech: 'Transactions: ACID, schedules, conflict vs view serializability, precedence graphs',
                eve: 'Serializability PYQs',
            },
            {
                math: 'Partial orders, Hasse diagrams, lattices (meet/join, bounded/complemented)',
                tech: '2PL + recoverability; DA add-on: data transformation — normalization, discretization, sampling',
                eve: 'Hasse/lattice + 2PL PYQs',
            },
            {
                math: 'Logic + relations timed drill',
                tech: 'Warehousing (DA): star vs snowflake schemas, fact/dimension tables, concept hierarchies, OLAP ops; DBMS timed set » SHARED CORE COMPLETE (~75% of DA, ~60% of CSE)',
                eve: 'Ledger sweep + core audit prep',
            },
            { math: null, tech: SUNDAY_ENGINE, eve: null },
        ],
        mission:
            'SAT PM: DBMS timed set + post-mortem. SUN AM: triage, re-solve >=85%, DBMS short notes, and the SHARED-CORE AUDIT: list every carryover item explicitly — carryovers get named and scheduled into W16\'s buffer. SUN PM: OFF.',
        metrics: [
            'Shared-core audit written (carryovers named)',
            'Normal-form classification >= 85%',
            'DBMS + warehouse short notes done',
            'Sunday re-solve >= 85%',
        ],
    },
    {
        week: 9,
        start: '2026-09-21',
        phase: 'Phase 2 · Branch — CSE Exclusives Begin',
        mathTrack: 'Discrete Math II — combinatorics',
        techTrack: 'Operating Systems I — processes » synchronization',
        eveningFocus: 'Scheduling + semaphore PYQs; combinatorics drills',
        subjects: { math: 'math', tech: 'os', eve: 'os' },
        days: [
            {
                math: 'Counting principles: product/sum rules, permutations, combinations, with/without repetition',
                tech: 'Processes vs threads: states, PCB, context switch; user vs kernel threads',
                eve: 'Counting + process-state PYQs',
            },
            {
                math: 'Pigeonhole principle: classic and disguised forms',
                tech: 'CPU scheduling: FCFS, SJF, SRTF, RR, priority — Gantt charts, waiting/turnaround arithmetic',
                eve: 'Gantt-chart PYQs (drill to speed)',
            },
            {
                math: 'Recurrence relations: linear homogeneous + particular solutions',
                tech: 'IPC; race conditions; the critical-section problem + correctness requirements',
                eve: 'Recurrence + race-condition PYQs',
            },
            {
                math: 'Generating functions: setup + coefficient extraction basics',
                tech: 'Semaphores + mutex: wait/signal semantics, producer-consumer with bounded buffer',
                eve: 'Semaphore-value PYQs',
            },
            {
                math: 'Combinatorics mixed drill (ledger-weighted)',
                tech: 'Monitors; readers-writers, dining philosophers; deadlock-vs-starvation intuition',
                eve: 'Classic-problem PYQs',
            },
            {
                math: 'Counting timed set',
                tech: 'Scheduling + synchronization timed set',
                eve: 'Ledger sweep',
            },
            { math: null, tech: SUNDAY_ENGINE, eve: null },
        ],
        mission:
            'SAT PM: OS-I timed set post-mortem. SUN AM: triage, re-solve >=85%, OS-I notes, W10 preview. SUN PM: OFF.',
        metrics: [
            'Gantt questions >= 85% accuracy',
            'Semaphore trace accuracy >= 80%',
            '>=110 PYQs this week',
            'Sunday re-solve >= 85%',
        ],
    },
    {
        week: 10,
        start: '2026-09-28',
        phase: 'Phase 2 · Branch',
        mathTrack: 'Discrete Math III — graph theory + groups. All new math done Sat Oct 4',
        techTrack: 'Operating Systems II — deadlock » disk. OS closes',
        eveningFocus: 'ML FAST-TRACK BEGINS: regression, bias-variance, cross-validation',
        subjects: { math: 'math', tech: 'os', eve: 'all' },
        days: [
            {
                math: 'Graph theory: degrees, handshake lemma, connectivity, components',
                tech: 'Deadlock: four conditions, prevention vs avoidance, Banker\'s algorithm arithmetic',
                eve: 'ML: simple + multiple linear regression PYQs',
            },
            {
                math: 'Matching + coloring: bipartite matching basics, chromatic number bounds',
                tech: 'Memory management: contiguous allocation, paging, segmentation, address translation',
                eve: 'ML: ridge regression + regularization intuition PYQs',
            },
            {
                math: 'Euler + Hamiltonian paths/circuits; planarity basics (Euler formula)',
                tech: 'Virtual memory: page tables, multi-level tables, TLB, EMAT arithmetic',
                eve: 'ML: bias-variance decomposition PYQs',
            },
            {
                math: 'Groups/monoids basics: axioms, identity/inverse checks, small examples',
                tech: 'Page replacement: FIFO, LRU, optimal; Belady\'s anomaly; fault counting',
                eve: 'ML: cross-validation (k-fold, LOO) PYQs',
            },
            {
                math: 'DM mixed drill (ledger-weighted)',
                tech: 'File systems: allocation methods, inodes; disk scheduling: FCFS/SSTF/SCAN family arithmetic',
                eve: 'ML: regression mixed set',
            },
            {
                math: 'DM PYQ MARATHON — timed » ALL NEW MATH DONE (maintenance engine starts Monday)',
                tech: 'OS full timed set (W9 + W10 span) » OS CLOSED',
                eve: 'Marathon + OS post-mortems begin',
            },
            { math: null, tech: SUNDAY_ENGINE, eve: null },
        ],
        mission:
            'SAT PM: double post-mortem (DM marathon + OS set). SUN AM: triage, re-solve >=85%, DM sheet frozen, OS short notes, maintenance-rotation setup for Monday. SUN PM: OFF.',
        metrics: [
            'DM marathon >= 70%',
            'Page-fault + EMAT arithmetic >= 85%',
            'ML evening PYQ accuracy >= 80% (your turf — investigate if lower)',
            'All-math-done audit: zero open items',
        ],
    },
    {
        week: 11,
        start: '2026-10-05',
        phase: 'Phase 2 · Branch',
        mathTrack: 'Math maintenance engine — rotation begins (runs to exam day)',
        techTrack: 'Theory of Computation I — regular languages',
        eveningFocus: 'ML fast-track: classification family (logistic, k-NN, naive Bayes, LDA, SVM, trees)',
        subjects: { math: 'math', tech: 'toc', eve: 'all' },
        days: [
            {
                math: 'LA rotation drill (timed)',
                tech: 'DFA + NFA: construction, NFA-to-DFA conversion, epsilon moves',
                eve: 'ML: logistic regression PYQs',
            },
            {
                math: 'P&S rotation drill',
                tech: 'Regular expressions: RE-to-automaton and back; identities',
                eve: 'ML: k-NN + distance-metric PYQs',
            },
            {
                math: 'Calc/Opt rotation drill',
                tech: 'Closure properties of regular languages; decision properties',
                eve: 'ML: naive Bayes PYQs',
            },
            {
                math: 'DM rotation drill',
                tech: 'Pumping lemma (regular): structure of proofs, standard non-regular examples',
                eve: 'ML: LDA + SVM-basics PYQs',
            },
            {
                math: 'Ledger weak-spot drill',
                tech: 'Myhill-Nerode; DFA minimization procedure to fluency',
                eve: 'ML: decision-tree (entropy/Gini) PYQs',
            },
            {
                math: 'Mixed math timed set',
                tech: 'TOC-I timed set: constructions + minimization under clock',
                eve: 'ML: classification mixed set',
            },
            { math: null, tech: SUNDAY_ENGINE, eve: null },
        ],
        mission:
            'SAT PM: TOC-I post-mortem. SUN AM: triage, re-solve >=85%, TOC-I notes; verify GATE 2027 brochure status (registration window typically opens around now — do not miss it). SUN PM: OFF.',
        metrics: [
            'DFA minimization: fluent, error-free on 5/5',
            'ML classification PYQs >= 80%',
            'Maintenance rotation: 6/6 dawns held',
            'Registration status checked on official site',
        ],
    },
    {
        week: 12,
        start: '2026-10-12',
        phase: 'Phase 2 · Branch',
        mathTrack: 'Maintenance rotation (Fri/Sat weighted to ledger flags)',
        techTrack: 'Theory of Computation II — CFLs » undecidability. TOC closes',
        eveningFocus: 'ML fast-track: neural nets + clustering + PCA. ML wraps',
        subjects: { math: 'math', tech: 'toc', eve: 'all' },
        days: [
            {
                math: 'LA rotation drill',
                tech: 'CFGs: derivations, parse trees, ambiguity; normal-form awareness',
                eve: 'ML: MLP / feed-forward NN PYQs',
            },
            {
                math: 'P&S rotation drill',
                tech: 'PDA: acceptance modes, CFG-PDA equivalence intuition',
                eve: 'ML: k-means + k-medoid PYQs',
            },
            {
                math: 'Calc/Opt rotation drill',
                tech: 'CFL pumping lemma + closure properties (union yes, intersection no...)',
                eve: 'ML: hierarchical clustering (single/complete linkage) PYQs',
            },
            {
                math: 'DM rotation drill',
                tech: 'Turing machines: model, RE vs REC, encodings',
                eve: 'ML: PCA PYQs (SVD callback)',
            },
            {
                math: 'Ledger weak-spot drill',
                tech: 'Decidability vs undecidability: reductions, Rice\'s theorem intuition, standard problem table',
                eve: 'ML: full mixed set',
            },
            {
                math: 'Mixed math timed set',
                tech: 'TOC full timed set (W11 + W12 span) » TOC CLOSED',
                eve: 'ML wrap audit: list any topic under 80% for Sat re-drill',
            },
            { math: null, tech: SUNDAY_ENGINE, eve: null },
        ],
        mission:
            'SAT PM: TOC post-mortem. SUN AM: triage, re-solve >=85%, decidability classification table memorized, TOC notes frozen. SUN PM: OFF.',
        metrics: [
            'Decidability classification >= 80%',
            'ML section audit: all topics >= 80% or scheduled',
            'TOC notes frozen',
            'Rotation 6/6 held',
        ],
    },
    {
        week: 13,
        start: '2026-10-19',
        phase: 'Phase 2 · Branch',
        mathTrack: 'Maintenance rotation',
        techTrack: 'Compiler Design — lexing » optimization',
        eveningFocus: 'AI FAST-TRACK BEGINS: search (uninformed, informed, adversarial)',
        subjects: { math: 'math', tech: 'compiler', eve: 'all' },
        days: [
            {
                math: 'LA rotation drill',
                tech: 'Compiler phases; lexical analysis, tokens/lexemes',
                eve: 'AI: BFS/DFS/UCS/IDS as search PYQs',
            },
            {
                math: 'P&S rotation drill',
                tech: 'LL(1): FIRST/FOLLOW computation, parse-table construction, conflicts',
                eve: 'AI: heuristic search — A*, admissibility, consistency',
            },
            {
                math: 'Calc/Opt rotation drill',
                tech: 'LR family: SLR / CLR / LALR items, conflict identification',
                eve: 'AI: A* PYQ drill',
            },
            {
                math: 'DM rotation drill',
                tech: 'Syntax-directed translation: attributes, evaluation orders; intermediate code (3-address)',
                eve: 'AI: minimax mechanics',
            },
            {
                math: 'Ledger weak-spot drill',
                tech: 'Runtime environments: activation records; local optimization + basic data-flow',
                eve: 'AI: alpha-beta pruning counts',
            },
            {
                math: 'Mixed math timed set',
                tech: 'Compilers timed set » COMPILERS CLOSED',
                eve: 'AI: search mixed set',
            },
            { math: null, tech: SUNDAY_ENGINE, eve: null },
        ],
        mission:
            'SAT PM: compilers post-mortem. SUN AM: triage, re-solve >=85%, FIRST/FOLLOW mechanical fluency check, compiler notes. SUN PM: OFF.',
        metrics: [
            'FIRST/FOLLOW computation >= 90% mechanical accuracy',
            'Alpha-beta node-count questions correct 4/5',
            'Rotation 6/6 held',
            'Sunday re-solve >= 85%',
        ],
    },
    {
        week: 14,
        start: '2026-10-26',
        phase: 'Phase 2 · Branch',
        mathTrack: 'Maintenance rotation',
        techTrack: 'Computer Networks — full pass. CN closes',
        eveningFocus: 'AI fast-track: logic + uncertainty » DA syllabus 100% by Sun Nov 1',
        subjects: { math: 'math', tech: 'cn', eve: 'all' },
        days: [
            {
                math: 'LA rotation drill',
                tech: 'Layering models; data link: framing, error detection — parity, CRC arithmetic',
                eve: 'AI: propositional inference PYQs',
            },
            {
                math: 'P&S rotation drill',
                tech: 'MAC: ALOHA, CSMA/CD; Ethernet, switches vs bridges',
                eve: 'AI: predicate-logic translation PYQs',
            },
            {
                math: 'Calc/Opt rotation drill',
                tech: 'Routing: distance-vector vs link-state; count-to-infinity',
                eve: 'AI: conditional independence PYQs',
            },
            {
                math: 'DM rotation drill',
                tech: 'IP: classful/CIDR addressing, subnetting to speed, fragmentation arithmetic, ARP/DHCP/ICMP/NAT',
                eve: 'AI: variable elimination PYQs',
            },
            {
                math: 'Ledger weak-spot drill',
                tech: 'TCP/UDP: headers, connection management, flow + congestion control (slow start / AIMD)',
                eve: 'AI: sampling / approximate inference PYQs',
            },
            {
                math: 'Mixed math timed set',
                tech: 'App layer: DNS, SMTP, HTTP; CN full timed set » CN CLOSED',
                eve: 'AI mixed set + DA closure audit prep',
            },
            { math: null, tech: SUNDAY_ENGINE, eve: null },
        ],
        mission:
            'SAT PM: CN post-mortem. SUN AM (Nov 1): triage, re-solve >=85%, CN notes, and the DA CLOSURE AUDIT — walk the official DA syllabus line by line and sign each item off » DA PAPER 100%. SUN PM: OFF (earned).',
        metrics: [
            'Subnetting: < 90 seconds per question',
            'DA closure audit signed, gaps named',
            'CN notes done',
            'Rotation 6/6 held',
        ],
    },
    {
        week: 15,
        start: '2026-11-02',
        phase: 'Phase 2 · Branch — Final Subjects',
        mathTrack: 'Maintenance rotation',
        techTrack: 'COA (dawns) — instructions » I/O',
        eveningFocus: 'DIGITAL LOGIC (evenings) — Boolean algebra » floating point',
        subjects: { math: 'math', tech: 'coa', eve: 'digital' },
        days: [
            {
                math: 'LA rotation drill',
                tech: 'Machine instructions, addressing modes, instruction formats',
                eve: 'DL: Boolean algebra, minimization laws, K-maps (2–4 var)',
            },
            {
                math: 'P&S rotation drill',
                tech: 'ALU, datapath + control (hardwired vs microprogrammed)',
                eve: 'DL: combinational — mux/demux, encoder/decoder, adders',
            },
            {
                math: 'Calc/Opt rotation drill',
                tech: 'Pipelining: stages, hazards (structural/data/control), stalls + forwarding, speedup arithmetic',
                eve: 'DL: flip-flops — SR/JK/D/T, excitation tables',
            },
            {
                math: 'DM rotation drill',
                tech: 'Memory hierarchy: cache mapping (direct / assoc / set-assoc), AMAT + hierarchy arithmetic',
                eve: 'DL: counters + registers, sequential circuit analysis',
            },
            {
                math: 'Ledger weak-spot drill',
                tech: 'I/O: interrupts, DMA, memory-mapped vs isolated I/O',
                eve: 'DL: number representation, fixed vs floating point (IEEE-754 reads)',
            },
            {
                math: 'Mixed math timed set',
                tech: 'COA timed set » COA CLOSED',
                eve: 'DL timed mini-set (close-out moves to W16 if needed)',
            },
            { math: null, tech: SUNDAY_ENGINE, eve: null },
        ],
        mission:
            'SAT PM: COA post-mortem. SUN AM: triage, re-solve >=85%, COA + DL notes, and write W16\'s buffer agenda from every audit so far (shared-core carryovers + DA gaps + DL remainder + weakest subject). SUN PM: OFF.',
        metrics: [
            'Pipeline speedup + AMAT arithmetic >= 85%',
            'K-map minimization error-free 5/5',
            'W16 buffer agenda written and prioritized',
            'Rotation 6/6 held',
        ],
    },
    {
        week: 16,
        start: '2026-11-09',
        phase: 'Phase 2 · Buffer Week — Syllabus Closes Sat Nov 14',
        mathTrack: 'Maintenance rotation + full math formula-sheet freeze',
        techTrack: 'BUFFER — spillover absorption » full syllabus close',
        eveningFocus: 'Mixed CSE-exclusive PYQ sets; Digital Logic wrap',
        subjects: { math: 'math', tech: 'all', eve: 'all' },
        days: [
            {
                math: 'LA drill + sheet-freeze pass',
                tech: 'Buffer agenda item 1 (highest-priority carryover)',
                eve: 'Mixed CSE-exclusive PYQ set A',
            },
            {
                math: 'P&S drill + sheet-freeze pass',
                tech: 'Buffer agenda item 2',
                eve: 'Mixed CSE-exclusive PYQ set B',
            },
            {
                math: 'Calc/Opt drill + sheet-freeze pass',
                tech: 'Digital Logic completion + timed set',
                techSub: 'digital',
                eve: 'DL post-mortem',
                eveSub: 'digital',
            },
            {
                math: 'DM drill + sheet-freeze pass',
                tech: 'Weakest-subject patch per ledger (deep re-solve block)',
                eve: 'Weak-subject PYQ set',
            },
            {
                math: 'Ledger weak-spot mega-drill',
                tech: 'Short-notes completion sweep: EVERY subject has short notes + formula sheet by tonight',
                eve: 'Notes-gap fixes',
            },
            {
                math: 'Mixed math timed set (all four subjects)',
                tech: 'SYLLABUS CLOSE, SAT NOV 14: final mixed timed set + full closure audit — zero open items across both papers » FULL SYLLABUS CLOSED',
                eve: 'Closure audit + Phase 3 stack build',
            },
            {
                math: 'Rest / light sheet glance',
                tech: 'SUN NOV 15 — REVISION D-DAY: ledger mega-triage (all 16 weeks, sorted by cause + frequency) and the Phase 3 revision stack built (AM)',
                eve: null,
            },
        ],
        mission:
            'SAT PM: closure audit — walk both official syllabi end to end, sign off, and archive. SUN NOV 15 = REVISION D-DAY: ledger mega-triage, build the Phase 3 revision stack, then PM OFF before the revision grind begins Monday.',
        metrics: [
            'Full-syllabus closure audit: zero open items, both papers',
            'Every subject has short notes + formula sheet',
            'Math sheets frozen (LA / P&S / Calc-Opt / DM)',
            'Ledger mega-triage complete; Phase 3 stack built',
        ],
    },
    {
        week: 17,
        start: '2026-11-15',
        phase: 'Phase 3 · Revision Cycle 1',
        mathTrack: 'Drills + LA sectional (Sat)',
        techTrack: 'Revision: Operating Systems (Sun–Wed) » DBMS + Warehousing (Thu–Sat)',
        eveningFocus: 'Timed subject tests: OS (Wed), DBMS (Fri)',
        subjects: { math: 'math', tech: 'os', eve: 'os' },
        days: [
            {
                math: 'REVISION D-DAY: ledger mega-triage + Phase 3 stack (AM). PM OFF',
                tech: null,
                eve: null,
            },
            {
                math: 'LA rotation drill',
                tech: 'OS notes sweep: scheduling + synchronization re-derivations',
                eve: 'OS ledger re-solves (all W9–W10 flags)',
            },
            {
                math: 'P&S rotation drill',
                tech: 'OS notes sweep: memory, VM, page replacement, disk arithmetic',
                eve: 'OS rapid-fire numericals',
            },
            {
                math: 'Calc/Opt drill',
                tech: 'OS ledger re-solve block 2 + trap list',
                eve: 'TIMED OS SUBJECT TEST + immediate post-mortem',
            },
            {
                math: 'DM rotation drill',
                tech: 'DBMS notes sweep: FDs, normalization, indexing',
                techSub: 'dbms',
                eve: 'DBMS ledger re-solves',
                eveSub: 'dbms',
            },
            {
                math: 'Ledger weak-spot drill',
                tech: 'DBMS notes sweep: transactions, serializability, SQL traps + warehouse schemas',
                techSub: 'dbms',
                eve: 'TIMED DBMS SUBJECT TEST + post-mortem',
                eveSub: 'dbms',
            },
            {
                math: 'MATH SECTIONAL: Linear Algebra (timed)',
                tech: 'Weak-zone patch from both subject tests',
                techSub: 'all',
                eve: 'Test post-mortems finalized; ledger updated',
                eveSub: 'all',
            },
        ],
        mission:
            'SAT PM: both subject-test post-mortems complete, every miss tagged. SUN (next plan) continues the cycle — send data + "Generate my next week". SUN PM: OFF.',
        metrics: [
            'OS subject test >= 75%',
            'DBMS subject test >= 75%',
            'LA sectional >= 80%',
            'All test misses ledgered same-day',
        ],
    },
    {
        week: 18,
        start: '2026-11-22',
        phase: 'Phase 3 · Revision Cycle 1',
        mathTrack: 'Drills + P&S sectional (Sat)',
        techTrack: 'Revision: C + Data Structures (Sun–Wed) » Algorithms (Thu–Sat)',
        eveningFocus: 'Timed subject tests: DS (Wed), Algorithms (Fri)',
        subjects: { math: 'math', tech: 'ds', eve: 'ds' },
        days: [
            {
                math: 'Ledger triage of W17 + rest (AM). PM OFF',
                tech: null,
                eve: null,
            },
            {
                math: 'LA rotation drill',
                tech: 'C traps re-solve: pointers, recursion outputs, storage classes',
                techSub: 'c_prog',
                eve: 'C rapid output set',
                eveSub: 'c_prog',
            },
            {
                math: 'P&S rotation drill',
                tech: 'DS notes sweep: trees, hashing, heaps re-derivations',
                eve: 'DS ledger re-solves',
            },
            {
                math: 'Calc/Opt drill',
                tech: 'DS traps: probe sequences, traversal reconstructions, circular-queue arithmetic',
                eve: 'TIMED DS SUBJECT TEST + post-mortem',
            },
            {
                math: 'DM rotation drill',
                tech: 'Algorithms notes sweep: recurrences, greedy proofs, graph algorithms',
                techSub: 'algo',
                eve: 'Algo ledger re-solves',
                eveSub: 'algo',
            },
            {
                math: 'Ledger weak-spot drill',
                tech: 'DP pattern restoration: LCS / knapsack / shortest-path table fluency',
                techSub: 'algo',
                eve: 'TIMED ALGORITHMS SUBJECT TEST + post-mortem',
                eveSub: 'algo',
            },
            {
                math: 'MATH SECTIONAL: Probability & Statistics (timed)',
                tech: 'Weak-zone patch from both tests',
                techSub: 'all',
                eve: 'Post-mortems finalized; ledger updated',
                eveSub: 'all',
            },
        ],
        mission:
            'SAT PM: post-mortems complete. SUN: cycle continues — send data + "Generate my next week". SUN PM: OFF.',
        metrics: [
            'DS subject test >= 75%',
            'Algorithms subject test >= 75%',
            'P&S sectional >= 80%',
            'DP tables restored to fluency (self-check)',
        ],
    },
    {
        week: 19,
        start: '2026-11-29',
        phase: 'Phase 3 · Revision Cycle 1',
        mathTrack: 'Drills + Calc/DM sectional (Sat)',
        techTrack: 'Revision: TOC (Sun–Tue) » Compilers (Wed–Thu) » Digital Logic (Fri–Sat)',
        eveningFocus: 'Timed subject tests: TOC (Tue), Compilers (Thu), DL (Fri)',
        subjects: { math: 'math', tech: 'toc', eve: 'toc' },
        days: [
            {
                math: 'Ledger triage (AM). PM OFF',
                tech: null,
                eve: null,
            },
            {
                math: 'LA rotation drill',
                tech: 'TOC sweep: constructions, minimization, pumping patterns',
                eve: 'TOC ledger re-solves',
            },
            {
                math: 'P&S rotation drill',
                tech: 'TOC sweep: decidability classification table re-memorized',
                eve: 'TIMED TOC SUBJECT TEST + post-mortem',
            },
            {
                math: 'Calc/Opt drill',
                tech: 'Compilers sweep: FIRST/FOLLOW + LL/LR conflicts re-drilled',
                techSub: 'compiler',
                eve: 'Compilers ledger re-solves',
                eveSub: 'compiler',
            },
            {
                math: 'DM rotation drill',
                tech: 'Compilers sweep: SDT + runtime environments',
                techSub: 'compiler',
                eve: 'TIMED COMPILERS SUBJECT TEST + post-mortem',
                eveSub: 'compiler',
            },
            {
                math: 'Ledger weak-spot drill',
                tech: 'DL sweep: K-maps, sequential analysis, IEEE-754 reads',
                techSub: 'digital',
                eve: 'TIMED DIGITAL LOGIC TEST + post-mortem',
                eveSub: 'digital',
            },
            {
                math: 'MATH SECTIONAL: Calculus + Discrete Math (timed)',
                tech: 'Weak-zone patch from all three tests',
                techSub: 'all',
                eve: 'Post-mortems finalized; ledger updated',
                eveSub: 'all',
            },
        ],
        mission:
            'SAT PM: post-mortems complete. SUN: cycle continues — send data + "Generate my next week". SUN PM: OFF.',
        metrics: [
            'TOC test >= 75%',
            'Compilers test >= 75%',
            'DL test >= 75%',
            'Calc/DM sectional >= 80%',
        ],
    },
    {
        week: 20,
        start: '2026-12-06',
        phase: 'Phase 3 · Revision Cycle 1 — Closes with Mock #1',
        mathTrack: 'Drills + mixed-math sectional',
        techTrack: 'Revision: CN (Sun–Mon) » COA (Tue) » ML (Wed) » AI (Thu) » GA (Fri)',
        eveningFocus: 'Subject tests daily; SAT DEC 12: FULL-LENGTH CSE MOCK #1 (exam slot)',
        subjects: { math: 'math', tech: 'cn', eve: 'cn' },
        days: [
            {
                math: 'Ledger triage (AM); CN notes sweep begins (PM stays OFF — sweep goes to Monday if needed)',
                tech: null,
                eve: null,
            },
            {
                math: 'LA rotation drill',
                tech: 'CN sweep: subnetting speed, TCP mechanics, CRC',
                eve: 'TIMED CN SUBJECT TEST + post-mortem',
            },
            {
                math: 'P&S rotation drill',
                tech: 'COA sweep: pipeline + cache arithmetic restoration',
                techSub: 'coa',
                eve: 'TIMED COA SUBJECT TEST + post-mortem',
                eveSub: 'coa',
            },
            {
                math: 'Calc/Opt drill',
                tech: 'ML sweep: ledger-flagged zones only (your strong suit)',
                techSub: 'all',
                eve: 'TIMED ML SUBJECT TEST + post-mortem',
                eveSub: 'all',
            },
            {
                math: 'DM rotation drill',
                tech: 'AI sweep: search counts, inference, uncertainty',
                techSub: 'all',
                eve: 'TIMED AI SUBJECT TEST + post-mortem',
                eveSub: 'all',
            },
            {
                math: 'Mixed-math sectional (timed)',
                tech: 'GA full sectional (timed) + weak-zone patch',
                techSub: 'aptitude',
                eve: 'Mock-eve protocol: light review only, sleep on time',
                eveSub: 'all',
            },
            {
                math: 'Light drill 45\' pre-mock',
                tech: 'FULL-LENGTH CSE MOCK #1 — 3 h, exam-slot simulation, virtual calculator only',
                techSub: 'all',
                eve: 'Mock post-mortem part 1 (same evening)',
                eveSub: 'all',
            },
        ],
        mission:
            'SAT: mock + post-mortem part 1. SUN DEC 13: post-mortem part 2 (2x-time rule: every wrong + every lucky guess re-solved, tagged). SUN PM: OFF. Phase 4 begins Monday.',
        metrics: [
            'All 4 subject tests + GA sectional done, >= 75% each',
            'Mock #1 completed under full exam conditions',
            'Mock post-mortem finished within 24 h',
            'Cycle 1 audit: every subject revised once',
        ],
    },
    {
        week: 21,
        start: '2026-12-13',
        phase: 'Phase 4 · Mock Marathon — Week 1 of 6',
        mathTrack: 'Maintenance drills + ledger greatest-hits',
        techTrack: 'Mock #1 post-mortem (Sun) » Cycle-2 revision » first DA full (Sat)',
        eveningFocus: 'Post-mortems on the 2x rule; score TREND starts here',
        subjects: { math: 'math', tech: 'all', eve: 'all' },
        days: [
            {
                math: 'Light drill 45\'',
                tech: 'MOCK #1 (Dec 12 CSE) POST-MORTEM — 2x rule: every wrong AND every lucky guess re-solved + cause-tagged (AM). PM OFF — protected',
                eve: null,
            },
            {
                math: 'LA rotation drill',
                tech: 'Cycle-2 revision: weakest subject A (ledger-ranked) — notes + re-solves',
                eve: 'Post-mortem residue » trap list + ledger',
            },
            {
                math: 'P&S rotation drill',
                tech: 'Cycle-2 revision: weakest subject A continued',
                eve: 'Weak-zone PYQ set',
            },
            {
                math: 'Calc/Opt drill',
                tech: 'Cycle-2 revision: weakest subject B',
                eve: 'Weak-zone sectional (timed)',
            },
            {
                math: 'DM rotation drill',
                tech: 'Cycle-2 revision: weakest subject B continued',
                eve: 'Sectional post-mortem + ledger',
            },
            {
                math: 'Ledger weak-spot drill',
                tech: 'Attempt-order + timing policy tuning; trap-list review',
                eve: 'Mock-eve: light only, sleep on time',
            },
            {
                math: 'Light drill 45\' pre-mock',
                tech: 'FULL-LENGTH DA MOCK #1 — 09:30–12:30 slot (Saturday stretch day)',
                eve: 'Afternoon + evening: FULL same-day post-mortem (2x rule) — finished tonight',
            },
        ],
        mission:
            'SUN: Mock #1 post-mortem complete by lunch, PM OFF. SAT: DA full #1 in the morning slot, complete same-day post-mortem. Between: Cycle-2 on the two weakest subjects per ledger. Send scores + data with "Generate my next week".',
        metrics: [
            'Mock #1 post-mortem complete (2x rule)',
            'DA full #1 done under exam conditions + post-mortemed same day',
            'Cycle-2: 2 weak subjects revised',
            'All mock misses ledgered',
        ],
    },
    {
        week: 22,
        start: '2026-12-20',
        phase: 'Phase 4 · Mock Marathon — Week 2 of 6',
        mathTrack: 'Maintenance drills + ledger greatest-hits',
        techTrack: 'Full-lengths: SUN DA (AM) + SAT CSE · Cycle-2 revision midweek',
        eveningFocus: 'Post-mortems on the 2x rule; score TREND tracked, not single scores',
        subjects: { math: 'math', tech: 'all', eve: 'all' },
        days: [
            {
                math: 'Light drill 45\' pre-mock',
                tech: 'FULL-LENGTH DA MOCK — 09:30–12:30 exam-slot simulation. Light lunch, then rest. PM protected',
                eve: null,
            },
            {
                math: 'LA rotation drill',
                tech: 'Cycle-2 revision: weakest subject A (ledger-ranked) — notes + re-solves',
                eve: 'Sun-mock post-mortem part 1 (2x rule)',
            },
            {
                math: 'P&S rotation drill',
                tech: 'Cycle-2 revision: weakest subject A continued',
                eve: 'Sun-mock post-mortem part 2 + ledger',
            },
            {
                math: 'Calc/Opt drill',
                tech: 'Cycle-2 revision: weakest subject B',
                eve: 'Weak-zone sectional (timed)',
            },
            {
                math: 'DM rotation drill',
                tech: 'Cycle-2 revision: weakest subject B continued',
                eve: 'Sectional post-mortem',
            },
            {
                math: 'Ledger weak-spot drill',
                tech: 'Attempt-order + timing policy tuning; trap-list review',
                eve: 'Mock-eve: light only, sleep on time',
            },
            {
                math: 'Light drill 45\' pre-mock',
                tech: 'FULL-LENGTH CSE MOCK — 09:30–12:30 slot (Saturday stretch day)',
                eve: 'Afternoon + evening: FULL same-day post-mortem (2x rule) — finished tonight, nothing carried into Sunday',
            },
        ],
        mission:
            'SUN: DA full in the 09:30–12:30 slot, PM protected (post-mortem lands in Mon+Tue burns). SAT: CSE full in the morning slot, entire afternoon + evening = complete same-day post-mortem. Holiday season is noise: the frame holds.',
        metrics: [
            '2 fulls completed, both post-mortemed within 24 h',
            'Score trend logged (3-mock moving average started)',
            'Cycle-2: next 2 weak subjects revised',
            'Sleep 22:00–05:00 held all 7 nights',
        ],
    },
    {
        week: 23,
        start: '2026-12-27',
        phase: 'Phase 4 · Mock Marathon — Week 3 of 6',
        mathTrack: 'Maintenance drills + ledger greatest-hits',
        techTrack: 'Full-lengths: SUN CSE (AM) + SAT DA · Cycle-2 revision midweek',
        eveningFocus: 'Post-mortems on the 2x rule; score TREND tracked, not single scores',
        subjects: { math: 'math', tech: 'all', eve: 'all' },
        days: [
            {
                math: 'Light drill 45\' pre-mock',
                tech: 'FULL-LENGTH CSE MOCK — 09:30–12:30 exam-slot simulation. Light lunch, then rest. PM protected',
                eve: null,
            },
            {
                math: 'LA rotation drill',
                tech: 'Cycle-2 revision: weakest subject A (ledger-ranked) — notes + re-solves',
                eve: 'Sun-mock post-mortem part 1 (2x rule)',
            },
            {
                math: 'P&S rotation drill',
                tech: 'Cycle-2 revision: weakest subject A continued',
                eve: 'Sun-mock post-mortem part 2 + ledger',
            },
            {
                math: 'Calc/Opt drill',
                tech: 'Cycle-2 revision: weakest subject B',
                eve: 'Weak-zone SECTIONAL #1 (timed) on flagged area',
            },
            {
                math: 'DM rotation drill',
                tech: 'Cycle-2 revision: weakest subject B continued',
                eve: 'Sectional post-mortem + ledger',
            },
            {
                math: 'Ledger weak-spot drill',
                tech: 'Attempt-order + timing policy tuning; trap-list review',
                eve: 'Mock-eve: light only, sleep on time',
            },
            {
                math: 'Light drill 45\' pre-mock',
                tech: 'FULL-LENGTH DA MOCK — 09:30–12:30 slot (Saturday stretch day)',
                eve: 'Afternoon + evening: FULL same-day post-mortem (2x rule) — finished tonight, nothing carried into Sunday',
            },
        ],
        mission:
            'Start locking your attempt-order policy (GA first? NATs when?) and your skip rules — by January these must be reflexes, not decisions. New year, same frame.',
        metrics: [
            '2 fulls + 2 sectionals completed',
            'Attempt-order policy written down and tested',
            'Trend improving or cause identified',
            'Virtual-calculator fluency: no fumbling',
        ],
    },
    {
        week: 24,
        start: '2027-01-03',
        phase: 'Phase 4 · Mock Marathon — Week 4 of 6',
        mathTrack: 'Maintenance drills + ledger greatest-hits',
        techTrack: 'Full-lengths: SUN DA (AM) + SAT CSE · Cycle-2 revision midweek',
        eveningFocus: 'Post-mortems on the 2x rule; score TREND tracked, not single scores',
        subjects: { math: 'math', tech: 'all', eve: 'all' },
        days: [
            {
                math: 'Light drill 45\' pre-mock',
                tech: 'FULL-LENGTH DA MOCK — 09:30–12:30 exam-slot simulation. Light lunch, then rest. PM protected',
                eve: null,
            },
            {
                math: 'LA rotation drill',
                tech: 'Cycle-2 revision: weakest subject A (ledger-ranked) — notes + re-solves',
                eve: 'Sun-mock post-mortem part 1 (2x rule)',
            },
            {
                math: 'P&S rotation drill',
                tech: 'Cycle-2 revision: weakest subject A continued',
                eve: 'Sun-mock post-mortem part 2 + ledger',
            },
            {
                math: 'Calc/Opt drill',
                tech: 'Cycle-2 revision: weakest subject B',
                eve: 'Weak-zone SECTIONAL #2 (timed)',
            },
            {
                math: 'DM rotation drill',
                tech: 'Cycle-2 revision: weakest subject B continued',
                eve: 'Sectional post-mortem + ledger',
            },
            {
                math: 'Ledger weak-spot drill',
                tech: 'Attempt-order + timing policy tuning; trap-list review',
                eve: 'Mock-eve: light only, sleep on time',
            },
            {
                math: 'Light drill 45\' pre-mock',
                tech: 'FULL-LENGTH CSE MOCK — 09:30–12:30 slot (Saturday stretch day)',
                eve: 'Afternoon + evening: FULL same-day post-mortem (2x rule) — finished tonight, nothing carried into Sunday',
            },
        ],
        mission:
            'Marking discipline is now the edge: NATs never blank (no negative), MSQs only what you can defend (no partial credit), 2-mark MCQs skipped below ~50% confidence. Cycle-2 narrows to the stubborn residue.',
        metrics: [
            '2 fulls + 2 sectionals completed',
            'Negative-mark leakage reduced vs W23 (measure it)',
            'Stubborn-residue list written (max 5 items)',
            'Post-mortems within 24 h',
        ],
    },
    {
        week: 25,
        start: '2027-01-10',
        phase: 'Phase 4 · Mock Marathon — Week 5 of 6 · 3 Fulls',
        mathTrack: 'Maintenance drills + ledger greatest-hits',
        techTrack: 'Full-lengths: SUN DA (AM) + WED third full + SAT CSE',
        eveningFocus: 'Post-mortems on the 2x rule; peak volume — no new material, only sharpening',
        subjects: { math: 'math', tech: 'all', eve: 'all' },
        days: [
            {
                math: 'Light drill 45\' pre-mock',
                tech: 'FULL-LENGTH DA MOCK — 09:30–12:30 exam-slot simulation. Light lunch, then rest. PM protected',
                eve: null,
            },
            {
                math: 'LA rotation drill',
                tech: 'Cycle-2 revision: weakest subject A (ledger-ranked) — notes + re-solves',
                eve: 'Sun-mock post-mortem part 1 (2x rule)',
            },
            {
                math: 'P&S rotation drill',
                tech: 'Cycle-2 revision: weakest subject A continued',
                eve: 'Sun-mock post-mortem part 2 + ledger',
            },
            {
                math: 'Calc/Opt drill',
                tech: 'Cycle-2 revision: weakest subject B',
                eve: 'THIRD FULL: Wed 18:45–21:45 (or forenoon on a leave day). Trim close-out; sleep still 22:00',
            },
            {
                math: 'DM rotation drill',
                tech: 'Cycle-2 revision: weakest subject B continued',
                eve: 'Wed-mock FULL post-mortem (2x rule)',
            },
            {
                math: 'Ledger weak-spot drill',
                tech: 'Attempt-order + timing policy tuning; trap-list review',
                eve: 'Mock-eve: light only, sleep on time',
            },
            {
                math: 'Light drill 45\' pre-mock',
                tech: 'FULL-LENGTH CSE MOCK — 09:30–12:30 slot (Saturday stretch day)',
                eve: 'Afternoon + evening: FULL same-day post-mortem (2x rule) — finished tonight, nothing carried into Sunday',
            },
        ],
        mission:
            'Peak volume: three fulls at exact exam-slot timing wherever possible. The math slot now runs ledger greatest-hits daily. No new material exists anymore — only sharpening.',
        metrics: [
            '3 fulls completed + post-mortemed',
            'Exam-slot timing simulated on Sun + Sat',
            'Greatest-hits re-solve accuracy >= 90%',
            'Energy check passed (no burnout tells) — else deload per ground rules',
        ],
    },
    {
        week: 26,
        start: '2027-01-17',
        phase: 'Phase 4 · Mock Marathon — Week 6 of 6 · Final Push',
        mathTrack: 'Maintenance drills + ledger greatest-hits',
        techTrack: 'Full-lengths: SUN CSE (AM) + WED third full + SAT DA',
        eveningFocus: 'Last marathon week — by Saturday ~13–15 full-lengths banked',
        subjects: { math: 'math', tech: 'all', eve: 'all' },
        days: [
            {
                math: 'Light drill 45\' pre-mock',
                tech: 'FULL-LENGTH CSE MOCK — 09:30–12:30 exam-slot simulation. Light lunch, then rest. PM protected',
                eve: null,
            },
            {
                math: 'LA rotation drill',
                tech: 'Cycle-2 revision: weakest subject A (ledger-ranked) — notes + re-solves',
                eve: 'Sun-mock post-mortem part 1 (2x rule)',
            },
            {
                math: 'P&S rotation drill',
                tech: 'Cycle-2 revision: weakest subject A continued',
                eve: 'Sun-mock post-mortem part 2 + ledger',
            },
            {
                math: 'Calc/Opt drill',
                tech: 'Cycle-2 revision: weakest subject B',
                eve: 'THIRD FULL: Wed 18:45–21:45 (or forenoon on leave)',
            },
            {
                math: 'DM rotation drill',
                tech: 'Cycle-2 revision: weakest subject B continued',
                eve: 'Wed-mock FULL post-mortem (2x rule)',
            },
            {
                math: 'Ledger weak-spot drill',
                tech: 'Attempt-order + timing policy tuning; trap-list review',
                eve: 'Mock-eve: light only, sleep on time',
            },
            {
                math: 'Light drill 45\' pre-mock',
                tech: 'FULL-LENGTH DA MOCK — 09:30–12:30 slot (Saturday stretch day)',
                eve: 'Afternoon + evening: FULL same-day post-mortem (2x rule) — finished tonight, nothing carried into Sunday',
            },
        ],
        mission:
            'Whatever the trend says now, the taper converts fitness into exam-day peak — trust the process you have run for six months.',
        metrics: [
            '3 fulls completed; marathon totals hit (~7–8 CSE, ~6–7 DA)',
            'Final weak-list for taper written (max 3 items)',
            'All post-mortems complete — no debt carried into taper',
            'Sleep held all week',
        ],
    },
    {
        week: 27,
        start: '2027-01-24',
        phase: 'Phase 5 · Taper — Week 1',
        mathTrack: 'Ledger greatest-hits + formula sheets (light)',
        techTrack: 'One LIGHT full per paper » sheets » logistics',
        eveningFocus: 'Gentle consolidation only — volume drops on purpose',
        subjects: { math: 'math', tech: 'all', eve: 'all' },
        days: [
            {
                math: 'Light drill 45\'',
                tech: 'LIGHT CSE FULL — 09:30–12:30 slot, no post-mortem marathon: errors noted gently, tagged, done. PM protected',
                eve: 'Rest',
            },
            {
                math: 'Greatest-hits re-solve (LA + P&S)',
                tech: 'Formula-sheet pass: all math + OS/CN/COA arithmetic sheets',
                eve: 'Gentle trap-list read',
            },
            {
                math: 'Greatest-hits re-solve (Calc + DM)',
                tech: 'LIGHT DA FULL — evening 18:45–21:45 (or forenoon on leave). Gentle notes only',
                eve: 'Rest after mock',
            },
            {
                math: 'Greatest-hits re-solve (weak residue)',
                tech: 'Short-notes skim: theory cluster (TOC/Compilers/DL)',
                eve: 'GA light set',
                eveSub: 'aptitude',
            },
            {
                math: 'Formula-sheet self-test (blind recall)',
                tech: 'Short-notes skim: systems cluster (OS/CN/COA/DBMS)',
                eve: 'Logistics: admit card printed, ID ready, center located',
            },
            {
                math: 'Light mixed drill',
                tech: 'Half-mock sectional (max) + gentle review; wind down',
                eve: 'Early night',
            },
            {
                math: 'Sheets only (45\')',
                tech: 'Rest, walk, food, exam-slot alertness anchoring',
                eve: null,
            },
        ],
        mission:
            'Both light fulls done by Wednesday; from Thursday it is sheets, skims and logistics. SUN: full rest + alertness anchoring. Deload trigger stays armed — any burnout tell cuts volume further, never sleep.',
        metrics: [
            '2 light fulls done, gently reviewed',
            'All formula sheets pass blind self-test',
            'Logistics complete (admit card, ID, route, center recce planned)',
            'Sleep 22:00–05:00 all 7 nights',
        ],
    },
    {
        week: 28,
        start: '2027-01-31',
        phase: 'Phase 5 · Taper — Exam Week',
        mathTrack: 'Sheets + greatest-hits only (short sessions)',
        techTrack: 'Peak protocol — exam dates TBA: verify + adapt this week to the real schedule',
        eveningFocus: 'Nothing heavy; alertness anchored to session times',
        subjects: { math: 'math', tech: 'all', eve: 'all' },
        days: [
            {
                math: 'Sheets 45\'',
                tech: 'Half-mock (final one, if any) OR sectional skim; stop by noon',
                eve: 'Light trap-list read; early night',
            },
            {
                math: 'Sheets 45\'',
                tech: 'Greatest-hits: top-20 ledger items, relaxed re-solve',
                eve: 'Rest; alertness anchoring',
            },
            {
                math: 'Sheets 45\'',
                tech: 'Short-notes final skim, paper 1 subjects',
                eve: 'Rest',
            },
            {
                math: 'Sheets 45\'',
                tech: 'Short-notes final skim, paper 2 subjects',
                eve: 'Pack: admit card, ID, pens, water; route rehearsed',
            },
            {
                math: 'Sheets 30\'',
                tech: 'DAY BEFORE PAPER: zero study after noon. Walk, eat clean, no screens late',
                eve: 'Lights out 22:00 sharp',
            },
            {
                math: null,
                tech: 'EXAM-DAY PROTOCOL: wake 05:00 as always; light sheet glance (30\' max); reach center 60–90\' early; GA-first attempt order; NATs never blank; breathe between sections',
                techType: 'exam',
                eve: 'Between papers (if same weekend): rest, food, 30\' sheet glance for paper 2 — no post-mortem of paper 1',
            },
            {
                math: null,
                tech: 'Second paper / recovery day per official schedule. Done. Whatever the papers held, the campaign was honest',
                techType: 'exam',
                eve: null,
            },
        ],
        mission:
            'This week bends to the official timetable: keep the pattern — short sheet sessions, early stops, sleep sacrosanct, day-before rule absolute (nothing after noon). If CSE and DA land on different weekends, insert a copy of the Mon–Thu pattern between them.',
        metrics: [
            'Official dates verified + week adapted',
            'Day-before rule honored for each paper',
            'Exam-day protocol executed as rehearsed',
            'Sleep held — you peak, you do not cram',
        ],
    },
];

function addDaysISO(iso, n) {
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(y, m - 1, d + n);
    return (
        date.getFullYear() +
        '-' +
        String(date.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(date.getDate()).padStart(2, '0')
    );
}

function inferType(text, slot) {
    const t = text.toLowerCase();
    if (/exam-day protocol|second paper/.test(t)) return 'exam';
    if (/mock|subject test|sectional|third full/.test(t)) return 'test';
    if (/pyq|marathon|timed set|drill|output set|rapid/.test(t)) return 'pyq';
    if (/triage|post-mortem|notes|sheet|rest|audit|ledger re-solve|skim|logistics|pack|trap-list/.test(t)) return 'revision';
    return slot === 'eve' ? 'pyq' : 'study';
}

function buildSession(id, text, subject, duration, frameLabel, forcedType, slot) {
    return {
        id,
        duration,
        subject,
        topics: [text, frameLabel],
        type: forcedType || inferType(text, slot),
    };
}

/**
 * Builds the full plan in the planner's canonical day-node format.
 * Weeks are walked in order into a date-keyed map (a date claimed by two
 * weeks — Nov 15 — resolves to the later week), then day numbers 1..N are
 * assigned chronologically.
 */
export function buildIshikaStudyPlan() {
    const byDate = new Map();

    for (const week of ISHIKA_WEEKS) {
        week.days.forEach((cell, idx) => {
            const date = addDaysISO(week.start, idx);
            const sessions = [];

            if (cell.math) {
                sessions.push(
                    buildSession(
                        'MATH',
                        cell.math,
                        cell.mathSub || week.subjects.math,
                        90,
                        FRAME_MATH,
                        cell.mathType,
                        'math'
                    )
                );
            }
            if (cell.tech) {
                sessions.push(
                    buildSession(
                        'TECH',
                        cell.tech,
                        cell.techSub || week.subjects.tech,
                        155,
                        FRAME_TECH,
                        cell.techType,
                        'tech'
                    )
                );
            }
            if (cell.eve) {
                sessions.push(
                    buildSession(
                        'EVE',
                        cell.eve,
                        cell.eveSub || week.subjects.eve,
                        105,
                        FRAME_EVE,
                        cell.eveType,
                        'eve'
                    )
                );
            }

            byDate.set(date, {
                date,
                phase: `Week ${week.week} · ${week.phase}`,
                phaseSubtitle: `Math: ${week.mathTrack} · Tech: ${week.techTrack} · Evening: ${week.eveningFocus}`,
                sessions,
                week: week.week,
                weekMission: week.mission,
                weekMetrics: week.metrics,
            });
        });
    }

    return [...byDate.values()]
        .sort((a, b) => (a.date < b.date ? -1 : 1))
        .map((node, i) => ({ day: i + 1, ...node }));
}

export const ISHIKA_PLAN_TOTAL_DAYS = buildIshikaStudyPlan().length;
