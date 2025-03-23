"use client";
import { ITask } from "@/interface/ITask";
import { cn } from "@/utils/shared";
import { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { RiCloseLargeLine } from "react-icons/ri";

interface Idata {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

interface TableProps {
  data: ITask[];
  title: string;
  deleteTask: (id: string) => void;
  setOpenModal: (value: boolean) => void;
}

export function Table({ data, title, deleteTask, setOpenModal }: TableProps) {
  const columns = ["Título", "Descrição", "Status", "Data de criação", "Editar/Excluir"];
  const [tasks, setTasks] = useState<Idata[]>([]);

  const colSpanTHead = (key: string) => (key === "Título" || key === "Descrição" ? 3 : 1);
  const colSpanTBody = (key: string) => (key === "title" || key === "description" ? 3 : 1);
  useEffect(() => {
    const formatedTasks = data.map((task: ITask) => ({
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt,
      id: task.id,
    }));
    setTasks(formatedTasks);
  }, [data]);

  return (
    <div className="flex justify-center w-full mt-5">
      <div className="flex flex-col w-11/12 m-2">
        <div className="flex items-center justify-between">
          <h1 className="text-center text-2xl flex-1">{title}</h1>
          <div className="flex justify-end">
            <button
              className="text-white bg-blue-600 rounded-md p-3 m-2 cursor-pointer"
              onClick={() => setOpenModal(true)}
            >
              Adicionar tarefa
            </button>
          </div>
        </div>
        <div className="h-[75vh] overflow-y-auto p-3 bg-gray-100 text-black rounded-md">
          <table className="w-full table-fixed">
            <thead>
              <tr>
                {columns.map((item, index) => (
                  <th
                    colSpan={colSpanTHead(item)}
                    className={cn(item === "Editar/Excluir" ? "text-center" : "text-start")}
                    key={index}
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.entries(task)
                    .filter(([key]) => key !== "id")
                    .map(([KEY, value], i) => (
                      <td
                        colSpan={colSpanTBody(KEY)}
                        className="text-start border-b-2 h-10"
                        key={i}
                      >
                        {value}
                      </td>
                    ))}
                  <td className="text-center border-b-2 h-10 w-5">
                    <div className="flex gap-3 w-full justify-center items-center">
                      <MdOutlineEdit className="cursor-pointer" />
                      <RiCloseLargeLine
                        color="red"
                        className="cursor-pointer"
                        onClick={() => deleteTask(task.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
