// convex/users.ts
// Create this file first to handle user management

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get or create a user by email
 * This is called when user logs in via Clerk
 */
export const getOrCreateUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      // Update user info if needed
      if (args.name || args.imageUrl) {
        await ctx.db.patch(existingUser._id, {
          name: args.name,
          imageUrl: args.imageUrl,
        });
      }
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
    });

    return userId;
  },
});

/**
 * Get user by email
 */
export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    return user;
  },
});