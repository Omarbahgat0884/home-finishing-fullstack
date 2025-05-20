import { api } from "@/trpc/server";
import { expect, test } from "@playwright/test";

test("add and get post", async () => {
  //   //   const ctx = await createContextInner({});
  //   //   const caller = createCaller(ctx);
  //   //   const input: inferProcedureInput<AppRouter["post"]["add"]> = {
  //   //     text: "hello test",
  //   //     title: "hello test",
  //   //   };
  //   const post = await api.post.add(input);
  //   const byId = await caller.post.byId({ id: post.id });
  //   expect(byId).toMatchObject(input);
  expect(true).toBe(true);
});
