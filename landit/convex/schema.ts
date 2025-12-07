// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // -------------------------
  // USERS TABLE
  // -------------------------
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("by_email", ["email"]),

  // -------------------------
  // JOB INFO TABLE
  // -------------------------
  job_info: defineTable({
    title: v.string(),
    name: v.optional(v.string()), // maybe job poster's name?
    experienceLevel: v.string(),
    description: v.optional(v.string()),
    userId: v.id("users"),        // reference to users table
  }).index("by_user", ["userId"]),



  activities: defineTable({
    userId: v.string(),
    questions: v.number(),
    correct: v.number(),
    incorrect: v.number(),
    year: v.number(),
  }),

    resumes: defineTable({
    userId: v.string(),
    jobDescriptionId: v.string(),
    fileName: v.string(),
    fileSize: v.number(),
    fileType: v.string(),
    storageId: v.string(), // Reference to Convex file storage
    uploadedAt: v.number(),
    analyzed: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_job", ["userId", "jobDescriptionId"])
    .index("by_job", ["jobDescriptionId"]),

  resumeAnalyses: defineTable({
    resumeId: v.string(),
    analysisData: v.string(), // JSON stringified full analysis
    score: v.number(), // Overall score 0-10
    atsScore: v.number(), // ATS compatibility 0-100
    jobMatchScore: v.number(), // Job match 0-100
    analyzedAt: v.number(),
  })
    .index("by_resume", ["resumeId"])
    .index("by_score", ["score"]),

  
  jobActions: defineTable({
    userId: v.string(),
    title: v.string(),
    icon: v.string(),
    completed: v.boolean(),
  }),
  jobDescriptions: defineTable({
  userId: v.string(),
  title: v.string(),
  company: v.optional(v.string()),
  description: v.string(),
  requirements: v.array(v.string()),
  skills: v.array(v.string()),
  experienceLevel: v.string(), // "entry" | "mid" | "senior" | "lead"
  jobType: v.string(), // "full-time" | "part-time" | "contract" | "internship"
  location: v.optional(v.string()),
  salary: v.optional(v.string()),
  isActive: v.boolean(),
  createdAt: v.number(),
  updatedAt: v.number(),
}).index("by_user", ["userId"]),

  questions: defineTable({
    text: v.string(),
    difficulty: v.string(), // "easy" | "medium" | "hard"
    type: v.string(), // "multiple-choice" | "text"
    options: v.optional(v.array(v.string())),
    correctAnswer: v.optional(v.string()),
    jobDescriptionId: v.string(),
    createdAt: v.number(),
  }).index("by_job_and_difficulty", ["jobDescriptionId", "difficulty"]),

   interviews: defineTable({
    userId: v.string(),
    jobDescriptionId: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("failed")
    ),
    vapiCallId: v.optional(v.string()),
    duration: v.optional(v.number()), // in seconds
    questionsAsked: v.number(),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    transcript: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_job", ["userId", "jobDescriptionId"])
    .index("by_status", ["status"]),

  interviewFeedback: defineTable({
    interviewId: v.string(),
    overallScore: v.number(), // out of 10
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
    analyzedAt: v.number(),
  }).index("by_interview", ["interviewId"]),

  interviewQuestions: defineTable({
    interviewId: v.string(),
    questionNumber: v.number(),
    question: v.string(),
    userAnswer: v.string(),
    evaluationScore: v.optional(v.number()),
    feedback: v.optional(v.string()),
    askedAt: v.number(),
  }).index("by_interview", ["interviewId"]),

  userAnswers: defineTable({
    questionId: v.string(),
    userId: v.string(),
    answer: v.string(),
    isCorrect: v.boolean(),
    score: v.number(),
    feedback: v.string(),
    submittedAt: v.number(),
  }).index("by_user_and_question", ["userId", "questionId"]),
});

