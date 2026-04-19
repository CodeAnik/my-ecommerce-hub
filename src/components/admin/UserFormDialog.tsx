import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserRole } from "@/data/mock-data";
import { toast } from "sonner";

export interface UserFormValue {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: Partial<UserFormValue> | null;
  onSubmit: (val: UserFormValue) => void;
}

const empty: UserFormValue = {
  first_name: "", last_name: "", email: "", phone: "", role: "customer", password: "",
};

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "administrator", label: "Administrator" },
  { value: "editor", label: "Editor" },
  { value: "shop_manager", label: "Shop Manager" },
  { value: "customer", label: "Customer" },
];

export function UserFormDialog({ open, onOpenChange, initial, onSubmit }: Props) {
  const [val, setVal] = useState<UserFormValue>(empty);

  useEffect(() => {
    if (open) setVal({ ...empty, ...(initial || {}) });
  }, [open, initial]);

  const set = <K extends keyof UserFormValue>(k: K, v: UserFormValue[K]) =>
    setVal(prev => ({ ...prev, [k]: v }));

  const handleSave = () => {
    if (!val.first_name.trim()) return toast.error("First name is required");
    if (!val.email.trim() || !val.email.includes("@")) return toast.error("Valid email required");
    if (!val.role) return toast.error("Role is required");
    if (!val.id && !val.password) return toast.error("Password required for new users");
    onSubmit(val);
    toast.success(val.id ? "User updated" : "User created");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{val.id ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">First Name <span className="text-destructive">*</span></Label>
              <Input value={val.first_name} onChange={e => set("first_name", e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Last Name</Label>
              <Input value={val.last_name} onChange={e => set("last_name", e.target.value)} />
            </div>
          </div>
          <div>
            <Label className="text-xs">Email <span className="text-destructive">*</span></Label>
            <Input type="email" value={val.email} onChange={e => set("email", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Phone</Label>
              <Input value={val.phone} onChange={e => set("phone", e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Role <span className="text-destructive">*</span></Label>
              <Select value={val.role} onValueChange={v => set("role", v as UserRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {roleOptions.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {!val.id && (
            <div>
              <Label className="text-xs">Password <span className="text-destructive">*</span></Label>
              <Input type="password" value={val.password || ""} onChange={e => set("password", e.target.value)} />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="gradient-primary text-primary-foreground" onClick={handleSave}>
            {val.id ? "Save Changes" : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
