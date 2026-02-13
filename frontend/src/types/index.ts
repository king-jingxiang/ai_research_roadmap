export interface Series {
  id: string;
  name: string;
  description: string;
  cover?: string;
}

export interface Benchmark {
  id: string;
  name: string;
  description: string;
  cover?: string;
}

export interface IndexData {
  series: Series[];
  benchmarks: Benchmark[];
}

export interface ModelDetail {
  model_id: string;
  papers: string[];
}

export interface SeriesData {
  repo_name: string;
  total_models_scanned: number;
  unique_papers: string[]; // These are URLs in the JSON, need to parse ID
  details: ModelDetail[];
}

export interface Paper {
  paperId: string;
  title: string;
  abstract: string;
  year: number;
  venue: string;
  authors: { authorId: string; name: string }[];
  url: string;
  citationCount?: number;
}
