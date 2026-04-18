import { useState, useMemo } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockOrders, OrderStatus } from "@/data/mock-data";
import { Search, Eye, Printer, ChevronLeft, ChevronRight, Filter, X, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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

const allStatuses: OrderStatus[] = ["pending", "processing", "on-hold", "completed", "cancelled", "refunded"];
const paymentMethods = ["all", "Credit Card", "PayPal", "Bank Transfer"];
const dateRanges = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
];

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [orders, setOrders] = useState(mockOrders);
  const [showFilters, setShowFilters] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast.success(`Order status updated to "${newStatus}"`);
  };

  const filtered = useMemo(() => orders.filter(o => {
    if (activeTab !== "all" && o.status !== activeTab) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!(o.number.toLowerCase().includes(s) || (o.customer_name || "").toLowerCase().includes(s))) return false;
    }
    if (paymentFilter !== "all" && !o.payment_method_title.toLowerCase().includes(paymentFilter.toLowerCase())) return false;
    if (dateFilter !== "all") {
      const days = dateFilter === "today" ? 1 : dateFilter === "7d" ? 7 : 30;
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      if (new Date(o.date_created).getTime() < cutoff) return false;
    }
    const total = parseFloat(o.total);
    if (minTotal && total < parseFloat(minTotal)) return false;
    if (maxTotal && total > parseFloat(maxTotal)) return false;
    return true;
  }), [orders, activeTab, search, paymentFilter, dateFilter, minTotal, maxTotal]);

  const activeFilterCount = [
    paymentFilter !== "all", dateFilter !== "all", !!minTotal, !!maxTotal,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setPaymentFilter("all"); setDateFilter("all"); setMinTotal(""); setMaxTotal("");
  };

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
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by order # or customer..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Button
              variant={showFilters || activeFilterCount > 0 ? "default" : "outline"}
              size="sm"
              className="h-9 gap-1.5 shrink-0"
              onClick={() => setShowFilters(v => !v)}
            >
              <Filter className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-background text-foreground text-[10px] font-bold px-1">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Advanced Filter Bar */}
        {showFilters && (
          <div className="bg-card rounded-xl border shadow-card p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-primary" /> Advanced Filters
              </h3>
              <div className="flex gap-2">
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={resetFilters}>
                    <X className="h-3 w-3 mr-1" /> Clear
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowFilters(false)}>
                  Close
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Payment Method</label>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(p => (
                      <SelectItem key={p} value={p} className="text-xs capitalize">{p === "all" ? "All Methods" : p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Date Range
                </label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {dateRanges.map(d => (
                      <SelectItem key={d.value} value={d.value} className="text-xs">{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Min Total ($)</label>
                <Input type="number" placeholder="0" className="h-9 text-xs" value={minTotal} onChange={e => setMinTotal(e.target.value)} />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Max Total ($)</label>
                <Input type="number" placeholder="∞" className="h-9 text-xs" value={maxTotal} onChange={e => setMaxTotal(e.target.value)} />
              </div>
            </div>
          </div>
        )}

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
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground hidden md:table-cell">Date</th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground">Status</th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground hidden lg:table-cell">Payment</th>
                  <th className="px-3 py-3 text-right font-medium text-xs text-muted-foreground">Total</th>
                  <th className="px-3 py-3 text-right font-medium text-xs text-muted-foreground">Action</th>
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
                    <td className="px-3 py-3 text-muted-foreground text-xs hidden md:table-cell">{format(new Date(order.date_created), "MMM d, yyyy")}</td>
                    <td className="px-3 py-3">
                      <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v as OrderStatus)}>
                        <SelectTrigger className="h-7 w-[110px] text-[11px] border-dashed">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {allStatuses.map(s => (
                            <SelectItem key={s} value={s} className="text-xs capitalize">{s.replace("-", " ")}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground text-xs hidden lg:table-cell">{order.payment_method_title.split('(')[0].trim()}</td>
                    <td className="px-3 py-3 text-right font-semibold whitespace-nowrap">${order.total}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-[11px] gap-1"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          title="View Order"
                        >
                          <Eye className="h-3 w-3" />
                          <span className="hidden md:inline">View</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-[11px] gap-1"
                          onClick={() => navigate(`/admin/orders/${order.id}?invoice=1`)}
                          title="Print Invoice"
                        >
                          <Printer className="h-3 w-3" />
                          <span className="hidden md:inline">Invoice</span>
                        </Button>
                      </div>
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
