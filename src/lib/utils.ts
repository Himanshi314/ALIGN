import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "COMPLETED":
      return "badge-sage";
    case "ON_TRACK":
      return "badge-blue";
    case "AT_RISK":
      return "badge-rose";
    case "NOT_STARTED":
      return "badge-slate";
    case "APPROVED":
      return "badge-sage";
    case "SUBMITTED":
      return "badge-gold";
    case "RETURNED":
      return "badge-rose";
    case "DRAFT":
      return "badge-slate";
    default:
      return "badge-slate";
  }
}

export function getStatusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function getProgressColor(pct: number): string {
  if (pct >= 80) return "var(--color-sage)";
  if (pct >= 50) return "var(--color-gold)";
  if (pct >= 25) return "var(--color-blue)";
  return "var(--color-rose)";
}

export const THRUST_AREAS = [
  "Revenue Growth",
  "Customer Success",
  "Innovation",
  "Operational Excellence",
  "People & Culture",
  "Strategic Initiatives",
] as const;

export const UOM_OPTIONS = [
  { value: "NUMERIC", label: "Numeric", description: "Count-based (e.g., 50 deals)" },
  { value: "PERCENTAGE", label: "Percentage", description: "Ratio-based (e.g., 95%)" },
  { value: "TIMELINE", label: "Timeline", description: "Date-based milestones" },
  { value: "ZERO_BASED", label: "Zero-Based", description: "Yes/No completion" },
] as const;
