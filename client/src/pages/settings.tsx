import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { Loader2, RefreshCw, LogOut } from "lucide-react";

export default function SettingsPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated, user, isLoading, logout, refreshNFTCollections } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Successfully logged out",
        variant: "success",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRefreshNFTs = async () => {
    try {
      await refreshNFTCollections();
      toast({
        title: "Success",
        description: "NFT collections refreshed successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Refresh error:", error);
      toast({
        title: "Error",
        description: "Failed to refresh NFT collections. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(225,6%,13%)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[hsl(235,86%,65%)]" />
          <p className="text-[hsl(210,11%,85%)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(225,6%,13%)] text-white">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Settings</h2>
            <p className="text-[hsl(210,11%,85%)]">Manage your account and wallet settings</p>
          </div>

          <div className="space-y-6 max-w-2xl">
            <Card className="bg-[hsl(223,7%,20%)] border-[hsl(225,6%,23%)]">
              <CardHeader>
                <CardTitle className="text-white">Wallet Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(210,11%,85%)]">Connected Wallet</span>
                  <span className="font-mono text-sm text-white">{user?.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(210,11%,85%)]">Network</span>
                  <span className="text-sm text-white">Ethereum Mainnet</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(210,11%,85%)]">User Name</span>
                  <span className="text-sm text-white">{user?.name || "Unknown"}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[hsl(223,7%,20%)] border-[hsl(225,6%,23%)]">
              <CardHeader>
                <CardTitle className="text-white">Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleRefreshNFTs}
                  className="w-full justify-start bg-transparent hover:bg-[hsl(225,6%,23%)] text-[hsl(235,86%,65%)] border-none"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh NFT Collections
                </Button>
                <Button
                  onClick={handleLogout}
                  className="w-full justify-start bg-transparent hover:bg-[hsl(225,6%,23%)] text-[hsl(359,82%,59%)] border-none"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
