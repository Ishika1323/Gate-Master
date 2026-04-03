/**
 * Detailed GATE CSE Curriculum — precise day-level subtopics per month.
 *
 * Each month maps to its primary and secondary subjects with granular
 * subtopic arrays. The study plan generator picks a subtopic based on
 * the day's position within the month so that every schedule card shows
 * an exact chapter / concept instead of "Part 1, Part 2".
 */

// ── Month-wise detailed subtopics ─────────────────────────────────────────────

export const MONTHLY_DETAILED = {
    /* ═══════════════════════════════════════════════════
       APRIL  —  Discrete Math (primary) + Probability (secondary)
       ═══════════════════════════════════════════════════ */
    4: {
        primary: {
            sub: 'math',
            label: 'Discrete Mathematics',
            subtopics: [
                // Week 1 — Propositional Logic
                'Propositional Logic: Truth Tables & Connectives (AND, OR, NOT, XOR)',
                'Propositional Logic: Logical Equivalences & De Morgan\'s Laws',
                'Propositional Logic: Implications, Biconditional & Contrapositive',
                'Propositional Logic: Tautology, Contradiction & Satisfiability',
                'Propositional Logic: Normal Forms (CNF & DNF) & Conversion',
                'Propositional Logic: Proof Techniques — Direct & Indirect',
                'PL Revision: Mixed GATE PYQ Set on Propositional Logic',
                // Week 2 — First Order Logic
                'First Order Logic: Predicates, Quantifiers (∀, ∃) & Scope',
                'First Order Logic: Nested Quantifiers & Order of Quantification',
                'First Order Logic: Free & Bound Variables, Substitution',
                'First Order Logic: Logical Inference Rules (Modus Ponens, Tollens)',
                'First Order Logic: Prenex Normal Form & Skolemization',
                'FOL Revision: GATE PYQ Set on First Order Logic',
                // Week 3 — Sets & Relations
                'Set Theory: Set Operations, Power Set & Cartesian Product',
                'Relations: Properties — Reflexive, Symmetric, Transitive, Antisymmetric',
                'Relations: Closures — Reflexive, Symmetric & Transitive Closure',
                'Equivalence Relations: Partitions & Equivalence Classes',
                'Partial Orders: Hasse Diagrams, Maximal/Minimal, LUB/GLB',
                'Lattices: Properties, Distributive & Complemented Lattices',
                'Relations Revision: GATE PYQ Set on Relations & Lattices',
                // Week 4 — Functions & Combinatorics
                'Functions: Injective, Surjective, Bijective & Composition',
                'Combinatorics: Permutations & Combinations with Repetition',
                'Combinatorics: Pigeonhole Principle & Applications',
                'Recurrence Relations: Solving Homogeneous Linear Recurrences',
                'Recurrence Relations: Non-homogeneous & Master Theorem',
                'Generating Functions: Definition, Operations & Closed Forms',
                'Graph Theory Intro: Degree Sequences, Handshaking Lemma',
                'Graph Theory: Euler & Hamilton Paths, Planar Graphs',
                'Graph Theory: Chromatic Number & Graph Coloring',
                'Discrete Math Consolidation: Full-length GATE PYQ Practice',
            ],
        },
        secondary: {
            sub: 'math',
            label: 'Probability & Statistics',
            subtopics: [
                // Week 1
                'Probability Axioms: Sample Space, Events & Probability Rules',
                'Probability: Addition Theorem & Inclusion-Exclusion',
                'Conditional Probability: Definition & Multiplication Rule',
                'Bayes\' Theorem: Statement, Proof & Classic Applications',
                'Total Probability Theorem: Partitions & Chain Applications',
                'Independent Events: Definition & Pairwise vs Mutual Independence',
                'Probability PYQ Practice Set 1',
                // Week 2
                'Random Variables: Discrete — PMF, CDF & Examples',
                'Random Variables: Continuous — PDF, CDF & Transformation',
                'Expectation: Definition, Linearity & Conditional Expectation',
                'Variance: Definition, Chebyshev Inequality & Properties',
                'Binomial Distribution: PMF, Mean, Variance & GATE Problems',
                'Poisson Distribution: Derivation, Properties & Applications',
                'Probability PYQ Practice Set 2',
                // Week 3–4
                'Normal Distribution: Z-scores, Standard Normal Table',
                'Exponential Distribution: Memoryless Property & Applications',
                'Uniform Distribution: Continuous & Discrete Forms',
                'Joint Probability: Joint PMF, Marginal & Conditional',
                'Covariance & Correlation: Properties & Computation',
                'Moment Generating Functions: Definition & Applications',
                'Statistical Inference: Point Estimation & Bias',
                'Hypothesis Testing: Null, Alternative & Type I/II Errors',
                'Probability & Stats Consolidation: GATE PYQ Mixed Set',
            ],
        },
    },

    /* ═══════════════════════════════════════════════════
       MAY  —  Digital Logic (primary) + Calculus (secondary)
       ═══════════════════════════════════════════════════ */
    5: {
        primary: {
            sub: 'digital',
            label: 'Digital Logic',
            subtopics: [
                // Week 1 — Boolean Algebra & Gates
                'Boolean Algebra: Axioms, Theorems & Duality Principle',
                'Boolean Algebra: SOP & POS Canonical Forms',
                'Boolean Simplification: Algebraic Minimization Techniques',
                'Logic Gates: AND, OR, NOT, NAND, NOR, XOR, XNOR Implementation',
                'Universal Gates: NAND-only & NOR-only Circuit Design',
                'Gate-level Delay Analysis & Propagation Delay',
                'Boolean Algebra PYQ Set',
                // Week 2 — K-maps
                'K-maps: 2-variable & 3-variable Simplification',
                'K-maps: 4-variable Simplification with Prime Implicants',
                'K-maps: Don\'t Care Conditions & Essential Prime Implicants',
                'K-maps: POS Minimization using Maxterms',
                'Quine-McCluskey Method: Tabular Minimization',
                'Multi-output Minimization & Shared Prime Implicants',
                'K-map PYQ Set',
                // Week 3 — Combinational Circuits
                'Multiplexers: 2:1, 4:1, 8:1 Design & Function Implementation',
                'Decoders & Encoders: n-to-2ⁿ Decoder, Priority Encoder',
                'Adders: Half Adder, Full Adder & Ripple Carry Adder',
                'Subtractors & Comparators: Circuit Design',
                'ALU Design: Arithmetic & Logic Unit Structure',
                'Combinational Circuit PYQ Set',
                // Week 4 — Sequential Circuits
                'Latches: SR, D Latch — Timing Diagrams & Analysis',
                'Flip-Flops: SR, JK, D, T — Characteristic Tables & Excitation',
                'Flip-Flop Conversions: JK↔D, SR↔T',
                'Counters: Synchronous & Asynchronous — Mod-N Design',
                'Registers: Shift Register Types & Applications',
                'Finite State Machines: Mealy vs Moore, State Diagrams',
                'FSM Design: State Minimization & Assignment',
                'FSM: Sequence Detectors — Overlapping & Non-overlapping',
                'Sequential Circuits PYQ Set',
                'Digital Logic Consolidation: Full GATE PYQ Practice',
            ],
        },
        secondary: {
            sub: 'math',
            label: 'Calculus',
            subtopics: [
                // Week 1 — Limits & Continuity
                'Limits: ε-δ Definition & Computation Techniques',
                'Limits: L\'Hôpital\'s Rule & Indeterminate Forms',
                'Limits: Squeeze Theorem & Limit at Infinity',
                'Continuity: Types of Discontinuity & Intermediate Value Theorem',
                'Continuity PYQ Practice',
                // Week 2 — Differentiation
                'Differentiation: Product, Quotient & Chain Rule',
                'Differentiation: Implicit & Logarithmic Differentiation',
                'Rolle\'s Theorem & Mean Value Theorem — Proofs & Applications',
                'Taylor Series & Maclaurin Series Expansion',
                'Differentiation PYQ Practice',
                // Week 3 — Integration
                'Integration: By Parts & Substitution Methods',
                'Integration: Partial Fractions & Trigonometric Substitution',
                'Definite Integrals: Properties & Reduction Formulas',
                'Improper Integrals: Convergence Tests & Evaluation',
                'Integration PYQ Practice',
                // Week 4 — Multivariable
                'Partial Derivatives: Chain Rule & Total Derivative',
                'Maxima & Minima: Second Derivative Test, Lagrange Multipliers',
                'Double Integrals: Change of Order & Polar Coordinates',
                'Triple Integrals & Applications (Volume Computation)',
                'Vector Calculus: Gradient, Divergence, Curl Overview',
                'Calculus Consolidation: GATE PYQ Mixed Set',
            ],
        },
    },

    /* ═══════════════════════════════════════════════════
       JUNE  —  COA (primary) + C Programming / CN (secondary, alternating)
       ═══════════════════════════════════════════════════ */
    6: {
        primary: {
            sub: 'coa',
            label: 'Computer Organization & Architecture',
            subtopics: [
                // Week 1 — Instruction Set & CPU
                'Instruction Set Architecture: RISC vs CISC Comparison',
                'Addressing Modes: Immediate, Direct, Indirect, Indexed',
                'Addressing Modes: Register, Base-Displacement & Stack',
                'Machine Instruction Format: Fixed vs Variable Length',
                'CPU Organization: Registers, ALU, Control Unit Overview',
                'Instruction Cycle: Fetch-Decode-Execute Phases',
                'COA Basics PYQ Set',
                // Week 2 — Pipelining
                'Pipelining: Basic Concept, Stages & Speedup Formula',
                'Pipeline Hazards: Structural Hazards & Solutions',
                'Pipeline Hazards: Data Hazards — RAW, WAR, WAW',
                'Data Forwarding & Pipeline Stalls',
                'Pipeline Hazards: Control Hazards & Branch Prediction',
                'Pipeline Performance: CPI Calculation & Throughput',
                'Pipelining PYQ Set',
                // Week 3 — Memory Hierarchy
                'Cache Memory: Direct Mapped — Address Breakdown & Hit/Miss',
                'Cache Memory: Set-Associative & Fully Associative Mapping',
                'Cache Replacement Policies: LRU, FIFO, Random',
                'Cache Write Policies: Write-through vs Write-back',
                'Cache Performance: AMAT, Miss Rate & Optimization',
                'Virtual Memory: Page Table, TLB & Address Translation',
                'Memory Hierarchy PYQ Set',
                // Week 4 — I/O & Advanced
                'Virtual Memory: Page Fault Handling & Demand Paging',
                'I/O Organization: Programmed I/O, Interrupt-driven, DMA',
                'DMA: Cycle Stealing vs Burst Mode Transfer',
                'I/O Interfaces: Serial vs Parallel, Handshaking',
                'Performance Metrics: MIPS, MFLOPS, Benchmarks',
                'COA Consolidation: Full GATE PYQ Practice',
            ],
        },
        secondary: {
            sub: 'c_prog',
            label: 'C Programming',
            secondaryAlt: {
                sub: 'cn',
                label: 'Computer Networks',
            },
            subtopics: [
                // C Programming subtopics (even days)
                'Pointers: Pointer Arithmetic, Arrays & Pointer Duality',
                'Pointers: Double Pointers, Function Pointers',
                'Dynamic Memory: malloc, calloc, realloc, free & Memory Leaks',
                'Structures & Unions: Memory Layout, Padding & Alignment',
                'Recursion: Stack Frames, Tail Recursion & Tree Recursion',
                'String Operations: Standard Library & Manual Implementation',
                'File I/O: fopen/fclose/fread/fwrite Patterns',
                'C Tricky Output Questions — GATE Favorite Patterns',
                'Scope & Storage Classes: auto, static, extern, register',
                'Preprocessor Directives: Macros, Conditional Compilation',
                'C Programming PYQ Practice Set 1',
                'C Programming PYQ Practice Set 2',
                'Bitwise Operations: AND, OR, XOR, Shifts & Masking',
                'C Programming Consolidation: Mixed GATE PYQ',
            ],
            subtopicsAlt: [
                // Computer Networks subtopics (odd days)
                'OSI Model: 7 Layers — Responsibilities & PDUs',
                'TCP/IP Model: 4 Layers — Comparison with OSI',
                'Physical Layer: Encoding, Multiplexing & Transmission Media',
                'Data Link Layer: Framing, Error Detection (CRC, Checksum)',
                'Data Link Layer: Flow Control — Stop-and-Wait, Sliding Window',
                'MAC Sub-layer: ALOHA, CSMA/CD, CSMA/CA Protocols',
                'Network Layer: IP Addressing — Classful & CIDR/VLSM',
                'Network Layer: Subnetting & Supernetting Calculations',
                'Routing: Distance Vector (Bellman-Ford) & Count-to-Infinity',
                'Routing: Link State (Dijkstra) & OSPF Overview',
                'Transport Layer: TCP — 3-way Handshake, Flow & Congestion Control',
                'Transport Layer: UDP, Port Numbers & Socket Programming Basics',
                'Application Layer: DNS, HTTP/HTTPS, SMTP, FTP',
                'Network Security: Firewalls, VPN & Encryption Basics',
                'Computer Networks Consolidation: GATE PYQ Mixed Set',
            ],
        },
    },

    /* ═══════════════════════════════════════════════════
       JULY  —  DBMS (primary) + OS (secondary)
       ═══════════════════════════════════════════════════ */
    7: {
        primary: {
            sub: 'dbms',
            label: 'Database Management Systems',
            subtopics: [
                // Week 1 — ER & Relational Model
                'ER Model: Entities, Attributes, Relationships & Cardinality',
                'ER Model: Weak Entities, Participation & ER-to-Relational Mapping',
                'Relational Model: Keys — Candidate, Primary, Foreign, Super Key',
                'Relational Algebra: σ, π, ×, ⋈, ÷ Operators & Expressions',
                'Relational Algebra: Advanced Queries & Optimization',
                'Tuple Relational Calculus & Domain Relational Calculus',
                'ER & Relational Model PYQ Set',
                // Week 2 — SQL
                'SQL: DDL — CREATE, ALTER, DROP & Constraints',
                'SQL: DML — SELECT, INSERT, UPDATE, DELETE',
                'SQL: Joins — Inner, Left, Right, Full Outer, Cross, Self',
                'SQL: Subqueries — Correlated, Nested & EXISTS/IN',
                'SQL: Aggregate Functions, GROUP BY, HAVING',
                'SQL: Views, Triggers & Stored Procedures',
                'SQL PYQ Set',
                // Week 3 — Normalization
                'Functional Dependencies: Closure, Armstrong\'s Axioms',
                'Canonical Cover: Minimal Cover & Extraneous Attributes',
                'Normalization: 1NF, 2NF — Definitions & Decomposition',
                'Normalization: 3NF — Lossless Join & Dependency Preserving',
                'Normalization: BCNF — Decomposition Algorithm',
                'Normalization: 4NF, 5NF & Multi-valued Dependencies',
                'Normalization PYQ Set',
                // Week 4 — Transactions & Indexing
                'Transactions: ACID Properties & States',
                'Concurrency Control: Conflict & View Serializability',
                'Concurrency Control: 2-Phase Locking & Deadlock Handling',
                'Concurrency Control: Timestamp Ordering & MVCC',
                'Recovery: Log-based Recovery, WAL & Checkpointing',
                'Indexing: B-Trees, B+ Trees & Hash Indexing',
                'DBMS Consolidation: Full GATE PYQ Practice',
            ],
        },
        secondary: {
            sub: 'os',
            label: 'Operating Systems',
            subtopics: [
                // Week 1 — Process Management
                'Processes: States, PCB & Context Switching',
                'Threads: User-level vs Kernel-level, Multithreading Models',
                'CPU Scheduling: FCFS, SJF, SRTF & Priority Scheduling',
                'CPU Scheduling: Round Robin, Multi-level Queue & Feedback Queue',
                'Scheduling: Gantt Charts, Turnaround/Waiting/Response Time',
                'Process Creation: fork(), exec(), wait() System Calls',
                'Process Scheduling PYQ Set',
                // Week 2 — Synchronization & Deadlocks
                'Synchronization: Race Condition & Critical Section Problem',
                'Synchronization: Peterson\'s Solution & Test-and-Set',
                'Semaphores: Binary & Counting — Producer-Consumer Problem',
                'Classic Problems: Reader-Writer & Dining Philosophers',
                'Monitors: Condition Variables & Java-style Synchronization',
                'Deadlocks: Conditions, Resource Allocation Graph',
                'Deadlocks: Prevention, Avoidance (Banker\'s Algorithm)',
                'Synchronization & Deadlocks PYQ Set',
                // Week 3–4 — Memory & File Systems
                'Memory Management: Contiguous Allocation & Fragmentation',
                'Paging: Page Table, Multi-level Page Tables',
                'Paging: TLB, Effective Access Time Calculation',
                'Virtual Memory: Demand Paging, Page Fault Handling',
                'Page Replacement: FIFO, LRU, Optimal & Belady\'s Anomaly',
                'Segmentation: Segmented Paging & Address Translation',
                'File Systems: Directory Structure & Allocation Methods',
                'Disk Scheduling: FCFS, SSTF, SCAN, C-SCAN, LOOK',
                'OS Consolidation: Full GATE PYQ Practice',
            ],
        },
    },

    /* ═══════════════════════════════════════════════════
       AUGUST  —  TOC (primary) + Data Structures (secondary)
       ═══════════════════════════════════════════════════ */
    8: {
        primary: {
            sub: 'toc',
            label: 'Theory of Computation',
            subtopics: [
                // Week 1 — Finite Automata & Regular Languages
                'DFA: Formal Definition, Transition Table & Diagrams',
                'DFA: Language Recognition & Complement Construction',
                'NFA: Non-determinism, ε-transitions & Subset Construction',
                'NFA to DFA Conversion: Systematic Approach & Examples',
                'Regular Expressions: Syntax, Precedence & Language Description',
                'RE ↔ FA Conversion: Thompson\'s & State Elimination',
                'Finite Automata PYQ Set',
                // Week 2 — Properties of Regular Languages
                'Regular Languages: Closure Properties (Union, Concat, Star, Complement)',
                'Pumping Lemma for Regular Languages: Statement & Proof Strategy',
                'Pumping Lemma Applications: Proving Non-regularity',
                'Myhill-Nerode Theorem & DFA Minimization',
                'DFA Minimization: Table-filling Algorithm',
                'Regular Language Decision Problems & Properties',
                'Regular Languages PYQ Set',
                // Week 3 — Context-Free Languages
                'CFG: Rules, Derivations & Parse Trees',
                'CFG: Ambiguity, Leftmost & Rightmost Derivations',
                'CFG Simplification: Useless, λ, Unit Production Removal',
                'Chomsky Normal Form & Greibach Normal Form',
                'PDA: Definition, Instantaneous Descriptions & Acceptance',
                'PDA Design: By Final State & By Empty Stack',
                'CFG ↔ PDA Equivalence',
                'Context-Free Languages PYQ Set',
                // Week 4 — Turing Machines & Decidability
                'CFL Properties: Pumping Lemma, Closure, Decision Problems',
                'Turing Machines: Definition, Configuration & Computation',
                'TM Design: Simple Language Recognizers',
                'TM Variants: Multi-tape, Non-deterministic, Enumerators',
                'Decidability: Recursive & Recursively Enumerable Languages',
                'Undecidability: Halting Problem & Rice\'s Theorem',
                'Reductions: Mapping Reducibility & Applications',
                'TOC Consolidation: Full GATE PYQ Practice',
            ],
        },
        secondary: {
            sub: 'ds',
            label: 'Data Structures',
            subtopics: [
                // Week 1 — Linear Structures
                'Arrays: Memory Layout, Row/Column Major & Access Time',
                'Linked Lists: Singly, Doubly & Circular — Operations & Complexity',
                'Stacks: Array & Linked List Implementation, Applications',
                'Stacks: Infix to Postfix Conversion & Evaluation',
                'Queues: Linear, Circular & Priority Queue Implementation',
                'Deques: Double-ended Queue Operations & Applications',
                'Linear Structures PYQ Set',
                // Week 2 — Trees
                'Binary Trees: Properties, Traversals (Pre/In/Post/Level)',
                'Binary Trees: Construction from Traversal Pairs',
                'BST: Insertion, Deletion, Search & Complexity Analysis',
                'AVL Trees: Rotations (LL, RR, LR, RL) & Balancing',
                'Heaps: Max-Heap, Min-Heap — Insertion, Deletion, Heapify',
                'Heap: Heap Sort & Priority Queue using Heap',
                'Trees PYQ Set',
                // Week 3 — Advanced Trees & Hashing
                'B-Trees: Properties, Insertion, Deletion & Search',
                'B+ Trees: Structure, Range Queries & Database Indexing',
                'Tries: Standard & Compressed Trie, Applications',
                'Hashing: Hash Functions — Division, Universal, Perfect',
                'Hashing: Collision Resolution — Chaining & Open Addressing',
                'Hashing: Linear/Quadratic Probing & Double Hashing',
                'Hashing PYQ Set',
                // Week 4 — Graphs
                'Graph: Representations — Adjacency Matrix & List',
                'Graph: BFS — Algorithm, Applications & Complexity',
                'Graph: DFS — Algorithm, Edge Classification & Applications',
                'Graph: Topological Sort — Kahn\'s & DFS-based',
                'Data Structures Consolidation: GATE PYQ Practice',
            ],
        },
    },

    /* ═══════════════════════════════════════════════════
       SEPTEMBER  —  Compiler Design (primary) + Algorithms (secondary)
       ═══════════════════════════════════════════════════ */
    9: {
        primary: {
            sub: 'compiler',
            label: 'Compiler Design',
            subtopics: [
                // Week 1 — Lexical Analysis
                'Compiler Phases: Overview & End-to-end Flow',
                'Lexical Analysis: Tokens, Patterns & Regular Definitions',
                'Lexical Analysis: Finite Automata for Token Recognition',
                'Lexical Analysis: LEX Tool & Scanner Implementation',
                'Lexical Errors: Error Recovery Strategies',
                'Lexical Analysis PYQ Set',
                // Week 2 — Parsing
                'Parsing: Context-Free Grammars & Parse Trees',
                'Top-Down Parsing: Recursive Descent & LL(1) Parsers',
                'LL(1): FIRST & FOLLOW Sets Computation',
                'LL(1): Parsing Table Construction & Left-Factoring',
                'Bottom-Up Parsing: Shift-Reduce & Handle Identification',
                'LR Parsing: SLR(1) — Items, Closure, GOTO, Parse Table',
                'LR Parsing: CLR(1) & LALR(1) — Lookahead & State Merging',
                'Parsing PYQ Set',
                // Week 3 — SDT & Intermediate Code
                'Syntax Directed Translation: Synthesized & Inherited Attributes',
                'SDT: S-attributed & L-attributed Definitions',
                'SDT: Evaluation Order & Dependency Graphs',
                'Intermediate Code: Three-address Code, Quadruples, Triples',
                'Type Checking: Static Typing, Type Expressions & Coercion',
                'Intermediate Code PYQ Set',
                // Week 4 — Optimization & Code Generation
                'Code Optimization: Local — Common Subexpression, Dead Code',
                'Code Optimization: Loop — Invariant Code Motion, Strength Reduction',
                'Code Optimization: Data Flow Analysis — Reaching Definitions',
                'Code Optimization: Live Variable Analysis & Available Expressions',
                'Code Generation: Register Allocation & Instruction Selection',
                'Target Code Generation: Addressing & Instruction Scheduling',
                'Compiler Design Consolidation: Full GATE PYQ Practice',
            ],
        },
        secondary: {
            sub: 'algo',
            label: 'Algorithms',
            subtopics: [
                // Week 1 — Analysis & Basics
                'Time Complexity: Big-O, Ω, Θ Notation & Formal Definitions',
                'Recurrence Solving: Substitution & Recursion Tree Methods',
                'Recurrence Solving: Master Theorem & Extended Master Theorem',
                'Sorting: Merge Sort, Quick Sort — Analysis & Comparison',
                'Sorting: Heap Sort, Counting Sort, Radix Sort',
                'Searching: Binary Search & Variants, Interpolation Search',
                'Sorting & Searching PYQ Set',
                // Week 2 — Design Techniques
                'Divide & Conquer: Matrix Multiplication (Strassen), Closest Pair',
                'Greedy Algorithms: Activity Selection, Fractional Knapsack',
                'Greedy Algorithms: Huffman Coding & Optimal Merge Pattern',
                'Dynamic Programming: Overlapping Subproblems & Optimal Substructure',
                'DP: 0/1 Knapsack, LCS & LIS',
                'DP: Matrix Chain Multiplication & Edit Distance',
                'Design Techniques PYQ Set',
                // Week 3 — Graph Algorithms
                'Shortest Paths: Dijkstra\'s Algorithm — Implementation & Proof',
                'Shortest Paths: Bellman-Ford & Negative Edge Detection',
                'Shortest Paths: Floyd-Warshall & Johnson\'s Algorithm',
                'MST: Prim\'s Algorithm — Proof & Implementation',
                'MST: Kruskal\'s Algorithm — Union-Find & Complexity',
                'Graph Algorithms PYQ Set',
                // Week 4 — Backtracking & Complexity
                'Backtracking: N-Queens, Hamiltonian Path & Subset Sum',
                'Branch & Bound: 0/1 Knapsack & TSP',
                'NP Completeness: P, NP, NP-Hard & NP-Complete Definitions',
                'NP Complete Problems: SAT, Clique, Vertex Cover, TSP',
                'Reductions: Polynomial-time Reduction & Proof Strategy',
                'Approximation Algorithms: Vertex Cover, Set Cover, TSP',
                'Algorithms Consolidation: Full GATE PYQ Practice',
            ],
        },
    },
};

