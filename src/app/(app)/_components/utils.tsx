// utils.tsx

export type Status = "Open" | "In Progress" | "Closed" | "Over Due";
export type Priority = "High" | "Medium" | "Low";

export interface Stats {
  open: number;
  inProgress: number;
  closed: number;
  overdue: number;
}

export interface Task {
  id: string; title: string; description: string;
  status: Status; priority: Priority;
  dueDate: string; assigneeId: string; assignee: string;
  daysLeft: number;
}
export const COLUMNS: Status[] = ["Open", "In Progress", "Closed", "Over Due"];
export const BADGE: Record<Priority, string> = {
  High: "bg-high-bg text-high-txt", Medium: "bg-med-bg text-med-txt", Low: "bg-low-bg text-low-txt",
};

// --- display label (UI) ↔ Prisma enum key (DB) ---
export type DbStatus = "OPEN" | "IN_PROGRESS" | "CLOSED" | "OVER_DUE";
export type DbPriority = "LOW" | "MEDIUM" | "HIGH";
export const STATUS_TO_DB: Record<Status, DbStatus> = {
  "Open": "OPEN", "In Progress": "IN_PROGRESS", "Closed": "CLOSED", "Over Due": "OVER_DUE",
};
export const DB_TO_STATUS: Record<DbStatus, Status> = {
  OPEN: "Open", IN_PROGRESS: "In Progress", CLOSED: "Closed", OVER_DUE: "Over Due",
};
export const PRIORITY_TO_DB: Record<Priority, DbPriority> = { High: "HIGH", Medium: "MEDIUM", Low: "LOW" };
export const DB_TO_PRIORITY: Record<DbPriority, Priority> = { HIGH: "High", MEDIUM: "Medium", LOW: "Low" };
export const daysLeft = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);

// Types based on your Prisma Schema
export type Role = "ADMIN" | "EMPLOYEE";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  number: string;
  role: Role;
}

// Mock Data (Replace with real data passed from Server Component)
export const INITIAL_MEMBERS: TeamMember[] = [
  { id: "1", name: "Param Shah", email: "param@todonest.com", number: "+91 9876543210", role: "ADMIN" },
  { id: "2", name: "Alice Smith", email: "alice@todonest.com", number: "+91 8765432109", role: "EMPLOYEE" },
];