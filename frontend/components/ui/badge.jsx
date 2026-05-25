import { cn } from "../../lib/utils";

const variants = {
  Pending: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Escalated: "bg-orange-100 text-orange-800",
  Resolved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

export function Badge({ children, className }) {
  const color = variants[children] || "bg-gray-100 text-gray-800";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", color, className)}>
      {children}
    </span>
  );
}
