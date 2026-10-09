import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/crm/AuthProvider";
import { supabase } from "@/lib/supabase";
import {
  formatCad,
  type InventoryCategory,
  type InventoryItem,
  type InventoryMovement,
  type InventoryUnit,
} from "@/types/crm";
import { cn } from "@/lib/utils";

const categories: InventoryCategory[] = ["string", "grip", "grommet", "other"];
const units: InventoryUnit[] = ["reel", "set", "each"];

const emptyItem = {
  sku: "",
  name: "",
  brand: "",
  category: "string" as InventoryCategory,
  unit: "set" as InventoryUnit,
  quantity_on_hand: "0",
  reorder_level: "5",
  unit_cost_cents: "0",
  sell_price_cents: "0",
  team_price_cents: "0",
};

export default function CrmInventoryPage() {
  const { canWrite, isAdminUser } = useAuth();
  const qc = useQueryClient();
  const [itemOpen, setItemOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState(emptyItem);
  const [adjustDelta, setAdjustDelta] = useState("0");
  const [adjustNote, setAdjustNote] = useState("");
  const [adjustReason, setAdjustReason] = useState<"purchase" | "adjustment" | "return">("adjustment");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["crm", "inventory", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .order("category")
        .order("brand")
        .order("name");
      if (error) throw error;
      return data as InventoryItem[];
    },
  });

  const { data: movements = [] } = useQuery({
    queryKey: ["crm", "inventory", "movements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_movements")
        .select("*, item:inventory_items(*)")
        .order("created_at", { ascending: false })
        .limit(40);
      if (error) throw error;
      return data as InventoryMovement[];
    },
  });

  const lowCount = useMemo(
    () =>
      items.filter(
        (i) => i.active && i.sku !== "OWN-STRING" && i.quantity_on_hand <= i.reorder_level,
      ).length,
    [items],
  );

  const saveItem = useMutation({
    mutationFn: async () => {
      const payload = {
        sku: form.sku.trim() || null,
        name: form.name.trim(),
        brand: form.brand.trim() || null,
        category: form.category,
        unit: form.unit,
        quantity_on_hand: Number(form.quantity_on_hand) || 0,
        reorder_level: Number(form.reorder_level) || 0,
        unit_cost_cents: Number(form.unit_cost_cents) || 0,
        sell_price_cents: Number(form.sell_price_cents) || 0,
        team_price_cents: Number(form.team_price_cents) || 0,
      };
      if (editing) {
        const { quantity_on_hand: _q, ...rest } = payload;
        const { error } = await supabase.from("inventory_items").update(rest).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("inventory_items").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm", "inventory"] });
      toast.success(editing ? "Item updated" : "Item created");
      setItemOpen(false);
      setEditing(null);
      setForm(emptyItem);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const adjustMutation = useMutation({
    mutationFn: async () => {
      if (!adjustItem) return;
      const delta = Number(adjustDelta);
      if (!delta || Number.isNaN(delta)) throw new Error("Enter a non-zero quantity change");
      const { error } = await supabase.rpc("apply_inventory_movement", {
        p_item_id: adjustItem.id,
        p_delta: delta,
        p_reason: adjustReason,
        p_order_id: null,
        p_note: adjustNote.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm", "inventory"] });
      toast.success("Stock adjusted");
      setAdjustOpen(false);
      setAdjustItem(null);
      setAdjustDelta("0");
      setAdjustNote("");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyItem);
    setItemOpen(true);
  };

  const openEdit = (item: InventoryItem) => {
    setEditing(item);
    setForm({
      sku: item.sku ?? "",
      name: item.name,
      brand: item.brand ?? "",
      category: item.category,
      unit: item.unit,
      quantity_on_hand: String(item.quantity_on_hand),
      reorder_level: String(item.reorder_level),
      unit_cost_cents: String(item.unit_cost_cents),
      sell_price_cents: String(item.sell_price_cents),
      team_price_cents: String(item.team_price_cents),
    });
    setItemOpen(true);
  };

  const openAdjust = (item: InventoryItem) => {
    setAdjustItem(item);
    setAdjustDelta("0");
    setAdjustNote("");
    setAdjustReason("adjustment");
    setAdjustOpen(true);
  };

  const handleItemSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    saveItem.mutate();
  };

  const handleAdjustSubmit = (e: FormEvent) => {
    e.preventDefault();
    adjustMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Strings, grips, and parts on hand.
            {lowCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-destructive">
                <AlertTriangle className="h-3.5 w-3.5" />
                {lowCount} low
              </span>
            )}
          </p>
        </div>
        {canWrite && (
          <Button className="btn-gold gap-2" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add item
          </Button>
        )}
      </div>

      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="mt-4">
          <div className="rounded-xl border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Reorder</TableHead>
                  <TableHead>Sell / Member</TableHead>
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
                {items.map((item) => {
                  const low =
                    item.active &&
                    item.sku !== "OWN-STRING" &&
                    item.quantity_on_hand <= item.reorder_level;
                  return (
                    <TableRow key={item.id} className={cn(low && "bg-destructive/5")}>
                      <TableCell>
                        <p className="font-medium">
                          {item.brand} {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.sku || "No SKU"}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className={cn("font-medium", low && "text-destructive")}>
                        {item.quantity_on_hand} {item.unit}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.reorder_level}</TableCell>
                      <TableCell className="text-sm">
                        {formatCad(item.sell_price_cents)}
                        <span className="text-muted-foreground"> / </span>
                        <span className="text-red-400">{formatCad(item.team_price_cents)}</span>
                      </TableCell>
                      <TableCell className="space-x-2">
                        {canWrite && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => openAdjust(item)}>
                              Adjust
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                              Edit
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="movements" className="mt-4">
          <div className="rounded-xl border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Delta</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground">
                      No movements yet.
                    </TableCell>
                  </TableRow>
                )}
                {movements.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(m.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {m.item?.brand} {m.item?.name}
                    </TableCell>
                    <TableCell className={m.delta < 0 ? "text-destructive" : "text-emerald-400"}>
                      {m.delta > 0 ? `+${m.delta}` : m.delta}
                    </TableCell>
                    <TableCell className="capitalize">{m.reason.replace("_", " ")}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.note || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={itemOpen} onOpenChange={setItemOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit item" : "New inventory item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleItemSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Brand</Label>
                <Input value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v as InventoryCategory }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c} className="capitalize">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select
                  value={form.unit}
                  onValueChange={(v) => setForm((f) => ({ ...f, unit: v as InventoryUnit }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {!editing && (
              <div className="space-y-2">
                <Label>Starting quantity</Label>
                <Input
                  type="number"
                  value={form.quantity_on_hand}
                  onChange={(e) => setForm((f) => ({ ...f, quantity_on_hand: e.target.value }))}
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reorder level</Label>
                <Input
                  type="number"
                  value={form.reorder_level}
                  onChange={(e) => setForm((f) => ({ ...f, reorder_level: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Cost (cents)</Label>
                <Input
                  type="number"
                  value={form.unit_cost_cents}
                  onChange={(e) => setForm((f) => ({ ...f, unit_cost_cents: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sell (cents)</Label>
                <Input
                  type="number"
                  value={form.sell_price_cents}
                  onChange={(e) => setForm((f) => ({ ...f, sell_price_cents: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Member (cents)</Label>
                <Input
                  type="number"
                  value={form.team_price_cents}
                  onChange={(e) => setForm((f) => ({ ...f, team_price_cents: e.target.value }))}
                />
              </div>
            </div>
            {!isAdminUser && editing && (
              <p className="text-xs text-muted-foreground">Use Adjust to change on-hand quantity.</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setItemOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="btn-gold" disabled={saveItem.isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Adjust stock — {adjustItem?.brand} {adjustItem?.name}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdjustSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Current: {adjustItem?.quantity_on_hand} {adjustItem?.unit}
            </p>
            <div className="space-y-2">
              <Label>Change (+ receive / − use)</Label>
              <Input
                type="number"
                value={adjustDelta}
                onChange={(e) => setAdjustDelta(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Select
                value={adjustReason}
                onValueChange={(v) => setAdjustReason(v as typeof adjustReason)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Note</Label>
              <Input value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAdjustOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="btn-gold" disabled={adjustMutation.isPending}>
                Apply
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
