import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { ORDER_STATUS_LABELS, formatCad, type Customer, type Order } from "@/types/crm";

export default function CrmCustomerDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: customer, isLoading } = useQuery({
    queryKey: ["crm", "customers", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").eq("id", id!).single();
      if (error) throw error;
      return data as Customer;
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["crm", "orders", "by-customer", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", id!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Order[];
    },
  });

  if (isLoading) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  if (!customer) {
    return (
      <div className="space-y-4">
        <p>Customer not found.</p>
        <Button asChild variant="outline">
          <Link to="/crm/customers">Back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2 gap-1">
          <Link to="/crm/customers">
            <ArrowLeft className="h-4 w-4" /> Customers
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold">{customer.name}</h1>
          {customer.is_phoenix_team && (
            <Badge className="bg-red-500/15 text-red-400 hover:bg-red-500/15">Member</Badge>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Email</CardTitle>
          </CardHeader>
          <CardContent>{customer.email || "—"}</CardContent>
        </Card>
        <Card className="border-border bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Phone</CardTitle>
          </CardHeader>
          <CardContent>{customer.phone || "—"}</CardContent>
        </Card>
        <Card className="border-border bg-card/60 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{customer.notes || "—"}</CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-semibold">Order history</h2>
          <Button asChild size="sm" className="btn-gold">
            <Link to={`/crm/orders?customer=${customer.id}`}>New order</Link>
          </Button>
        </div>
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>String</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    No orders yet.
                  </TableCell>
                </TableRow>
              )}
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="text-sm">
                    {new Date(o.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {o.string_brand} {o.string_model}
                    {o.racket_model && (
                      <span className="block text-xs text-muted-foreground">{o.racket_model}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{ORDER_STATUS_LABELS[o.status]}</Badge>
                  </TableCell>
                  <TableCell>{formatCad(o.price_cents)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
