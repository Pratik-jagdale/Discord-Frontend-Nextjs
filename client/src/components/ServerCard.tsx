import React, {useState} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { UpdateServerModal } from "./modals/UpdateServerModal";
import { DeleteServerModal } from "./modals/DeleteServerModal";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../../../lib/queryClient";
import type { Server } from "../../../shared/schema";

const DISCORD_BOT = process.env.NEXT_PUBLIC_DISCORD_BOT || "http://localhost:3001";

interface ServerCardProps {
  server: Server;
}

export function ServerCard({ server }: ServerCardProps) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user, signMessage } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (data: { collectionId: string; nftId: string }) => {
      if (!user) throw new Error("User not authenticated");

      const message = `Delete Discord server ${server.serverId}`;
      const signature = await signMessage(message);

      const payload = {
        userAddress: user.address,
        signature,
        message,
        collectionId: data.collectionId,
        nftId: data.nftId,
      };

      const response = await apiRequest("DELETE", `${DISCORD_BOT}/api/servers/${server.serverId}`, payload);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Server deleted successfully!",
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: [`${DISCORD_BOT}/api/servers`, user?.address]
      });
      setShowDeleteModal(false);
    },
    onError: (error: any) => {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete server. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getServerInitial = (serverId: string) => {
    return serverId.charAt(0).toUpperCase();
  };

  return (
    <>
      <Card className="bg-[hsl(223,7%,20%)] border-[hsl(225,6%,23%)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[hsl(235,86%,65%)] rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {getServerInitial(server.serverId)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Server</h3>
                <p className="text-[hsl(210,11%,85%)] text-sm">Server ID: {server.serverId}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-[hsl(139,47%,42%)] bg-opacity-20 text-[hsl(139,47%,42%)] hover:bg-[hsl(139,47%,42%)] hover:bg-opacity-30">
                    Active
                  </Badge>
                  <span className="text-xs text-[hsl(210,11%,85%)]">
                    Collection: {server.collectionId} | NFT: {server.nftId}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowUpdateModal(true)}
                className="bg-transparent border border-[hsl(235,86%,65%)] text-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,65%)] hover:text-white"
              >
                Update Knowledge Base
              </Button>
              <Button
                onClick={() => setShowDeleteModal(true)}
                className="bg-transparent border border-[hsl(359,82%,59%)] text-[hsl(359,82%,59%)] hover:bg-[hsl(359,82%,59%)] hover:text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <UpdateServerModal
        server={server}
        open={showUpdateModal}
        onOpenChange={setShowUpdateModal}
      />

      <DeleteServerModal
        server={server}
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={(data) => deleteMutation.mutate(data)}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}

