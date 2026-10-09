import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import { ROLE_LABELS, type Profile, type StaffRole } from "@/types/crm";

export default function CrmStaffPage() {
  const { isAdminUser, user } = useAuth();
  const qc = useQueryClient();

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ["crm", "profiles"],
    enabled: isAdminUser,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("full_name");
      if (error) throw error;
      return data as Profile[];
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: StaffRole }) => {
      const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm", "profiles"] });
      toast.success("Role updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (!isAdminUser) {
    return <Navigate to="/crm" replace />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Staff</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Manage roles for team members. Create new users in the Supabase Auth dashboard (email/password),
          then set their role here. New signups default to Viewer.
        </p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {staff.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">
                  {p.full_name || "—"}
                  {p.id === user?.id && (
                    <Badge variant="secondary" className="ml-2">
                      You
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {p.id.slice(0, 8)}…
                </TableCell>
                <TableCell>
                  <Select
                    value={p.role}
                    onValueChange={(v) => roleMutation.mutate({ id: p.id, role: v as StaffRole })}
                    disabled={p.id === user?.id}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(ROLE_LABELS) as StaffRole[]).map((r) => (
                        <SelectItem key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(p.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
