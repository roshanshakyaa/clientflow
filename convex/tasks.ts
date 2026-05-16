import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const createTask = mutation({
  args: {
    title: v.string(),
    projectId: v.id("projects"),
    description: v.optional(v.string()), // Match schema optionality
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Not authenticated");

    const lastTask = await ctx.db
      .query("tasks")
      .withIndex("by_project_status", (q) =>
        q.eq("projectId", args.projectId).eq("status", "todo"),
      )
      .order("desc")
      .first();

    const newOrder = lastTask ? lastTask.order + 1000 : 1000;

    return await ctx.db.insert("tasks", {
      userId: user._id,
      projectId: args.projectId,
      title: args.title,
      description: args.description,
      priority: args.priority,
      status: "todo",
      dueDate: args.dueDate,
      order: newOrder,
    });
  },
});
export const getTasks = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("tasks")
      .withIndex("by_project_status", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const updateTaskStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("review"),
      v.literal("done"),
    ),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Not authenticated");

    const task = await ctx.db.get(args.id);
    if (!task) throw new ConvexError("Task not found");
    if (task.userId !== user._id) throw new ConvexError("Unauthorized");

    await ctx.db.patch(args.id, {
      status: args.status,
      ...(args.order !== undefined ? { order: args.order } : {}),
    });
  },
});
