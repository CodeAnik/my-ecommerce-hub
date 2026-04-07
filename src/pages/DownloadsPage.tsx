import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { mockDownloads } from "@/data/mock-data";
import { Download, FileDown, Clock, FileText } from "lucide-react";
import { format } from "date-fns";

export default function DownloadsPage() {
  return (
    <>
      <DashboardHeader title="Downloads" breadcrumb={["Dashboard", "Downloads"]} />
      <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
        {mockDownloads.length === 0 ? (
          <EmptyState icon={Download} title="No downloads" description="You don't have any downloadable products yet." actionLabel="Browse Products" onAction={() => {}} />
        ) : (
          <div className="space-y-3">
            {mockDownloads.map(dl => (
              <div key={dl.id} className="bg-card rounded-xl border shadow-card p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-elevated transition-all">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{dl.name}</p>
                  <p className="text-xs text-muted-foreground">{dl.product_name} · {dl.file_size}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Download className="h-3 w-3" /> {dl.downloads_remaining} remaining</span>
                    {dl.access_expires && (
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Expires {format(new Date(dl.access_expires), "MMM d, yyyy")}</span>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0">
                  <FileDown className="h-3.5 w-3.5 mr-1.5" /> Download
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
