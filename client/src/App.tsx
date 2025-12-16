import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Spaces from "@/pages/spaces";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Spaces is now the homepage */}
      <Route path="/" component={Spaces} />
      {/* Original landing page is now at /home */}
      <Route path="/subscribe" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
