"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import { api } from "@/trpc/react";

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  const { data: services, isLoading } = api.service.getAll.useQuery(
    categoryId ? { categoryId } : undefined,
  );

  const { data: categories } = api.serviceCategory.getAll.useQuery();

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Services</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/services">
          <Button variant={!categoryId ? "default" : "outline"}>All</Button>
        </Link>
        {categories?.map((category) => (
          <Link key={category.id} href={`/services?category=${category.id}`}>
            <Button
              variant={categoryId === category.id ? "default" : "outline"}
            >
              {category.name}
            </Button>
          </Link>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[...(Array(6) as number[])].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="mb-2 h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-4 h-[200px] w-full" />
                <Skeleton className="mb-2 h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {services?.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>{service.category.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4 h-[200px] w-full">
                  <Image
                    src={
                      service.imageUrl ??
                      "/placeholder.svg?height=200&width=400"
                    }
                    alt={service.name}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="mb-2 text-xl font-bold">
                  ${Number(service.price).toFixed(2)}
                </div>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/services/${service.id}`} className="w-full">
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
