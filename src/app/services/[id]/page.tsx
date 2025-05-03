"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Calendar,
  Star,
  Clock,
  DollarSign,
  Tag,
} from "lucide-react";
import { api } from "@/trpc/react";
import { PublicBookingForm } from "@/components/public-booking-form";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [bookingFormOpen, setBookingFormOpen] = useState(false);

  const { data: service, isLoading } = api.service.getById.useQuery(
    { id: params.id as string },
    { enabled: !!params.id },
  );

  const { data: contractors } = api.contractor.getAll.useQuery(
    { specialization: service?.category?.name },
    { enabled: !!service },
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-6 flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Skeleton className="h-8 w-1/3" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Skeleton className="mb-6 h-[300px] w-full" />
            <Skeleton className="mb-4 h-6 w-1/2" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div>
            <Skeleton className="h-[200px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="mb-6 text-3xl font-bold">Service not found</h1>
        <Link href="/services">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{service.name}</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="relative mb-6 h-[300px] w-full overflow-hidden rounded-lg">
            <Image
              src={service.imageUrl || "/placeholder.svg?height=300&width=600"}
              alt={service.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center">
              <Tag className="mr-1 h-3 w-3" />
              {service.category.name}
            </Badge>
            <Badge variant="secondary" className="flex items-center">
              <DollarSign className="mr-1 h-3 w-3" />$
              {Number(service.price).toFixed(2)}
            </Badge>
          </div>

          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="contractors">
                Available Contractors
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Service Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{service.description || "No description available."}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contractors" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Available Contractors</CardTitle>
                  <CardDescription>
                    Professionals who can perform this service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {contractors && contractors.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {contractors.map((contractor) => (
                        <div
                          key={contractor.id}
                          className="rounded-lg border p-4"
                        >
                          <div className="font-medium">{contractor.name}</div>
                          <div className="text-muted-foreground mb-2 text-sm">
                            {contractor.specialization || "General Contractor"}
                          </div>
                          <div className="mb-1 flex items-center">
                            {[...(Array(5) as number[])].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.round(contractor.rating || 0)
                                    ? "fill-primary"
                                    : "fill-muted stroke-muted-foreground"
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-xs">
                              {contractor.rating?.toFixed(1) || "0.0"}
                            </span>
                          </div>
                          <Link href={`/contractors/${contractor.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 w-full"
                            >
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No contractors available for this service.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Book This Service</CardTitle>
              <CardDescription>
                Schedule an appointment with one of our professionals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center">
                  <DollarSign className="text-muted-foreground mr-2 h-5 w-5" />
                  <span className="text-xl font-bold">
                    ${Number(service.price).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="text-muted-foreground mr-2 h-5 w-5" />
                  <span>Estimated time: 2-3 hours</span>
                </div>
                <Button
                  className="mt-2 w-full"
                  onClick={() => setBookingFormOpen(true)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <PublicBookingForm
        open={bookingFormOpen}
        onOpenChange={setBookingFormOpen}
        serviceId={service.id}
        serviceName={service.name}
      />
    </div>
  );
}
