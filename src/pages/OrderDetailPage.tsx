import { useParams, Link } from "react-router-dom";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { mockOrders } from "@/data/mock-data";
import { format } from "date-fns";
import { ArrowLeft, Truck, FileDown, RotateCcw, Package } from "lucide-react";

export default function OrderDetailPage() {
  const { id } = useParams();
  const order = mockOrders.find(o => o.id === Number(id));

  if (!order) {
    return (
      <>
        <DashboardHeader title="Order Not Found" breadcrumb={["Dashboard", "Orders"]} />
        <div className="p-6 text-center"><p className="text-muted-foreground">Order not found.</p></div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title={`Order ${order.number}`} breadcrumb={["Dashboard", "Orders", order.number]} />
      <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
        {/* Back + actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Link to="/dashboard/orders" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </Link>
          <div className="flex gap-2">
            {order.tracking_number && (
              <Button variant="outline" size="sm"><Truck className="h-3.5 w-3.5 mr-1.5" /> Track Order</Button>
            )}
            <Button variant="outline" size="sm"><FileDown className="h-3.5 w-3.5 mr-1.5" /> Invoice</Button>
            {order.status === "completed" && (
              <Button size="sm" className="gradient-primary text-primary-foreground"><RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Buy Again</Button>
            )}
          </div>
        </div>

        {/* Order summary header */}
        <div className="bg-card rounded-xl border p-5 shadow-card">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Order Number</p>
              <p className="text-sm font-semibold">{order.number}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-sm font-semibold">{format(new Date(order.date_created), "MMM d, yyyy")}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <StatusBadge status={order.status} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Payment</p>
              <p className="text-sm font-semibold">{order.payment_method_title}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items + totals */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card rounded-xl border shadow-card overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="text-sm font-semibold flex items-center gap-2"><Package className="h-4 w-4 text-primary" /> Items ({order.line_items.length})</h3>
              </div>
              {order.line_items.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 border-b last:border-0">
                  <div className="h-14 w-14 rounded-lg bg-muted overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {item.sku} · Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              {/* Totals */}
              <div className="p-4 bg-muted/50 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>${order.subtotal}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span>${order.shipping_total}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax</span><span>${order.tax_total}</span></div>
                {Number(order.discount_total) > 0 && (
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Discount</span><span className="text-success">-${order.discount_total}</span></div>
                )}
                <div className="flex justify-between text-sm font-bold pt-2 border-t"><span>Total</span><span>${order.total}</span></div>
              </div>
            </div>

            {order.customer_note && (
              <div className="bg-card rounded-xl border p-4 shadow-card">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Customer Note</p>
                <p className="text-sm">{order.customer_note}</p>
              </div>
            )}
          </div>

          {/* Sidebar: addresses + timeline */}
          <div className="space-y-4">
            {[{ label: "Billing Address", addr: order.billing }, { label: "Shipping Address", addr: order.shipping }].map(a => (
              <div key={a.label} className="bg-card rounded-xl border p-4 shadow-card">
                <p className="text-xs font-semibold text-muted-foreground mb-2">{a.label}</p>
                <p className="text-sm">{a.addr.first_name} {a.addr.last_name}</p>
                {a.addr.company && <p className="text-sm text-muted-foreground">{a.addr.company}</p>}
                <p className="text-sm text-muted-foreground">{a.addr.address_1}</p>
                {a.addr.address_2 && <p className="text-sm text-muted-foreground">{a.addr.address_2}</p>}
                <p className="text-sm text-muted-foreground">{a.addr.city}, {a.addr.state} {a.addr.postcode}</p>
                <p className="text-sm text-muted-foreground">{a.addr.phone}</p>
              </div>
            ))}

            {/* Timeline */}
            <div className="bg-card rounded-xl border p-4 shadow-card">
              <p className="text-xs font-semibold text-muted-foreground mb-3">Order Timeline</p>
              <div className="relative pl-5 space-y-4">
                {order.timeline.map((ev, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-5 top-0.5 h-2.5 w-2.5 rounded-full border-2 ${i === 0 ? "bg-primary border-primary" : "bg-card border-border"}`} />
                    {i < order.timeline.length - 1 && <div className="absolute -left-[14px] top-3 w-0.5 h-full bg-border" />}
                    <p className="text-xs font-semibold">{ev.status}</p>
                    <p className="text-xs text-muted-foreground">{ev.note}</p>
                    <p className="text-[10px] text-muted-foreground">{format(new Date(ev.date), "MMM d 'at' h:mm a")}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
