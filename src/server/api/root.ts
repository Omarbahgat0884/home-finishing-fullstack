import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { serviceCategoryRouter } from "./routers/servicecategory";
import { serviceRouter } from "./routers/service";
import { contractorRouter } from "./routers/contractor";
import { customerRouter } from "./routers/customer";
import { bookingRouter } from "./routers/booking";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  serviceCategory: serviceCategoryRouter,
  service: serviceRouter,
  contractor: contractorRouter,
  customer: customerRouter,
  booking: bookingRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
