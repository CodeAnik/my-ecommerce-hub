import { useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockOrders, OrderStatus } from "@/data/mock-data";
import { Search, Eye, MoreHorizontal, Printer, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const tabs = [
  { label: "All", value: "all" },
  { label: "Processing", value: "processing" },
  { label: "Pending", value: "pending" },
  { label: "On Hold", value: "on-hold" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
];

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = mockOrders.filter(o => {
    if (activeTab !== "all" && o.status !== activeTab) return false;
    if (search) {
      const s = search.toLowerCase();
      return o.number.toLowerCase().includes(s) || (o.customer_name || "").toLowerCase().includes(s);
    }
    return true;
  });

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelected(prev => prev.length === filtered.length ? [] : filtered.map(o => o.id));
  };

  return (
    <>
      <DashboardHeader title="Order Management" breadcrumb={["Admin", "Orders"]} />
      <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "All Orders", value: mockOrders.length, color: "text-foreground" },
            { label: "Processing", value: mockOrders.filter(o => o.status === "processing").length, color: "text-info" },
            { label: "Pending", value: mockOrders.filter(o => o.status === "pending").length, color: "text-warning" },
            { label: "Completed", value: mockOrders.filter(o => o.status === "completed").length, color: "text-success" },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-xl border p-4 shadow-card text-center">
              <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {tabs.map(tab => (
              <button key={tab.value} onClick={() => setActiveTab(tab.value)}
                className={cn("px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                  activeTab === tab.value ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground")}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by order # or customer..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Bulk actions */}
        {selected.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm font-medium">{selected.length} order{selected.length > 1 ? 's' : ''} selected</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs" onClick={() => { toast.success("Marked as completed"); setSelected([]); }}>
                Mark Completed
              </Button>
              <Button size="sm" variant="outline" className="text-xs" onClick={() => setSelected([])}>Clear</Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-card rounded-xl border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-left w-10">
                    <input type="checkbox" className="rounded border-border" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} />
                  </th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground">Order</th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground hidden sm:table-cell">Customer</th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground">Date</th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground">Status</th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground hidden md:table-cell">Payment</th>
                  <th className="px-3 py-3 text-right font-medium text-xs text-muted-foreground">Total</th>
                  <th className="px-3 py-3 text-right font-medium text-xs text-muted-foreground w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id} className={cn("border-b last:border-0 hover:bg-muted/20 transition-colors", selected.includes(order.id) && "bg-primary/5")}>
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded border-border" checked={selected.includes(order.id)} onChange={() => toggleSelect(order.id)} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {order.line_items.slice(0, 2).map(item => (
                            <div key={item.id} className="h-7 w-7 rounded border-2 border-card bg-muted overflow-hidden">
                              <img src={item.image} alt="" className="h-full w-full object-cover" />
                            </div>
                          ))}
                        </div>
                        <div>
                          <span className="font-semibold">{order.number}</span>
                          <p className="text-[11px] text-muted-foreground sm:hidden">{order.customer_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <span className="text-muted-foreground">{order.customer_name || "Guest"}</span>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground text-xs">{format(new Date(order.date_created), "MMM d, yyyy")}</td>
                    <td className="px-3 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-3 py-3 text-muted-foreground text-xs hidden md:table-cell">{order.payment_method_title.split('(')[0].trim()}</td>
                    <td className="px-3 py-3 text-right font-semibold">${order.total}</td>
                    <td className="px-3 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="h-3.5 w-3.5 mr-2" /> View Details</DropdownMenuItem>
                          <DropdownMenuItem><Printer className="h-3.5 w-3.5 mr-2" /> Print Invoice</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t">
            <p className="text-xs text-muted-foreground">Showing {filtered.length} of {mockOrders.length} orders</p>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled><ChevronLeft className="h-4 w-4" /></Button>
              <Button size="icon" className="h-8 w-8 gradient-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
