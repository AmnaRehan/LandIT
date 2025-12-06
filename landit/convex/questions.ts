import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";


export const getQuestionsByDifficulty = query({
  args: {
    jobDescriptionId: v.string(),
    difficulty: v.string(),
  },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_job_and_difficulty", (q) =>
  q.eq("jobDescriptionId", args.jobDescriptionId)
   .eq("difficulty", args.difficulty.toLowerCase())
       )
      .collect();
    return questions;
  },
});


export const createQuestion = mutation({
  args: {
    text: v.string(),
    difficulty: v.string(),
    type: v.string(),
    options: v.optional(v.array(v.string())),
    correctAnswer: v.optional(v.string()),
    jobDescriptionId: v.string(),
  },
  handler: async (ctx, args) => {
    const questionId = await ctx.db.insert("questions", {
      ...args,
      difficulty: args.difficulty.toLowerCase(),
      createdAt: Date.now(),
    });
    return questionId;
  },
});

export const submitAnswer = mutation({
  args: {
    questionId: v.string(),
    userId: v.string(),
    answer: v.string(),
    isCorrect: v.optional(v.boolean()),
    score: v.optional(v.number()),  // or v.float64()
    feedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const answerId = await ctx.db.insert("userAnswers", {
      userId: args.userId,
      questionId: args.questionId,
      answer: args.answer,
      isCorrect: args.isCorrect ?? false,
      score: args.score ?? 0,
      feedback: args.feedback ?? "",
      submittedAt: Date.now(),
    });
    return answerId;
  },
});



export const getUserAnswers = query({
  args: {
    userId: v.string(),
    questionId: v.string(),
  },
  handler: async (ctx, args) => {
    const answer = await ctx.db
      .query("userAnswers")
      .withIndex("by_user_and_question", (q) =>
        q.eq("userId", args.userId).eq("questionId", args.questionId)
      )
      .first();
    return answer;
  },
});

export const generateQuestionsWithGemini = action({
  args: {
    userId: v.string(),
    difficulty: v.string(),
    count: v.number(),
  },
  handler: async (ctx, args): Promise<string[]> => {
    // Get job description
    const jobDescriptions = await ctx.runQuery(api.jobDescriptions.getAllJobDescriptions, {
      userId: args.userId,
    });

    const jobDesc = jobDescriptions[0];
    if (!jobDesc) {
      throw new Error("No job description found. Please create one first.");
    }

    // Call AI API to generate questions
    const prompt = `Generate ${args.count} ${args.difficulty} difficulty technical interview questions for a ${jobDesc.title} position.

Job Description: ${jobDesc.description}
Requirements: ${jobDesc.requirements?.join(", ") || "None specified"}

For each question, provide:
1. The question text
2. Type: "multiple-choice" or "text"
3. If multiple-choice, provide 4 options
4. The correct answer
5. Brief explanation

Format as JSON array:
[
  {
    "text": "question text",
    "type": "multiple-choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "why this is correct"
  }
]`;

    try {
      const geminiResponse = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  }
);


      if (!geminiResponse.ok) {
        throw new Error(`API request failed: ${geminiResponse.status}`);
      }

      const data = await geminiResponse.json();
      
      // Validate response structure
      if (!data || !data.content || !Array.isArray(data.content) || data.content.length === 0) {
        throw new Error("Invalid response structure from AI");
      }

     if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
  throw new Error("Invalid response structure from Gemini API");
}
const responseText = data.candidates[0].content.parts[0].text;
      
      // Parse JSON from response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Could not find JSON in AI response");
      }

      const generatedQuestions = JSON.parse(jsonMatch[0]);

      // Store questions in database
      const questionIds = [];
      for (const q of generatedQuestions) {
        const id = await ctx.runMutation(api.questions.createQuestion, {
          text: q.text,
          difficulty: args.difficulty,
          type: q.type,
          options: q.options,
          correctAnswer: q.correctAnswer,
          jobDescriptionId: jobDesc._id,
        });
        questionIds.push(id);
      }

      return questionIds;
    } catch (error) {
      console.error("Error generating questions:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate questions: ${errorMessage}`);
    }
  },
});