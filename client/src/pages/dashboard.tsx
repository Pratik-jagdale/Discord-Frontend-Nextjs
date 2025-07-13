import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { ServerCard } from "../components/ServerCard";
import { Card, CardContent } from "../components/ui/card";
import { Loader2, Server as ServerIcon, CheckCircle, Wallet } from "lucide-react";
import type { Server } from "../../../shared/schema";

const DISCORD_BOT = process.env.NEXT_PUBLIC_DISCORD_BOT || "http://localhost:3001";


export default function DashboardPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const { data: serversData, isLoading: serversLoading } = useQuery<{ servers: Server[] }>({
    queryKey: [`${DISCORD_BOT}/api/servers`, user?.address],
    enabled: !!user?.address,
    queryFn: async ({ queryKey }) => {
      const response = await fetch(`${queryKey[0]}?userAddress=${queryKey[1]}`);
      if (!response.ok) {
        throw new Error("Failed to fetch servers");
      }
      return response.json();
    },
  });

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

  const servers = serversData?.servers || [];
  const activeServers = servers.length;
  const nftCollections = 5; // This would come from the auth context

  return (
    <div className="min-h-screen bg-[hsl(225,6%,13%)] text-white">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Your Discord Servers</h2>
            <p className="text-[hsl(210,11%,85%)]">Manage your registered Discord servers and their bot configurations</p>
          </div>

          {/* Server Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-[hsl(223,7%,20%)] border-[hsl(225,6%,23%)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[hsl(210,11%,85%)] text-sm">Total Servers</p>
                    <p className="text-2xl font-bold">{servers.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-[hsl(235,86%,65%)] rounded-lg flex items-center justify-center">
                    <ServerIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[hsl(223,7%,20%)] border-[hsl(225,6%,23%)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[hsl(210,11%,85%)] text-sm">Active Bots</p>
                    <p className="text-2xl font-bold">{activeServers}</p>
                  </div>
                  <div className="w-12 h-12 bg-[hsl(139,47%,42%)] rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[hsl(223,7%,20%)] border-[hsl(225,6%,23%)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[hsl(210,11%,85%)] text-sm">NFT Collections</p>
                    <p className="text-2xl font-bold">{nftCollections}</p>
                  </div>
                  <div className="w-12 h-12 bg-[hsl(38,95%,54%)] rounded-lg flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Server List */}
          <div className="space-y-4">
            {serversLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[hsl(235,86%,65%)]" />
                <p className="text-[hsl(210,11%,85%)]">Loading servers...</p>
              </div>
            ) : servers.length === 0 ? (
              <Card className="bg-[hsl(223,7%,20%)] border-[hsl(225,6%,23%)]">
                <CardContent className="p-8 text-center">
                  <ServerIcon className="w-12 h-12 mx-auto mb-4 text-[hsl(210,11%,85%)]" />
                  <h3 className="text-lg font-semibold mb-2">No servers registered</h3>
                  <p className="text-[hsl(210,11%,85%)] mb-4">Get started by registering your first Discord server</p>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-4 py-2 bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,60%)] text-white rounded-lg transition-colors"
                  >
                    Register Server
                  </button>
                </CardContent>
              </Card>
            ) : (
              servers.map((server) => (
                <ServerCard key={server.id} server={server} />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
