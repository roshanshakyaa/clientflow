import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const createProject = mutation({
  args: {
    title: v.string(),
    clientId: v.id("clients"),
    deadline: v.string(),
    budget: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Not authenticated");

    return await ctx.db.insert("projects", {
      userId: user._id,
      clientId: args.clientId,
      title: args.title,
      status: "active",
      deadline: args.deadline,
      budget: args.budget,
      description: args.description,
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
