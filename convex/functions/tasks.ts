import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const getTasks = query({
  args: { columnId: v.id("columns") },
  handler: async (ctx, { columnId }) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_column", (q) => q.eq("columnId", columnId))
      .collect();

    const column = await ctx.db.get(columnId);

    if (!column) {
      throw new Error("Column not found");
    }

    const taskIds = tasks.map((task) => task._id);

    const allSubtasks = await Promise.all(
      taskIds.map((taskId) =>
        ctx.db
          .query("subtasks")
          .withIndex("by_task", (q) => q.eq("taskId", taskId))
          .collect(),
      ),
    );

    const subtasks = allSubtasks.flat();

    const tasksWithSubtasks = tasks.map((task) => {
      return {
        ...task,
        column: column.name,
        subtasks: subtasks.filter((subtask) => subtask.taskId === task._id),
      };
    });

    return tasksWithSubtasks;
  },
});

export const getTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, { taskId }) => {
    const task = await ctx.db.get(taskId);

    if (!task) {
      throw new Error("Task not found");
    }
    const column = await ctx.db.get(task.columnId);

    const subtasks = await ctx.db
      .query("subtasks")
      .withIndex("by_task", (q) => q.eq("taskId", taskId))
      .collect();

    return {
      ...task,
      subtasks,
      column,
    };
  },
});

export const updateTaskStatus = mutation({
  args: { taskId: v.id("tasks"), newColumnId: v.id("columns") },
  handler: async (ctx, { taskId, newColumnId }) => {
    await ctx.db.patch(taskId, { columnId: newColumnId });
  },
});

export const createTask = mutation({
  args: {
    task: v.object({
      title: v.string(),
      description: v.optional(v.string()),
      boardId: v.id("boards"),
      columnId: v.id("columns"),
      subtasks: v.array(v.object({ title: v.string(), isCompleted: v.boolean() })),
    }),
  },
  handler: async (ctx, { task }) => {
    const newTaskId = await ctx.db.insert("tasks", {
      title: task.title,
      description: task.description,
      boardId: task.boardId,
      columnId: task.columnId,
    });

    for (const subtask of task.subtasks) {
      await ctx.db.insert("subtasks", {
        title: subtask.title,
        isCompleted: subtask.isCompleted,
        taskId: newTaskId,
      });
    }
  },
});
