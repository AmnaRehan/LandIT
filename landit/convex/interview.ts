import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";

// Create new interview session
export const createInterview = mutation({
  args: {
    userId: v.string(),
    jobDescriptionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const interviewId = await ctx.db.insert("interviews", {
      userId: args.userId,
      jobDescriptionId: args.jobDescriptionId,
      status: "pending",
      questionsAsked: 0,
      startedAt: Date.now(),
    });
    return interviewId;
  },
});

// Start interview
export const startInterview = mutation({
  args: {
    interviewId: v.string(),
    vapiCallId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const interview = await ctx.db.get(args.interviewId as any);
    if (!interview) throw new Error("Interview not found");

    await ctx.db.patch(args.interviewId as any, {
      status: "in_progress",
      vapiCallId: args.vapiCallId,
    });
  },
});

// Complete interview
export const completeInterview = mutation({
  args: {
    interviewId: v.string(),
    duration: v.number(),
    questionsAsked: v.number(),
    transcript: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.interviewId as any, {
      status: "completed",
      duration: args.duration,
      questionsAsked: args.questionsAsked,
      transcript: args.transcript,
      completedAt: Date.now(),
    });
  },
});

// Save interview question
export const saveQuestion = mutation({
  args: {
    interviewId: v.string(),
    questionNumber: v.number(),
    question: v.string(),
    userAnswer: v.string(),
  },
  handler: async (ctx, args) => {
    const questionId = await ctx.db.insert("interviewQuestions", {
      ...args,
      askedAt: Date.now(),
    });
    return questionId;
  },
});

// Save feedback
export const saveFeedback = mutation({
  args: {
    interviewId: v.string(),
    overallScore: v.number(),
    strengths: v.array(v.string()),
    areasToImprove: v.array(v.string()),
    performanceBreakdown: v.object({
      technicalKnowledge: v.number(),
      problemSolving: v.number(),
      confidenceLevel: v.number(),
      answerStructure: v.number(),
    }),
    nextSteps: v.array(v.string()),
    detailedFeedback: v.string(),
  },
  handler: async (ctx, args) => {
    const feedbackId = await ctx.db.insert("interviewFeedback", {
      ...args,
      analyzedAt: Date.now(),
    });
    return feedbackId;
  },
});

// Get interview by ID
export const getInterviewById = query({
  args: { interviewId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.interviewId as any);
  },
});

// Get user's interview history
export const getInterviewHistory = query({
  args: {
    userId: v.string(),
    jobDescriptionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.jobDescriptionId) {
      return await ctx.db
        .query("interviews")
        .withIndex("by_user_and_job", (q) =>
          q.eq("userId", args.userId).eq("jobDescriptionId", args.jobDescriptionId!)
        )
        .order("desc")
        .collect();
    }

    return await ctx.db
      .query("interviews")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(10);
  },
});

// Get feedback for interview
export const getFeedbackByInterview = query({
  args: { interviewId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("interviewFeedback")
      .withIndex("by_interview", (q) => q.eq("interviewId", args.interviewId))
      .first();
  },
});

// Get questions for interview
export const getQuestionsByInterview = query({
  args: { interviewId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("interviewQuestions")
      .withIndex("by_interview", (q) => q.eq("interviewId", args.interviewId))
      .collect();
  },
});

// Generate feedback with AI
export const generateFeedback = action({
  args: {
    interviewId: v.string(),
  },
  handler: async (ctx, args): Promise<{ feedbackId: string; result: any }> => {
    // Get interview data
    const interview = await ctx.runQuery(api.interview.getInterviewById, {
      interviewId: args.interviewId,
    });

    if (!interview) throw new Error("Interview not found");

    // Get questions and answers
    const questions = await ctx.runQuery(api.interview.getQuestionsByInterview, {
      interviewId: args.interviewId,
    });

    // Build prompt for AI
    const qaText = questions
      .map((q, i) => `Q${i + 1}: ${q.question}\nA: ${q.userAnswer}`)
      .join("\n\n");

    // Type guard for interview
    type InterviewType = {
      duration?: number;
      questionsAsked?: number;
      [key: string]: any;
    };
    const interviewData = interview as InterviewType;

    const prompt = `Analyze this mock interview performance:

Duration: ${Math.floor((interviewData.duration || 0) / 60)} minutes
Questions: ${interviewData.questionsAsked || 0}

Interview Q&A:
${qaText}

Provide feedback in JSON format ONLY:
{
  "overallScore": 8.2,
  "strengths": ["Clear communication", "Good examples", "Technical depth"],
  "areasToImprove": ["Be more specific", "Reduce filler words"],
  "performanceBreakdown": {
    "technicalKnowledge": 9,
    "problemSolving": 8,
    "confidenceLevel": 7,
    "answerStructure": 9
  },
  "nextSteps": ["Practice STAR method", "Review common questions"],
  "detailedFeedback": "Overall strong performance..."
}`;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 4000,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

      // Extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON in AI response");

      const result = JSON.parse(jsonMatch[0]);

      // Save feedback
      const feedbackId = await ctx.runMutation(api.interview.saveFeedback, {
        interviewId: args.interviewId,
        overallScore: result.overallScore || 0,
        strengths: result.strengths || [],
        areasToImprove: result.areasToImprove || [],
        performanceBreakdown: result.performanceBreakdown || {
          technicalKnowledge: 0,
          problemSolving: 0,
          confidenceLevel: 0,
          answerStructure: 0,
        },
        nextSteps: result.nextSteps || [],
        detailedFeedback: result.detailedFeedback || "",
      });

      return { feedbackId, result };
    } catch (err) {
      console.error("Feedback generation error:", err);
      throw new Error("Failed to generate feedback");
    }
  },
});