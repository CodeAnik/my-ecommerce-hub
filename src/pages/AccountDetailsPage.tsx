import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Lock, Camera, Check } from "lucide-react";
import { toast } from "sonner";

export default function AccountDetailsPage() {
  const { customer, updateCustomer } = useAuth();
  const [form, setForm] = useState({
    first_name: customer?.first_name || "",
    last_name: customer?.last_name || "",
    display_name: customer?.display_name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
  });
  const [pwForm, setPwForm] = useState({ current: "", new_pw: "", confirm: "" });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    // Replace with WooCommerce update customer endpoint
    await new Promise(r => setTimeout(r, 800));
    updateCustomer(form);
    setSaving(false);
    toast.success("Account details updated");
  };

  const handlePasswordChange = async () => {
    if (pwForm.new_pw.length < 6) { toast.error("Min 6 characters"); return; }
    if (pwForm.new_pw !== pwForm.confirm) { toast.error("Passwords don't match"); return; }
    // Replace with WP password update endpoint
    await new Promise(r => setTimeout(r, 800));
    setPwForm({ current: "", new_pw: "", confirm: "" });
    toast.success("Password updated");
  };

  return (
    <>
      <DashboardHeader title="Account Details" breadcrumb={["Dashboard", "Account Details"]} />
      <div className="p-4 lg:p-6 space-y-6 animate-fade-in max-w-2xl">
        {/* Avatar */}
        <div className="bg-card rounded-xl border shadow-card p-5 flex items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
              {customer?.first_name[0]}{customer?.last_name[0]}
            </div>
            <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-card border shadow-card flex items-center justify-center hover:bg-muted transition-colors">
              <Camera className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
          <div>
            <p className="font-semibold">{customer?.display_name}</p>
            <p className="text-xs text-muted-foreground">{customer?.email}</p>
            {/* Profile photo placeholder - connect to WP media upload */}
          </div>
        </div>

        {/* Personal info */}
        <div className="bg-card rounded-xl border shadow-card p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label className="text-xs">First name</Label><Input className="mt-1" value={form.first_name} onChange={e => set("first_name", e.target.value)} /></div>
            <div><Label className="text-xs">Last name</Label><Input className="mt-1" value={form.last_name} onChange={e => set("last_name", e.target.value)} /></div>
            <div><Label className="text-xs">Display name</Label><Input className="mt-1" value={form.display_name} onChange={e => set("display_name", e.target.value)} /></div>
            <div>
              <Label className="text-xs flex items-center gap-1"><Mail className="h-3 w-3" /> Email</Label>
              <Input className="mt-1" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</Label>
              <Input className="mt-1" value={form.phone} onChange={e => set("phone", e.target.value)} />
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gradient-primary text-primary-foreground">
            <Check className="h-3.5 w-3.5 mr-1.5" /> {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Password */}
        <div className="bg-card rounded-xl border shadow-card p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Lock className="h-4 w-4 text-primary" /> Change Password</h3>
          <div className="space-y-3">
            <div><Label className="text-xs">Current password</Label><Input className="mt-1" type="password" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} /></div>
            <div><Label className="text-xs">New password</Label><Input className="mt-1" type="password" value={pwForm.new_pw} onChange={e => setPwForm(p => ({ ...p, new_pw: e.target.value }))} /></div>
            <div><Label className="text-xs">Confirm new password</Label><Input className="mt-1" type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} /></div>
          </div>
          <Button variant="outline" onClick={handlePasswordChange}>Update Password</Button>
        </div>
      </div>
    </>
  );
}
