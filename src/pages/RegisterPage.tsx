import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Store, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const { register, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (isAuthenticated) { navigate("/dashboard", { replace: true }); return null; }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.last_name.trim()) e.last_name = "Required";
    if (!form.email) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await register(form);
    if (ok) { toast.success("Account created!"); navigate("/dashboard"); }
  };

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center space-y-6">
          <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto">
            <Store className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground">Join MyStore</h2>
          <p className="text-primary-foreground/70 text-sm leading-relaxed">Create your account and start shopping with exclusive member benefits.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
              <Store className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="first_name">First name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="first_name" placeholder="Sarah" className="pl-10" value={form.first_name} onChange={e => set("first_name", e.target.value)} />
                </div>
                {errors.first_name && <p className="text-xs text-destructive">{errors.first_name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Last name</Label>
                <Input id="last_name" placeholder="Mitchell" value={form.last_name} onChange={e => set("last_name", e.target.value)} />
                {errors.last_name && <p className="text-xs text-destructive">{errors.last_name}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="reg-email" type="email" placeholder="you@example.com" className="pl-10" value={form.email} onChange={e => set("email", e.target.value)} />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="reg-password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10" value={form.password} onChange={e => set("password", e.target.value)} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input id="confirm" type="password" placeholder="••••••••" value={form.confirm} onChange={e => set("confirm", e.target.value)} />
              {errors.confirm && <p className="text-xs text-destructive">{errors.confirm}</p>}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full gradient-primary text-primary-foreground h-11 font-semibold">
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
