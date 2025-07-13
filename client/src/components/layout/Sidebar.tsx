import { useLocation } from "wouter";
import { Button } from "../ui/button";
import { cn } from "../../../../lib/utils";
import { LayoutDashboard, Plus, Settings } from "lucide-react";

export function Sidebar() {
  const [location, navigate] = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Register Server",
      path: "/register",
      icon: Plus,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-[hsl(223,7%,20%)] border-r border-[hsl(225,6%,23%)] min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Button
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full justify-start font-medium",
                    isActive 
                      ? "bg-[hsl(235,86%,65%)] text-white hover:bg-[hsl(235,86%,60%)]"
                      : "bg-transparent text-[hsl(210,11%,85%)] hover:text-white hover:bg-[hsl(225,6%,23%)]"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
