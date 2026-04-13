import { useAuth } from "@/contexts/AuthContext";
import { Moon, Sun, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "./NotificationCenter";

interface DashboardHeaderProps {
  title: string;
  breadcrumb?: string[];
}

export function DashboardHeader({ title, breadcrumb }: DashboardHeaderProps) {
  const { customer, isDarkMode, toggleDarkMode } = useAuth();

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-lg sticky top-0 z-20 flex items-center justify-between px-4 lg:px-6">
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                <span>{item}</span>
              </span>
            ))}
          </div>
        )}
        <h1 className="text-lg font-bold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9 text-muted-foreground hover:text-foreground">
          <Search className="h-4 w-4" />
        </Button>
        <NotificationCenter />
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={toggleDarkMode}>
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        {customer && (
          <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground ml-1">
            {customer.first_name[0]}{customer.last_name[0]}
          </div>
        )}
      </div>
    </header>
  );
}
