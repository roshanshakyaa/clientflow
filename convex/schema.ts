import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  clients: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
    totalRevenue: v.number(),
    outstandingBalance: v.number(),
    imageUrl: v.optional(v.string()),
    lastContacted: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["userId"],
    }),

  projects: defineTable({
    userId: v.string(),
    clientId: v.id("clients"),
    title: v.string(),
    description: v.optional(v.string()),

    // Detailed Status for better filtering
    status: v.union(
      v.literal("proposal"), // New/Lead
      v.literal("active"), // In progress
      v.literal("on-hold"), // Paused
      v.literal("completed"), // Done
      v.literal("archived"), // Finished and hidden
    ),

    // Priority for sorting the dashboard
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),

    // Timestamps for math/sorting
    startDate: v.number(),
    deadline: v.number(),

    // Financials
    budget: v.optional(v.number()),
    hourlyRate: v.optional(v.number()), // Essential for Day 6 (Time Tracking)

    // Progress automation
    totalTasks: v.number(),
    completedTasks: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_client", ["clientId"])
    .index("by_status", ["userId", "status"])
    .index("by_deadline", ["userId", "deadline"]),

  tasks: defineTable({
    userId: v.string(),
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),

    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("review"),
      v.literal("done"),
    ),

    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),

    dueDate: v.optional(v.number()),
    estimatedMinutes: v.optional(v.number()),
    actualMinutes: v.number(), // For calculating efficiency later

    order: v.number(), // For drag-and-drop sorting
  })
    .index("by_project", ["projectId"])
    .index("by_user_status", ["userId", "status"]),
});
