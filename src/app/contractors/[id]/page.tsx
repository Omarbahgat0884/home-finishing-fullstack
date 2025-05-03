"use client";

import { useParams, useRouter } from "next/navigation";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Star,
  Phone,
  Mail,
  Briefcase,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { api } from "@/trpc/react";

export default function ContractorDetailPage() {
  const params = useParams();
  const router = useRouter();

  const { data: contractor, isLoading } = api.contractor.getById.useQuery(
    { id: params.id as string },
    { enabled: !!params.id },
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
          <div>
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="mb-4 h-6 w-1/2" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!contractor) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="mb-6 text-3xl font-bold">Contractor not found</h1>
        <Link href="/contractors">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contractors
          </Button>
        </Link>
      </div>
    );
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{contractor.name}</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="mb-4 h-32 w-32">
                  <AvatarFallback className="text-2xl">
                    {getInitials(contractor.name)}
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-xl font-bold">{contractor.name}</h2>
                <p className="text-muted-foreground mb-4">
                  {contractor.specialization || "General Contractor"}
                </p>

                <div className="mb-4 flex items-center">
                  {[...(Array(5) as number[])].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(contractor.rating || 0)
                          ? "fill-primary"
                          : "fill-muted stroke-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="ml-2">
                    {contractor.rating?.toFixed(1) || "0.0"}
                  </span>
                </div>

                <div className="w-full space-y-2">
                  <div className="flex items-center">
                    <Phone className="text-muted-foreground mr-2 h-4 w-4" />
                    <span>{contractor.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="text-muted-foreground mr-2 h-4 w-4" />
                    <span>{contractor.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="services">
            <TabsList>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                  <CardDescription>
                    Services this contractor specializes in
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {contractor.specialization ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {contractor.specialization
                        .split(",")
                        .map((specialization, index) => (
                          <div key={index} className="rounded-lg border p-4">
                            <div className="flex items-center">
                              <Briefcase className="text-muted-foreground mr-2 h-5 w-5" />
                              <span className="font-medium">
                                {specialization.trim()}
                              </span>
                            </div>
                            <Link
                              href={`/services?category=${specialization.trim()}`}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-4 w-full"
                              >
                                View Related Services
                              </Button>
                            </Link>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p>
                      No specific services listed. This contractor offers
                      general construction services.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>
                    Recent projects completed by this contractor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {contractor.bookings && contractor.bookings.length > 0 ? (
                    <div className="space-y-4">
                      {contractor.bookings.map((booking) => (
                        <div key={booking.id} className="rounded-lg border p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium">
                                {booking.service.name}
                              </div>
                              <div className="text-muted-foreground text-sm">
                                {booking.service.description?.substring(0, 100)}
                                {booking.service.description &&
                                booking.service.description.length > 100
                                  ? "..."
                                  : ""}
                              </div>
                            </div>
                            <Badge
                              className={
                                booking.status === "COMPLETED"
                                  ? "bg-green-500"
                                  : booking.status === "IN_PROGRESS"
                                    ? "bg-blue-500"
                                    : booking.status === "CONFIRMED"
                                      ? "bg-purple-500"
                                      : booking.status === "CANCELLED"
                                        ? "bg-red-500"
                                        : "bg-yellow-500"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center text-sm">
                            <Calendar className="text-muted-foreground mr-1 h-4 w-4" />
                            {format(new Date(booking.date), "PPP")}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No recent bookings available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
