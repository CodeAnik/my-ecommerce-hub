import { useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockStoreProducts } from "@/data/mock-data";
import { Search, Plus, MoreHorizontal, Edit2, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductFormDialog, type ProductFormValue } from "@/components/admin/ProductFormDialog";
import { ImportExportMenu } from "@/components/admin/ImportExportMenu";

const tabs = [
  { label: "All", value: "all" },
  { label: "Published", value: "publish" },
  { label: "Draft", value: "draft" },
  { label: "Pending", value: "pending" },
];

export default function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(mockStoreProducts);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<ProductFormValue> | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (p: typeof products[0]) => {
    setEditing({
      id: p.id, name: p.name, slug: (p as any).slug || "", sku: p.sku,
      description: (p as any).description || "", short_description: (p as any).short_description || "",
      regular_price: p.regular_price, sale_price: p.sale_price || "",
      category: p.category, brand: (p as any).brand || "",
      stock_quantity: p.stock_quantity ?? 0, stock_status: p.stock_status as any,
      status: p.status as any, featured_image: p.image, gallery: (p as any).gallery || [],
      meta_title: (p as any).meta_title || "", meta_description: (p as any).meta_description || "",
      meta_keywords: (p as any).meta_keywords || "",
    });
    setFormOpen(true);
  };

  const handleSubmit = (val: ProductFormValue) => {
    if (val.id) {
      setProducts(prev => prev.map(p => p.id === val.id ? {
        ...p, name: val.name, sku: val.sku, price: val.sale_price || val.regular_price,
        regular_price: val.regular_price, sale_price: val.sale_price, category: val.category,
        stock_quantity: val.stock_quantity, stock_status: val.stock_status, status: val.status,
        image: val.featured_image || p.image, ...(val as any),
      } as any : p));
    } else {
      const id = Math.max(...products.map(p => p.id)) + 1;
      setProducts(prev => [{
        id, name: val.name, sku: val.sku, price: val.sale_price || val.regular_price,
        regular_price: val.regular_price, sale_price: val.sale_price, image: val.featured_image || "/placeholder.svg",
        rating: 0, category: val.category, stock_status: val.stock_status, stock_quantity: val.stock_quantity,
        status: val.status, total_sales: 0, date_created: new Date().toISOString().split("T")[0],
        ...(val as any),
      } as any, ...prev]);
    }
  };

  const handleDelete = () => {
    if (deleteId == null) return;
    setProducts(prev => prev.filter(p => p.id !== deleteId));
    toast.success("Product deleted");
    setDeleteId(null);
  };

  const filtered = products.filter(p => {
    if (activeTab !== "all" && p.status !== activeTab) return false;
    if (search) {
      const s = search.toLowerCase();
      return p.name.toLowerCase().includes(s) || (p.sku || "").toLowerCase().includes(s);
    }
    return true;
  });

  const stockBadge = (p: typeof mockStoreProducts[0]) => {
    if (p.stock_status === "outofstock") return <Badge variant="destructive" className="text-[10px]">Out of Stock</Badge>;
    if (p.stock_status === "onbackorder") return <Badge className="bg-warning/10 text-warning border-warning/20 text-[10px]">Backorder</Badge>;
    if ((p.stock_quantity ?? 0) <= 10) return <Badge className="bg-info/10 text-info border-info/20 text-[10px]">Low: {p.stock_quantity}</Badge>;
    return <Badge className="bg-success/10 text-success border-success/20 text-[10px]">{p.stock_quantity} in stock</Badge>;
  };

  return (
    <>
      <DashboardHeader title="Products" breadcrumb={["Admin", "Products"]} />
      <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
        {/* Header */}
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
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Button size="sm" className="gradient-primary text-primary-foreground h-9" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Button>
          </div>
        </div>

        {/* Product Grid/Table */}
        <div className="bg-card rounded-xl border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-left w-10">
                    <input type="checkbox" className="rounded border-border" />
                  </th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground">Product</th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground hidden md:table-cell">SKU</th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground">Stock</th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground hidden sm:table-cell">Category</th>
                  <th className="px-3 py-3 text-right font-medium text-xs text-muted-foreground">Price</th>
                  <th className="px-3 py-3 text-right font-medium text-xs text-muted-foreground hidden lg:table-cell">Sales</th>
                  <th className="px-3 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded border-border" />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden shrink-0">
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate max-w-[200px]">{product.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={cn("inline-block h-1.5 w-1.5 rounded-full",
                              product.status === "publish" ? "bg-success" : product.status === "draft" ? "bg-muted-foreground" : "bg-warning")} />
                            <span className="text-[10px] text-muted-foreground capitalize">{product.status}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground text-xs hidden md:table-cell font-mono">{product.sku}</td>
                    <td className="px-3 py-3">{stockBadge(product)}</td>
                    <td className="px-3 py-3 text-muted-foreground text-xs hidden sm:table-cell">{product.category}</td>
                    <td className="px-3 py-3 text-right">
                      <span className="font-semibold">${product.price}</span>
                      {product.sale_price && (
                        <span className="text-xs text-muted-foreground line-through ml-1">${product.regular_price}</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right text-muted-foreground hidden lg:table-cell">{product.total_sales}</td>
                    <td className="px-3 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(product)}><Eye className="h-3.5 w-3.5 mr-2" /> View</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(product)}><Edit2 className="h-3.5 w-3.5 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(product.id)}><Trash2 className="h-3.5 w-3.5 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-3 border-t">
            <p className="text-xs text-muted-foreground">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled><ChevronLeft className="h-4 w-4" /></Button>
              <Button size="icon" className="h-8 w-8 gradient-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </div>

      <ProductFormDialog open={formOpen} onOpenChange={setFormOpen} initial={editing} onSubmit={handleSubmit} />

      <AlertDialog open={deleteId !== null} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The product will be permanently removed from your store.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
