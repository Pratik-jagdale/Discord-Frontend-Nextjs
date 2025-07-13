import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { Loader2, Info, CheckCircle, ExternalLink, Copy } from "lucide-react";
import { z } from "zod";
import { apiRequest } from "../../../lib/queryClient";

const DISCORD_BOT = process.env.NEXT_PUBLIC_DISCORD_BOT || "http://localhost:3001";

const registerServerSchema = z.object({
  serverId: z.string().min(1, "Server ID is required"),
  collectionId: z.string().min(1, "Collection ID is required"),
  nftId: z.string().min(1, "NFT ID is required"),
  agentAddress: z.string().min(1, "Agent Address is required"),
  agentID: z.string().min(1, "Agent ID is required")
});

type RegisterServerFormData = z.infer<typeof registerServerSchema>;

export default function RegisterServerPage() {
  const [, navigate] = useLocation();
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const { isAuthenticated, user, isLoading, signMessage } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const form = useForm<RegisterServerFormData>({
    resolver: zodResolver(registerServerSchema),
    defaultValues: {
      serverId: "",
      collectionId: "",
      nftId: "",
      agentAddress: "",
      agentID: ""
    },
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Invite link copied to clipboard",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterServerFormData) => {
      if (!user) throw new Error("User not authenticated");

      // Generate message and signature
      const message = `Register Discord server ${data.serverId} with collection ${data.collectionId} and NFT ${data.nftId}`;
      const signature = await signMessage(message);

      const payload = {
        serverId: data.serverId,
        userAddress: user.address,
        signature,
        message,
        collectionId: data.collectionId,
        nftId: data.nftId,
        agentAddress: data.agentAddress,
        agentID: data.agentID,
      };

      const response = await apiRequest("POST", `${DISCORD_BOT}/api/register`, payload);
      console.log("Registration response:", response);
      const result = await response.json();
      return result;

    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Server registered successfully!",
        variant: "success",
      });
      setInviteLink(data.inviteLink || null);
      queryClient.invalidateQueries({
        queryKey: [`${DISCORD_BOT}/api/servers`, user?.address]
      });
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to register server. Please try again.",
        variant: "destructive",
      });
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

  return (
    <div className="min-h-screen bg-[hsl(225,6%,13%)] text-white">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 text-white">Register New Server</h2>
              <p className="text-[hsl(210,11%,85%)] text-lg">Connect your Discord server with your NFT collection</p>
            </div>

            {/* Enhanced invite link display */}
            {inviteLink && (
              <Card className="mb-6 bg-gradient-to-r from-green-900/20 to-green-800/20 border-green-700/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-green-100 mb-2">
                        Server Registered Successfully!
                      </h3>
                      <p className="text-green-200 mb-4 text-sm">
                        Your Discord server has been registered. Use the invite link below to add the bot to your server.
                      </p>
                      
                      <div className="bg-[hsl(225,6%,23%)] rounded-lg p-4 border border-green-700/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-100">Discord Bot Invite Link</span>
                          <Button
                            onClick={() => copyToClipboard(inviteLink)}
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 border-green-700/50 text-green-100 hover:bg-green-800/20 hover:border-green-600"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2 bg-[hsl(225,6%,18%)] rounded px-3 py-2">
                          <code className="text-green-100 text-sm flex-1 truncate">
                            {inviteLink}
                          </code>
                          <a
                            href={inviteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 flex-shrink-0"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-[hsl(223,7%,20%)] border-[hsl(225,6%,23%)] shadow-xl">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="serverId"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-base font-medium">Discord Server ID</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                placeholder="Enter your Discord server ID"
                                className="bg-[hsl(225,6%,23%)] border-[hsl(225,6%,30%)] text-white placeholder-[hsl(210,11%,70%)] h-12 text-base focus:border-[hsl(235,86%,65%)] focus:ring-1 focus:ring-[hsl(235,86%,65%)]"
                              />
                            </FormControl>
                            <FormDescription className="text-[hsl(210,11%,75%)] text-sm">
                              Need help finding your server ID? {" "}
                              <a href="#" className="text-[hsl(235,86%,65%)] hover:underline font-medium">Learn how</a>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="collectionId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">NFT Collection</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                placeholder="Enter your NFT Collection ID"
                                className="bg-[hsl(225,6%,23%)] border-[hsl(225,6%,30%)] text-white placeholder-[hsl(210,11%,70%)] h-12 text-base focus:border-[hsl(235,86%,65%)] focus:ring-1 focus:ring-[hsl(235,86%,65%)]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nftId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">NFT ID</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                placeholder="Enter your NFT ID"
                                className="bg-[hsl(225,6%,23%)] border-[hsl(225,6%,30%)] text-white placeholder-[hsl(210,11%,70%)] h-12 text-base focus:border-[hsl(235,86%,65%)] focus:ring-1 focus:ring-[hsl(235,86%,65%)]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    

                    <FormField
                        control={form.control}
                        name="agentAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Agent Collection ID</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                placeholder="Enter your Agent Collection ID"
                                className="bg-[hsl(225,6%,23%)] border-[hsl(225,6%,30%)] text-white placeholder-[hsl(210,11%,70%)] h-12 text-base focus:border-[hsl(235,86%,65%)] focus:ring-1 focus:ring-[hsl(235,86%,65%)]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="agentID"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Agent ID</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                placeholder="Enter your Agent ID"
                                className="bg-[hsl(225,6%,23%)] border-[hsl(225,6%,30%)] text-white placeholder-[hsl(210,11%,70%)] h-12 text-base focus:border-[hsl(235,86%,65%)] focus:ring-1 focus:ring-[hsl(235,86%,65%)]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Card className="bg-[hsl(225,6%,16%)] border-[hsl(225,6%,28%)] shadow-inner">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Info className="w-6 h-6 text-[hsl(235,86%,65%)] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-base font-semibold text-white mb-3">Registration Requirements</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-[hsl(235,86%,65%)] rounded-full"></div>
                                <span className="text-sm text-[hsl(210,11%,85%)]">Own the selected NFT in your wallet</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-[hsl(235,86%,65%)] rounded-full"></div>
                                <span className="text-sm text-[hsl(210,11%,85%)]">Have admin permissions in Discord</span>
                              </div>
                              <div className="flex items-center space-x-2 md:col-span-2">
                                <div className="w-2 h-2 bg-[hsl(235,86%,65%)] rounded-full"></div>
                                <span className="text-sm text-[hsl(210,11%,85%)]">Registration creates a unique API key for your server</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                      <Button 
                        type="submit"
                        className="w-full sm:w-auto bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,60%)] text-white px-8 py-3 text-base font-medium shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Registering...
                          </>
                        ) : (
                          "Register Server"
                        )}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/dashboard")}
                        className="w-full sm:w-auto border-[hsl(225,6%,30%)] text-[hsl(210,11%,85%)] hover:text-white hover:bg-[hsl(225,6%,25%)] hover:border-[hsl(210,11%,85%)] px-8 py-3 text-base transition-all duration-200"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}