import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const bookingRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          customerId: z.string().optional(),
          contractorId: z.string().optional(),
          status: z
            .enum([
              "PENDING",
              "CONFIRMED",
              "IN_PROGRESS",
              "COMPLETED",
              "CANCELLED",
            ])
            .optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.booking.findMany({
        where: {
          ...(input?.customerId && { customerId: input.customerId }),
          ...(input?.contractorId && { contractorId: input.contractorId }),
          ...(input?.status && { status: input.status }),
        },
        include: {
          service: true,
          customer: true,
          contractor: true,
        },
        orderBy: {
          date: "desc",
        },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.booking.findUnique({
        where: { id: input.id },
        include: {
          service: true,
          customer: true,
          contractor: true,
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        serviceId: z.string(),
        customerId: z.string(),
        contractorId: z.string(),
        date: z.date(),
        status: z
          .enum([
            "PENDING",
            "CONFIRMED",
            "IN_PROGRESS",
            "COMPLETED",
            "CANCELLED",
          ])
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.booking.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        serviceId: z.string().optional(),
        customerId: z.string().optional(),
        contractorId: z.string().optional(),
        date: z.date().optional(),
        status: z
          .enum([
            "PENDING",
            "CONFIRMED",
            "IN_PROGRESS",
            "COMPLETED",
            "CANCELLED",
          ])
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.db.booking.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.booking.delete({
        where: { id: input.id },
      });
    }),
});
