"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { api } from "@/trpc/react";

export default function ContractorsPage() {
  const { data: contractors, isLoading } = api.contractor.getAll.useQuery();

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Contractors</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[...(Array(6) as number[])].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="mb-2 h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {contractors?.map((contractor) => (
            <Card key={contractor.id}>
              <CardHeader>
                <CardTitle>{contractor.name}</CardTitle>
                <CardDescription>
                  {contractor.specialization || "General Contractor"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-center">
                  {[...(Array(5) as number[])].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(contractor.rating || 0) ? "fill-primary" : "fill-muted stroke-muted-foreground"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm">
                    {contractor.rating?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <div className="mb-2 flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  <span>{contractor.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>{contractor.email}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/contractors/${contractor.id}`} className="w-full">
                  <Button className="w-full">View Profile</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
