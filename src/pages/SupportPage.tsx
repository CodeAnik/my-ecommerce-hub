import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockFAQs } from "@/data/mock-data";
import { HelpCircle, MessageCircle, Mail, Phone, ChevronDown, Send, Ticket } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const sendTicket = () => {
    if (!message.trim()) { toast.error("Please enter a message"); return; }
    // Replace with WP support ticket endpoint
    toast.success("Support ticket submitted!");
    setMessage("");
  };

  return (
    <>
      <DashboardHeader title="Support" breadcrumb={["Dashboard", "Support"]} />
      <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
        {/* Contact options */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: MessageCircle, label: "Live Chat", desc: "Chat with our support team", action: "Start Chat" },
            { icon: Mail, label: "Email Us", desc: "support@mystore.com", action: "Send Email" },
            { icon: Phone, label: "Call Us", desc: "+1 (555) 000-1234", action: "Call Now" },
          ].map(opt => (
            <div key={opt.label} className="bg-card rounded-xl border shadow-card p-5 text-center space-y-3">
              <div className="h-11 w-11 rounded-lg gradient-primary flex items-center justify-center mx-auto">
                <opt.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="text-sm font-semibold">{opt.label}</p>
              <p className="text-xs text-muted-foreground">{opt.desc}</p>
              <Button variant="outline" size="sm" className="w-full">{opt.action}</Button>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* FAQ */}
          <div className="bg-card rounded-xl border shadow-card p-5">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"><HelpCircle className="h-4 w-4 text-primary" /> Frequently Asked Questions</h3>
            <div className="space-y-2">
              {mockFAQs.map((faq, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-3 text-sm font-medium text-left hover:bg-muted/50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {faq.question}
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-3 pb-3 text-sm text-muted-foreground animate-fade-in">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact form + recent tickets */}
          <div className="space-y-4">
            <div className="bg-card rounded-xl border shadow-card p-5">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"><Send className="h-4 w-4 text-primary" /> Submit a Ticket</h3>
              <div className="space-y-3">
                <Input placeholder="Subject" className="h-9" />
                <Textarea placeholder="Describe your issue..." className="min-h-[100px]" value={message} onChange={e => setMessage(e.target.value)} />
                <Button onClick={sendTicket} className="gradient-primary text-primary-foreground w-full"><Send className="h-3.5 w-3.5 mr-1.5" /> Submit</Button>
              </div>
            </div>

            {/* Recent tickets placeholder */}
            <div className="bg-card rounded-xl border shadow-card p-5">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3"><Ticket className="h-4 w-4 text-primary" /> Recent Tickets</h3>
              {[
                { id: "#T-001", subject: "Missing item in order #1040", status: "Open", date: "Apr 3, 2026" },
                { id: "#T-002", subject: "Request refund for order #1038", status: "Resolved", date: "Mar 15, 2026" },
              ].map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted mb-2 last:mb-0">
                  <div>
                    <p className="text-sm font-medium">{t.subject}</p>
                    <p className="text-xs text-muted-foreground">{t.id} · {t.date}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.status === "Open" ? "bg-info/10 text-info" : "bg-success/10 text-success"}`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
