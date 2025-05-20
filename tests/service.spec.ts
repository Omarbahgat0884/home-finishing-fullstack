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

test.describe("Service API", () => {
  let createdServiceId: string;
  let categoryId: string;

  test.beforeAll(async () => {
    // Create a category first
    const category = await trpc.serviceCategory.create.mutate({
      name: "Test Category for Service",
      description: "Test Category Description",
    });
    categoryId = category.id;

    // Create a service for subsequent tests
    const service = await trpc.service.create.mutate({
      name: "Test Service",
      description: "Test Service Description",
      price: 100,
      categoryId,
      imageUrl: "https://example.com/image.jpg",
    });
    createdServiceId = service.id;

    // Optional sanity checks
    expect(service).toBeDefined();
    expect(service.categoryId).toBe(categoryId);
  });

  test("should get all services", async () => {
    const services = await trpc.service.getAll.query();
    expect(Array.isArray(services)).toBe(true);
    expect(services.find((s) => s.id === createdServiceId)).toBeDefined();
  });

  test("should get services by category", async () => {
    const services = await trpc.service.getAll.query({ categoryId });
    expect(Array.isArray(services)).toBe(true);
    expect(services.every((service) => service.categoryId === categoryId)).toBe(
      true,
    );
  });

  test("should get service by id", async () => {
    const service = await trpc.service.getById.query({ id: createdServiceId });
    expect(service).toBeDefined();
    expect(service?.id).toBe(createdServiceId);
    expect(service?.category).toBeDefined();
  });

  test("should update service", async () => {
    const updateData = {
      id: createdServiceId,
      name: "Updated Service",
      description: "Updated Service Description",
      price: 150,
    };

    const updatedService = await trpc.service.update.mutate(updateData);
    expect(updatedService).toBeDefined();
    expect(updatedService.name).toBe(updateData.name);
    expect(updatedService.description).toBe(updateData.description);
    expect(updatedService.price).toBe(updateData.price.toString());
  });

  test.afterAll(async () => {
    // Clean up: delete service first (if applicable), then category
    await trpc.service.delete.mutate({ id: createdServiceId }).catch(() => {
      // Handle error if service deletion fails
      console.error("Failed to delete service:", createdServiceId);
    });
    await trpc.serviceCategory.delete.mutate({ id: categoryId }).catch(() => {
      // Handle error if category deletion fails
      console.error("Failed to delete category:", categoryId);
    });
  });
});
