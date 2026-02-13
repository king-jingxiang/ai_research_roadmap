import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart, Layers } from "lucide-react";

export const Home: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["index"],
    queryFn: api.fetchIndex,
  });

  if (isLoading) {
    return <div className="container py-10 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container py-10 text-center text-destructive">Failed to load index.</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl text-primary">
          AI Research Roadmap
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Visualize the technical evolution of Large Language Models and Benchmarks. 
          Trace the lineage of ideas from paper to paper.
        </p>
      </section>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Model Series</h2>
          </div>
          <div className="grid gap-4">
            {data?.series.map((series) => (
              <Card key={series.id} className="hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle>{series.name}</CardTitle>
                  <CardDescription>{series.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild>
                    <Link to={`/series/${series.id}`}>
                      Explore Evolution <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <BarChart className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Benchmarks</h2>
          </div>
          <div className="grid gap-4">
            {data?.benchmarks.map((benchmark) => (
              <Card key={benchmark.id} className="hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle>{benchmark.name}</CardTitle>
                  <CardDescription>{benchmark.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link to={`/series/${benchmark.id}`}>
                      Analyze Benchmark <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
