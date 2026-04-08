import { useAuth } from "@/contexts/AuthContext";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DollarSign, ShoppingBag, Users, Package, TrendingUp, TrendingDown,
  ArrowRight, Eye, AlertTriangle,
} from "lucide-react";
import { mockOrders, mockStoreProducts, mockRevenueData, mockTopCustomers } from "@/data/mock-data";
import { format } from "date-fns";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function AdminHome() {
  const { customer } = useAuth();
  const totalRevenue = mockOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
  const processingOrders = mockOrders.filter(o => o.status === "processing").length;
  const pendingOrders = mockOrders.filter(o => o.status === "pending").length;
  const lowStock = mockStoreProducts.filter(p => (p.stock_quantity ?? 0) <= 5 && p.stock_status !== "outofstock").length;
  const outOfStock = mockStoreProducts.filter(p => p.stock_status === "outofstock").length;

  return (
    <>
      <DashboardHeader title="Store Overview" breadcrumb={["Admin", "Overview"]} />
      <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
        {/* Welcome */}
        <div className="gradient-hero rounded-xl p-6 text-primary-foreground">
          <h2 className="text-xl font-bold">Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {customer?.first_name}! 🏪</h2>
          <p className="text-sm text-primary-foreground/70 mt-1">Here's how your store is performing today.</p>
          <div className="flex gap-2 mt-4">
            <Button asChild size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20 border">
              <Link to="/admin/orders">View Orders</Link>
            </Button>
            <Button asChild size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20 border">
              <Link to="/admin/analytics">Analytics</Link>
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} icon={DollarSign} trend="+12.5% vs last month" trendUp />
          <StatCard title="Total Orders" value={mockOrders.length} icon={ShoppingBag} trend={`${processingOrders} processing`} trendUp />
          <StatCard title="Customers" value={mockTopCustomers.length} icon={Users} trend="+3 this week" trendUp />
          <StatCard title="Products" value={mockStoreProducts.length} icon={Package} trend={outOfStock > 0 ? `${outOfStock} out of stock` : "All stocked"} trendUp={outOfStock === 0} />
        </div>

        {/* Revenue Chart + Alerts */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-card rounded-xl border p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Revenue Overview</h3>
              <span className="text-xs text-muted-foreground">Last 7 months</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockRevenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(230, 80%, 56%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(230, 80%, 56%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(0, 0%, 100%)', border: '1px solid hsl(220, 13%, 91%)', borderRadius: '8px', fontSize: 12 }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(230, 80%, 56%)" strokeWidth={2} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-card rounded-xl border p-5 shadow-card space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" /> Attention Needed
            </h3>
            {pendingOrders > 0 && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm font-medium text-warning">{pendingOrders} pending order{pendingOrders > 1 ? 's' : ''}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Awaiting payment confirmation</p>
              </div>
            )}
            {outOfStock > 0 && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm font-medium text-destructive">{outOfStock} product{outOfStock > 1 ? 's' : ''} out of stock</p>
                <p className="text-xs text-muted-foreground mt-0.5">Restock needed</p>
              </div>
            )}
            {lowStock > 0 && (
              <div className="p-3 rounded-lg bg-info/10 border border-info/20">
                <p className="text-sm font-medium text-info">{lowStock} low stock item{lowStock > 1 ? 's' : ''}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Below 5 units remaining</p>
              </div>
            )}
            {processingOrders > 0 && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium text-primary">{processingOrders} order{processingOrders > 1 ? 's' : ''} processing</p>
                <p className="text-xs text-muted-foreground mt-0.5">Ready to ship</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders + Top Customers */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Recent orders */}
          <div className="bg-card rounded-xl border shadow-card">
            <div className="flex items-center justify-between p-5 pb-3">
              <h3 className="text-sm font-semibold">Recent Orders</h3>
              <Button asChild variant="ghost" size="sm" className="text-xs">
                <Link to="/admin/orders">View All <ArrowRight className="h-3 w-3 ml-1" /></Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-b text-muted-foreground">
                    <th className="text-left px-5 py-2.5 font-medium text-xs">Order</th>
                    <th className="text-left px-3 py-2.5 font-medium text-xs">Customer</th>
                    <th className="text-left px-3 py-2.5 font-medium text-xs">Status</th>
                    <th className="text-right px-5 py-2.5 font-medium text-xs">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.slice(0, 5).map(order => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 font-medium">{order.number}</td>
                      <td className="px-3 py-3 text-muted-foreground">{order.customer_name || "—"}</td>
                      <td className="px-3 py-3"><StatusBadge status={order.status} /></td>
                      <td className="px-5 py-3 text-right font-semibold">${order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top customers */}
          <div className="bg-card rounded-xl border shadow-card">
            <div className="flex items-center justify-between p-5 pb-3">
              <h3 className="text-sm font-semibold">Top Customers</h3>
              <Button asChild variant="ghost" size="sm" className="text-xs">
                <Link to="/admin/customers">View All <ArrowRight className="h-3 w-3 ml-1" /></Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-b text-muted-foreground">
                    <th className="text-left px-5 py-2.5 font-medium text-xs">Customer</th>
                    <th className="text-center px-3 py-2.5 font-medium text-xs">Orders</th>
                    <th className="text-right px-5 py-2.5 font-medium text-xs">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTopCustomers.map(c => (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3">
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">{c.orders}</td>
                      <td className="px-5 py-3 text-right font-semibold">${c.total_spent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
