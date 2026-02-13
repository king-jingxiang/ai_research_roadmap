import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, ThumbsUp } from "lucide-react";
import type { ModelDetail } from "@/types";

interface ModelCardProps {
  model: ModelDetail;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  // Mock stats since we don't have HF API integration yet
  const downloads = Math.floor(Math.random() * 100000);
  const likes = Math.floor(Math.random() * 5000);

  return (
    <Card className="w-full mb-4 hover:shadow-lg transition-shadow border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold truncate text-primary" title={model.model_id}>
          {model.model_id.split("/")[1] || model.model_id}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground truncate">
          {model.model_id}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            <span>{(downloads / 1000).toFixed(1)}k</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{likes}</span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
           {/* Mock tags */}
           <Badge variant="secondary" className="text-xs">Safetensors</Badge>
           <Badge variant="outline" className="text-xs">License: Apache 2.0</Badge>
        </div>
      </CardContent>
    </Card>
  );
};
