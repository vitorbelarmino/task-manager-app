import { ICreateTask, IUpdateTask } from "@/interface/ITask";
import { api } from ".";

export async function getTaskByUser(userId: string) {
  try {
    const { data } = await api.get(`/task/user/${userId}`);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error ao buscar tarefas");
  }
}

export async function deleteTaskByid(id: string) {
  try {
    await api.delete(`/task/delete/${id}`);
  } catch (error) {
    console.error(error);
    throw new Error("Error ao deletar tarefa");
  }
}

export async function createTask(task: ICreateTask) {
  try {
    const { data } = await api.post("/task/create", task);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error ao criar tarefa");
  }
}

export async function updateTask(task: IUpdateTask) {
  try {
    const { data } = await api.put(`/task/update/${task.id}`, {
      title: task.title,
      description: task.description,
      status: task.status,
    });
    return data;
  } catch (error) {
    throw new Error("Error ao atualizar tarefa");
  }
}
