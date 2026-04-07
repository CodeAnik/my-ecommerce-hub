import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Pencil, X, Check } from "lucide-react";
import { toast } from "sonner";
import type { WooAddress } from "@/data/mock-data";

function AddressBlock({ label, address, onSave }: { label: string; address: WooAddress; onSave: (a: WooAddress) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(address);
  const set = (k: keyof WooAddress, v: string) => setForm(p => ({ ...p, [k]: v }));

  const save = () => {
    onSave(form);
    setEditing(false);
    toast.success(`${label} address updated`);
  };

  if (!editing) {
    return (
      <div className="bg-card rounded-xl border shadow-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{label} Address</h3>
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}><Pencil className="h-3.5 w-3.5 mr-1" /> Edit</Button>
        </div>
        <div className="text-sm space-y-0.5 text-muted-foreground">
          <p className="text-foreground font-medium">{address.first_name} {address.last_name}</p>
          {address.company && <p>{address.company}</p>}
          <p>{address.address_1}</p>
          {address.address_2 && <p>{address.address_2}</p>}
          <p>{address.city}, {address.state} {address.postcode}</p>
          <p>{address.country}</p>
          <p>{address.phone}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Edit {label} Address</h3>
        <Button variant="ghost" size="sm" onClick={() => { setForm(address); setEditing(false); }}><X className="h-3.5 w-3.5" /></Button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {(["first_name", "last_name", "company", "address_1", "address_2", "city", "state", "postcode", "country", "phone"] as (keyof WooAddress)[]).map(field => (
          <div key={field} className={field === "address_1" || field === "address_2" ? "col-span-2" : ""}>
            <Label className="text-xs capitalize">{field.replace("_", " ")}</Label>
            <Input className="h-9 mt-1" value={form[field]} onChange={e => set(field, e.target.value)} />
          </div>
        ))}
      </div>
      <Button onClick={save} size="sm" className="mt-4 gradient-primary text-primary-foreground"><Check className="h-3.5 w-3.5 mr-1" /> Save Changes</Button>
    </div>
  );
}

export default function AddressesPage() {
  const { customer, updateCustomer } = useAuth();
  if (!customer) return null;

  return (
    <>
      <DashboardHeader title="Addresses" breadcrumb={["Dashboard", "Addresses"]} />
      <div className="p-4 lg:p-6 animate-fade-in">
        <div className="grid lg:grid-cols-2 gap-6">
          <AddressBlock label="Billing" address={customer.billing} onSave={billing => updateCustomer({ billing })} />
          <AddressBlock label="Shipping" address={customer.shipping} onSave={shipping => updateCustomer({ shipping })} />
        </div>
      </div>
    </>
  );
}
