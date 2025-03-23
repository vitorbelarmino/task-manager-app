"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getTaskByUser } from "@/api/task";
import { ITask } from "@/interface/ITask";
import { Auth } from "./authContext";

type TaskContextType = {
  tasks: ITask[];
  setTasks: (value: ITask[]) => void;
  getTasks: () => Promise<void>;
};
export const Context = createContext({} as TaskContextType);
export const taskContext = () => useContext(Context);

export default function TaskProvider({ children }: { children: React.ReactNode }) {
  const { userId } = Auth();
  const [tasks, setTasks] = useState<ITask[]>([]);

  const getTasks = async () => {
    try {
      const data = await getTaskByUser(userId);
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getTasks();
    }
  }, [userId]);

  return <Context.Provider value={{ tasks, setTasks, getTasks }}> {children} </Context.Provider>;
}
