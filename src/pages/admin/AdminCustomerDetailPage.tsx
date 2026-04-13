import { useParams, Link } from "react-router-dom";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockTopCustomers, mockOrders } from "@/data/mock-data";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, TrendingUp, Package } from "lucide-react";
import { format } from "date-fns";

export default function AdminCustomerDetailPage() {
  const { id } = useParams();
  const customer = mockTopCustomers.find(c => c.id === Number(id));

  if (!customer) {
    return (
      <>
        <DashboardHeader title="Customer Not Found" breadcrumb={["Admin", "Customers"]} />
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Customer not found.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/admin/customers">Back to Customers</Link>
          </Button>
        </div>
      </>
    );
  }

  // Simulate customer orders from admin orders
  const customerOrders = mockAdminOrders.slice(0, customer.orders > 5 ? 5 : customer.orders);
  const totalSpent = parseFloat(customer.total_spent.replace(",", ""));
  const avgOrderValue = customer.orders > 0 ? (totalSpent / customer.orders).toFixed(2) : "0.00";
  const initials = customer.name.split(" ").map(n => n[0]).join("");

  const stats = [
    { label: "Total Orders", value: customer.orders, icon: ShoppingBag },
    { label: "Lifetime Value", value: `$${customer.total_spent}`, icon: DollarSign },
    { label: "Avg. Order Value", value: `$${avgOrderValue}`, icon: TrendingUp },
    { label: "Last Order", value: format(new Date(customer.last_order), "MMM d, yyyy"), icon: Package },
  ];

  return (
    <>
      <DashboardHeader title="Customer Details" breadcrumb={["Admin", "Customers", customer.name]} />
      <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
        {/* Back */}
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link to="/admin/customers"><ArrowLeft className="h-4 w-4" />Back to Customers</Link>
        </Button>

        {/* Profile Card */}
        <div className="bg-card rounded-xl border shadow-card p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <h2 className="text-xl font-bold">{customer.name}</h2>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{customer.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />(555) 123-4567</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />New York, NY</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Customer since Jan 2025</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
              <Mail className="h-3.5 w-3.5" />Send Email
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-card rounded-xl border shadow-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-bold mt-0.5">{s.value}</p>
                </div>
                <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
                  <s.icon className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Account Info + Order History */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Account Info */}
          <div className="bg-card rounded-xl border shadow-card p-5 space-y-4">
            <h3 className="font-semibold text-sm">Account Information</h3>
            <div className="space-y-3 text-sm">
              {[
                ["Full Name", customer.name],
                ["Email", customer.email],
                ["Phone", "(555) 123-4567"],
                ["Location", "New York, NY 10001"],
                ["Member Since", "January 15, 2025"],
                ["Status", "Active"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-right">{value}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t">
              <h4 className="font-semibold text-sm mb-2">Billing Address</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {customer.name}<br />
                123 Main Street<br />
                New York, NY 10001<br />
                United States
              </p>
            </div>

            <div className="pt-3 border-t">
              <h4 className="font-semibold text-sm mb-2">Shipping Address</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {customer.name}<br />
                123 Main Street<br />
                New York, NY 10001<br />
                United States
              </p>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2 bg-card rounded-xl border shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h3 className="font-semibold text-sm">Order History</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Showing latest {customerOrders.length} orders</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-5 py-2.5 text-left text-xs font-medium text-muted-foreground">Order</th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">Date</th>
                    <th className="px-3 py-2.5 text-center text-xs font-medium text-muted-foreground">Status</th>
                    <th className="px-3 py-2.5 text-right text-xs font-medium text-muted-foreground">Items</th>
                    <th className="px-5 py-2.5 text-right text-xs font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {customerOrders.map(order => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3">
                        <Link to={`/admin/orders/${order.id}`} className="font-semibold text-primary hover:underline">
                          #{order.number}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground text-xs">
                        {format(new Date(order.date_created), "MMM d, yyyy")}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-3 py-3 text-right">{order.line_items.length}</td>
                      <td className="px-5 py-3 text-right font-semibold">${order.total}</td>
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
