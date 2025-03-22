"use client";
import { useEffect, useState } from "react";
import { Table } from "./components/Table";
import { Auth } from "@/context/authContext";
import { ITask } from "@/interface/ITask";
import { deleteTaskByid, getTaskByUser } from "@/api/task";
import { Loading } from "./components/Loading";

export default function Home() {
  const { userId } = Auth();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getTasks = async (user_id: string) => {
    const data = await getTaskByUser(user_id);
    const formatedTasks = data.map((task: ITask) => ({
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: new Intl.DateTimeFormat("pt-BR").format(new Date(task.createdAt)),
      id: task.id,
    }));
    setTasks(formatedTasks);
    setLoading(false);
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteTaskByid(id);
      getTasks(userId);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getTasks(userId);
    }
  }, [userId]);

  return (
    <div>
      {loading ? (
        <div className="flex h-screen justify-center items-center">
          <Loading size={60} />
        </div>
      ) : (
        <Table data={tasks} title="Tarefas" deleteTask={deleteTask} />
      )}
    </div>
  );
}
