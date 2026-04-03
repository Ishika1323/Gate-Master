/**
 * Gemini Service for generating AI-powered schedules.
 * Communicates with the gemini-1.5-flash model.
 */

// Uses VITE_GEMINI_API_KEY from env
const getGeminiKey = () => import.meta.env.VITE_GEMINI_API_KEY;

export async function generateDailySchedule({
  allSubjects,
  allTopics,
  completedTopics,
  targetDate,
  availableHours,
  weakAreas,
  daysToExam
}) {
  const apiKey = getGeminiKey();
  if (!apiKey) {
    console.warn("No VITE_GEMINI_API_KEY found, returning fallback schedule.");
    return fallbackSchedule(targetDate, availableHours);
  }

  const prompt = `
You are a GATE exam preparation expert. Generate a detailed, optimized study schedule.

Context:
- Target date: ${targetDate}
- Available study hours today: ${availableHours}
- Days remaining to GATE exam: ${daysToExam}
- Completed topics so far: ${completedTopics.join(", ")}
- Weak areas needing revision: ${weakAreas.join(", ")}
- Subjects with remaining topics: ${allSubjects.map(s => s.name).join(", ")}

Generate a pure JSON schedule with this EXACT structure (NO markdown formatting, just parseable JSON):
{
  "date": "${targetDate}",
  "optimizationNote": "Brief explanation of today's strategy based on weak areas and progress.",
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
- Prioritize incomplete topics that are important.
- Include PYQ revision for topics marked as "weak areas".
- Balance subjects — don't repeat the same subject fully back-to-back.
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
