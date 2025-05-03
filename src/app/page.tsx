import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Paintbrush, Zap, Layers } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-10 flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Home Finishing App
        </h1>
        <p className="text-muted-foreground max-w-[700px]">
          Find professional contractors for all your construction finishing
          needs
        </p>
        <div className="mt-4 flex gap-4">
          <Link href="/services">
            <Button size="lg">Browse Services</Button>
          </Link>
          <Link href="/contractors">
            <Button size="lg" variant="outline">
              Find Contractors
            </Button>
          </Link>
        </div>
      </div>

      <h2 className="mb-6 text-2xl font-bold">Popular Service Categories</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Paintbrush className="mb-2 h-8 w-8" />
            <CardTitle>Painting</CardTitle>
            <CardDescription>
              Interior and exterior painting services
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/services?category=painting" className="w-full">
              <Button className="w-full">View Services</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Layers className="mb-2 h-8 w-8" />
            <CardTitle>Flooring</CardTitle>
            <CardDescription>
              Tile, wood, and laminate flooring installation
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/services?category=flooring" className="w-full">
              <Button className="w-full">View Services</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Zap className="mb-2 h-8 w-8" />
            <CardTitle>Electrical</CardTitle>
            <CardDescription>
              Electrical installations and repairs
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/services?category=electrical" className="w-full">
              <Button className="w-full">View Services</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
