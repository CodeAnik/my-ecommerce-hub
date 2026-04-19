import { useMemo, useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Mail, Edit2, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  mockAdmin, mockEditor, mockShopManager, mockCustomer, mockOrders, mockTopCustomers,
  type WooCustomer, type UserRole,
} from "@/data/mock-data";
import { ImportExportMenu } from "@/components/admin/ImportExportMenu";
import { UserFormDialog, type UserFormValue } from "@/components/admin/UserFormDialog";
import { cn } from "@/lib/utils";

const roleStyles: Record<UserRole, string> = {
  administrator: "bg-destructive/10 text-destructive border-destructive/20",
  editor: "bg-info/10 text-info border-info/20",
  shop_manager: "bg-warning/10 text-warning border-warning/20",
  customer: "bg-success/10 text-success border-success/20",
};

const roleLabels: Record<UserRole, string> = {
  administrator: "Administrator", editor: "Editor",
  shop_manager: "Shop Manager", customer: "Customer",
};

/** Build the initial unified user list from all mock sources */
function buildInitialUsers(): WooCustomer[] {
  const seeds: WooCustomer[] = [mockAdmin, mockEditor, mockShopManager, mockCustomer];
  const extra: WooCustomer[] = mockTopCustomers
    .filter(c => !seeds.some(s => s.id === c.id))
    .map(c => {
      const [first, ...rest] = c.name.split(" ");
      return {
        id: c.id, first_name: first, last_name: rest.join(" "), display_name: c.name,
        email: c.email, phone: "", avatar_url: "", role: "customer",
        date_created: c.last_order, store_credit: 0, reward_points: 0,
        billing: mockCustomer.billing, shipping: mockCustomer.shipping,
      };
    });
  return [...seeds, ...extra];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<WooCustomer[]>(buildInitialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<UserFormValue> | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const ordersByUser = useMemo(() => {
    const map = new Map<number, { orders: number; total_spent: number; last_order: string }>();
    mockOrders.forEach(o => {
      if (!o.customer_id) return;
      const cur = map.get(o.customer_id) || { orders: 0, total_spent: 0, last_order: o.date_created };
      cur.orders += 1;
      cur.total_spent += parseFloat(o.total);
      if (new Date(o.date_created) > new Date(cur.last_order)) cur.last_order = o.date_created;
      map.set(o.customer_id, cur);
    });
    return map;
  }, []);

  const filtered = users.filter(u => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return u.display_name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
    }
    return true;
  });

  const stats = {
    total: users.length,
    administrators: users.filter(u => u.role === "administrator").length,
    staff: users.filter(u => u.role === "editor" || u.role === "shop_manager").length,
    customers: users.filter(u => u.role === "customer").length,
  };

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (u: WooCustomer) => {
    setEditing({
      id: u.id, first_name: u.first_name, last_name: u.last_name,
      email: u.email, phone: u.phone, role: u.role,
    });
    setFormOpen(true);
  };

  const handleSubmit = (val: UserFormValue) => {
    if (val.id) {
      setUsers(prev => prev.map(u => u.id === val.id ? {
        ...u, first_name: val.first_name, last_name: val.last_name,
        display_name: `${val.first_name} ${val.last_name}`.trim(),
        email: val.email, phone: val.phone, role: val.role,
      } : u));
    } else {
      const id = Math.max(0, ...users.map(u => u.id)) + 1;
      const newUser: WooCustomer = {
        id, first_name: val.first_name, last_name: val.last_name,
        display_name: `${val.first_name} ${val.last_name}`.trim(),
        email: val.email, phone: val.phone, role: val.role, avatar_url: "",
        date_created: new Date().toISOString(), store_credit: 0, reward_points: 0,
        billing: mockCustomer.billing, shipping: mockCustomer.shipping,
      };
      setUsers(prev => [newUser, ...prev]);
    }
  };

  const handleDelete = () => {
    if (deleteId == null) return;
    setUsers(prev => prev.filter(u => u.id !== deleteId));
    toast.success("User deleted");
    setDeleteId(null);
  };

  const buildExportRows = () => users.map(u => {
    const stat = ordersByUser.get(u.id);
    return {
      id: u.id, first_name: u.first_name, last_name: u.last_name,
      email: u.email, phone: u.phone, role: u.role,
      date_created: u.date_created,
      orders_count: stat?.orders || 0,
      total_spent: stat?.total_spent.toFixed(2) || "0.00",
      last_order: stat?.last_order || "",
      billing_address: `${u.billing.address_1}, ${u.billing.city}, ${u.billing.state} ${u.billing.postcode}`,
    };
  });

  const handleImport = (rows: Record<string, any>[]) => {
    const validRoles: UserRole[] = ["administrator", "editor", "shop_manager", "customer"];
    let nextId = Math.max(0, ...users.map(u => u.id)) + 1;
    const imported: WooCustomer[] = [];
    rows.forEach(r => {
      const email = String(r.email || "").trim();
      if (!email || !email.includes("@")) return;
      const role = validRoles.includes(r.role) ? (r.role as UserRole) : "customer";
      imported.push({
        id: typeof r.id === "number" ? r.id : nextId++,
        first_name: String(r.first_name || ""), last_name: String(r.last_name || ""),
        display_name: `${r.first_name || ""} ${r.last_name || ""}`.trim() || email,
        email, phone: String(r.phone || ""), avatar_url: "", role,
        date_created: String(r.date_created || new Date().toISOString()),
        store_credit: 0, reward_points: 0,
        billing: mockCustomer.billing, shipping: mockCustomer.shipping,
      });
    });
    // Merge by email — replace existing, append new
    setUsers(prev => {
      const byEmail = new Map(prev.map(u => [u.email.toLowerCase(), u]));
      imported.forEach(u => byEmail.set(u.email.toLowerCase(), u));
      return Array.from(byEmail.values());
    });
    return imported.length;
  };

  return (
    <>
      <DashboardHeader title="Users" breadcrumb={["Admin", "Users"]} />
      <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Users", value: stats.total, color: "text-foreground" },
            { label: "Administrators", value: stats.administrators, color: "text-destructive" },
            { label: "Staff", value: stats.staff, color: "text-warning" },
            { label: "Customers", value: stats.customers, color: "text-success" },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-xl border p-4 shadow-card text-center">
              <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or email..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as any)}>
              <SelectTrigger className="h-9 w-[150px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Roles</SelectItem>
                <SelectItem value="administrator" className="text-xs">Administrators</SelectItem>
                <SelectItem value="editor" className="text-xs">Editors</SelectItem>
                <SelectItem value="shop_manager" className="text-xs">Shop Managers</SelectItem>
                <SelectItem value="customer" className="text-xs">Customers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <ImportExportMenu
              filenameBase="users"
              getExportRows={buildExportRows}
              onImport={handleImport}
            />
            <Button size="sm" className="gradient-primary text-primary-foreground h-9" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1" /> Add User
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-5 py-3 text-left font-medium text-xs text-muted-foreground">User</th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground">Role</th>
                  <th className="px-3 py-3 text-center font-medium text-xs text-muted-foreground hidden md:table-cell">Orders</th>
                  <th className="px-3 py-3 text-right font-medium text-xs text-muted-foreground hidden sm:table-cell">Total Spent</th>
                  <th className="px-3 py-3 text-left font-medium text-xs text-muted-foreground hidden lg:table-cell">Joined</th>
                  <th className="px-5 py-3 text-right font-medium text-xs text-muted-foreground w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const stat = ordersByUser.get(u.id);
                  return (
                    <tr key={u.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                            {u.first_name[0]}{u.last_name[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{u.display_name}</p>
                            <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant="outline" className={cn("text-[10px] capitalize", roleStyles[u.role])}>
                          {roleLabels[u.role]}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-center font-medium hidden md:table-cell">{stat?.orders || 0}</td>
                      <td className="px-3 py-3 text-right font-semibold hidden sm:table-cell">
                        ${stat?.total_spent.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                        {format(new Date(u.date_created), "MMM d, yyyy")}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1 justify-end">
                          {u.role === "customer" && (
                            <Button asChild variant="ghost" size="icon" className="h-7 w-7" title="View profile">
                              <Link to={`/admin/customers/${u.id}`}><Eye className="h-3.5 w-3.5" /></Link>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit" onClick={() => openEdit(u)}>
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="Email" onClick={() => toast.success(`Email draft to ${u.email}`)}>
                            <Mail className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" title="Delete" onClick={() => setDeleteId(u.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-sm text-muted-foreground">No users match your filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} initial={editing} onSubmit={handleSubmit} />

      <AlertDialog open={deleteId !== null} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The user account will be permanently removed.</AlertDialogDescription>
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
