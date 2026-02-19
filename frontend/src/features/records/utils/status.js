const STATUS_STYLE_MAP = {
  Active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Discharged: "bg-slate-100 text-slate-800 border-slate-200",
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};

export function getStatusClassName(status) {
  return STATUS_STYLE_MAP[status] || "bg-muted text-muted-foreground border-border";
}
