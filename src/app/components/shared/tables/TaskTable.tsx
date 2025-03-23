"use client";
import { taskContext } from "@/context/taskContext";
import { ITaskTable } from "@/interface/ITask";
import { formatDateBR } from "@/utils/date";
import { cn } from "@/utils/shared";
import { useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { RiCloseLargeLine } from "react-icons/ri";
import { UpdateModalTask } from "../modals/UpdateModalTask";
import { deleteTaskByid } from "@/api/task";
import { CreateTaskModal } from "../modals/CreateTaskModal";
import { FaPlus } from "react-icons/fa";

export function TaskTable() {
  const { tasks, getTasks } = taskContext();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITaskTable | undefined>(undefined);

  const colSpanMap: Record<string, number> = {
    title: 3,
    description: 3,
    status: 1,
    createdAt: 1,
    actions: 1,
  };

  const columns = [
    { key: "title", value: "Título", colSpan: 3 },
    { key: "description", value: "Descrição", colSpan: 3 },
    { key: "status", value: "Status", colSpan: 1 },
    { key: "createdAt", value: "Data de criação", colSpan: 1 },
    { key: "actions", value: "Editar/Excluir", colSpan: 1 },
  ];

  const deleteTask = async (id: string) => {
    try {
      await deleteTaskByid(id);
      getTasks();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const activeUpdateModal = (task: ITaskTable) => {
    setSelectedTask(task);
    setOpenUpdateModal(true);
  };

  return (
    <div className="flex justify-center w-full mt-5">
      <div className="flex flex-col w-11/12 m-2">
        <div className="flex items-center justify-between">
          <h1 className="text-center text-2xl flex-1">Tarefas</h1>
          <button
            className="text-white bg-blue-600 rounded-md p-3 m-2 hover:bg-blue-700 transition cursor-pointer"
            onClick={() => setOpenCreateModal(true)}
          >
            <div className="flex items-center gap-2">
              <FaPlus />
              Adicionar tarefa
            </div>
          </button>
        </div>

        <div className="m-3 bg-gray-100 text-black">
          <div className="h-[75vh] overflow-y-auto scrollbar-hide  border-gray-200 border rounded-md shadow-md">
            <table className="w-full table-fixed">
              <thead className="bg-blue-500 text-white sticky top-0 z-10 m-2">
                <tr>
                  {columns.map((col, index) => (
                    <th
                      key={index}
                      colSpan={col.colSpan}
                      className={cn(
                        !["title", "description"].includes(col.key) ? "text-center" : "text-start",
                        "p-2",
                      )}
                    >
                      {col.value}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={index} className="border-b border-gray-300 even:bg-gray-200">
                    <td className="p-2" colSpan={colSpanMap.title}>
                      {task.title}
                    </td>
                    <td className="p-2" colSpan={colSpanMap.description}>
                      {task.description}
                    </td>
                    <td className="p-2 text-center" colSpan={colSpanMap.status}>
                      <span
                        className={`px-3 py-1 rounded-full text-white ${task.status === "Concluído" ? "bg-green-500" : "bg-yellow-500"}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="p-2 text-center" colSpan={colSpanMap.createdAt}>
                      {formatDateBR(task.createdAt)}
                    </td>
                    <td className="p-2 text-center w-5" colSpan={colSpanMap.actions}>
                      <div className="flex gap-3 justify-center items-center">
                        <MdOutlineEdit
                          className="cursor-pointer text-blue-500 hover:text-blue-700 transition hover:scale-105"
                          onClick={() => activeUpdateModal(task)}
                        />
                        <RiCloseLargeLine
                          className="cursor-pointer text-red-500 hover:text-red-700 transition hover:scale-105"
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

      {/* Modals */}
      <CreateTaskModal open={openCreateModal} setOpen={setOpenCreateModal} />
      <UpdateModalTask open={openUpdateModal} setOpen={setOpenUpdateModal} task={selectedTask} />
    </div>
  );
}
