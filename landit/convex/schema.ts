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

  // -------------------------
  // INTERVIEWS TABLE
  // -------------------------
  interviews: defineTable({
    jobInfoId: v.id("job_info"),
    duration: v.optional(v.string()),
    humeChatId: v.string(),
    feedback: v.string(),
  })
    .index("by_job_info", ["jobInfoId"])
    .index("by_hume_chat", ["humeChatId"]),

  activities: defineTable({
    userId: v.string(),
    questions: v.number(),
    correct: v.number(),
    incorrect: v.number(),
    year: v.number(),
  }),
  
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

  userAnswers: defineTable({
    questionId: v.string(),
    userId: v.string(),
    answer: v.string(),
    isCorrect: v.boolean(),
    score: v.number(),
    feedback: v.string(),
    submittedAt: v.number(),
  }).index("by_user_and_question", ["userId", "questionId"])
});

