export const GATE_CS_SUBJECTS = [
  { id: "em", name: "Engineering Mathematics", weightage: 13, totalTopics: 12, color: "#3b82f6" },
  { id: "ds", name: "Data Structures", weightage: 10, totalTopics: 15, color: "#10b981" },
  { id: "algo", name: "Algorithms", weightage: 10, totalTopics: 12, color: "#f59e0b" },
  { id: "toc", name: "Theory of Computation", weightage: 8, totalTopics: 10, color: "#8b5cf6" },
  { id: "co", name: "Computer Organization", weightage: 8, totalTopics: 14, color: "#ec4899" },
  { id: "os", name: "Operating Systems", weightage: 8, totalTopics: 16, color: "#14b8a6" },
  { id: "dbms", name: "DBMS", weightage: 8, totalTopics: 13, color: "#f43f5e" },
  { id: "cn", name: "Computer Networks", weightage: 8, totalTopics: 15, color: "#6366f1" },
  { id: "compiler", name: "Compiler Design", weightage: 6, totalTopics: 10, color: "#84cc16" },
  { id: "dig", name: "Digital Logic", weightage: 6, totalTopics: 9, color: "#06b6d4" },
  { id: "prog", name: "Programming & C", weightage: 5, totalTopics: 8, color: "#d946ef" },
  { id: "apt", name: "General Aptitude", weightage: 15, totalTopics: 8, color: "#f97316" }
];

// Helper to generate some dummy topics based on subject ID if needed.
// In a real database, each of these would be a full object.
export const generateTopicsForSubject = (subjectId, subjectName, count) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${subjectId}_t${i + 1}`,
    subjectId,
    name: `${subjectName} Topic ${i + 1}`,
    estimatedHours: Math.floor(Math.random() * 3) + 1, // 1 to 3 hours
    difficulty: ["easy", "medium", "hard"][Math.floor(Math.random() * 3)],
    completed: false,
    completedDate: null,
    pyqCount: Math.floor(Math.random() * 30) + 10, // 10 to 40 PYQs
    pyqSolved: 0,
    notes: ""
  }));
};

export const ALL_GATE_TOPICS = GATE_CS_SUBJECTS.flatMap(subject => 
  generateTopicsForSubject(subject.id, subject.name, subject.totalTopics)
);
