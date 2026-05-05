import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  clients: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    totalRevenue: v.number(),
    outstandingBalance: v.number(),
  }).index("by_user", ["userId"]),
  projects: defineTable({
    userId: v.string(),
    clientId: v.id("clients"),
    title: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("on-hold"),
    ),
    deadline: v.string(),
  }).index("by_client", ["clientId"]),
});
