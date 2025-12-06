import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Difficulty } from "@/types/questions";
import { parse } from "jsonc-parser";

export function useQuestions(userId: string) {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [isGenerating, setIsGenerating] = useState(false);

  const jobDescription = useQuery(api.jobDescriptions.getCurrentJobDescription, {
    userId,
  });

  const questions = useQuery(
    api.questions.getQuestionsByDifficulty,
    jobDescription
      ? {
          jobDescriptionId: jobDescription._id,
          difficulty,
        }
      : "skip"
  );

  const createQuestion = useMutation(api.questions.createQuestion);

  const handleGenerateQuestions = async () => {
    if (!jobDescription) return;
    setIsGenerating(true);
    
    try {
      const prompt = `Generate 5 ${difficulty} difficulty technical interview questions for a ${jobDescription.title} position.

Job Description: ${jobDescription.description}
Requirements: ${jobDescription.requirements?.join(", ") || "None"}

Respond ONLY with a valid JSON array. 
DO NOT include any explanation, markdown, backticks, or text outside JSON.
If you cannot answer, return [].


Format:
[
  {
    "text": "question text here",
    "type": "multiple-choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A"
  }
]`;

console.log("Gemini Key:", process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`;

function extractJsonArraySafe(text: string) {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON array found in Gemini response");
  }

  const jsonString = text.slice(start, end + 1);
  try {
    return parse(jsonString); // tolerate minor JSON errors
  } catch (err) {
    console.error("Failed to parse extracted JSON safely:", jsonString);
    throw err;
  }
}





console.log("Hitting URL:", GEMINI_URL); // IMPORTANT

const response = await fetch(GEMINI_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
  }),
});



      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract text from Gemini response
      const generatedText = data.candidates[0].content.parts[0].text;
      const generatedQuestions = extractJsonArraySafe(generatedText);
      // Save each question to Convex
      for (const q of generatedQuestions) {
        await createQuestion({
          text: q.text,
          difficulty,
          type: q.type,
          options: q.options,
          correctAnswer: q.correctAnswer,
          jobDescriptionId: jobDescription._id,
        });
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswer = useMutation(api.questions.submitAnswer);

  return {
    difficulty,
    setDifficulty,
    questions: questions || [],
    jobDescription,
    isGenerating,
    generateQuestions: handleGenerateQuestions,
    submitAnswer,
  };
}