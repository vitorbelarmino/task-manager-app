import { api } from ".";

export async function getTaskByUser(userId: string) {
  try {
    const { data } = await api.get(`/task/user/${userId}`);
    return data;
  } catch (error) {
    console.error(error);
    return error;
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
