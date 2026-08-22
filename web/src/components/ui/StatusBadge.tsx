import React from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export type StatusType = "Active" | "Pending" | "Inactive" | "Success" | "Warning" | "Danger";

type StatusBadgeProps = {
  status: string;
  type?: StatusType;
  showIcon?: boolean;
  className?: string;
};

export function StatusBadge({ status, type, showIcon = false, className = "" }: StatusBadgeProps) {
  // Infer type from status string if not explicitly provided
  const resolvedType = type || (
    status === "Active" || status === "Success" || status === "Verified" || status === "Completed" || status === "Approved" ? "Success" :
    status === "Pending" ? "Warning" :
    "Danger"
  );

  let colors = "";
  let Icon = null;

  switch (resolvedType) {
    case "Success":
      colors = "bg-success/15 text-success";
      Icon = CheckCircle2;
      break;
    case "Warning":
      colors = "bg-warning/15 text-warning";
      Icon = Clock;
      break;
    case "Danger":
    case "Inactive":
      colors = "bg-danger/15 text-danger";
      Icon = AlertCircle;
      break;
  }

  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${colors} ${className}`}>
      {showIcon && Icon && <Icon className="h-3.5 w-3.5 mr-1.5" />}
      {status}
    </span>
  );
}
