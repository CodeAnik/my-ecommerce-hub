import { useAuth } from "@/contexts/AuthContext";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ShoppingBag, CheckCircle2, Clock, Heart, ArrowRight,
  Package, MapPin, Gift, Star, TrendingUp, CreditCard, Sparkles,
} from "lucide-react";
import { mockOrders, mockWishlist, mockRecommended, mockRecentlyViewed } from "@/data/mock-data";
import { format } from "date-fns";

export default function DashboardHome() {
  const { customer } = useAuth();
  const totalOrders = mockOrders.length;
  const completedOrders = mockOrders.filter(o => o.status === "completed").length;
  const pendingOrders = mockOrders.filter(o => ["processing", "pending", "on-hold"].includes(o.status)).length;
  const latestOrder = mockOrders[0];

  const completionItems = [
    { label: "Profile photo", done: false },
    { label: "Billing address", done: true },
    { label: "Shipping address", done: true },
    { label: "Phone number", done: true },
    { label: "Email verified", done: true },
  ];
  const completionPct = Math.round((completionItems.filter(i => i.done).length / completionItems.length) * 100);

  return (
    <>
      <DashboardHeader title="Dashboard" breadcrumb={["Home", "Dashboard"]} />
      <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
        {/* Welcome */}
        <div className="bg-card rounded-xl border p-6 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Welcome back, {customer?.first_name}! 👋</h2>
              <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your account today.</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm"><Link to="/dashboard/orders">View Orders</Link></Button>
              <Button asChild variant="outline" size="sm"><Link to="/dashboard/account">Edit Profile</Link></Button>
              <Button size="sm" className="gradient-primary text-primary-foreground" asChild>
                <a href="#" /* Replace with WooCommerce shop URL */>Continue Shopping</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Orders" value={totalOrders} icon={ShoppingBag} trend="+2 this month" trendUp />
          <StatCard title="Completed" value={completedOrders} icon={CheckCircle2} />
          <StatCard title="Pending" value={pendingOrders} icon={Clock} />
          <StatCard title="Wishlist" value={mockWishlist.length} icon={Heart} />
        </div>

        {/* Completion + Credits Row */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Account completion */}
          <div className="bg-card rounded-xl border p-5 shadow-card">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Account Completion</h3>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{completionPct}% complete</span>
              <span>{completionItems.filter(i => i.done).length}/{completionItems.length}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
              <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${completionPct}%` }} />
            </div>
            <div className="space-y-2">
              {completionItems.map(item => (
                <div key={item.label} className="flex items-center gap-2 text-xs">
                  <div className={`h-4 w-4 rounded-full flex items-center justify-center ${item.done ? "bg-success text-success-foreground" : "bg-muted"}`}>
                    {item.done && <CheckCircle2 className="h-3 w-3" />}
                  </div>
                  <span className={item.done ? "text-muted-foreground line-through" : "text-foreground"}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Store credit & rewards */}
          <div className="bg-card rounded-xl border p-5 shadow-card space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Gift className="h-4 w-4 text-primary" /> Rewards & Credits</h3>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Store Credit</span>
              </div>
              <span className="text-sm font-bold">${customer?.store_credit?.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-warning" />
                <span className="text-sm">Reward Points</span>
              </div>
              <span className="text-sm font-bold">{customer?.reward_points?.toLocaleString()} pts</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm">Member Since</span>
              </div>
              <span className="text-sm font-bold">{customer?.date_created ? format(new Date(customer.date_created), "MMM yyyy") : "—"}</span>
            </div>
          </div>

          {/* Saved addresses summary */}
          <div className="bg-card rounded-xl border p-5 shadow-card">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Saved Addresses</h3>
            {[{ label: "Billing", addr: customer?.billing }, { label: "Shipping", addr: customer?.shipping }].map(a => (
              <div key={a.label} className="p-3 rounded-lg bg-muted mb-2 last:mb-0">
                <p className="text-xs font-semibold text-muted-foreground mb-1">{a.label}</p>
                <p className="text-sm">{a.addr?.address_1}, {a.addr?.city}, {a.addr?.state} {a.addr?.postcode}</p>
              </div>
            ))}
            <Button asChild variant="outline" size="sm" className="w-full mt-3"><Link to="/dashboard/addresses">Manage Addresses</Link></Button>
          </div>
        </div>

        {/* Latest order timeline */}
        {latestOrder && (
          <div className="bg-card rounded-xl border p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Package className="h-4 w-4 text-primary" /> Latest Order {latestOrder.number}</h3>
              <StatusBadge status={latestOrder.status} />
            </div>
            <div className="relative pl-6 space-y-4">
              {latestOrder.timeline.map((event, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-6 top-0.5 h-3 w-3 rounded-full border-2 ${i === 0 ? "bg-primary border-primary" : "bg-card border-border"}`} />
                  {i < latestOrder.timeline.length - 1 && (
                    <div className="absolute -left-[18px] top-4 w-0.5 h-full bg-border" />
                  )}
                  <p className="text-sm font-medium">{event.status}</p>
                  <p className="text-xs text-muted-foreground">{event.note}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(event.date), "MMM d, yyyy 'at' h:mm a")}</p>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link to={`/dashboard/orders/${latestOrder.id}`}>View Order Details <ArrowRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </div>
        )}

        {/* Recently Viewed */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Recently Viewed</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {mockRecentlyViewed.map(p => (
              <div key={p.id} className="bg-card rounded-xl border shadow-card overflow-hidden group hover:shadow-elevated transition-all">
                <div className="aspect-square bg-muted overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="text-xs text-muted-foreground">{p.rating}</span>
                  </div>
                  <p className="text-sm font-bold mt-1">${p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Recommended for You</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {mockRecommended.map(p => (
              <div key={p.id} className="bg-card rounded-xl border shadow-card overflow-hidden group hover:shadow-elevated transition-all">
                <div className="aspect-square bg-muted overflow-hidden relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {p.sale_price && (
                    <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">SALE</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold">${p.price}</span>
                    {p.sale_price && <span className="text-xs text-muted-foreground line-through">${p.regular_price}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
