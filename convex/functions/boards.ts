import type { Id } from "../_generated/dataModel";
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
      columns: columns[index]!,
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

export const updateBoard = mutation({
  args: {
    boardId: v.id("boards"),
    board: v.object({
      name: v.string(),
      user: v.string(),
      columns: v.array(v.object({ _id: v.string(), name: v.string() })),
    }),
  },
  handler: async (ctx, { boardId, board }) => {
    await ctx.db.patch(boardId, {
      name: board.name,
      user: board.user,
    });

    const existingColumns = await ctx.db
      .query("columns")
      .withIndex("by_board", (q) => q.eq("boardId", boardId))
      .collect();

    const existingColumnIds = new Set(existingColumns.map((col) => col._id.toString()));
    const updates: Promise<any>[] = [];
    const deletes: Promise<any>[] = [];
    const inserts: Promise<any>[] = [];

    // patch and inserts
    for (const column of board.columns) {
      if (!column._id || column._id === "new") {
        inserts.push(
          ctx.db.insert("columns", {
            name: column.name,
            boardId: boardId,
          }),
        );
      } else {
        if (existingColumnIds.has(column._id.toString()))
          updates.push(
            ctx.db.patch(column._id as Id<"columns">, {
              name: column.name,
            }),
          );
      }
    }

    // deletes
    const remainingColumnIds = new Set(
      board.columns.filter((col) => col._id && col._id !== "new").map((col) => col._id.toString()),
    );

    for (const column of existingColumns) {
      if (!remainingColumnIds.has(column._id.toString())) {
        deletes.push(ctx.db.delete(column._id));
      }
    }

    await Promise.all([...updates, ...deletes, ...inserts]);
  },
});
