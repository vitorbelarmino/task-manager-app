export interface ITask {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  userId: string;
}

export interface ICreateTask {
  userId: string;
  title: string;
  description: string;
}
