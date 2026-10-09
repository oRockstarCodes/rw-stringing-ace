import { FormEvent, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Plus, Filter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/crm/AuthProvider";
import { supabase } from "@/lib/supabase";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  formatCad,
  type Customer,
  type InventoryItem,
  type Order,
  type OrderStatus,
  type Profile,
} from "@/types/crm";

type OrderForm = {
  customer_id: string;
  status: OrderStatus;
  racket_model: string;
  inventory_item_id: string;
  tension_mains: string;
  tension_crosses: string;
  hybrid_notes: string;
  include_grip: boolean;
  include_grommet: boolean;
  price_cents: string;
  is_team_price: boolean;
  assigned_to: string;
  due_at: string;
  notes: string;
};

const emptyForm = (customerId = ""): OrderForm => ({
  customer_id: customerId,
  status: "received",
  racket_model: "",
  inventory_item_id: "",
  tension_mains: "24",
  tension_crosses: "26",
  hybrid_notes: "",
  include_grip: false,
  include_grommet: false,
  price_cents: "",
  is_team_price: false,
  assigned_to: "",
  due_at: "",
  notes: "",
});

export default function CrmOrdersPage() {
  const { canWrite, user } = useAuth();
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();
  const statusFilter = params.get("status") || "open";
  const customerPrefill = params.get("customer") || "";
  const focusId = params.get("id");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [form, setForm] = useState<OrderForm>(emptyForm(customerPrefill));

  useEffect(() => {
    if (customerPrefill && canWrite) {
      setForm(emptyForm(customerPrefill));
      setEditing(null);
      setOpen(true);
      setParams((p) => {
        const next = new URLSearchParams(p);
        next.delete("customer");
        return next;
      }, { replace: true });
    }
  }, [customerPrefill, canWrite, setParams]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["crm", "orders", statusFilter],
    queryFn: async () => {
      let q = supabase
        .from("orders")
        .select("*, customer:customers(*), inventory_item:inventory_items(*), assignee:profiles(*)")
        .order("created_at", { ascending: false });

      if (statusFilter === "open") {
        q = q.not("status", "in", '("picked_up","cancelled")');
      } else if (statusFilter !== "all") {
        q = q.eq("status", statusFilter);
      }

      const { data, error } = await q;
      if (error) throw error;
      return data as Order[];
    },
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["crm", "customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").order("name");
      if (error) throw error;
      return data as Customer[];
    },
  });

  const { data: strings = [] } = useQuery({
    queryKey: ["crm", "inventory", "strings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .eq("category", "string")
        .eq("active", true)
        .order("brand")
        .order("name");
      if (error) throw error;
      return data as InventoryItem[];
    },
  });

  const { data: staff = [] } = useQuery({
    queryKey: ["crm", "profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("full_name");
      if (error) throw error;
      return data as Profile[];
    },
  });

  const selectedItem = useMemo(
    () => strings.find((s) => s.id === form.inventory_item_id),
    [strings, form.inventory_item_id],
  );

  useEffect(() => {
    if (!selectedItem || editing) return;
    const cents = form.is_team_price ? selectedItem.team_price_cents : selectedItem.sell_price_cents;
    setForm((f) => ({ ...f, price_cents: String(cents) }));
  }, [selectedItem, form.is_team_price, editing]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const item = strings.find((s) => s.id === form.inventory_item_id);
      const payload = {
        customer_id: form.customer_id,
        status: form.status,
        racket_model: form.racket_model.trim() || null,
        inventory_item_id: form.inventory_item_id || null,
        string_brand: item?.brand ?? null,
        string_model: item?.name ?? null,
        tension_mains: form.tension_mains ? Number(form.tension_mains) : null,
        tension_crosses: form.tension_crosses ? Number(form.tension_crosses) : null,
        hybrid_notes: form.hybrid_notes.trim() || null,
        include_grip: form.include_grip,
        include_grommet: form.include_grommet,
        price_cents: Number(form.price_cents) || 0,
        is_team_price: form.is_team_price,
        assigned_to: form.assigned_to || null,
        due_at: form.due_at ? new Date(form.due_at).toISOString() : null,
        notes: form.notes.trim() || null,
      };

      if (editing) {
        const { error } = await supabase.from("orders").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("orders").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm", "orders"] });
      qc.invalidateQueries({ queryKey: ["crm", "inventory"] });
      toast.success(editing ? "Order updated" : "Order created");
      setOpen(false);
      setEditing(null);
      setForm(emptyForm());
      if (params.get("id")) {
        setParams((p) => {
          const next = new URLSearchParams(p);
          next.delete("id");
          return next;
        }, { replace: true });
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm", "orders"] });
      qc.invalidateQueries({ queryKey: ["crm", "inventory"] });
      toast.success("Status updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const openCreate = () => {
    setEditing(null);
    const customer = customers.find((c) => c.id === form.customer_id);
    setForm({
      ...emptyForm(),
      assigned_to: user?.id ?? "",
      is_team_price: customer?.is_phoenix_team ?? false,
    });
    setOpen(true);
  };

  const openEdit = (order: Order) => {
    setEditing(order);
    setForm({
      customer_id: order.customer_id,
      status: order.status,
      racket_model: order.racket_model ?? "",
      inventory_item_id: order.inventory_item_id ?? "",
      tension_mains: order.tension_mains != null ? String(order.tension_mains) : "",
      tension_crosses: order.tension_crosses != null ? String(order.tension_crosses) : "",
      hybrid_notes: order.hybrid_notes ?? "",
      include_grip: order.include_grip,
      include_grommet: order.include_grommet,
      price_cents: String(order.price_cents),
      is_team_price: order.is_team_price,
      assigned_to: order.assigned_to ?? "",
      due_at: order.due_at ? order.due_at.slice(0, 16) : "",
      notes: order.notes ?? "",
    });
    setOpen(true);
  };

  useEffect(() => {
    if (!focusId || !orders.length) return;
    const order = orders.find((o) => o.id === focusId);
    if (order) openEdit(order);
  }, [focusId, orders]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.customer_id) {
      toast.error("Select a customer");
      return;
    }
    saveMutation.mutate();
  };

  const setFilter = (value: string) => {
    setParams((p) => {
      const next = new URLSearchParams(p);
      if (value === "open") next.delete("status");
      else next.set("status", value);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">Stringing jobs from drop-off to pickup.</p>
        </div>
        {canWrite && (
          <Button className="btn-gold gap-2" onClick={openCreate}>
            <Plus className="h-4 w-4" /> New order
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {[
          { value: "open", label: "Open" },
          { value: "all", label: "All" },
          ...ORDER_STATUSES.map((s) => ({ value: s, label: ORDER_STATUS_LABELS[s] })),
        ].map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={statusFilter === f.value || (f.value === "open" && !params.get("status")) ? "default" : "outline"}
            className={
              statusFilter === f.value || (f.value === "open" && !params.get("status"))
                ? "btn-gold"
                : ""
            }
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="rounded-xl border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-40" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground">
                  No orders match this filter.
                </TableCell>
              </TableRow>
            )}
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <p className="font-medium">{order.customer?.name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.assignee?.full_name ? `Assigned: ${order.assignee.full_name}` : "Unassigned"}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">
                    {order.string_brand} {order.string_model}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.racket_model || "Racket n/a"}
                    {order.tension_mains != null &&
                      ` · ${order.tension_mains}/${order.tension_crosses ?? "—"} lbs`}
                  </p>
                </TableCell>
                <TableCell>
                  {canWrite ? (
                    <Select
                      value={order.status}
                      onValueChange={(v) =>
                        statusMutation.mutate({ id: order.id, status: v as OrderStatus })
                      }
                    >
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {ORDER_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="outline">{ORDER_STATUS_LABELS[order.status]}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {order.due_at ? new Date(order.due_at).toLocaleString() : "—"}
                </TableCell>
                <TableCell>
                  {formatCad(order.price_cents)}
                  {order.is_team_price && (
                    <span className="block text-[10px] text-red-400">Member</span>
                  )}
                </TableCell>
                <TableCell>
                  {canWrite && (
                    <Button variant="outline" size="sm" onClick={() => openEdit(order)}>
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit order" : "New order"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Customer</Label>
              <Select
                value={form.customer_id}
                onValueChange={(v) => {
                  const c = customers.find((x) => x.id === v);
                  setForm((f) => ({
                    ...f,
                    customer_id: v,
                    is_team_price: c?.is_phoenix_team ?? f.is_team_price,
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                      {c.is_phoenix_team ? " (Member)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>String / inventory</Label>
              <Select
                value={form.inventory_item_id}
                onValueChange={(v) => setForm((f) => ({ ...f, inventory_item_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select string" />
                </SelectTrigger>
                <SelectContent>
                  {strings.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.brand} {s.name} ({s.quantity_on_hand} left)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="racket">Racket model</Label>
              <Input
                id="racket"
                value={form.racket_model}
                onChange={(e) => setForm((f) => ({ ...f, racket_model: e.target.value }))}
                placeholder="e.g. Astrox 88D Pro"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tm">Tension mains</Label>
                <Input
                  id="tm"
                  type="number"
                  step="0.5"
                  value={form.tension_mains}
                  onChange={(e) => setForm((f) => ({ ...f, tension_mains: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tc">Tension crosses</Label>
                <Input
                  id="tc"
                  type="number"
                  step="0.5"
                  value={form.tension_crosses}
                  onChange={(e) => setForm((f) => ({ ...f, tension_crosses: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hybrid">Hybrid notes</Label>
              <Input
                id="hybrid"
                value={form.hybrid_notes}
                onChange={(e) => setForm((f) => ({ ...f, hybrid_notes: e.target.value }))}
                placeholder="Mains / crosses combo"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.include_grip}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, include_grip: v === true }))}
                />
                Grip
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.include_grommet}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, include_grommet: v === true }))}
                />
                Grommets
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.is_team_price}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, is_team_price: v === true }))}
                />
                Member price
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (cents)</Label>
                <Input
                  id="price"
                  type="number"
                  value={form.price_cents}
                  onChange={(e) => setForm((f) => ({ ...f, price_cents: e.target.value }))}
                />
                {form.price_cents && (
                  <p className="text-xs text-muted-foreground">{formatCad(Number(form.price_cents) || 0)}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as OrderStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {ORDER_STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assigned to</Label>
                <Select
                  value={form.assigned_to || "none"}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, assigned_to: v === "none" ? "" : v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {staff.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.full_name || p.id.slice(0, 8)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="due">Due</Label>
                <Input
                  id="due"
                  type="datetime-local"
                  value={form.due_at}
                  onChange={(e) => setForm((f) => ({ ...f, due_at: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="btn-gold" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
