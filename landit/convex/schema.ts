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
    name: v.optional(v.string()),
    experienceLevel: v.string(),
    description: v.optional(v.string()),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),

  // -------------------------
  // INTERVIEWS TABLE (MERGED - has all fields)
  // -------------------------
  interviews: defineTable({
    userId: v.id("users"),                    // who is being interviewed
    jobInfoId: v.optional(v.id("job_info")), // optional: which job they're practicing for
    startTime: v.number(),                    // timestamp when interview started
    endTime: v.optional(v.number()),          // timestamp when interview ended
    status: v.union(                          // current status of interview
      v.literal("active"), 
      v.literal("completed")
    ),
    difficulty: v.optional(v.string()),       // difficulty level selected
    duration: v.optional(v.string()),         // formatted duration string
    humeChatId: v.optional(v.string()),       // Hume AI chat ID if using voice
    feedback: v.optional(v.string()),         // AI-generated feedback
  })
    .index("by_user", ["userId"])
    .index("by_job_info", ["jobInfoId"])
    .index("by_hume_chat", ["humeChatId"])
    .index("by_status", ["userId", "status"]),

  // -------------------------
  // INTERVIEW QUESTIONS TABLE
  // -------------------------
  interview_questions: defineTable({
    interviewId: v.id("interviews"),          // which interview session
    questionText: v.string(),                 // the actual question asked
    answer: v.optional(v.string()),           // user's answer (if answered)
    skipped: v.boolean(),                     // whether question was skipped
    timestamp: v.number(),                    // when this question was asked
    questionOrder: v.optional(v.number()),    // order in the interview
  }).index("by_interview", ["interviewId"]),

  // -------------------------
  // QUESTIONS TABLE (for practice questions)
  // -------------------------
  questions: defineTable({
    jobInfoId: v.optional(v.id("job_info")), // optional link to job_info
    text: v.string(),
    difficulty: v.string(),                   // "easy" | "medium" | "hard"
    type: v.string(),                         // "multiple-choice" | "text"
    options: v.optional(v.array(v.string())),
    correctAnswer: v.optional(v.string()),
    jobDescriptionId: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  })
    .index("by_job_info", ["jobInfoId"])
    .index("by_job_and_difficulty", ["jobDescriptionId", "difficulty"]),

  // -------------------------
  // ACTIVITIES TABLE
  // -------------------------
  activities: defineTable({
    userId: v.string(),
    questions: v.number(),
    correct: v.number(),
    incorrect: v.number(),
    year: v.number(),
  }),

  // -------------------------
  // JOB ACTIONS TABLE
  // -------------------------
  jobActions: defineTable({
    userId: v.string(),
    title: v.string(),
    icon: v.string(),
    completed: v.boolean(),
  }),

  // -------------------------
  // JOB DESCRIPTIONS TABLE
  // -------------------------
  jobDescriptions: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    requirements: v.array(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // -------------------------
  // USER ANSWERS TABLE
  // -------------------------
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