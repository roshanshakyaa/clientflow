import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const createProject = mutation({
  args: {
    title: v.string(),
    clientId: v.id("clients"),
    description: v.optional(v.string()),

    // Status must match your schema literals exactly
    status: v.union(
      v.literal("proposal"),
      v.literal("active"),
      v.literal("on-hold"),
      v.literal("completed"),
      v.literal("archived"),
    ),

    // Priority levels
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),

    // Timestamps as numbers (Date.getTime())
    startDate: v.number(),
    deadline: v.number(),

    // Financials
    budget: v.optional(v.number()),
    hourlyRate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Not authenticated");

    return await ctx.db.insert("projects", {
      userId: user._id,
      clientId: args.clientId,
      title: args.title,
      description: args.description,
      status: args.status,
      priority: args.priority,
      startDate: args.startDate,
      deadline: args.deadline,
      budget: args.budget,
      hourlyRate: args.hourlyRate,

      // Automatic initialization for your Kanban/Progress bars
      totalTasks: 0,
      completedTasks: 0,
    });
  },
});

export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", user._id)) // Secure filtering
      .order("desc")
      .collect();
  },
});
