import React, { useState } from "react";
import { Input } from "../../UI/Input";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Loading } from "../../UI/Loading";
import { ITaskTable, IUpdateTask } from "@/interface/ITask";
import { updateTaskSchema } from "@/schema/ITaskSchema";
import { updateTask } from "@/api/task";
import { AxiosError } from "axios";
import { validateErrorsYup } from "@/utils/validateErrorsYup";
import { Select } from "../../UI/Select";
import { taskContext } from "@/context/taskContext";
import { Auth } from "@/context/authContext";

interface TaskModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  task?: ITaskTable;
}

export function UpdateModalTask({ open, setOpen, task }: TaskModalProps) {
  if (!open || !task) return null;
  const { getTasks } = taskContext();
  const { userId } = Auth();
  const [TaskInfo, setTaskInfo] = React.useState<IUpdateTask>({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    userId,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskInfo({ ...TaskInfo, [name]: value });
  };

  const onSubmit = async () => {
    if (!TaskInfo) return;
    setLoading(true);
    try {
      await updateTaskSchema.validate(TaskInfo, { abortEarly: false });
      await updateTask(TaskInfo);
      getTasks();
      toast.success("Tarefa alterada com sucesso");
      setErrors({});
      setLoading(false);
      setOpen(false);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrors(validateErrorsYup(error));
        setLoading(false);
        return;
      }
      if (error instanceof AxiosError) {
        if (error.message === "Network Error") {
          toast.error("Backend fora do ar! Por favor entre em contato");
          setLoading(false);
          return false;
        }
      }
      console.error("Failed to create Task", error);
      toast.error("Erro ao alterar a tarefa");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center bg-o text-black">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg">
        <div className="flex flex-col justify-between items-center p-4 pb-0 px-8 ">
          <h2 className="text-xl font-semibold">Atualize sua tarefa</h2>
          <Input
            label="Título"
            type="text"
            name="title"
            value={TaskInfo.title}
            handleChange={handleChange}
            errors={errors}
          />
          <Input
            label="Descrição"
            name="description"
            value={TaskInfo.description}
            handleChange={handleChange}
            errors={errors}
          />

          <Select
            label="Status"
            name="status"
            task={task}
            value={TaskInfo.status}
            handleChange={handleChange}
          />
        </div>
        <div className="flex justify-end p-4 gap-2 px-8 pt-0">
          <button
            onClick={() => setOpen(false)}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            {loading ? (
              <div className="flex justify-center w-full">
                <Loading />
              </div>
            ) : (
              "Cadastrar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
