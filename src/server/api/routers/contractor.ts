import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const contractorRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          specialization: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.contractor.findMany({
        where: input?.specialization
          ? {
              AND: [
                { specialization: { not: null } }, // exclude nulls
                {
                  specialization: {
                    contains: input.specialization,
                  },
                },
              ],
            }
          : undefined,
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.contractor.findUnique({
        where: { id: input.id },
        include: {
          bookings: {
            include: {
              service: true,
              customer: true,
            },
          },
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        phone: z.string().min(1),
        email: z.string().email(),
        specialization: z.string().optional(),
        rating: z.number().min(0).max(5).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.contractor.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        phone: z.string().min(1).optional(),
        email: z.string().email().optional(),
        specialization: z.string().optional(),
        rating: z.number().min(0).max(5).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.db.contractor.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.contractor.delete({
        where: { id: input.id },
      });
    }),
});
