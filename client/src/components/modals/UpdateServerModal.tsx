import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../../../lib/queryClient";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import type { Server } from "../../../../shared/schema";

const DISCORD_BOT = process.env.NEXT_PUBLIC_DISCORD_BOT || "http://localhost:3001";

const updateServerSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
});

type UpdateServerFormData = z.infer<typeof updateServerSchema>;

interface UpdateServerModalProps {
  server: Server;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateServerModal({ server, open, onOpenChange }: UpdateServerModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UpdateServerFormData>({
    resolver: zodResolver(updateServerSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateServerFormData) => {
      if (!user) throw new Error("User not authenticated");

      const payload = {
        prompt: data.prompt,
      };

      const response = await apiRequest("POST", `${DISCORD_BOT}/api/servers/${server.serverId}`, payload);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Knowledge Base updated successfully!",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["${DISCORD_BOT}/api/servers"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update Knowledge Base. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(223,7%,20%)] border-[hsl(225,6%,23%)] text-white">
        <DialogHeader>
          <DialogTitle>Update Knowledge Base </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))} className="space-y-4">
             <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Write Prompt For KB</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Enter prompt"
                      {...field}
                      rows={6} // You can change this to make it taller or shorter
                      className="w-full p-3 bg-[hsl(225,6%,23%)] border-[hsl(225,6%,23%)] text-white rounded-md resize-y"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-3 pt-4">
              <Button
                type="submit"
                className="bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,60%)] text-white"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Knowledge Base"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-[hsl(225,6%,23%)] text-[hsl(210,11%,85%)] hover:text-white hover:border-[hsl(210,11%,85%)]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
