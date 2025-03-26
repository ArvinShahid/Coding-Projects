
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DevOps from "./pages/DevOps";
import ProjectManager from "./pages/ProjectManager";
import CodeEditorPage from "./pages/CodeEditorPage";
import HowItWorks from "./pages/HowItWorks";
import IdeaGenerator from "./pages/IdeaGenerator";
import DataAnalyzer from "./pages/DataAnalyzer";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/devops" element={<DevOps />} />
            <Route path="/project-manager" element={<ProjectManager />} />
            <Route path="/code-editor" element={<CodeEditorPage />} />
            <Route path="/idea-generator" element={<IdeaGenerator />} />
            <Route path="/data-analyzer" element={<DataAnalyzer />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
