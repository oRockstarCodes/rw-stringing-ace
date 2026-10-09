import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/crm/AuthProvider";
import { supabase } from "@/lib/supabase";
import type { Inquiry, InquiryStatus } from "@/types/crm";

const statusLabels: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted",
  closed: "Closed",
};

export default function CrmInquiriesPage() {
  const { canWrite } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<InquiryStatus | "all">("new");

  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ["crm", "inquiries", filter],
    queryFn: async () => {
      let q = supabase.from("inquiries").select("*").order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data, error } = await q;
      if (error) throw error;
      return data as Inquiry[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: InquiryStatus }) => {
      const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm", "inquiries"] });
      toast.success("Inquiry updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const convertMutation = useMutation({
    mutationFn: async (inquiry: Inquiry) => {
      const { data: customer, error: cErr } = await supabase
        .from("customers")
        .insert({
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          notes: `Converted from inquiry: ${inquiry.message}`,
        })
        .select("*")
        .single();
      if (cErr) throw cErr;

      const { error: iErr } = await supabase
        .from("inquiries")
        .update({ status: "converted", customer_id: customer.id })
        .eq("id", inquiry.id);
      if (iErr) throw iErr;

      return customer.id as string;
    },
    onSuccess: (customerId) => {
      qc.invalidateQueries({ queryKey: ["crm", "inquiries"] });
      qc.invalidateQueries({ queryKey: ["crm", "customers"] });
      toast.success("Converted to customer", {
        description: "You can create an order from the customer page.",
        action: {
          label: "View",
          onClick: () => {
            window.location.href = `/crm/customers/${customerId}`;
          },
        },
      });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground mt-1">Messages from the public contact form.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["new", "contacted", "converted", "closed", "all"] as const).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={filter === s ? "default" : "outline"}
            className={filter === s ? "btn-gold" : ""}
            onClick={() => setFilter(s)}
          >
            {s === "all" ? "All" : statusLabels[s]}
          </Button>
        ))}
      </div>

      {isLoading && <p className="text-muted-foreground">Loading…</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {!isLoading && inquiries.length === 0 && (
          <p className="text-muted-foreground col-span-full">No inquiries in this view.</p>
        )}
        {inquiries.map((inq) => (
          <Card key={inq.id} className="border-border bg-card/60">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-lg">{inq.name}</CardTitle>
                  <CardDescription>
                    {[inq.email, inq.phone].filter(Boolean).join(" · ") || "No contact info"}
                  </CardDescription>
                </div>
                <Badge variant="outline">{statusLabels[inq.status]}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {inq.racket_count != null && (
                <p className="text-sm text-muted-foreground">
                  Rackets: <span className="text-foreground font-medium">{inq.racket_count}</span>
                </p>
              )}
              <p className="text-sm whitespace-pre-wrap">{inq.message}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(inq.created_at).toLocaleString()}
              </p>
              {canWrite && (
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={inq.status}
                    onValueChange={(v) =>
                      updateStatus.mutate({ id: inq.id, status: v as InquiryStatus })
                    }
                  >
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(statusLabels) as InquiryStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {statusLabels[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {inq.status !== "converted" && (
                    <Button
                      size="sm"
                      className="btn-gold"
                      onClick={() => convertMutation.mutate(inq)}
                      disabled={convertMutation.isPending}
                    >
                      Convert to customer
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
