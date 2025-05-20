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

test.describe("Contractor API", () => {
  let createdContractorId: string;

  test.beforeAll(async () => {
    const email = `test+${Date.now()}@customer.com`;

    const existingContractors = await trpc.contractor.getAll.query();
    const existing = existingContractors.find((c) => c.email === email);
    if (existing) {
      await trpc.contractor.delete.mutate({ id: existing.id }).catch(() => {
        console.error("Failed to delete existing contractor:", existing.id);
      });
    }

    const contractorData = {
      name: "Test Contractor",
      phone: "+1234567890",
      email,
      specialization: "Plumbing",
      rating: 4.5,
    };

    const result = await trpc.contractor.create.mutate(contractorData);
    createdContractorId = result.id;

    // Sanity check
    expect(result).toBeDefined();
    expect(result.name).toBe(contractorData.name);
    expect(result.phone).toBe(contractorData.phone);
    expect(result.email).toBe(contractorData.email);
    expect(result.specialization).toBe(contractorData.specialization);
    expect(result.rating).toBe(contractorData.rating);
  });

  test("should get all contractors", async () => {
    const contractors = await trpc.contractor.getAll.query();
    expect(Array.isArray(contractors)).toBe(true);
    expect(contractors.find((c) => c.id === createdContractorId)).toBeDefined();
  });

  test("should get contractors by specialization", async () => {
    const contractors = await trpc.contractor.getAll.query({
      specialization: "Plumbing",
    });
    expect(Array.isArray(contractors)).toBe(true);
    expect(contractors.every((c) => c.specialization === "Plumbing")).toBe(
      true,
    );
  });

  test("should get contractor by id", async () => {
    const contractor = await trpc.contractor.getById.query({
      id: createdContractorId,
    });
    expect(contractor).toBeDefined();
    expect(contractor?.id).toBe(createdContractorId);
    expect(contractor?.bookings).toBeDefined();
  });

  test("should get contractor with bookings", async () => {
    const contractor = await trpc.contractor.getById.query({
      id: createdContractorId,
    });
    expect(contractor).toBeDefined();
    expect(Array.isArray(contractor?.bookings)).toBe(true);
  });

  test.afterAll(async () => {
    await trpc.contractor.delete
      .mutate({ id: createdContractorId })
      .catch(() => {
        // Handle error if contractor deletion fails
        console.error("Failed to delete contractor:", createdContractorId);
      });
  });
});
