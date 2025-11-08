import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  boards: defineTable({
    name: v.string(),
    user: v.optional(v.string()),
  }).index("by_user", ["user"]),
  columns: defineTable({
    name: v.string(),
    boardId: v.id("boards"),
  }).index("by_board", ["boardId"]),
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    columnId: v.id("columns"),
    boardId: v.id("boards"),
  })
    .index("by_column", ["columnId"])
    .index("by_board", ["boardId"]),
  subtasks: defineTable({
    title: v.string(),
    isCompleted: v.boolean(),
    taskId: v.id("tasks"),
  }).index("by_task", ["taskId"]),
});
