import { test, expect } from "@playwright/test";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { type appRouter } from "../src/server/api/root";
import superjson from "superjson";

// Create a tRPC client for testing
const trpc = createTRPCClient<typeof appRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
      headers: () => ({
        "x-trpc-source": "playwright-test",
      }),
      transformer: superjson,
    }),
  ],
});

test.describe("Service Category API", () => {
  let createdCategoryId: string;

  test.beforeAll(async () => {
    const categoryData = {
      name: "Test Category",
      description: "Test Description",
    };

    const result = await trpc.serviceCategory.create.mutate(categoryData);
    createdCategoryId = result.id;

    // Optional: Validate creation in setup
    expect(result).toBeDefined();
    expect(result.name).toBe(categoryData.name);
    expect(result.description).toBe(categoryData.description);
  });

  test("should get all service categories", async () => {
    const categories = await trpc.serviceCategory.getAll.query();
    expect(Array.isArray(categories)).toBe(true);
    expect(
      categories.find((cat) => cat.id === createdCategoryId),
    ).toBeDefined();
  });

  test("should get service category by id", async () => {
    const category = await trpc.serviceCategory.getById.query({
      id: createdCategoryId,
    });
    expect(category).toBeDefined();
    expect(category?.id).toBe(createdCategoryId);
  });

  test("should update service category", async () => {
    const updateData = {
      id: createdCategoryId,
      name: "Updated Category",
      description: "Updated Description",
    };

    const updatedCategory =
      await trpc.serviceCategory.update.mutate(updateData);
    expect(updatedCategory).toBeDefined();
    expect(updatedCategory.name).toBe(updateData.name);
    expect(updatedCategory.description).toBe(updateData.description);
  });

  test("should delete service category", async () => {
    const result = await trpc.serviceCategory.delete.mutate({
      id: createdCategoryId,
    });
    expect(result).toBeDefined();

    // Verify deletion
    const categories = await trpc.serviceCategory.getAll.query();
    const deletedCategory = categories.find(
      (cat) => cat.id === createdCategoryId,
    );
    expect(deletedCategory).toBeUndefined();
  });
});
