import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const todoRouter = router({
  addTodo: publicProcedure
    .input(z.object({ task: z.string(), dueDate: z.date() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.todo.create({
        data: { task: input.task, dueDate: input.dueDate },
      });
    }),
  deleteTodo: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.todo.delete({ where: { id: input.id } });
    }),
  getTodos: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany();
  }),
});
