import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Store, CreditCard, Truck, Bell, Shield, Save, Home, FileText, MessageSquare, Layers, Database, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { SiteSettingsPanel } from "@/components/admin/settings/SiteSettingsPanel";
import { HomepagePanel } from "@/components/admin/settings/HomepagePanel";
import { PoliciesPanel } from "@/components/admin/settings/PoliciesPanel";
import { ContactPanel } from "@/components/admin/settings/ContactPanel";
import { ReviewsPanel } from "@/components/admin/settings/ReviewsPanel";
import { PresetsPanel } from "@/components/admin/settings/PresetsPanel";
import { ClonePanel } from "@/components/admin/settings/ClonePanel";

type SectionId = "site" | "homepage" | "policies" | "contact" | "reviews" | "presets" | "clone" | "payments" | "shipping" | "notifications" | "security";

interface SettingsSection {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
  adminOnly?: boolean;
}

const ALL_SECTIONS: SettingsSection[] = [
  { id: "site", label: "Site Settings", icon: Store, group: "Branding" },
  { id: "presets", label: "Branding Presets", icon: Layers, group: "Branding" },

  { id: "homepage", label: "Homepage", icon: Home, group: "Content" },
  { id: "policies", label: "Policy Pages", icon: FileText, group: "Content" },
  { id: "contact", label: "Contact Page", icon: Mail, group: "Content" },
  { id: "reviews", label: "Reviews", icon: MessageSquare, group: "Content" },

  { id: "payments", label: "Payments", icon: CreditCard, group: "System", adminOnly: true },
  { id: "shipping", label: "Shipping", icon: Truck, group: "System", adminOnly: true },
  { id: "notifications", label: "Notifications", icon: Bell, group: "System", adminOnly: true },
  { id: "security", label: "Security", icon: Shield, group: "System", adminOnly: true },
  { id: "clone", label: "Clone / Template", icon: Database, group: "System", adminOnly: true },
];

export default function AdminSettingsPage() {
  const { role } = useAuth();
  const isAdmin = role === "administrator";
  const sections = useMemo(() => ALL_SECTIONS.filter(s => isAdmin || !s.adminOnly), [isAdmin]);
  const [activeSection, setActiveSection] = useState<SectionId>("site");

  const groups = useMemo(() => {
    const map = new Map<string, SettingsSection[]>();
    sections.forEach(s => { if (!map.has(s.group)) map.set(s.group, []); map.get(s.group)!.push(s); });
    return Array.from(map.entries());
  }, [sections]);

  return (
    <>
      <DashboardHeader title="Settings" breadcrumb={["Admin", "Settings"]} />
      <div className="p-4 lg:p-6 animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar nav */}
          <aside className="lg:w-60 shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {groups.map(([group, items]) => (
                <div key={group} className="lg:space-y-1 flex lg:block gap-1">
                  <p className="hidden lg:block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground px-3 pt-3 pb-1">{group}</p>
                  {items.map(s => (
                    <button key={s.id} onClick={() => setActiveSection(s.id)}
                      className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors w-full",
                        activeSection === s.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                      <s.icon className="h-4 w-4 shrink-0" />
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </nav>
            {!isAdmin && (
              <p className="hidden lg:block mt-4 px-3 text-xs text-muted-foreground italic">Editor mode — system settings hidden.</p>
            )}
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 max-w-4xl">
            {activeSection === "site" && <SiteSettingsPanel />}
            {activeSection === "homepage" && <HomepagePanel />}
            {activeSection === "policies" && <PoliciesPanel />}
            {activeSection === "contact" && <ContactPanel />}
            {activeSection === "reviews" && <ReviewsPanel />}
            {activeSection === "presets" && <PresetsPanel />}
            {activeSection === "clone" && isAdmin && <ClonePanel />}

            {activeSection === "payments" && isAdmin && (
              <div className="bg-card rounded-xl border p-6 shadow-card space-y-6">
                <div>
                  <h3 className="text-base font-semibold mb-1">Payment methods</h3>
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

            {activeSection === "shipping" && isAdmin && (
              <div className="bg-card rounded-xl border p-6 shadow-card space-y-6">
                <div>
                  <h3 className="text-base font-semibold mb-1">Shipping zones</h3>
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

            {activeSection === "notifications" && isAdmin && (
              <div className="bg-card rounded-xl border p-6 shadow-card space-y-6">
                <div>
                  <h3 className="text-base font-semibold mb-1">Email notifications</h3>
                  <p className="text-sm text-muted-foreground">Manage notification preferences</p>
                </div>
                <Separator />
                {[
                  { name: "New order", desc: "Receive when a new order is placed", enabled: true },
                  { name: "Order status change", desc: "When order status changes", enabled: true },
                  { name: "Low stock", desc: "When product stock is low", enabled: true },
                  { name: "New customer", desc: "When new customer registers", enabled: false },
                  { name: "Product review", desc: "When product gets reviewed", enabled: false },
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

            {activeSection === "security" && isAdmin && (
              <div className="bg-card rounded-xl border p-6 shadow-card space-y-6">
                <div>
                  <h3 className="text-base font-semibold mb-1">Security settings</h3>
                  <p className="text-sm text-muted-foreground">Manage store security</p>
                </div>
                <Separator />
                <div className="space-y-4">
                  {[
                    { name: "Two-Factor Authentication", desc: "Require 2FA for admin login", checked: false },
                    { name: "SSL Enforcement", desc: "Force HTTPS on all pages", checked: true },
                    { name: "Login Rate Limiting", desc: "Limit login attempts", checked: true },
                  ].map(item => (
                    <div key={item.name} className="flex items-center justify-between p-3">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch defaultChecked={item.checked} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
