import type { IndexData, SeriesData, Paper } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.BASE_URL;

export const api = {
  async fetchIndex(): Promise<IndexData> {
    const response = await fetch(`${API_BASE_URL}index.json`);
    if (!response.ok) throw new Error("Failed to fetch index");
    return response.json();
  },

  async fetchSeries(id: string): Promise<SeriesData> {
    const response = await fetch(`${API_BASE_URL}series/${id}.json`);
    if (!response.ok) throw new Error(`Failed to fetch series ${id}`);
    return response.json();
  },

  async fetchReport(id: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}reports/series/${id}.md`);
    if (!response.ok) throw new Error(`Failed to fetch report ${id}`);
    return response.text();
  },

  async fetchPaperDetails(paperIds: string[]): Promise<Paper[]> {
    // Extract ArXiv IDs from URLs
    // e.g. https://arxiv.org/abs/2309.00071 -> ARXIV:2309.00071
    const ids = paperIds.map(url => {
      const match = url.match(/arxiv\.org\/abs\/([\d.]+)/);
      return match ? `ARXIV:${match[1]}` : null;
    }).filter(Boolean) as string[];

    if (ids.length ===0) return [];

    // Semantic Scholar Batch API
    // POST https://api.semanticscholar.org/graph/v1/paper/batch
    const response = await fetch("https://api.semanticscholar.org/graph/v1/paper/batch?fields=title,year,abstract,authors,venue,url,citationCount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      console.error("Failed to fetch paper details from Semantic Scholar", await response.text());
      // Fallback: return dummy data based on IDs
      return ids.map(id => ({
        paperId: id,
        title: `Paper ${id}`,
        abstract: "Abstract not available (API Limit or Error)",
        year: parseInt(id.split(':')[1]?.substring(0, 2) || "23") + 2000,
        venue: "ArXiv",
        authors: [{ authorId: "1", name: "Unknown Author" }],
        url: `https://arxiv.org/abs/${id.split(':')[1]}`,
      }));
    }

    const data = await response.json();
    // Map response to Paper interface
    return data.map((item: any) => ({
      paperId: item.paperId,
      title: item.title,
      abstract: item.abstract,
      year: item.year,
      venue: item.venue || "ArXiv",
      authors: item.authors || [],
      url: item.url,
      citationCount: item.citationCount
    }));
  }
};
