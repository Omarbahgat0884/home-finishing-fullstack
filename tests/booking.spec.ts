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

test.describe("Booking API", () => {
  let createdBookingId: string;
  let customerId: string;
  let contractorId: string;
  let serviceId: string;
  let categoryId: string;

  test.beforeAll(async () => {
    const customerEmail = `test+${Date.now()}@customer.com`;
    const contractorEmail = `test+${Date.now()}@contractor.com`;

    // Clean up any existing test customer with same email (if using hardcoded ones)
    const existingCustomers = await trpc.customer.getAll.query();
    const existing = existingCustomers.find((c) => c.email === customerEmail);
    if (existing) {
      await trpc.customer.delete.mutate({ id: existing.id }).catch(() => {
        // Handle error if customer deletion fails
        console.error("Failed to delete existing customer:", existing.id);
      });
    }
    // Clean up any existing test contractor with same email (if using hardcoded ones)
    const existingContractors = await trpc.contractor.getAll.query();
    const existingContractor = existingContractors.find(
      (c) => c.email === contractorEmail,
    );
    if (existingContractor) {
      await trpc.contractor.delete
        .mutate({ id: existingContractor.id })
        .catch(() => {
          // Handle error if contractor deletion fails
          console.error(
            "Failed to delete existing contractor:",
            existingContractor.id,
          );
        });
    }

    // Create test customer
    const customer = await trpc.customer.create.mutate({
      name: "Test Customer for Booking",
      email: customerEmail,
      phone: "+1234567890",
    });
    customerId = customer.id;

    // Create test contractor
    const contractor = await trpc.contractor.create.mutate({
      name: "Test Contractor for Booking",
      phone: "+1234567890",
      email: contractorEmail,
      specialization: "General",
    });
    contractorId = contractor.id;

    // Create test service category
    const category = await trpc.serviceCategory.create.mutate({
      name: "Test Category for Booking",
      description: "Test Category Description",
    });
    categoryId = category.id;

    // Create test service
    const service = await trpc.service.create.mutate({
      name: "Test Service for Booking",
      description: "Test Service Description",
      price: 100,
      categoryId,
    });
    serviceId = service.id;

    // Create booking
    const booking = await trpc.booking.create.mutate({
      serviceId,
      customerId,
      contractorId,
      date: new Date(),
      status: "PENDING",
    });
    createdBookingId = booking.id;
  });

  test("should get all bookings", async () => {
    const bookings = await trpc.booking.getAll.query();
    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.find((b) => b.id === createdBookingId)).toBeDefined();
  });

  test("should get bookings by customer", async () => {
    const bookings = await trpc.booking.getAll.query({ customerId });
    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.every((booking) => booking.customerId === customerId)).toBe(
      true,
    );
  });

  test("should get bookings by contractor", async () => {
    const bookings = await trpc.booking.getAll.query({ contractorId });
    expect(Array.isArray(bookings)).toBe(true);
    expect(
      bookings.every((booking) => booking.contractorId === contractorId),
    ).toBe(true);
  });

  test("should get bookings by status", async () => {
    const bookings = await trpc.booking.getAll.query({ status: "PENDING" });
    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.every((booking) => booking.status === "PENDING")).toBe(
      true,
    );
  });

  test("should get booking by id", async () => {
    const booking = await trpc.booking.getById.query({ id: createdBookingId });
    expect(booking).toBeDefined();
    expect(booking?.id).toBe(createdBookingId);
    expect(booking?.service).toBeDefined();
    expect(booking?.customer).toBeDefined();
    expect(booking?.contractor).toBeDefined();
  });

  test.afterAll(async () => {
    // Clean up test data in reverse order
    await trpc.booking.delete.mutate({ id: createdBookingId }).catch(() => {
      // Handle error if booking deletion fails
      console.error("Failed to delete booking:", createdBookingId);
    });
    await trpc.service.delete.mutate({ id: serviceId }).catch(() => {
      // Handle error if service deletion fails
      console.error("Failed to delete service:", serviceId);
    });
    await trpc.serviceCategory.delete.mutate({ id: categoryId }).catch(() => {
      console.error("Failed to delete category:", categoryId);
    });
    await trpc.customer.delete.mutate({ id: customerId }).catch(() => {
      // Handle error if customer deletion fails
      console.error("Failed to delete customer:", customerId);
    });
    await trpc.contractor.delete.mutate({ id: contractorId }).catch(() => {
      // Handle error if contractor deletion fails
      console.error("Failed to delete contractor:", contractorId);
    });
  });
});
