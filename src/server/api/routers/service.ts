import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const serviceRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          categoryId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.service.findMany({
        where: input?.categoryId ? { categoryId: input.categoryId } : undefined,
        include: {
          category: true,
        },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.service.findUnique({
        where: { id: input.id },
        include: {
          category: true,
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().positive(),
        imageUrl: z.string().url().optional(),
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.service.create({
        data: {
          ...input,
          price: input.price.toString(),
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        imageUrl: z.string().url().optional(),
        categoryId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, price, ...rest } = input;
      return await ctx.db.service.update({
        where: { id },
        data: {
          ...rest,
          ...(price && { price: price.toString() }),
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.service.delete({
        where: { id: input.id },
      });
    }),
});
