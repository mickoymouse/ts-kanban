import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const getBoards = query({
  args: { user: v.string() },
  handler: async (ctx, { user }) => {
    const boards = await ctx.db
      .query("boards")
      .withIndex("by_user", (q) => q.eq("user", user))
      .collect();

    const columnsFetcher = [];
    for (const board of boards) {
      columnsFetcher.push(
        ctx.db
          .query("columns")
          .withIndex("by_board", (q) => q.eq("boardId", board._id))
          .collect(),
      );
    }

    const columns = await Promise.all(columnsFetcher);
    return boards.map((board, index) => ({
      ...board,
      columns: columns[index],
    }));
  },
});

export const createBoard = mutation({
  args: {
    board: v.object({
      name: v.string(),
      user: v.string(),
      columns: v.array(v.object({ name: v.string() })),
    }),
  },
  handler: async (ctx, { board }) => {
    const boardId = await ctx.db.insert("boards", {
      name: board.name,
      user: board.user,
    });

    const columnInserts = [];
    for (const column of board.columns) {
      columnInserts.push(
        ctx.db.insert("columns", {
          name: column.name,
          boardId: boardId,
        }),
      );
    }
    await Promise.all(columnInserts);
  },
});
