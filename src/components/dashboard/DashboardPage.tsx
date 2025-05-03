"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { BookingForm } from "@/components/forms/booking-form";
import { ContractorForm } from "@/components/forms/contractor-form";
import { CustomerForm } from "@/components/forms/customer-form";
import { ServiceForm } from "@/components/forms/service-form";
import { ServiceCategoryForm } from "@/components/forms/service-category-form";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import type {
  Booking,
  Contractor,
  Customer,
  Service,
  ServiceCategory,
} from "@prisma/client";

export default function DashboardPage() {
  const utils = api.useUtils();

  // Fetch data
  const { data: categories } = api.serviceCategory.getAll.useQuery();
  const { data: services } = api.service.getAll.useQuery();
  const { data: contractors } = api.contractor.getAll.useQuery();
  const { data: customers } = api.customer.getAll.useQuery();
  const { data: bookings } = api.booking.getAll.useQuery();

  // Delete mutations
  const deleteCategory = api.serviceCategory.delete.useMutation({
    onSuccess: async () => {
      await utils.serviceCategory.getAll.invalidate();
      toast("Category deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteService = api.service.delete.useMutation({
    onSuccess: async () => {
      await utils.service.getAll.invalidate();
      toast("Service deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteContractor = api.contractor.delete.useMutation({
    onSuccess: async () => {
      await utils.contractor.getAll.invalidate();
      toast("Contractor deleted successfully");
    },
    onError: (error) => {
      toast.message(error.message);
    },
  });

  const deleteCustomer = api.customer.delete.useMutation({
    onSuccess: async () => {
      await utils.customer.getAll.invalidate();
      toast("Customer deleted successfully");
    },
    onError: (error) => {
      toast.message(error.message);
    },
  });

  const deleteBooking = api.booking.delete.useMutation({
    onSuccess: async () => {
      await utils.booking.getAll.invalidate();
      toast("Booking deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Form states
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [contractorFormOpen, setContractorFormOpen] = useState(false);
  const [customerFormOpen, setCustomerFormOpen] = useState(false);
  const [bookingFormOpen, setBookingFormOpen] = useState(false);

  // Edit states
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    description?: string | null;
  }>();
  const [editingService, setEditingService] = useState<{
    id: string;
    name: string;
    description?: string | null;
    price: string;
    imageUrl?: string | null;
    categoryId: string;
  }>();
  const [editingContractor, setEditingContractor] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
    specialization?: string | null;
    rating?: number | null;
  }>();
  const [editingCustomer, setEditingCustomer] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
  }>();
  const [editingBooking, setEditingBooking] = useState<{
    id: string;
    serviceId: string;
    customerId: string;
    contractorId: string;
    date: Date;
    status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  }>();

  // Delete confirmation states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: string;
    id: string;
  } | null>(null);

  // Handle edit functions
  const handleEditCategory = (category: ServiceCategory) => {
    setEditingCategory(category);
    setCategoryFormOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceFormOpen(true);
  };

  const handleEditContractor = (contractor: Contractor) => {
    setEditingContractor(contractor);
    setContractorFormOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setCustomerFormOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setBookingFormOpen(true);
  };

  // Handle delete functions
  const handleDeleteClick = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    switch (itemToDelete.type) {
      case "category":
        deleteCategory.mutate({ id: itemToDelete.id });
        break;
      case "service":
        deleteService.mutate({ id: itemToDelete.id });
        break;
      case "contractor":
        deleteContractor.mutate({ id: itemToDelete.id });
        break;
      case "customer":
        deleteCustomer.mutate({ id: itemToDelete.id });
        break;
      case "booking":
        deleteBooking.mutate({ id: itemToDelete.id });
        break;
    }

    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  // Reset form states when closing
  const handleCategoryFormClose = (open: boolean) => {
    setCategoryFormOpen(open);
    if (!open) setEditingCategory(undefined);
  };

  const handleServiceFormClose = (open: boolean) => {
    setServiceFormOpen(open);
    if (!open) setEditingService(undefined);
  };

  const handleContractorFormClose = (open: boolean) => {
    setContractorFormOpen(open);
    if (!open) setEditingContractor(undefined);
  };

  const handleCustomerFormClose = (open: boolean) => {
    setCustomerFormOpen(open);
    if (!open) setEditingCustomer(undefined);
  };

  const handleBookingFormClose = (open: boolean) => {
    setBookingFormOpen(open);
    if (!open) setEditingBooking(undefined);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contractors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractors?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories">
        <TabsList className="mb-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="contractors">Contractors</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setCategoryFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories?.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Services: {category.services.length}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Pencil className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick("category", category.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services">
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setServiceFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services?.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.category.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Price: ${Number(service.price).toFixed(2)}
                  </p>
                  <p className="mt-1 text-sm">{service.description}</p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditService(service)}
                    >
                      <Pencil className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick("service", service.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contractors">
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setContractorFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Contractor
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contractors?.map((contractor) => (
              <Card key={contractor.id}>
                <CardHeader>
                  <CardTitle>{contractor.name}</CardTitle>
                  <CardDescription>
                    {contractor.specialization || "General Contractor"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Email: {contractor.email}</p>
                  <p className="text-sm">Phone: {contractor.phone}</p>
                  <p className="text-sm">
                    Rating: {contractor.rating?.toFixed(1) || "0.0"}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditContractor(contractor)}
                    >
                      <Pencil className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleDeleteClick("contractor", contractor.id)
                      }
                    >
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setCustomerFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {customers?.map((customer) => (
              <Card key={customer.id}>
                <CardHeader>
                  <CardTitle>{customer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Email: {customer.email}</p>
                  <p className="text-sm">Phone: {customer.phone}</p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCustomer(customer)}
                    >
                      <Pencil className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick("customer", customer.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setBookingFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Booking
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {bookings?.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <CardTitle>{booking.service.name}</CardTitle>
                  <CardDescription>Status: {booking.status}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Customer: {booking.customer.name}</p>
                  <p className="text-sm">
                    Contractor: {booking.contractor.name}
                  </p>
                  <p className="text-sm">
                    Date: {new Date(booking.date).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBooking(booking)}
                    >
                      <Pencil className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick("booking", booking.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Forms */}
      <ServiceCategoryForm
        open={categoryFormOpen}
        onOpenChange={handleCategoryFormClose}
        initialData={editingCategory}
      />
      <ServiceForm
        open={serviceFormOpen}
        onOpenChange={handleServiceFormClose}
        initialData={editingService}
      />
      <ContractorForm
        open={contractorFormOpen}
        onOpenChange={handleContractorFormClose}
        initialData={editingContractor}
      />
      <CustomerForm
        open={customerFormOpen}
        onOpenChange={handleCustomerFormClose}
        initialData={editingCustomer}
      />
      <BookingForm
        open={bookingFormOpen}
        onOpenChange={handleBookingFormClose}
        initialData={editingBooking}
      />

      {/* Delete confirmation */}
      <DeleteConfirmation
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
