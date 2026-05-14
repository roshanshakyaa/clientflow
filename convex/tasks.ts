import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
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
