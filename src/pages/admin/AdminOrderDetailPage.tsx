import { useState, useRef, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { mockOrders, OrderStatus } from "@/data/mock-data";
import { format } from "date-fns";
import { ArrowLeft, Package, Printer, Download, X } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import companyLogo from "@/assets/company-logo.png";

const allStatuses: OrderStatus[] = ["pending", "processing", "on-hold", "completed", "cancelled", "refunded"];

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const order = mockOrders.find(o => o.id === Number(id));
  const [status, setStatus] = useState<OrderStatus | undefined>(order?.status);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchParams.get("invoice") === "1") setInvoiceOpen(true);
  }, [searchParams]);

  if (!order) {
    return (
      <>
        <DashboardHeader title="Order Not Found" breadcrumb={["Admin", "Orders"]} />
        <div className="p-6 text-center"><p className="text-muted-foreground">Order not found.</p></div>
      </>
    );
  }

  const handleStatusChange = (val: string) => {
    setStatus(val as OrderStatus);
    toast.success(`Order ${order.number} status updated to "${val}"`);
  };

  const handlePrint = () => {
    setInvoiceOpen(true);
  };

  const renderPdf = async (): Promise<jsPDF | null> => {
    const content = invoiceRef.current;
    if (!content) return null;
    const canvas = await html2canvas(content, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    return pdf;
  };

  const printInvoice = async () => {
    const pdf = await renderPdf();
    if (!pdf) return;
    const blobUrl = pdf.output("bloburl");
    const win = window.open(blobUrl as unknown as string, "_blank");
    if (win) {
      win.focus();
      setTimeout(() => win.print(), 600);
    }
    toast.success("Invoice ready to print");
  };

  const downloadInvoice = async () => {
    const pdf = await renderPdf();
    if (!pdf) return;
    pdf.save(`Invoice-${order.number.replace("#", "")}.pdf`);
    toast.success("Invoice PDF downloaded");
  };

  return (
    <>
      <DashboardHeader title={`Order ${order.number}`} breadcrumb={["Admin", "Orders", order.number]} />
      <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Link to="/admin/orders" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Status:</span>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-8 w-[150px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allStatuses.map(s => (
                    <SelectItem key={s} value={s} className="text-xs capitalize">{s.replace("-", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-3.5 w-3.5 mr-1.5" /> Invoice
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-card rounded-xl border p-5 shadow-card">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><p className="text-xs text-muted-foreground">Order Number</p><p className="text-sm font-semibold">{order.number}</p></div>
            <div><p className="text-xs text-muted-foreground">Date</p><p className="text-sm font-semibold">{format(new Date(order.date_created), "MMM d, yyyy")}</p></div>
            <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge status={status || order.status} /></div>
            <div><p className="text-xs text-muted-foreground">Customer</p><p className="text-sm font-semibold">{order.customer_name || "Guest"}</p></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
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

          {/* Sidebar */}
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

      {/* Invoice Modal */}
      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Invoice {order.number}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={printInvoice}><Printer className="h-3.5 w-3.5 mr-1.5" /> Print</Button>
                <Button size="sm" className="gradient-primary text-primary-foreground" onClick={downloadInvoice}><Download className="h-3.5 w-3.5 mr-1.5" /> Download</Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div ref={invoiceRef} className="bg-white text-black p-6 rounded-lg text-[13px]">
            <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
              <div>
                <h1 style={{ fontSize: 24, margin: 0, fontWeight: 700 }}>INVOICE</h1>
                <p style={{ color: "#888", marginTop: 4 }}>{order.number}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontWeight: 700 }}>MyStore Inc.</p>
                <p style={{ color: "#888" }}>742 Evergreen Terrace</p>
                <p style={{ color: "#888" }}>Portland, OR 97201</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, margin: "24px 0" }}>
              <div>
                <h2 style={{ fontSize: 11, textTransform: "uppercase", color: "#888", fontWeight: 600, marginBottom: 8 }}>Bill To</h2>
                <p style={{ fontWeight: 600 }}>{order.billing.first_name} {order.billing.last_name}</p>
                {order.billing.company && <p>{order.billing.company}</p>}
                <p>{order.billing.address_1}</p>
                <p>{order.billing.city}, {order.billing.state} {order.billing.postcode}</p>
              </div>
              <div>
                <h2 style={{ fontSize: 11, textTransform: "uppercase", color: "#888", fontWeight: 600, marginBottom: 8 }}>Details</h2>
                <p><strong>Date:</strong> {format(new Date(order.date_created), "MMM d, yyyy")}</p>
                <p><strong>Payment:</strong> {order.payment_method_title}</p>
                <p><strong>Status:</strong> {status || order.status}</p>
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e5e5" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, textTransform: "uppercase", color: "#888", fontWeight: 600 }}>Item</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, textTransform: "uppercase", color: "#888", fontWeight: 600 }}>SKU</th>
                  <th style={{ padding: "8px 12px", textAlign: "right", fontSize: 11, textTransform: "uppercase", color: "#888", fontWeight: 600 }}>Qty</th>
                  <th style={{ padding: "8px 12px", textAlign: "right", fontSize: 11, textTransform: "uppercase", color: "#888", fontWeight: 600 }}>Price</th>
                  <th style={{ padding: "8px 12px", textAlign: "right", fontSize: 11, textTransform: "uppercase", color: "#888", fontWeight: 600 }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.line_items.map(item => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #e5e5e5" }}>
                    <td style={{ padding: "8px 12px" }}>{item.name}</td>
                    <td style={{ padding: "8px 12px", color: "#888" }}>{item.sku}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right" }}>{item.quantity}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right" }}>${item.price.toFixed(2)}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginLeft: "auto", width: 280 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span>Subtotal</span><span>${order.subtotal}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span>Shipping</span><span>${order.shipping_total}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span>Tax</span><span>${order.tax_total}</span></div>
              {Number(order.discount_total) > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span>Discount</span><span>-${order.discount_total}</span></div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 4px", borderTop: "2px solid #1a1a1a", marginTop: 4, fontWeight: 700 }}>
                <span>Total</span><span>${order.total}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
