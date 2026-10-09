import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AlertTriangle, ClipboardList, Inbox, Package, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { ORDER_STATUS_LABELS, formatCad, type Order, type Inquiry, type InventoryItem } from "@/types/crm";
import { startOfDay, endOfDay } from "date-fns";

export default function CrmDashboardPage() {
  const todayStart = startOfDay(new Date()).toISOString();
  const todayEnd = endOfDay(new Date()).toISOString();

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["crm", "orders", "dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, customer:customers(*)")
        .not("status", "in", '("picked_up","cancelled")')
        .order("due_at", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data as Order[];
    },
  });

  const { data: lowStock = [] } = useQuery({
    queryKey: ["crm", "inventory", "low"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .eq("active", true)
        .neq("sku", "OWN-STRING");
      if (error) throw error;
      return (data as InventoryItem[]).filter((i) => i.quantity_on_hand <= i.reorder_level);
    },
  });

  const { data: dueToday = [] } = useQuery({
    queryKey: ["crm", "orders", "due-today", todayStart],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, customer:customers(*)")
        .gte("due_at", todayStart)
        .lte("due_at", todayEnd)
        .not("status", "in", '("picked_up","cancelled")');
      if (error) throw error;
      return data as Order[];
    },
  });

  const { data: inquiries = [] } = useQuery({
    queryKey: ["crm", "inquiries", "new"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .eq("status", "new")
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data as Inquiry[];
    },
  });

  const { data: customerCount = 0 } = useQuery({
    queryKey: ["crm", "customers", "count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: "Open jobs", value: orders.length, icon: ClipboardList, to: "/crm/orders" },
    { label: "Due today", value: dueToday.length, icon: ClipboardList, to: "/crm/orders" },
    { label: "Low stock", value: lowStock.length, icon: Package, to: "/crm/inventory" },
    { label: "New inquiries", value: inquiries.length, icon: Inbox, to: "/crm/inquiries" },
    { label: "Customers", value: customerCount, icon: Users, to: "/crm/customers" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Operations overview for RW Stringing.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card className="card-premium h-full hover:border-accent/40 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display font-bold">{ordersLoading && s.label === "Open jobs" ? "…" : s.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card/60">
          <CardHeader>
            <CardTitle className="text-lg">Open jobs by status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(["received", "in_progress", "ready"] as const).map((status) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{ORDER_STATUS_LABELS[status]}</span>
                <Badge variant="secondary">{byStatus[status] || 0}</Badge>
              </div>
            ))}
            {orders.slice(0, 6).map((order) => (
              <Link
                key={order.id}
                to={`/crm/orders?id=${order.id}`}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 hover:bg-secondary/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{order.customer?.name ?? "Customer"}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.string_brand} {order.string_model} · {formatCad(order.price_cents)}
                  </p>
                </div>
                <Badge variant="outline">{ORDER_STATUS_LABELS[order.status]}</Badge>
              </Link>
            ))}
            {!orders.length && !ordersLoading && (
              <p className="text-sm text-muted-foreground">No open jobs.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card/60">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-accent" />
              Needs attention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Low stock</p>
              {lowStock.length === 0 ? (
                <p className="text-sm text-muted-foreground">All stock levels look good.</p>
              ) : (
                <ul className="space-y-2">
                  {lowStock.slice(0, 5).map((item) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.brand} {item.name}
                      </span>
                      <span className="text-destructive font-medium">
                        {item.quantity_on_hand} / {item.reorder_level}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Recent inquiries</p>
              {inquiries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No new inquiries.</p>
              ) : (
                <ul className="space-y-2">
                  {inquiries.map((inq) => (
                    <li key={inq.id}>
                      <Link
                        to="/crm/inquiries"
                        className="block rounded-lg border border-border px-3 py-2 hover:bg-secondary/50"
                      >
                        <p className="text-sm font-medium">{inq.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{inq.message}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
