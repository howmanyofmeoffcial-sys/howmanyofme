import Canonical from "./Canonical";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ScrollToTop from "@/components/ScrollToTop";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LetterDirectory = lazy(() => import("./pages/LetterDirectory"));
const NameDetail = lazy(() => import("./pages/NameDetail"));
const ToolsPage = lazy(() => import("./pages/ToolsPage"));
const RandomNameGenerator = lazy(() => import("./pages/tools/RandomNameGenerator"));
const PopularityChecker = lazy(() => import("./pages/tools/PopularityChecker"));
const BabyNames = lazy(() => import("./pages/tools/BabyNames"));
const UsernameGenerator = lazy(() => import("./pages/tools/UsernameGenerator"));
const NameComparison = lazy(() => import("./pages/tools/NameComparison"));
const TrendVisualizer = lazy(() => import("./pages/tools/TrendVisualizer"));
const UniqueNameGenerator = lazy(() => import("./pages/tools/UniqueNameGenerator"));
const PopularityGuide = lazy(() => import("./pages/tools/PopularityGuide"));
const MeaningLookup = lazy(() => import("./pages/tools/MeaningLookup"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const About = lazy(() => import("./pages/About"));
const Methodology = lazy(() => import("./pages/Methodology"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
        <BrowserRouter>
  <Canonical />
  <ScrollToTop />
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/names/:letter" element={<LetterDirectory />} />
      <Route path="/name/:name" element={<NameDetail />} />
      <Route path="/tools" element={<ToolsPage />} />
      <Route path="/tools/random-name" element={<RandomNameGenerator />} />
      <Route path="/tools/popularity-checker" element={<PopularityChecker />} />
      <Route path="/tools/baby-names" element={<BabyNames />} />
      <Route path="/tools/username-generator" element={<UsernameGenerator />} />
      <Route path="/tools/name-comparison" element={<NameComparison />} />
      <Route path="/tools/trend-visualizer" element={<TrendVisualizer />} />
      <Route path="/tools/unique-name-generator" element={<UniqueNameGenerator />} />
      <Route path="/tools/popularity-guide" element={<PopularityGuide />} />
      <Route path="/tools/meaning" element={<MeaningLookup />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<BlogArticle />} />
      <Route path="/about" element={<About />} />
      <Route path="/methodology" element={<Methodology />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/disclaimer" element={<Disclaimer />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
</BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
