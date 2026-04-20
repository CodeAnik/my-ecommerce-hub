import { useState } from "react";
import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function NewsletterSection() {
  const { settings } = useStoreSettings();
  const n = settings.homepage.newsletter;
  const [email, setEmail] = useState("");
  if (!n.enabled) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Thanks — check your inbox.");
    setEmail("");
  };

  return (
    <section className="container max-w-7xl mx-auto px-4 py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-8 md:p-12 text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_white_0%,_transparent_50%)] opacity-10" />
        <div className="relative max-w-xl mx-auto text-center space-y-4">
          <Mail className="h-10 w-10 mx-auto opacity-80" />
          <h2 className="text-2xl md:text-3xl font-bold">{n.heading}</h2>
          <p className="opacity-90">{n.subheading}</p>
          <form onSubmit={submit} className="flex gap-2 max-w-md mx-auto pt-2">
            <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="bg-background/20 border-background/30 placeholder:text-primary-foreground/60 text-primary-foreground" />
            <Button type="submit" variant="secondary" className="shrink-0">{n.buttonText}</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
