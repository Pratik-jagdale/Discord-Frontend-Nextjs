import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { LogOut, Wallet } from "lucide-react";

export function Header() {
  const { user, getBalance, logout } = useAuth();
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const bal = await getBalance();
        setBalance(bal);
      } catch (err) {
        console.error("Failed to fetch wallet balance", err);
      }
    };

    fetchBalance();
  }, [getBalance]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-[hsl(223,7%,20%)] border-b border-[hsl(225,6%,23%)] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[hsl(235,86%,65%)] rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.375-.445.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">SkynetAI Bot Manager</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Wallet balance with icon */}
          {balance && (
            <div className="flex items-center space-x-1 text-white text-sm">
              <Wallet className="w-4 h-4 text-[hsl(235,86%,65%)]" />
              <span>{balance} ETH</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[hsl(235,86%,65%)] rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">{user?.name || "Unknown User"}</p>
              <p className="text-xs text-[hsl(210,11%,85%)]">
                {user?.address ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : ""}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            size="sm"
            variant="ghost"
            className="text-[hsl(210,11%,85%)] hover:text-white"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
