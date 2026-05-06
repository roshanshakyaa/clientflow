import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  clients: defineTable({
    // Auth & Identification
    userId: v.string(),

    // Core Info
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    phone: v.optional(v.string()),

    // Financials (Defaulted to 0 in mutation)
    totalRevenue: v.number(),
    outstandingBalance: v.number(),

    // Metadata for UI
    imageUrl: v.optional(v.string()), // For that high-end avatar look
    lastContacted: v.optional(v.number()), // Unix timestamp
  })
    .index("by_user", ["userId"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["userId"],
    }),

  projects: defineTable({
    userId: v.string(),
    clientId: v.id("clients"),

    // Core Info
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("on-hold"),
    ),
    deadline: v.string(),

    // Financial Context
    budget: v.optional(v.number()),
  })
    .index("by_user", ["userId"]) // Essential for "All Projects" view
    .index("by_client", ["clientId"]) // Essential for "Client Detail" view
    .index("by_status", ["userId", "status"]), // For filtering "Active" projects fast
});
