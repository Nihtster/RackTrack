/** A maintenance job: upcoming while `completedAt` is unset, history once set. */
export interface MaintenanceTask {
  id: string;
  firearmId: string;
  task: string;
  /** Calendar day, YYYY-MM-DD. */
  dueDate: string;
  /** Calendar day the job was done, YYYY-MM-DD. */
  completedAt?: string;
}

/** Where an open job stands against its due date. */
export type MaintenanceStatus = 'overdue' | 'due-soon' | 'scheduled';
