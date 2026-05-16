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

    const lastProject = await ctx.db
      .query("projects")
      .withIndex("by_status_order", (q) =>
        q.eq("userId", user._id).eq("status", args.status),
      )
      .order("desc")
      .first();

    const newOrder = lastProject ? lastProject.order + 1000 : 1000;

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
      order: newOrder, // Added order field
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

    // Use the status_order index to ensure the Kanban displays correctly
    return await ctx.db
      .query("projects")
      .withIndex("by_status_order", (q) => q.eq("userId", user._id))
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
    order: v.optional(v.number()), // Optional: allows simple status changes OR reordering
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Not authenticated");

    const project = await ctx.db.get(args.id);
    if (!project) throw new ConvexError("Project not found");
    if (project.userId !== user._id) throw new ConvexError("Unauthorized");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patchData: any = { status: args.status };

    // If a specific order is passed (from drag-and-drop), update it
    if (args.order !== undefined) {
      patchData.order = args.order;
    }

    await ctx.db.patch(args.id, patchData);
  },
});

export const getProjectsOfClient = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("projects")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .collect();
  },
});
export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;

    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== user._id) return null;

    const client = await ctx.db.get(project.clientId);

    return { ...project, client };
  },
});

export const getRecentProjects = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;

    return await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .take(5);
  },
});
