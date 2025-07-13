import React from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./client/src/components/ui/toaster";
import { AuthProvider } from "./client/src/contexts/AuthContext";
import LoginPage from "./client/src/pages/login";
import DashboardPage from "./client/src/pages/dashboard";
import RegisterServerPage from "./client/src/pages/register-server";
import SettingsPage from "./client/src/pages/settings";
import NotFound from "./client/src/pages/not-found";

function Router() {
  return (
    <Switch children={[
      <Route path="/" component={LoginPage} />,
      <Route path="/dashboard" component={DashboardPage} />,
      <Route path="/register" component={RegisterServerPage} />,
      <Route path="/settings" component={SettingsPage} />,
      <Route component={NotFound} />
    ]} />
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider children={
        <div className="dark min-h-screen bg-background text-foreground">
          <Toaster />
          <Router />
        </div>
      } />
    </QueryClientProvider>
  );
}

export default App;
