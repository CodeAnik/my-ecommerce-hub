import { Link, NavLink } from "react-router-dom";
import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/contact", label: "Contact" },
  { to: "/terms", label: "Terms" },
  { to: "/privacy", label: "Privacy" },
];

export function SiteHeader() {
  const { settings } = useStoreSettings();
  const { storeName, logoUrl, headerLayout } = settings.site;

  const Logo = (
    <Link to="/" className="flex items-center gap-2 shrink-0">
      {logoUrl ? <img src={logoUrl} alt={storeName} className="h-8 w-auto object-contain" /> : <div className="h-8 w-8 rounded-md gradient-primary flex items-center justify-center text-primary-foreground font-bold">{storeName.charAt(0)}</div>}
      <span className="font-semibold tracking-tight">{storeName}</span>
    </Link>
  );

  const Nav = (
    <nav className="flex items-center gap-1">
      {NAV.map(n => (
        <NavLink key={n.to} to={n.to} end className={({ isActive }) => cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors", isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
          {n.label}
        </NavLink>
      ))}
    </nav>
  );

  const Actions = (
    <div className="flex items-center gap-1">
      <Button size="icon" variant="ghost" className="h-9 w-9"><Search className="h-4 w-4" /></Button>
      <Button size="icon" variant="ghost" className="h-9 w-9" asChild><Link to="/login"><User className="h-4 w-4" /></Link></Button>
      <Button size="icon" variant="ghost" className="h-9 w-9 relative"><ShoppingBag className="h-4 w-4" /><span className="absolute top-1 right-1 h-4 w-4 text-[10px] font-bold rounded-full bg-primary text-primary-foreground flex items-center justify-center">2</span></Button>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {headerLayout === "centered" ? (
          <>
            <div className="flex-1">{Nav}</div>
            <div className="flex-shrink-0">{Logo}</div>
            <div className="flex-1 flex justify-end">{Actions}</div>
          </>
        ) : headerLayout === "left" ? (
          <>
            {Logo}
            <div className="ml-6">{Nav}</div>
            <div className="ml-auto">{Actions}</div>
          </>
        ) : (
          <>
            {Logo}
            <div className="hidden md:flex ml-auto">{Nav}</div>
            <div className="ml-auto md:ml-4">{Actions}</div>
          </>
        )}
      </div>
    </header>
  );
}
