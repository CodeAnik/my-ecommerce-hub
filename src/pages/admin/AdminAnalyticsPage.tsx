import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StatCard } from "@/components/ui/stat-card";
import { mockRevenueData, mockCategoryData, mockOrders, mockStoreProducts } from "@/data/mock-data";
import { DollarSign, ShoppingBag, TrendingUp, Package } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ['hsl(230, 80%, 56%)', 'hsl(260, 80%, 60%)', 'hsl(152, 69%, 41%)', 'hsl(38, 92%, 50%)'];

export default function AdminAnalyticsPage() {
  const totalRevenue = mockOrders.reduce((s, o) => s + parseFloat(o.total), 0);
  const avgOrderValue = totalRevenue / mockOrders.length;
  const totalProductsSold = mockOrders.reduce((s, o) => s + o.line_items.reduce((a, i) => a + i.quantity, 0), 0);

  return (
    <>
      <DashboardHeader title="Analytics" breadcrumb={["Admin", "Analytics"]} />
      <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} icon={DollarSign} trend="+12.5%" trendUp />
          <StatCard title="Avg. Order Value" value={`$${avgOrderValue.toFixed(2)}`} icon={TrendingUp} trend="+4.2%" trendUp />
          <StatCard title="Items Sold" value={totalProductsSold} icon={Package} trend="+8 this week" trendUp />
          <StatCard title="Conversion Rate" value="3.2%" icon={ShoppingBag} trend="+0.4%" trendUp />
        </div>

        {/* Revenue + Orders Chart */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border p-5 shadow-card">
            <h3 className="text-sm font-semibold mb-4">Revenue Trend</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockRevenueData}>
                  <defs>
                    <linearGradient id="analyticsRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(230, 80%, 56%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(230, 80%, 56%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: 'hsl(0,0%,100%)', border: '1px solid hsl(220,13%,91%)', borderRadius: '8px', fontSize: 12 }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(230, 80%, 56%)" strokeWidth={2} fill="url(#analyticsRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-5 shadow-card">
            <h3 className="text-sm font-semibold mb-4">Orders per Month</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                  <Tooltip contentStyle={{ background: 'hsl(0,0%,100%)', border: '1px solid hsl(220,13%,91%)', borderRadius: '8px', fontSize: 12 }} />
                  <Bar dataKey="orders" fill="hsl(260, 80%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border p-5 shadow-card">
            <h3 className="text-sm font-semibold mb-4">Sales by Category</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mockCategoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={4}>
                    {mockCategoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(0,0%,100%)', border: '1px solid hsl(220,13%,91%)', borderRadius: '8px', fontSize: 12 }}
                    formatter={(v: number) => [`${v}%`, 'Share']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-5 shadow-card">
            <h3 className="text-sm font-semibold mb-4">Category Revenue</h3>
            <div className="space-y-4">
              {mockCategoryData.map((cat, i) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="font-medium">{cat.name}</span>
                    </div>
                    <span className="font-semibold">${cat.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${cat.value}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-card rounded-xl border shadow-card">
          <div className="p-5 pb-3">
            <h3 className="text-sm font-semibold">Top Selling Products</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-b bg-muted/30">
                  <th className="px-5 py-2.5 text-left font-medium text-xs text-muted-foreground">Product</th>
                  <th className="px-3 py-2.5 text-right font-medium text-xs text-muted-foreground">Sales</th>
                  <th className="px-3 py-2.5 text-right font-medium text-xs text-muted-foreground hidden sm:table-cell">Revenue</th>
                  <th className="px-5 py-2.5 text-right font-medium text-xs text-muted-foreground hidden md:table-cell">Rating</th>
                </tr>
              </thead>
              <tbody>
                {[...mockStoreProducts].sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0)).slice(0, 5).map(p => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-muted overflow-hidden shrink-0">
                          <img src={p.image} alt="" className="h-full w-full object-cover" />
                        </div>
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold">{p.total_sales}</td>
                    <td className="px-3 py-3 text-right text-muted-foreground hidden sm:table-cell">
                      ${((p.total_sales || 0) * parseFloat(p.price)).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right hidden md:table-cell">⭐ {p.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
