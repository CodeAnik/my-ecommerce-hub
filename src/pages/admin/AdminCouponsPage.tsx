import { useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockCoupons, WooCoupon } from "@/data/mock-data";
import {
  Search, Plus, MoreHorizontal, Pencil, Trash2, Copy, Tag, Calendar, Users, X,
} from "lucide-react";
import { format, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<WooCoupon[]>(mockCoupons);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WooCoupon | null>(null);
  const [form, setForm] = useState<Partial<WooCoupon>>({});

  const filtered = coupons.filter(c => {
    if (!search) return true;
    const s = search.toLowerCase();
    return c.code.toLowerCase().includes(s) || c.description.toLowerCase().includes(s);
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ code: "", description: "", discount_type: "percent", amount: "10", usage_limit: 100, usage_count: 0, expiry_date: "", minimum_amount: "0", status: "active" });
    setDialogOpen(true);
  };

  const openEdit = (coupon: WooCoupon) => {
    setEditing(coupon);
    setForm({ ...coupon });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.code?.trim()) { toast.error("Coupon code is required"); return; }
    if (editing) {
      setCoupons(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } as WooCoupon : c));
      toast.success(`Coupon "${form.code}" updated`);
    } else {
      const newCoupon: WooCoupon = {
        id: Date.now(),
        code: form.code!.toUpperCase(),
        description: form.description || "",
        discount_type: form.discount_type as WooCoupon["discount_type"] || "percent",
        amount: form.amount || "0",
        usage_limit: form.usage_limit || null,
        usage_count: 0,
        expiry_date: form.expiry_date || null,
        minimum_amount: form.minimum_amount || "0",
        status: "active",
        date_created: new Date().toISOString(),
      };
      setCoupons(prev => [newCoupon, ...prev]);
      toast.success(`Coupon "${newCoupon.code}" created`);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    toast.success("Coupon deleted");
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`"${code}" copied to clipboard`);
  };

  return (
    <>
      <DashboardHeader title="Coupon Management" breadcrumb={["Admin", "Coupons"]} />
      <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Coupons", value: coupons.length, color: "text-foreground" },
            { label: "Active", value: coupons.filter(c => c.status === "active").length, color: "text-success" },
            { label: "Expired", value: coupons.filter(c => c.expiry_date && isPast(new Date(c.expiry_date))).length, color: "text-destructive" },
            { label: "Total Uses", value: coupons.reduce((s, c) => s + c.usage_count, 0), color: "text-primary" },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-xl border p-4 shadow-card text-center">
              <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search coupons..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button size="sm" className="gradient-primary text-primary-foreground" onClick={openCreate}>
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Create Coupon
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-xs text-muted-foreground">Code</th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground hidden sm:table-cell">Type</th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground">Amount</th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground hidden md:table-cell">Usage</th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground hidden md:table-cell">Expiry</th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground">Status</th>
                  <th className="px-3 py-3 text-right font-medium text-xs text-muted-foreground w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(coupon => {
                  const expired = coupon.expiry_date && isPast(new Date(coupon.expiry_date));
                  return (
                    <tr key={coupon.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Tag className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <span className="font-mono font-semibold text-xs">{coupon.code}</span>
                            <p className="text-[11px] text-muted-foreground truncate max-w-[160px]">{coupon.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground capitalize">{coupon.discount_type.replace("_", " ")}</span>
                      </td>
                      <td className="px-3 py-3 font-semibold">
                        {coupon.discount_type === "percent" ? `${coupon.amount}%` : `$${coupon.amount}`}
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {coupon.usage_count}{coupon.usage_limit ? ` / ${coupon.usage_limit}` : " / ∞"}
                        </span>
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {coupon.expiry_date ? format(new Date(coupon.expiry_date), "MMM d, yyyy") : "No expiry"}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={expired ? "cancelled" : coupon.status === "active" ? "completed" : "pending"} />
                      </td>
                      <td className="px-3 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(coupon)}><Pencil className="h-3.5 w-3.5 mr-2" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyCode(coupon.code)}><Copy className="h-3.5 w-3.5 mr-2" /> Copy Code</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(coupon.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No coupons found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Coupon Code</Label>
              <Input placeholder="e.g. SUMMER20" value={form.code || ""} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input placeholder="Summer sale discount" value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Discount Type</Label>
                <Select value={form.discount_type || "percent"} onValueChange={v => setForm(f => ({ ...f, discount_type: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Percentage</SelectItem>
                    <SelectItem value="fixed_cart">Fixed Cart</SelectItem>
                    <SelectItem value="fixed_product">Fixed Product</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Amount</Label>
                <Input type="number" value={form.amount || ""} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Usage Limit</Label>
                <Input type="number" placeholder="Unlimited" value={form.usage_limit ?? ""} onChange={e => setForm(f => ({ ...f, usage_limit: e.target.value ? Number(e.target.value) : null }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Min. Order Amount</Label>
                <Input type="number" value={form.minimum_amount || ""} onChange={e => setForm(f => ({ ...f, minimum_amount: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Expiry Date</Label>
              <Input type="date" value={form.expiry_date || ""} onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={handleSave}>{editing ? "Save Changes" : "Create Coupon"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
