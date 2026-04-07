import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Min 6 characters"); return; }
    if (password !== confirm) { toast.error("Passwords don't match"); return; }
    setLoading(true);
    // Replace with WP password reset endpoint
    await new Promise(r => setTimeout(r, 1200));
    toast.success("Password updated!");
    setLoading(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
            <Store className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter a new password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-pw">New password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="new-pw" type={show ? "text" : "password"} className="pl-10 pr-10" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShow(!show)}>
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-pw">Confirm new password</Label>
            <Input id="confirm-pw" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground h-11 font-semibold">
            {loading ? "Updating..." : "Update password"}
          </Button>
        </form>

        <Link to="/login" className="block text-center text-sm text-muted-foreground hover:text-foreground">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
