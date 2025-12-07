import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";

// Get all job descriptions for a user
export const getAllJobDescriptions = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const jobDescs = await ctx.db
      .query("jobDescriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    return jobDescs;
  },
});


export const getCurrentJobDescription = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const jobDesc = await ctx.db
      .query("jobDescriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
    
    // If no active job, return the most recent one
    if (!jobDesc) {
      return await ctx.db
        .query("jobDescriptions")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .order("desc")
        .first();
    }
    
    return jobDesc;
  },
});

// Get active job description
export const getActiveJobDescription = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const jobDesc = await ctx.db
      .query("jobDescriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
    return jobDesc;
  },
});

// Get job description by ID
export const getJobDescriptionById = query({
  args: { id: v.id("jobDescriptions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create new job description
export const createJobDescription = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    company: v.optional(v.string()),
    description: v.string(),
    requirements: v.array(v.string()),
    skills: v.array(v.string()),
    experienceLevel: v.string(),
    jobType: v.string(),
    location: v.optional(v.string()),
    salary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Deactivate all existing job descriptions
    const existingJobs = await ctx.db
      .query("jobDescriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const job of existingJobs) {
      await ctx.db.patch(job._id, { isActive: false });
    }

    // Create new active job description
    const jobDescId = await ctx.db.insert("jobDescriptions", {
      userId: args.userId,
      title: args.title,
      company: args.company,
      description: args.description,
      requirements: args.requirements,
      skills: args.skills,
      experienceLevel: args.experienceLevel,
      jobType: args.jobType,
      location: args.location,
      salary: args.salary,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return jobDescId;
  },
});

// Update job description
export const updateJobDescription = mutation({
  args: {
    id: v.id("jobDescriptions"),
    title: v.optional(v.string()),
    company: v.optional(v.string()),
    description: v.optional(v.string()),
    requirements: v.optional(v.array(v.string())),
    skills: v.optional(v.array(v.string())),
    experienceLevel: v.optional(v.string()),
    jobType: v.optional(v.string()),
    location: v.optional(v.string()),
    salary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    return id;
  },
});

// Delete job description
export const deleteJobDescription = mutation({
  args: { id: v.id("jobDescriptions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Set active job description
export const setActiveJobDescription = mutation({
  args: {
    userId: v.string(),
    id: v.id("jobDescriptions"),
  },
  handler: async (ctx, args) => {
    // Deactivate all
    const allJobs = await ctx.db
      .query("jobDescriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const job of allJobs) {
      await ctx.db.patch(job._id, { isActive: false });
    }

    // Activate selected
    await ctx.db.patch(args.id, { isActive: true });
    return args.id;
  },
});

// Action: Generate job description with AI
export const generateJobDescriptionWithAI = action({
  args: {
    jobTitle: v.string(),
    company: v.optional(v.string()),
    additionalInfo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const prompt = `Generate a detailed job description for a ${args.jobTitle} position${
      args.company ? ` at ${args.company}` : ""
    }.

${args.additionalInfo ? `Additional context: ${args.additionalInfo}` : ""}

Provide a comprehensive job description with:
1. A clear job description (2-3 paragraphs)
2. 5-7 key requirements
3. 5-8 technical skills needed
4. Experience level (entry/mid/senior/lead)
5. Recommended job type (full-time/part-time/contract/internship)

Format as JSON:
{
  "description": "detailed description",
  "requirements": ["req1", "req2", ...],
  "skills": ["skill1", "skill2", ...],
  "experienceLevel": "mid",
  "jobType": "full-time"
}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const responseText = data.content[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const generated = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

      return generated;
    } catch (error) {
      console.error("Error generating job description:", error);
      throw new Error("Failed to generate job description");
    }
  },
});

// Debug query - see ALL jobs regardless of user
export const debugGetAllJobs = query({
  args: {},
  handler: async (ctx) => {
    const allJobs = await ctx.db.query("jobDescriptions").collect();
    return allJobs.map(job => ({
      id: job._id,
      title: job.title,
      userId: job.userId,
    }));
  },
});

// One-time fix mutation
export const fixJobUserIds = mutation({
  args: {
    correctUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all jobs with wrong userId
    const allJobs = await ctx.db.query("jobDescriptions").collect();
    
    let updated = 0;
    for (const job of allJobs) {
      if (job.userId !== args.correctUserId) {
        await ctx.db.patch(job._id, { userId: args.correctUserId });
        updated++;
      }
    }
    
    return { message: `Updated ${updated} jobs to userId: ${args.correctUserId}` };
  },
});