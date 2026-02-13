import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { Paper, ModelDetail } from "@/types";
import { cn } from "@/lib/utils";
import { Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimelineProps {
  papers: Paper[];
  models: ModelDetail[];
  onPaperSelect: (paper: Paper) => void;
  selectedPaperId?: string | null;
}

const TimelineNode = ({ paper, models, isSelected, onClick }: { paper: Paper; models: ModelDetail[]; isSelected: boolean; onClick: () => void }) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && nodeRef.current) {
      nodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isSelected]);

  const associatedModels = models.filter(m => m.papers.some(p => p.includes(paper.paperId.split(':')[1])));

  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative pl-8 pb-8 border-l-2 border-border last:border-0",
        isSelected && "border-primary"
      )}
    >
      <div 
        className={cn(
          "absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-muted-foreground transition-colors",
          isSelected ? "bg-primary border-primary scale-125" : "hover:border-primary"
        )}
        onClick={onClick}
      />
      
      <div 
        className={cn(
          "cursor-pointer group hover:bg-muted/50 p-4 rounded-lg transition-colors border border-transparent hover:border-border",
          isSelected && "bg-muted border-primary/50"
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{paper.year}</span>
          <span className="mx-1">•</span>
          <FileText className="w-3 h-3" />
          <span className="font-mono text-xs">{paper.paperId.replace('ARXIV:', '')}</span>
        </div>
        
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {paper.title}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {paper.abstract}
        </p>

        <div className="flex flex-wrap gap-2">
          {associatedModels.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {associatedModels.length} Models
            </Badge>
          )}
          <Badge variant="outline" className="text-xs font-mono">
            {paper.venue}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
};

export const TimelineComponent: React.FC<TimelineProps> = ({ papers, models, onPaperSelect, selectedPaperId }) => {
  // Sort papers by year descending (newest first)
  const sortedPapers = [...papers].sort((a, b) => b.year - a.year);

  // Group by year
  const groupedPapers = sortedPapers.reduce((acc, paper) => {
    const year = paper.year;
    if (!acc[year]) acc[year] = [];
    acc[year].push(paper);
    return acc;
  }, {} as Record<number, Paper[]>);

  const years = Object.keys(groupedPapers).map(Number).sort((a, b) => b - a);

  return (
    <div className="relative py-8 px-4 max-w-2xl mx-auto">
      {years.map(year => (
        <div key={year} className="mb-8">
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2 mb-4 border-b border-border/50">
            <h2 className="text-2xl font-bold text-primary">{year}</h2>
          </div>
          <div className="space-y-0">
            {groupedPapers[year].map(paper => (
              <TimelineNode
                key={paper.paperId}
                paper={paper}
                models={models}
                isSelected={selectedPaperId === paper.paperId || selectedPaperId === paper.paperId.replace('ARXIV:', '')}
                onClick={() => onPaperSelect(paper)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