// ── Engineering Mathematics — 4 alternating daily tracks ──────────────────────
// Day 1 → Linear Algebra, Day 2 → Calculus, Day 3 → Probability, Day 4 → Discrete Math, repeat

export const MATH_ALTERNATING_TRACKS = [
    {
        label: 'Linear Algebra',
        subtopics: [
            'Matrices: Types, Operations & Transpose Properties',
            'Rank of a Matrix: Row Echelon Form & Rank-Nullity Theorem',
            'System of Linear Equations: Gaussian Elimination & Consistency',
            'Determinants: Cofactor Expansion, Properties & Cramer\'s Rule',
            'Vector Spaces: Definition, Subspaces & Span',
            'Basis & Dimension: Finding Basis, Change of Basis',
            'Linear Transformations: Kernel, Image & Matrix Representation',
            'Eigenvalues & Eigenvectors: Characteristic Equation & Computation',
            'Cayley-Hamilton Theorem: Statement, Proof & Applications',
            'Diagonalization: Conditions, Procedure & Powers of Matrices',
            'Orthogonal Matrices: Gram-Schmidt & QR Decomposition',
            'Quadratic Forms: Positive Definite, Semi-definite & Classification',
            'Linear Algebra GATE PYQ Practice Set 1',
            'Linear Algebra GATE PYQ Practice Set 2',
            'Linear Algebra: Mixed Numerical Problems',
        ],
    },
    {
        label: 'Calculus',
        subtopics: [
            'Limits: ε-δ Definition & Standard Limits',
            'Limits: L\'Hôpital\'s Rule for Indeterminate Forms',
            'Continuity: Types of Discontinuity & IVT Applications',
            'Differentiation: Rules, Higher-order & Leibniz Formula',
            'Mean Value Theorem: Rolle\'s, Lagrange\'s & Cauchy\'s MVT',
            'Taylor & Maclaurin Series: Expansion & Error Bounds',
            'Maxima & Minima: First/Second Derivative Test & Applications',
            'Integration: Techniques — Parts, Substitution, Partial Fractions',
            'Definite Integrals: Properties & Fundamental Theorem of Calculus',
            'Improper Integrals: Convergence & Comparison Tests',
            'Partial Derivatives: Euler\'s Theorem & Chain Rule',
            'Multiple Integrals: Fubini\'s Theorem & Change of Variables',
            'Calculus GATE PYQ Practice Set 1',
            'Calculus GATE PYQ Practice Set 2',
            'Calculus: Mixed Problem-solving Session',
        ],
    },
    {
        label: 'Probability & Statistics',
        subtopics: [
            'Probability: Axioms, Sample Space & Event Algebra',
            'Conditional Probability & Multiplication Theorem',
            'Bayes\' Theorem: Derivation & GATE Application Problems',
            'Random Variables: PMF, PDF & CDF Properties',
            'Expectation, Variance & Standard Deviation',
            'Binomial Distribution: Mean, Variance & GATE Numericals',
            'Poisson Distribution: Properties & Approximation to Binomial',
            'Normal Distribution: Z-table, 68-95-99.7 Rule',
            'Exponential & Uniform Distributions',
            'Joint Distributions: Marginal & Conditional, Independence',
            'Covariance, Correlation & Moment Generating Functions',
            'Estimation: Unbiased Estimators & MLE Basics',
            'Probability GATE PYQ Practice Set 1',
            'Probability GATE PYQ Practice Set 2',
            'Probability & Statistics: Mixed Problem Session',
        ],
    },
    {
        label: 'Discrete Mathematics',
        subtopics: [
            'Propositional Logic: Truth Tables & Logical Equivalences',
            'First Order Logic: Quantifiers & Proof Techniques',
            'Set Theory: Venn Diagrams, Laws & Power Sets',
            'Relations: Equivalence Relations & Partial Orders',
            'Lattices: Distributive, Complemented & Boolean Algebra',
            'Functions: Injective, Surjective & Bijective Proofs',
            'Graphs: Connectivity, Eulerian & Hamiltonian Properties',
            'Trees: Spanning Trees, Binary Trees & Counting',
            'Combinatorics: Permutations, Combinations & Binomial Theorem',
            'Pigeonhole Principle: Applications & GATE Problems',
            'Recurrence Relations: Characteristic Equation Method',
            'Generating Functions: Ordinary & Exponential',
            'Groups: Definition, Subgroups & Lagrange\'s Theorem',
            'Discrete Math GATE PYQ Practice Set 1',
            'Discrete Math: Mixed Problem-solving Session',
        ],
    },
];

