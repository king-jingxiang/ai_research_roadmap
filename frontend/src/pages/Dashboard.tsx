import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { TimelineComponent } from "@/components/timeline/TimelineComponent";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Paper } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelCard } from "@/components/ModelCard";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Dashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [highlightedPaperId, setHighlightedPaperId] = useState<string | null>(null);

  // Fetch Series Data
  const { data: seriesData, isLoading: isSeriesLoading, error: seriesError } = useQuery({
    queryKey: ["series", id],
    queryFn: () => api.fetchSeries(id!),
    enabled: !!id,
  });

  // Fetch Report
  const { data: reportContent, isLoading: isReportLoading } = useQuery({
    queryKey: ["report", id],
    queryFn: () => api.fetchReport(id!),
    enabled: !!id,
  });

  // Fetch Papers
  const { data: papers, isLoading: isPapersLoading } = useQuery({
    queryKey: ["papers", seriesData?.unique_papers],
    queryFn: () => api.fetchPaperDetails(seriesData!.unique_papers),
    enabled: !!seriesData,
  });

  const handleCitationClick = (citationId: string) => {
    // citationId matches ArXiv ID e.g. 2309.00071
    // Timeline expects just the ID or ARXIV:ID
    setHighlightedPaperId(citationId);
    
    // Also find the paper and select it?
    // Maybe just highlight/scroll.
  };

  const handlePaperSelect = (paper: Paper) => {
    setSelectedPaper(paper);
    setHighlightedPaperId(paper.paperId);
  };

  if (isSeriesLoading || isReportLoading || isPapersLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (seriesError || !seriesData) {
    return <div className="p-8 text-center text-destructive">Failed to load series data</div>;
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden flex">
       {/* Left Panel: Report */}
       <div className="w-5/12 h-full border-r border-border hidden md:block">
          <ScrollArea className="h-full p-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-2 text-primary">{seriesData.repo_name} Evolution</h1>
              <p className="text-muted-foreground mb-8">
                {seriesData.total_models_scanned} Models • {seriesData.unique_papers.length} Papers
              </p>
              
              {reportContent ? (
                <MarkdownRenderer 
                  content={reportContent} 
                  onCitationClick={handleCitationClick} 
                />
              ) : (
                <div className="text-muted-foreground italic">No analysis report available.</div>
              )}
            </div>
          </ScrollArea>
       </div>
        
        {/* Right Panel: Timeline */}
        <div className="w-full md:w-7/12 h-full bg-muted/10">
          <ScrollArea className="h-full">
            <TimelineComponent 
              papers={papers || []} 
              models={seriesData.details}
              onPaperSelect={handlePaperSelect}
              selectedPaperId={highlightedPaperId}
            />
          </ScrollArea>
        </div>

      {/* Paper Detail Sheet/Drawer */}
      <Sheet open={!!selectedPaper} onOpenChange={(open) => !open && setSelectedPaper(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedPaper?.title}</SheetTitle>
            <SheetDescription>
              {selectedPaper?.authors.map(a => a.name).join(", ")} • {selectedPaper?.year} • {selectedPaper?.venue}
            </SheetDescription>
          </SheetHeader>
          
          <Tabs defaultValue="summary" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="full">Full Paper</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-4">
              <div className="prose dark:prose-invert text-sm">
                <p>{selectedPaper?.abstract}</p>
                <div className="mt-4">
                  <a 
                    href={selectedPaper?.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    Read on ArXiv ↗
                  </a>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="models" className="mt-4">
              <div className="space-y-4">
                {selectedPaper && seriesData.details
                  .filter(m => m.papers.some(p => p.includes(selectedPaper.paperId.replace("ARXIV:", ""))))
                  .map(model => (
                    <ModelCard key={model.model_id} model={model} />
                  ))
                }
                {selectedPaper && seriesData.details.filter(m => m.papers.some(p => p.includes(selectedPaper.paperId.replace("ARXIV:", "")))).length === 0 && (
                  <div className="text-muted-foreground text-center py-8">No specific models linked to this paper in registry.</div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="full" className="mt-4">
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="text-muted-foreground">Full paper content rendering is not yet implemented (PaddleOCR integration required).</p>
                <Button className="mt-4" variant="outline" asChild>
                  <a href={selectedPaper?.url} target="_blank" rel="noreferrer">View Original PDF</a>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
};
