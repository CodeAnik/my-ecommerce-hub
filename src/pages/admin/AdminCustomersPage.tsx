import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockTopCustomers } from "@/data/mock-data";
import { Search, Mail, Eye } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = mockTopCustomers.filter(c => {
    if (!search) return true;
    const s = search.toLowerCase();
    return c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s);
  });

  return (
    <>
      <DashboardHeader title="Customers" breadcrumb={["Admin", "Customers"]} />
      <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-card rounded-xl border p-4 shadow-card text-center">
            <p className="text-2xl font-bold">{mockTopCustomers.length}</p>
            <p className="text-xs text-muted-foreground">Total Customers</p>
          </div>
          <div className="bg-card rounded-xl border p-4 shadow-card text-center">
            <p className="text-2xl font-bold">{mockTopCustomers.reduce((s, c) => s + c.orders, 0)}</p>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </div>
          <div className="bg-card rounded-xl border p-4 shadow-card text-center hidden sm:block">
            <p className="text-2xl font-bold">$9,338</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-5 py-3 text-left font-medium text-xs text-muted-foreground">Customer</th>
                  <th className="px-3 py-3 text-center font-medium text-xs text-muted-foreground">Orders</th>
                  <th className="px-3 py-3 text-right font-medium text-xs text-muted-foreground hidden sm:table-cell">Total Spent</th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground hidden md:table-cell">Last Order</th>
                  <th className="px-5 py-3 text-right font-medium text-xs text-muted-foreground w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(customer => (
                  <tr key={customer.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center font-medium">{customer.orders}</td>
                    <td className="px-3 py-3 text-right font-semibold hidden sm:table-cell">${customer.total_spent}</td>
                    <td className="px-3 py-3 text-muted-foreground text-xs hidden md:table-cell">{format(new Date(customer.last_order), "MMM d, yyyy")}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <Button asChild variant="ghost" size="icon" className="h-7 w-7"><Link to={`/admin/customers/${customer.id}`}><Eye className="h-3.5 w-3.5" /></Link></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Mail className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
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
