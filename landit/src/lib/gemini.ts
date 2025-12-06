export async function evaluateAnswer(
  question: string,
  userAnswer: string,
  correctAnswer?: string
): Promise<{ isCorrect: boolean; score: number; feedback: string }> {
  const prompt = `Evaluate this interview answer:

Question: ${question}
${correctAnswer ? `Expected Answer: ${correctAnswer}` : ""}
User's Answer: ${userAnswer}

Provide evaluation in JSON format ONLY:
{
  "isCorrect": true or false,
  "score": number from 0-10,
  "feedback": "constructive feedback in 2-3 sentences"
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 5000,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    // FIXED: Correct path to response text
    const responseText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let result;
    try {
      // Extract JSON object from AI output
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (err) {
      console.error("Failed to parse AI evaluation JSON:", responseText, err);
      result = null;
    }

    // Validate the result has expected properties
    if (result && typeof result === 'object') {
      return {
        isCorrect: result.isCorrect ?? false,
        score: typeof result.score === 'number' ? result.score : 0,
        feedback: result.feedback || "Unable to evaluate answer.",
      };
    }

    return {
      isCorrect: false,
      score: 0,
      feedback: "Unable to evaluate answer.",
    };
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return {
      isCorrect: false,
      score: 0,
      feedback: "Error evaluating your answer. Please try again.",
    };
  }
}