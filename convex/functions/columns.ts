import { query } from "../_generated/server";
import { v } from "convex/values";

export const getColumns = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, { boardId }) => {
    return await ctx.db
      .query("columns")
      .withIndex("by_board", (q) => q.eq("boardId", boardId))
      .collect();
  },
});
