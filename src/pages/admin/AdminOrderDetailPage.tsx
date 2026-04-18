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
    const pageWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    // Scale image so it always fits in a single A4 page (no blank 2nd page from rounding)
    const finalHeight = Math.min(imgHeight, pageHeight);
    const finalWidth = imgHeight > pageHeight ? (canvas.width * pageHeight) / canvas.height : pageWidth;
    const offsetX = (pageWidth - finalWidth) / 2;
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    pdf.addImage(imgData, "PNG", offsetX, 0, finalWidth, finalHeight);
    return pdf;
  };

  const printInvoice = async () => {
    const pdf = await renderPdf();
    if (!pdf) return;
    const blobUrl = pdf.output("bloburl") as unknown as string;
    // Use a hidden iframe so print() can be called reliably (popup blockers + cross-origin issues)
    let iframe = document.getElementById("invoice-print-frame") as HTMLIFrameElement | null;
    if (iframe) iframe.remove();
    iframe = document.createElement("iframe");
    iframe.id = "invoice-print-frame";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe!.contentWindow?.focus();
          iframe!.contentWindow?.print();
        } catch {
          window.open(blobUrl, "_blank");
        }
      }, 300);
    };
    toast.success("Opening print dialog…");
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
        <DialogContent className="max-w-[860px] w-[95vw] max-h-[92vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span>Invoice {order.number} <span className="text-xs font-normal text-muted-foreground">· A4 PDF</span></span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={printInvoice}><Printer className="h-3.5 w-3.5 mr-1.5" /> Print</Button>
                <Button size="sm" className="gradient-primary text-primary-foreground" onClick={downloadInvoice}><Download className="h-3.5 w-3.5 mr-1.5" /> Download PDF</Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* A4 invoice canvas — 210mm x 297mm at 96dpi ≈ 794x1123px */}
          <div className="flex justify-center bg-muted/40 p-4 rounded-lg overflow-x-auto">
            <div
              ref={invoiceRef}
              style={{
                width: "794px",
                minHeight: "1123px",
                background: "#ffffff",
                color: "#1a1a1a",
                padding: "56px 64px",
                position: "relative",
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: 13,
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Watermark */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              >
                <img
                  src={companyLogo}
                  alt=""
                  style={{
                    width: 460,
                    height: 460,
                    opacity: 0.06,
                    transform: "rotate(-18deg)",
                  }}
                />
              </div>

              {/* Foreground content */}
              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1 }}>
                {/* Header with logo */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, borderBottom: "2px solid #1a1a1a", paddingBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <img src={companyLogo} alt="MyStore" style={{ width: 64, height: 64, objectFit: "contain" }} />
                    <div>
                      <p style={{ fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>MyStore Inc.</p>
                      <p style={{ color: "#888", margin: "2px 0 0", fontSize: 11 }}>742 Evergreen Terrace, Portland, OR 97201</p>
                      <p style={{ color: "#888", margin: 0, fontSize: 11 }}>support@mystore.com · +1 (555) 010-2024</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <h1 style={{ fontSize: 28, margin: 0, fontWeight: 800, letterSpacing: "-1px" }}>INVOICE</h1>
                    <p style={{ color: "#888", margin: "4px 0 0", fontSize: 12 }}>{order.number}</p>
                    <p style={{ color: "#888", margin: 0, fontSize: 11 }}>{format(new Date(order.date_created), "MMM d, yyyy")}</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, margin: "24px 0" }}>
                  <div>
                    <h2 style={{ fontSize: 10, textTransform: "uppercase", color: "#888", fontWeight: 700, marginBottom: 8, letterSpacing: "0.5px" }}>Bill To</h2>
                    <p style={{ fontWeight: 600, margin: "0 0 2px" }}>{order.billing.first_name} {order.billing.last_name}</p>
                    {order.billing.company && <p style={{ margin: "0 0 2px" }}>{order.billing.company}</p>}
                    <p style={{ margin: "0 0 2px", color: "#555" }}>{order.billing.address_1}</p>
                    <p style={{ margin: 0, color: "#555" }}>{order.billing.city}, {order.billing.state} {order.billing.postcode}</p>
                  </div>
                  <div>
                    <h2 style={{ fontSize: 10, textTransform: "uppercase", color: "#888", fontWeight: 700, marginBottom: 8, letterSpacing: "0.5px" }}>Ship To</h2>
                    <p style={{ fontWeight: 600, margin: "0 0 2px" }}>{order.shipping.first_name} {order.shipping.last_name}</p>
                    <p style={{ margin: "0 0 2px", color: "#555" }}>{order.shipping.address_1}</p>
                    <p style={{ margin: 0, color: "#555" }}>{order.shipping.city}, {order.shipping.state} {order.shipping.postcode}</p>
                  </div>
                  <div>
                    <h2 style={{ fontSize: 10, textTransform: "uppercase", color: "#888", fontWeight: 700, marginBottom: 8, letterSpacing: "0.5px" }}>Payment</h2>
                    <p style={{ margin: "0 0 2px" }}><strong>Method:</strong> {order.payment_method_title}</p>
                    <p style={{ margin: "0 0 2px" }}><strong>Status:</strong> <span style={{ textTransform: "capitalize" }}>{status || order.status}</span></p>
                    <p style={{ margin: 0 }}><strong>Date:</strong> {format(new Date(order.date_created), "MMM d, yyyy")}</p>
                  </div>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0" }}>
                  <thead>
                    <tr style={{ background: "#f5f5f7" }}>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 10, textTransform: "uppercase", color: "#555", fontWeight: 700, letterSpacing: "0.5px" }}>Item</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 10, textTransform: "uppercase", color: "#555", fontWeight: 700, letterSpacing: "0.5px" }}>SKU</th>
                      <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 10, textTransform: "uppercase", color: "#555", fontWeight: 700, letterSpacing: "0.5px" }}>Qty</th>
                      <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 10, textTransform: "uppercase", color: "#555", fontWeight: 700, letterSpacing: "0.5px" }}>Price</th>
                      <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 10, textTransform: "uppercase", color: "#555", fontWeight: 700, letterSpacing: "0.5px" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.line_items.map(item => (
                      <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "10px 12px" }}>{item.name}</td>
                        <td style={{ padding: "10px 12px", color: "#888" }}>{item.sku}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>{item.quantity}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>${item.price.toFixed(2)}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ marginLeft: "auto", width: 300, marginTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: "#555" }}><span>Subtotal</span><span>${order.subtotal}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: "#555" }}><span>Shipping</span><span>${order.shipping_total}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: "#555" }}><span>Tax</span><span>${order.tax_total}</span></div>
                  {Number(order.discount_total) > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: "#0a8f3c" }}><span>Discount</span><span>-${order.discount_total}</span></div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 4px", borderTop: "2px solid #1a1a1a", marginTop: 8, fontWeight: 800, fontSize: 16 }}>
                    <span>Total</span><span>${order.total}</span>
                  </div>
                </div>

                <div style={{ position: "absolute", bottom: 40, left: 64, right: 64, borderTop: "1px solid #e5e5e5", paddingTop: 16, textAlign: "center", color: "#888", fontSize: 10 }}>
                  Thank you for your business! For questions about this invoice, contact support@mystore.com
                  <br />
                  MyStore Inc. · Invoice generated on {format(new Date(), "MMM d, yyyy 'at' h:mm a")}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
