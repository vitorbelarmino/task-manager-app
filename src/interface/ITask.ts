export enum TaskStatus {
  PENDING = "Pendente",
  DONE = "Concluído",
}

export interface ITaskTable {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
}

export interface ITask extends ITaskTable {
  userId: string;
}

export interface ICreateTask {
  userId: string;
  title: string;
  description: string;
}

export interface IUpdateTask extends ICreateTask {
  id: string;
  status: TaskStatus;
}
