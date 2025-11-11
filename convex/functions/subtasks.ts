import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const updateSubtaskStatus = mutation({
  args: { subtaskId: v.id("subtasks"), isCompleted: v.boolean() },
  handler: async (ctx, { subtaskId, isCompleted }) => {
    await ctx.db.patch(subtaskId, { isCompleted });
  },
});
