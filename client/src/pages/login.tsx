import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await login();
      toast({
        title: "Success",
        description: "Successfully logged in!",
        variant: "success",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(225,6%,13%)] to-[hsl(223,7%,20%)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[hsl(235,86%,65%)]" />
          <p className="text-[hsl(210,11%,85%)]">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(225,6%,13%)] to-[hsl(223,7%,20%)]">
      <Card className="w-full max-w-md mx-4 bg-[hsl(223,7%,20%)] border-[hsl(225,6%,23%)] shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[hsl(235,86%,65%)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.375-.445.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-white">SkynetAI Bot Manager</h1>
            <p className="text-[hsl(210,11%,85%)] text-sm">Connect your wallet and manage your Discord bots</p>
          </div>
          
          <Button 
            onClick={handleLogin}
            className="w-full bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,60%)] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
          
          <div className="mt-6 text-center text-xs text-[hsl(210,11%,85%)]">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
