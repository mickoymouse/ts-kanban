import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const getColumns = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, { boardId }) => {
    const columns = await ctx.db
      .query("columns")
      .withIndex("by_board", (q) => q.eq("boardId", boardId))
      .collect();

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_board", (q) => q.eq("boardId", boardId))
      .collect();

    const columnsWithTasks = columns.map((column) => {
      return {
        ...column,
        tasks: tasks.filter((task) => task.columnId === column._id),
      };
    });

    return columnsWithTasks;
  },
});
