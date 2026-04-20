import { useState } from "react";
import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const { settings } = useStoreSettings();
  const c = settings.contact;
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Message sent to ${c.formRecipient}`);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <section className="container max-w-7xl mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Get in touch</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">{c.heroText}</p>
      </section>

      <section className="container max-w-7xl mx-auto px-4 pb-16 grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><MapPin className="h-5 w-5 text-primary" /></div>
              <div><p className="text-sm font-semibold">Address</p><p className="text-sm text-muted-foreground whitespace-pre-line">{c.address}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Phone className="h-5 w-5 text-primary" /></div>
              <div><p className="text-sm font-semibold">Phone</p><p className="text-sm text-muted-foreground">{c.phone}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Mail className="h-5 w-5 text-primary" /></div>
              <div><p className="text-sm font-semibold">Email</p><p className="text-sm text-muted-foreground">{c.email}</p></div>
            </div>
          </div>
          {c.mapEmbedUrl && (
            <div className="rounded-2xl overflow-hidden border aspect-video">
              <iframe src={c.mapEmbedUrl} className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map" />
            </div>
          )}
        </div>

        {c.formEnabled && (
          <form onSubmit={submit} className="bg-card border rounded-2xl p-6 shadow-card space-y-4 h-fit">
            <h2 className="text-xl font-semibold">Send a message</h2>
            <div className="space-y-2"><Label>Name</Label><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Message</Label><Textarea rows={5} required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground"><Send className="h-4 w-4 mr-2" /> Send message</Button>
          </form>
        )}
      </section>
    </>
  );
}
