import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, X, ImageIcon, Plus, Star, Package, Search, FileText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

export interface ProductFormValue {
  id?: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description: string;
  regular_price: string;
  sale_price: string;
  category: string;
  brand: string;
  stock_quantity: number;
  stock_status: "instock" | "outofstock" | "onbackorder";
  status: "publish" | "draft" | "pending";
  featured_image: string;
  gallery: string[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

const CATEGORIES = ["Electronics", "Accessories", "Footwear", "Clothing", "Home & Garden", "Sports"];
const BRANDS = ["MyStore", "TechPro", "Urban", "EcoLine", "Generic"];

const empty: ProductFormValue = {
  name: "", slug: "", sku: "", description: "", short_description: "",
  regular_price: "", sale_price: "", category: "", brand: "",
  stock_quantity: 0, stock_status: "instock", status: "draft",
  featured_image: "", gallery: [],
  meta_title: "", meta_description: "", meta_keywords: "",
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<ProductFormValue> | null;
  onSubmit: (value: ProductFormValue) => void;
}

export function ProductFormDialog({ open, onOpenChange, initial, onSubmit }: Props) {
  const isEdit = !!initial?.id;
  const [tab, setTab] = useState("general");
  const [v, setV] = useState<ProductFormValue>(empty);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setV({ ...empty, ...(initial || {}) });
      setErrors({});
      setSlugTouched(!!initial?.slug);
      setTab("general");
    }
  }, [open, initial]);

  const update = <K extends keyof ProductFormValue>(k: K, val: ProductFormValue[K]) => {
    setV(prev => {
      const next = { ...prev, [k]: val };
      if (k === "name" && !slugTouched) next.slug = slugify(String(val));
      return next;
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!v.name.trim()) e.name = "Product name is required";
    if (!v.sku.trim()) e.sku = "SKU is required";
    if (!v.regular_price.trim()) e.regular_price = "Regular price is required";
    if (!v.category) e.category = "Category is required";
    if (v.sale_price && parseFloat(v.sale_price) >= parseFloat(v.regular_price || "0"))
      e.sale_price = "Sale price must be less than regular price";
    setErrors(e);
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
      const firstField = Object.keys(e)[0];
      if (["name", "sku", "regular_price", "sale_price", "category"].includes(firstField)) setTab("general");
      toast.error("Please fix the highlighted fields");
      return;
    }
    onSubmit({ ...v, slug: v.slug || slugify(v.name) });
    toast.success(isEdit ? "Product updated" : "Product created");
    onOpenChange(false);
  };

  // Image handling - convert to base64 for demo
  const handleFile = async (file: File): Promise<string> => {
    return new Promise(res => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const onFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    update("featured_image", await handleFile(f));
  };
  const onGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = await Promise.all(files.map(handleFile));
    update("gallery", [...v.gallery, ...urls]);
  };

  const Req = () => <span className="text-destructive ml-0.5">*</span>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-5 w-5 text-primary" />
            {isEdit ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? `Update product details${v.name ? ` for "${v.name}"` : ""}` : "Fill in the product details below. Fields marked with * are required."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-4 border-b">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="general" className="gap-1.5"><FileText className="h-3.5 w-3.5" /> General</TabsTrigger>
              <TabsTrigger value="inventory" className="gap-1.5"><Package className="h-3.5 w-3.5" /> Inventory</TabsTrigger>
              <TabsTrigger value="media" className="gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Media</TabsTrigger>
              <TabsTrigger value="seo" className="gap-1.5"><Search className="h-3.5 w-3.5" /> SEO</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* GENERAL */}
            <TabsContent value="general" className="mt-0 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="name">Product Name<Req /></Label>
                  <Input id="name" value={v.name} onChange={e => update("name", e.target.value)}
                    placeholder="e.g. Premium Wireless Headphones"
                    className={cn(errors.name && "border-destructive")} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="slug">Product Slug</Label>
                  <Input id="slug" value={v.slug}
                    onChange={e => { setSlugTouched(true); update("slug", slugify(e.target.value)); }}
                    placeholder="auto-generated-from-name" />
                  <p className="text-[11px] text-muted-foreground">URL: /product/{v.slug || "your-slug"}</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="sku">SKU<Req /></Label>
                  <Input id="sku" value={v.sku} onChange={e => update("sku", e.target.value.toUpperCase())}
                    placeholder="WH-1000" className={cn("font-mono", errors.sku && "border-destructive")} />
                  {errors.sku && <p className="text-xs text-destructive">{errors.sku}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="regular_price">Regular Price ($)<Req /></Label>
                  <Input id="regular_price" type="number" step="0.01" value={v.regular_price}
                    onChange={e => update("regular_price", e.target.value)}
                    placeholder="149.99" className={cn(errors.regular_price && "border-destructive")} />
                  {errors.regular_price && <p className="text-xs text-destructive">{errors.regular_price}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="sale_price">Sale Price ($)</Label>
                  <Input id="sale_price" type="number" step="0.01" value={v.sale_price}
                    onChange={e => update("sale_price", e.target.value)}
                    placeholder="129.99" className={cn(errors.sale_price && "border-destructive")} />
                  {errors.sale_price && <p className="text-xs text-destructive">{errors.sale_price}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Category<Req /></Label>
                  <Select value={v.category} onValueChange={val => update("category", val)}>
                    <SelectTrigger className={cn(errors.category && "border-destructive")}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                  {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Brand</Label>
                  <Select value={v.brand} onValueChange={val => update("brand", val)}>
                    <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                    <SelectContent>{BRANDS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="short_desc">Short Description</Label>
                  <Textarea id="short_desc" rows={2} value={v.short_description}
                    onChange={e => update("short_description", e.target.value)}
                    placeholder="Brief teaser shown on product cards..." />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="desc">Product Description</Label>
                  <Textarea id="desc" rows={6} value={v.description}
                    onChange={e => update("description", e.target.value)}
                    placeholder="Full product description with features, specs, benefits..." />
                </div>
              </div>
            </TabsContent>

            {/* INVENTORY */}
            <TabsContent value="inventory" className="mt-0 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="qty">Stock Quantity</Label>
                  <Input id="qty" type="number" value={v.stock_quantity}
                    onChange={e => update("stock_quantity", parseInt(e.target.value) || 0)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Stock Status</Label>
                  <Select value={v.stock_status} onValueChange={(val: any) => update("stock_status", val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instock">In Stock</SelectItem>
                      <SelectItem value="outofstock">Out of Stock</SelectItem>
                      <SelectItem value="onbackorder">On Backorder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Publish Status</Label>
                  <Select value={v.status} onValueChange={(val: any) => update("status", val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="publish">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* MEDIA */}
            <TabsContent value="media" className="mt-0 space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-warning" /> Featured Image</Label>
                <div className="flex items-start gap-4">
                  <div className="h-32 w-32 rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center overflow-hidden shrink-0">
                    {v.featured_image ? (
                      <img src={v.featured_image} alt="featured" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-input bg-background hover:bg-accent text-sm cursor-pointer transition-colors">
                      <Upload className="h-3.5 w-3.5" /> Upload featured image
                      <input type="file" accept="image/*" className="hidden" onChange={onFeaturedUpload} />
                    </label>
                    {v.featured_image && (
                      <Button type="button" variant="ghost" size="sm" className="text-destructive"
                        onClick={() => update("featured_image", "")}>
                        <X className="h-3.5 w-3.5 mr-1" /> Remove
                      </Button>
                    )}
                    <p className="text-xs text-muted-foreground">Recommended: 800×800px, JPG/PNG, max 2MB</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Product Gallery <Badge variant="secondary" className="ml-2 text-[10px]">{v.gallery.length} images</Badge></Label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {v.gallery.map((img, i) => (
                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
                      <img src={img} alt={`gallery-${i}`} className="h-full w-full object-cover" />
                      <button type="button" onClick={() => update("gallery", v.gallery.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors">
                    <Plus className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">Add</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={onGalleryUpload} />
                  </label>
                </div>
              </div>
            </TabsContent>

            {/* SEO */}
            <TabsContent value="seo" className="mt-0 space-y-5">
              <div className="rounded-lg border bg-muted/20 p-4 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Search Preview</p>
                <p className="text-base text-info truncate">{v.meta_title || v.name || "Product Title"}</p>
                <p className="text-xs text-success truncate">yourstore.com/product/{v.slug || "product-slug"}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{v.meta_description || v.short_description || "Your meta description will appear here..."}</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mt">Meta Title <span className="text-xs text-muted-foreground font-normal">({v.meta_title.length}/60)</span></Label>
                <Input id="mt" maxLength={60} value={v.meta_title}
                  onChange={e => update("meta_title", e.target.value)}
                  placeholder="SEO title shown in Google search results" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="md">Meta Description <span className="text-xs text-muted-foreground font-normal">({v.meta_description.length}/160)</span></Label>
                <Textarea id="md" rows={3} maxLength={160} value={v.meta_description}
                  onChange={e => update("meta_description", e.target.value)}
                  placeholder="Brief description shown in search results..." />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mk">Meta Keywords</Label>
                <Input id="mk" value={v.meta_keywords}
                  onChange={e => update("meta_keywords", e.target.value)}
                  placeholder="comma, separated, keywords" />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="px-6 py-4 border-t bg-muted/20 gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="gradient-primary text-primary-foreground" onClick={handleSubmit}>
            {isEdit ? "Update Product" : "Create Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
