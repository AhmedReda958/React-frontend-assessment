import { Badge } from "../../../components/ui/badge";
import { getStatusClassName } from "../utils/status";

export function StatusBadge({ status }) {
  return (
    <Badge variant="outline" className={getStatusClassName(status)}>
      {status}
    </Badge>
  );
}
