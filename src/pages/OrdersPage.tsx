import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockOrders, OrderStatus } from "@/data/mock-data";
import { ShoppingBag, Search, Eye, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const tabs: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = mockOrders.filter(o => {
    if (activeTab !== "all" && o.status !== activeTab) return false;
    if (search && !o.number.toLowerCase().includes(search.toLowerCase()) && !o.line_items.some(i => i.name.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  return (
    <>
      <DashboardHeader title="My Orders" breadcrumb={["Dashboard", "Orders"]} />
      <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
        {/* Search + Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                  activeTab === tab.value
                    ? "gradient-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search orders..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="No orders found" description="You haven't placed any orders yet or no orders match your filter." actionLabel="Continue Shopping" onAction={() => {}} />
        ) : (
          <div className="space-y-3">
            {filtered.map(order => (
              <div key={order.id} className="bg-card rounded-xl border shadow-card p-4 hover:shadow-elevated transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Product thumbnails */}
                  <div className="flex -space-x-2">
                    {order.line_items.slice(0, 3).map(item => (
                      <div key={item.id} className="h-10 w-10 rounded-lg border-2 border-card bg-muted overflow-hidden">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                    ))}
                    {order.line_items.length > 3 && (
                      <div className="h-10 w-10 rounded-lg border-2 border-card bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                        +{order.line_items.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold">{order.number}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(order.date_created), "MMM d, yyyy")} · {order.line_items.length} item{order.line_items.length > 1 ? "s" : ""} · {order.payment_method_title}
                    </p>
                  </div>

                  {/* Total + Actions */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">${order.total}</span>
                    <div className="flex gap-1.5">
                      <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                        <Link to={`/dashboard/orders/${order.id}`}><Eye className="h-3 w-3 mr-1" /> View</Link>
                      </Button>
                      {order.status === "completed" && (
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          <RotateCcw className="h-3 w-3 mr-1" /> Buy Again
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">Showing {filtered.length} of {mockOrders.length} orders</p>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled><ChevronLeft className="h-4 w-4" /></Button>
              <Button size="icon" className="h-8 w-8 gradient-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
