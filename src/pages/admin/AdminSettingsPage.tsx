import { useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Store, Globe, CreditCard, Truck, Bell, Shield, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsSections = [
  { id: "general", label: "General", icon: Store },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("general");

  return (
    <>
      <DashboardHeader title="Settings" breadcrumb={["Admin", "Settings"]} />
      <div className="p-4 lg:p-6 animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar nav */}
          <div className="lg:w-56 shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {settingsSections.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={cn("flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                    activeSection === s.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                  <s.icon className="h-4 w-4 shrink-0" />
                  <span>{s.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 max-w-2xl">
            {activeSection === "general" && (
              <div className="bg-card rounded-xl border p-6 shadow-card space-y-6">
                <div>
                  <h3 className="text-base font-semibold mb-1">Store Information</h3>
                  <p className="text-sm text-muted-foreground">Basic store settings and branding</p>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Store Name</Label>
                    <Input defaultValue="MyStore" />
                  </div>
                  <div className="space-y-2">
                    <Label>Store URL</Label>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Input defaultValue="https://mystore.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Store Email</Label>
                    <Input defaultValue="hello@mystore.com" type="email" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Input defaultValue="USD ($)" />
                    </div>
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Input defaultValue="America/New_York" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button className="gradient-primary text-primary-foreground" onClick={() => toast.success("Settings saved")}>
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </Button>
                </div>
              </div>
            )}

            {activeSection === "payments" && (
              <div className="bg-card rounded-xl border p-6 shadow-card space-y-6">
                <div>
                  <h3 className="text-base font-semibold mb-1">Payment Methods</h3>
                  <p className="text-sm text-muted-foreground">Configure payment gateways</p>
                </div>
                <Separator />
                {[
                  { name: "Stripe", desc: "Accept cards via Stripe", enabled: true },
                  { name: "PayPal", desc: "Accept PayPal payments", enabled: true },
                  { name: "Bank Transfer", desc: "Direct bank transfer", enabled: false },
                  { name: "Cash on Delivery", desc: "Pay on delivery", enabled: false },
                ].map(pm => (
                  <div key={pm.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
                    <div>
                      <p className="text-sm font-semibold">{pm.name}</p>
                      <p className="text-xs text-muted-foreground">{pm.desc}</p>
                    </div>
                    <Switch defaultChecked={pm.enabled} />
                  </div>
                ))}
              </div>
            )}

            {activeSection === "shipping" && (
              <div className="bg-card rounded-xl border p-6 shadow-card space-y-6">
                <div>
                  <h3 className="text-base font-semibold mb-1">Shipping Zones</h3>
                  <p className="text-sm text-muted-foreground">Manage shipping methods and rates</p>
                </div>
                <Separator />
                {[
                  { zone: "Domestic (US)", method: "Flat Rate", rate: "$5.00" },
                  { zone: "Canada", method: "Flat Rate", rate: "$12.00" },
                  { zone: "International", method: "Calculated", rate: "Varies" },
                ].map(sz => (
                  <div key={sz.zone} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
                    <div>
                      <p className="text-sm font-semibold">{sz.zone}</p>
                      <p className="text-xs text-muted-foreground">{sz.method} · {sz.rate}</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">Edit</Button>
                  </div>
                ))}
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="bg-card rounded-xl border p-6 shadow-card space-y-6">
                <div>
                  <h3 className="text-base font-semibold mb-1">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Manage notification preferences</p>
                </div>
                <Separator />
                {[
                  { name: "New Order", desc: "Receive when a new order is placed", enabled: true },
                  { name: "Order Status Change", desc: "When order status changes", enabled: true },
                  { name: "Low Stock", desc: "When product stock is low", enabled: true },
                  { name: "New Customer", desc: "When new customer registers", enabled: false },
                  { name: "Product Review", desc: "When product gets reviewed", enabled: false },
                ].map(n => (
                  <div key={n.name} className="flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm font-medium">{n.name}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                    <Switch defaultChecked={n.enabled} />
                  </div>
                ))}
              </div>
            )}

            {activeSection === "security" && (
              <div className="bg-card rounded-xl border p-6 shadow-card space-y-6">
                <div>
                  <h3 className="text-base font-semibold mb-1">Security Settings</h3>
                  <p className="text-sm text-muted-foreground">Manage store security</p>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm font-medium">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Require 2FA for admin login</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm font-medium">SSL Enforcement</p>
                      <p className="text-xs text-muted-foreground">Force HTTPS on all pages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm font-medium">Login Rate Limiting</p>
                      <p className="text-xs text-muted-foreground">Limit login attempts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
