"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getTaskByUser } from "@/api/task";
import { ITask } from "@/interface/ITask";
import { Auth } from "./authContext";

type SortConfig = {
  column: keyof ITask | undefined;
  direction: "asc" | "desc" | undefined;
};

type TaskContextType = {
  tasks: ITask[];
  setTasks: (value: ITask[]) => void;
  getTasks: () => Promise<void>;
  sortConfig: SortConfig;
  setSortConfig: (value: SortConfig) => void;
  sortedTasks: ITask[];
  setSortedTasks: (value: ITask[]) => void;
};

export const Context = createContext({} as TaskContextType);
export const taskContext = () => useContext(Context);

export default function TaskProvider({ children }: { children: React.ReactNode }) {
  const { userId } = Auth();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [sortedTasks, setSortedTasks] = useState<ITask[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: undefined,
    direction: undefined,
  });

  const getTasks = async () => {
    try {
      const data = await getTaskByUser(userId);
      setTasks(data);
      setSortedTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getTasks();
    }
  }, [userId]);

  return (
    <Context.Provider
      value={{ tasks, setTasks, getTasks, sortConfig, setSortConfig, sortedTasks, setSortedTasks }}
    >
      {children}
    </Context.Provider>
  );
}
