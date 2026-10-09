export type StaffRole = "admin" | "stringer" | "viewer";
export type OrderStatus = "received" | "in_progress" | "ready" | "picked_up" | "cancelled";
export type InventoryCategory = "string" | "grip" | "grommet" | "other";
export type InventoryUnit = "reel" | "set" | "each";
export type MovementReason = "purchase" | "job_use" | "adjustment" | "return";
export type InquiryStatus = "new" | "contacted" | "converted" | "closed";

export interface Profile {
  id: string;
  full_name: string;
  role: StaffRole;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  is_phoenix_team: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  sku: string | null;
  name: string;
  brand: string | null;
  category: InventoryCategory;
  unit: InventoryUnit;
  quantity_on_hand: number;
  reorder_level: number;
  unit_cost_cents: number;
  sell_price_cents: number;
  team_price_cents: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  status: OrderStatus;
  racket_model: string | null;
  inventory_item_id: string | null;
  string_brand: string | null;
  string_model: string | null;
  tension_mains: number | null;
  tension_crosses: number | null;
  hybrid_notes: string | null;
  include_grip: boolean;
  include_grommet: boolean;
  price_cents: number;
  is_team_price: boolean;
  assigned_to: string | null;
  due_at: string | null;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  customer?: Customer | null;
  inventory_item?: InventoryItem | null;
  assignee?: Profile | null;
}

export interface InventoryMovement {
  id: string;
  item_id: string;
  delta: number;
  reason: MovementReason;
  order_id: string | null;
  created_by: string | null;
  note: string | null;
  created_at: string;
  item?: InventoryItem | null;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  racket_count: number | null;
  status: InquiryStatus;
  customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export const ORDER_STATUSES: OrderStatus[] = [
  "received",
  "in_progress",
  "ready",
  "picked_up",
  "cancelled",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  received: "Received",
  in_progress: "In Progress",
  ready: "Ready",
  picked_up: "Picked Up",
  cancelled: "Cancelled",
};

export const ROLE_LABELS: Record<StaffRole, string> = {
  admin: "Admin",
  stringer: "Stringer",
  viewer: "Viewer",
};

export function formatCad(cents: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(cents / 100);
}

export function canWriteOps(role: StaffRole | null | undefined): boolean {
  return role === "admin" || role === "stringer";
}

export function isAdmin(role: StaffRole | null | undefined): boolean {
  return role === "admin";
}
