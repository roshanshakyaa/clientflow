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
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("on-hold"),
    ),
    deadline: v.string(),

    budget: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_client", ["clientId"])
    .index("by_status", ["userId", "status"]),
});
