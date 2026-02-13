import { Routes, Route, Link } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Dashboard } from "@/pages/Dashboard";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-background font-sans antialiased">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center px-4">
              <div className="mr-4 hidden md:flex">
                <Link to="/" className="mr-6 flex items-center space-x-2">
                  <span className="hidden font-bold sm:inline-block">
                    AI Research Roadmap
                  </span>
                </Link>
              </div>
              <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <div className="w-full flex-1 md:w-auto md:flex-none">
                  {/* Search could go here */}
                </div>
                <nav className="flex items-center gap-2">
                  <ModeToggle />
                  <Button variant="ghost" size="icon" asChild>
                    <a href="https://github.com/king-jingxiang/ai_research_roadmap" target="_blank" rel="noreferrer">
                      <Github className="h-4 w-4" />
                      <span className="sr-only">GitHub</span>
                    </a>
                  </Button>
                </nav>
              </div>
            </div>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/series/:id" element={<Dashboard />} />
              <Route path="/benchmark/:id" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
