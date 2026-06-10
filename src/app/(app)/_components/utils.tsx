export type Status = "Open" | "In Progress" | "Closed" | "Over Due";
export type Priority = "High" | "Medium" | "Low";

export interface Task {
  id: string; title: string; description: string;
  status: Status; priority: Priority;
  daysLeft: number; comments: number; attachments: number;
}
export const COLUMNS: Status[] = ["Open", "In Progress", "Closed", "Over Due"];
export const BADGE: Record<Priority, string> = {
  High: "bg-high-bg text-high-txt", Medium: "bg-med-bg text-med-txt", Low: "bg-low-bg text-low-txt",
};

export const INITIAL_TASKS: Task[] = [
  { id: "1", title: "Feed Research", description: "Feed design is required for our new project. Let's research the best practices.", status: "Open", priority: "Low", daysLeft: 12, comments: 1, attachments: 0 },
  { id: "2", title: "Design System", description: "Design decisions need to be taken for our new project.", status: "Open", priority: "High", daysLeft: 15, comments: 2, attachments: 10 },
  { id: "3", title: "Update Last Design Folder", description: "", status: "Open", priority: "Medium", daysLeft: 12, comments: 2, attachments: 0 },
  { id: "4", title: "Create Dashboard Component", description: "Create of calendar and feed components for dashboard design.", status: "In Progress", priority: "High", daysLeft: 26, comments: 1, attachments: 14 },
  { id: "5", title: "Calendar Research", description: "Researching for calendar design. Don't forget the timezone.", status: "In Progress", priority: "Medium", daysLeft: 32, comments: 2, attachments: 6 },
  { id: "6", title: "Add Kanban Design to Your Portfolio", description: "Don't forget to design it nicely before adding it to your portfolio.", status: "In Progress", priority: "Low", daysLeft: 67, comments: 3, attachments: 43 },
  { id: "7", title: "Create Wireframe for Mobile", description: "", status: "In Progress", priority: "Medium", daysLeft: 12, comments: 2, attachments: 6 },
  { id: "8", title: "Create Wireframe for Kanban", description: "Kanban design is required for our new project, let's research the best practices.", status: "Closed", priority: "Low", daysLeft: 67, comments: 2, attachments: 11 },
  { id: "9", title: "Navigation Prototype", description: "", status: "Closed", priority: "High", daysLeft: 26, comments: 1, attachments: 16 },
];