// ── Helper functions ──────────────────────────────────────────────────────────

/**
 * Get the primary-subject subtopic for a given calendar month and day-of-month (1-indexed).
 */
export function getPrimarySubtopic(calendarMonth, dayOfMonth) {
    const monthData = MONTHLY_DETAILED[calendarMonth];
    if (!monthData?.primary?.subtopics?.length) return null;
    const idx = (dayOfMonth - 1) % monthData.primary.subtopics.length;
    return {
        sub: monthData.primary.sub,
        label: monthData.primary.label,
        subtopic: monthData.primary.subtopics[idx],
    };
}

/**
 * Get the secondary-subject subtopic for a given calendar month and day-of-month (1-indexed).
 * For June (month 6), alternates between C Programming and Computer Networks.
 */
export function getSecondarySubtopic(calendarMonth, dayOfMonth) {
    const monthData = MONTHLY_DETAILED[calendarMonth];
    if (!monthData?.secondary) return null;

    const sec = monthData.secondary;

    // June alternation
    if (calendarMonth === 6 && sec.subtopicsAlt) {
        const useAlt = dayOfMonth % 2 !== 0; // odd days → CN, even days → C
        const topics = useAlt ? sec.subtopicsAlt : sec.subtopics;
        const sub = useAlt ? sec.secondaryAlt.sub : sec.sub;
        const label = useAlt ? sec.secondaryAlt.label : sec.label;
        const idx = Math.floor((dayOfMonth - 1) / 2) % topics.length;
        return { sub, label, subtopic: topics[idx] };
    }

    const idx = (dayOfMonth - 1) % sec.subtopics.length;
    return {
        sub: sec.sub,
        label: sec.label,
        subtopic: sec.subtopics[idx],
    };
}

/**
 * Get the Engineering Mathematics topic for today (alternates between 4 tracks).
 * @param {number} planDayNumber — 1-indexed plan day
 */
export function getMathAlternatingTopic(planDayNumber) {
    const trackIndex = (planDayNumber - 1) % MATH_ALTERNATING_TRACKS.length;
    const track = MATH_ALTERNATING_TRACKS[trackIndex];
    // Progress through the track's subtopics based on how many times we've visited this track
    const visitNumber = Math.floor((planDayNumber - 1) / MATH_ALTERNATING_TRACKS.length);
    const subtopicIndex = visitNumber % track.subtopics.length;
    return {
        label: track.label,
        subtopic: track.subtopics[subtopicIndex],
    };
}
