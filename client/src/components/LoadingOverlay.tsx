import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "Processing your request..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[hsl(223,7%,20%)] border border-[hsl(225,6%,23%)] rounded-xl p-6 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-[hsl(235,86%,65%)] mx-auto mb-4" />
        <p className="text-[hsl(210,11%,85%)]">{message}</p>
      </div>
    </div>
  );
}
