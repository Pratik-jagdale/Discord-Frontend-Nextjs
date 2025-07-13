import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import type { Server } from "../../../../shared/schema";

const deleteServerSchema = z.object({
  collectionId: z.string().min(1, "Collection ID is required"),
  nftId: z.string().min(1, "NFT ID is required"),
});

type DeleteServerFormData = z.infer<typeof deleteServerSchema>;

interface DeleteServerModalProps {
  server: Server;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: DeleteServerFormData) => void;
  isLoading: boolean;
}

export function DeleteServerModal({ server, open, onOpenChange, onConfirm, isLoading }: DeleteServerModalProps) {
  const { nftCollections } = useAuth();

  const form = useForm<DeleteServerFormData>({
    resolver: zodResolver(deleteServerSchema),
    defaultValues: {
      collectionId: server.collectionId,
      nftId: server.nftId,
    },
  });

  const selectedCollection = nftCollections.find(
    (collection) => collection.id === form.watch("collectionId")
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(223,7%,20%)] border-[hsl(225,6%,23%)] text-white">
        <DialogHeader>
          <DialogTitle>Delete Server</DialogTitle>
        </DialogHeader>
        
        <p className="text-[hsl(210,11%,85%)] mb-6">
          Are you sure you want to delete this server registration? This action cannot be undone.
          Please verify your NFT ownership to confirm deletion.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onConfirm)} className="space-y-4">
            <FormField
              control={form.control}
              name="collectionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFT Collection</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[hsl(225,6%,23%)] border-[hsl(225,6%,23%)] text-white">
                        <SelectValue placeholder="Select a collection..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[hsl(223,7%,20%)] border-[hsl(225,6%,23%)]">
                      {nftCollections.map((collection) => (
                        <SelectItem key={collection.id} value={collection.id} className="text-white">
                          {collection.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nftId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFT ID</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[hsl(225,6%,23%)] border-[hsl(225,6%,23%)] text-white">
                        <SelectValue placeholder="Select an NFT..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[hsl(223,7%,20%)] border-[hsl(225,6%,23%)]">
                      {selectedCollection?.nfts.map((nft) => (
                        <SelectItem key={nft.id} value={nft.id} className="text-white">
                          {nft.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-3 pt-4">
              <Button
                type="submit"
                className="bg-[hsl(359,82%,59%)] hover:bg-[hsl(359,82%,54%)] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
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
