/**
 * Gemini Service for generating AI-powered schedules.
 * Communicates with the gemini-1.5-flash model.
 */

// Uses VITE_GEMINI_API_KEY from env
const getGeminiKey = () => import.meta.env.VITE_GEMINI_API_KEY;

export async function generateDailySchedule({
  allSubjects,
  completedTopics,
  targetDate,
  availableHours,
  weakAreas,
  daysToExam,
  rankedWeakSubjects = [],
  focusLabel = 'High',
}) {
  const apiKey = getGeminiKey();
  if (!apiKey) {
    console.warn("No VITE_GEMINI_API_KEY found, returning fallback schedule.");
    return fallbackSchedule(targetDate, availableHours);
  }

  // Highest-priority weak subjects first, with the reason they're weak.
  const rankedWeakText = rankedWeakSubjects.length
    ? rankedWeakSubjects
        .map((s, i) => `${i + 1}. ${s.name}${s.reasons?.length ? ` (${s.reasons.join('; ')})` : ''}`)
        .join("\n")
    : "None recorded yet";

  // How aggressively to bias the day toward weak areas.
  const focusDirective = {
    Balanced: 'Keep a balanced mix, but give weak areas a slight edge.',
    High: 'Weak areas should take the MAJORITY of today’s time; completed topics get only brief spaced revision.',
    Aggressive: 'Weak areas are the near-exclusive focus today. Touch completed/strong topics only for a quick warm-up, if at all.',
  }[focusLabel] || 'Weak areas should take the majority of today’s time.';

  const prompt = `
You are a GATE exam preparation expert. Generate a detailed, optimized study schedule
that PRIORITIZES the student's weak areas over topics they have already completed.

Context:
- Target date: ${targetDate}
- Available study hours today: ${availableHours}
- Days remaining to GATE exam: ${daysToExam}
- Personalisation focus: ${focusLabel} — ${focusDirective}
- Weak subjects, ranked by priority (highest first):
${rankedWeakText}
- Additional weak topics (low PYQ accuracy): ${weakAreas.length ? weakAreas.join(", ") : "None recorded yet"}
- Already-completed topics (DEPRIORITIZE — light spaced revision only): ${completedTopics.length ? completedTopics.join(", ") : "None yet"}
- Subjects with remaining topics: ${allSubjects.map(s => s.name).join(", ")}

Generate a pure JSON schedule with this EXACT structure (NO markdown formatting, just parseable JSON):
{
  "date": "${targetDate}",
  "optimizationNote": "Brief explanation of today's strategy, explicitly naming which weak areas you prioritized and why.",
  "sessions": [
    {
      "id": "unique-session-id",
      "subjectId": "...",
      "topicId": "...",
      "topicName": "...",
      "duration": 90,
      "type": "concept",
      "completed": false,
      "pyqsToSolve": 10,
      "resources": ["NPTEL link or standard book chapter"]
    }
  ],
  "totalHours": ${availableHours}
}

Rules:
- Valid session \`type\` are: "concept", "practice", "pyq_revision", "mock_test"
- Allocate the FIRST and LARGEST blocks to the highest-ranked weak subjects above.
- Include heavy PYQ revision for weak areas; completed topics get at most one short spaced-revision block.
- Respect the personalisation focus directive above when deciding the weak-vs-completed time split.
- Balance across the weak subjects — don't spend the whole day on a single subject unless only one is weak.
- Return ONLY valid JSON, no markdown tags like \`\`\`json.
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
              temperature: 0.3, 
              responseMimeType: "application/json" 
          }
        })
      }
    );

    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No output from Gemini");
    }

    const textOutput = data.candidates[0].content.parts[0].text;
    return JSON.parse(textOutput);
  } catch (error) {
    console.error("Error generating schedule from Gemini:", error);
    return fallbackSchedule(targetDate, availableHours);
  }
}

function fallbackSchedule(targetDate, availableHours) {
  return {
    date: targetDate,
    optimizationNote: "Fallback schedule generated due to API issue.",
    totalHours: availableHours,
    sessions: [
      {
        id: "fb-1",
        subjectId: "em",
        topicId: "em_t1",
        topicName: "Linear Algebra basics",
        duration: 120,
        type: "concept",
        completed: false,
        pyqsToSolve: 5,
        resources: []
      }
    ]
  };
}
