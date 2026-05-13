import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const createProject = mutation({
  args: {
    title: v.string(),
    clientId: v.id("clients"),
    description: v.optional(v.string()),

    status: v.union(
      v.literal("proposal"),
      v.literal("active"),
      v.literal("on-hold"),
      v.literal("completed"),
      v.literal("archived"),
    ),

    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),

    startDate: v.number(),
    deadline: v.number(),

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
export const getProjectsOfClient = query({
  args: {
    clientId: v.id("clients"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("projects")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .collect();
  },
});

export const updateProjectStatus = mutation({
  args: {
    id: v.id("projects"),
    status: v.union(
      v.literal("proposal"),
      v.literal("active"),
      v.literal("on-hold"),
      v.literal("completed"),
      v.literal("archived"),
    ),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Not authenticated");

    const project = await ctx.db.get(args.id);
    if (!project) throw new ConvexError("Project not found");
    if (project.userId !== user._id) throw new ConvexError("Unauthorized");

    await ctx.db.patch(args.id, { status: args.status });
  },
});
