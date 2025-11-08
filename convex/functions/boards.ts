import { query } from "../_generated/server";
import { v } from "convex/values";

export const getBoards = query({
  args: { user: v.string() },
  handler: async (ctx, { user }) => {
    return await ctx.db
      .query("boards")
      .withIndex("by_user", (q) => q.eq("user", user))
      .collect();
  },
});
