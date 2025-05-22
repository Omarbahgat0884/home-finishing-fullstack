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

test.describe("Customer API", () => {
  let createdCustomerId: string;

  test.beforeAll(async () => {
    const email = `test+${Date.now()}@customer.com`;

    // Clean up any existing test customer with same email (if using hardcoded ones)
    // This is useful if you're testing with static email like 'test@customer.com'
    const existingCustomers = await trpc.customer.getAll.query();
    const existing = existingCustomers.find((c) => c.email === email);
    if (existing) {
      await trpc.customer.delete.mutate({ id: existing.id }).catch(() => {
        // Handle error if customer deletion fails
        console.error("Failed to delete existing customer:", existing.id);
      });
    }

    const result = await trpc.customer.create.mutate({
      name: "Test Customer",
      email,
      phone: "+1234567890",
    });

    createdCustomerId = result.id;

    expect(result).toBeDefined();
  });

  test("should get all customers", async () => {
    const customers = await trpc.customer.getAll.query();
    expect(Array.isArray(customers)).toBe(true);
    expect(customers.find((c) => c.id === createdCustomerId)).toBeDefined();
  });

  test("should get customer by id", async () => {
    const customer = await trpc.customer.getById.query({
      id: createdCustomerId,
    });
    expect(customer).toBeDefined();
    expect(customer?.id).toBe(createdCustomerId);
    expect(customer?.bookings).toBeDefined();
  });

  test("should get customer with bookings", async () => {
    const customer = await trpc.customer.getById.query({
      id: createdCustomerId,
    });
    expect(customer).toBeDefined();
    expect(Array.isArray(customer?.bookings)).toBe(true);
  });

  test("should update customer", async () => {
    const updateData = {
      id: createdCustomerId,
      name: "Updated Customer",
      email: "updated@customer.com",
    };

    const updatedCustomer = await trpc.customer.update.mutate(updateData);
    expect(updatedCustomer).toBeDefined();
    expect(updatedCustomer.name).toBe(updateData.name);
    expect(updatedCustomer.email).toBe(updateData.email);
  });

  test.afterAll(async () => {
    await trpc.customer.delete.mutate({ id: createdCustomerId }).catch(() => {
      // Handle error if customer deletion fails
      console.error("Failed to delete customer:", createdCustomerId);
    });
  });

  // test("should delete customer", async () => {
  //   const result = await trpc.customer.delete.mutate({ id: createdCustomerId });
  //   expect(result).toBeDefined();

  //   // Verify deletion
  //   const customers = await trpc.customer.getAll.query();
  //   const deletedCustomer = customers.find(
  //     (cust) => cust.id === createdCustomerId,
  //   );
  //   expect(deletedCustomer).toBeUndefined();
  // });
});
