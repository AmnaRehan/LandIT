import { query } from "./_generated/server";
import { v } from "convex/values";

export const getActivityData = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const activities = await ctx.db
      .query("activities")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    return activities;
  },
});

export const getJobInfo = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const jobInfo = await ctx.db
      .query("job_info")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    return jobInfo;
  },
});

export const getJobActions = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const actions = await ctx.db
      .query("jobActions")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    return actions;
  },
});

