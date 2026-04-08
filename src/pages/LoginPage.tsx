import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Store, Mail, Lock, Info } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login, isLoading, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  if (isAuthenticated) {
    const target = role === "customer" ? "/dashboard" : "/admin";
    navigate(target, { replace: true });
    return null;
  }

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email format";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await login(email, password);
    if (ok) {
      toast.success("Welcome back!");
      navigate("/redirect");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center space-y-6">
          <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto">
            <Store className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground">Welcome to MyStore</h2>
          <p className="text-primary-foreground/70 text-sm leading-relaxed">
            Manage your orders, track shipments, and explore your personalized dashboard.
          </p>
          <div className="flex justify-center gap-2 pt-4">
            {[0, 1, 2].map(i => (
              <div key={i} className={`h-1.5 rounded-full ${i === 0 ? "w-8 bg-primary" : "w-1.5 bg-primary-foreground/30"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
              <Store className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight">Sign in to your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your credentials to access your dashboard</p>
          </div>

          {/* Demo role hint */}
          <div className="bg-info/10 border border-info/20 rounded-lg p-3 flex items-start gap-2">
            <Info className="h-4 w-4 text-info mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p className="font-semibold text-foreground">Demo Login Hints:</p>
              <p><strong>Customer:</strong> any email (e.g. sarah@example.com)</p>
              <p><strong>Admin:</strong> email with "admin" (e.g. admin@store.com)</p>
              <p><strong>Editor:</strong> email with "editor" (e.g. editor@store.com)</p>
              <p><strong>Manager:</strong> email with "manager" (e.g. manager@store.com)</p>
              <p className="text-muted-foreground">Any password with 6+ chars</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-10" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">Remember me</Label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full gradient-primary text-primary-foreground h-11 font-semibold">
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Social login placeholders */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-background px-3 text-muted-foreground">or continue with</span></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-11" type="button">
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </Button>
            <Button variant="outline" className="h-11" type="button">
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.18 0-.36-.02-.53-.06.02-.18.04-.39.04-.56 0-1.12.535-2.22 1.235-3.02.75-.86 2.03-1.56 2.97-1.56.12 0 .24.02.35.04.03.15.05.33.05.49h.04zm3.24 17.6c-.63 1.14-1.34 2.24-2.4 2.24-.64 0-1.11-.38-1.85-.38-.76 0-1.29.39-1.89.39-1.02 0-1.77-1.14-2.4-2.26-1.37-2.38-1.56-5.2-.69-6.7.63-1.06 1.7-1.7 2.69-1.7.85 0 1.47.42 1.97.42.48 0 1.1-.44 2.05-.44.75 0 1.77.29 2.44 1.16-2.13 1.17-1.78 4.22.37 5.04-.43 1.04-.77 1.5-1.3 2.23h.01z"/></svg>
              Apple
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
