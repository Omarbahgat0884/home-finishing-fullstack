"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addDays } from "date-fns";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { DatePicker } from "./date-picker";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  contractorId: z.string().min(1, "Please select a contractor"),
  date: z
    .date({
      required_error: "Please select a date",
    })
    .refine((date) => date > new Date(), {
      message: "Date must be in the future",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface PublicBookingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: string;
  serviceName: string;
}

export function PublicBookingForm({
  open,
  onOpenChange,
  serviceId,
  serviceName,
}: PublicBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const utils = api.useUtils();

  const { data: contractors } = api.contractor.getAll.useQuery();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      contractorId: "",
      date: addDays(new Date(), 1),
    },
  });

  const createCustomer = api.customer.create.useMutation();
  const createBooking = api.booking.create.useMutation({
    onSuccess: async () => {
      await utils.booking.getAll.invalidate();
      setBookingComplete(true);
      toast("Booking created successfully!");
    },
    onError: (error) => {
      toast.error("Error creating booking: " + error.message);
      setIsSubmitting(false);
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      // First create or find the customer
      const customerResult = await createCustomer.mutateAsync({
        name: values.name,
        email: values.email,
        phone: values.phone,
      });

      // Then create the booking
      await createBooking.mutateAsync({
        serviceId: serviceId,
        customerId: customerResult.id,
        contractorId: values.contractorId,
        date: values.date,
        status: "PENDING",
      });
    } catch (error) {
      // Error is handled by the mutation callbacks
      console.error("Booking error:", error);
    }
  }

  function handleClose(open: boolean) {
    if (!open) {
      // Reset form when dialog is closed
      form.reset();
      setBookingComplete(false);
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {!bookingComplete ? (
          <>
            <DialogHeader>
              <DialogTitle>Book Service: {serviceName}</DialogTitle>
              <DialogDescription>
                Fill out the form below to book this service. We will contact
                you to confirm the details.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contractorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Contractor</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a contractor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contractors?.map((contractor) => (
                            <SelectItem
                              key={contractor.id}
                              value={contractor.id}
                            >
                              {contractor.name}{" "}
                              {contractor.rating
                                ? `(${contractor.rating.toFixed(1)}★)`
                                : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Preferred Date</FormLabel>
                      <DatePicker date={field.value} setDate={field.onChange} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Booking..." : "Book Now"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Booking Confirmed!</DialogTitle>
              <DialogDescription>
                Thank you for your booking. We have sent a confirmation email
                with all the details.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="mb-4 rounded-full bg-green-100 p-3">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-center text-lg font-medium">
                Your booking for {serviceName} has been placed
              </h3>
              <p className="text-muted-foreground mt-2 text-center text-sm">
                A contractor will contact you shortly to confirm the details.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => handleClose(false)}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
