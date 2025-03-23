import React, { useState } from "react";
import { Input } from "../../UI/Input";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Loading } from "../../UI/Loading";
import { ICreateTask, ITask } from "@/interface/ITask";
import { createTaskSchema } from "@/schema/ITaskSchema";
import { createTask } from "@/api/task";
import { AxiosError } from "axios";
import { validateErrorsYup } from "@/utils/validateErrorsYup";
import { formatDateBR } from "@/utils/date";

interface TaskModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  userId: string;
  tasks: ITask[];
  setTasks: (value: ITask[]) => void;
}

export function TaskModal({ open, setOpen, userId, tasks, setTasks }: TaskModalProps) {
  if (!open) return null;
  const [TaskInfo, setTaskInfo] = React.useState<ICreateTask>({
    userId,
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTaskInfo({ ...TaskInfo, [name]: value });
  };

  const onSubmit = async () => {
    if (!TaskInfo) return;
    setLoading(true);
    try {
      await createTaskSchema.validate(TaskInfo, { abortEarly: false });
      const newTask = await createTask(TaskInfo);
      setTasks([
        ...tasks,
        {
          ...newTask,
          createdAt: formatDateBR(newTask.createdAt),
        },
      ]);
      toast.success("Task criada com sucesso");
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
      toast.error("Erro ao criar a tarefa");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center bg-o text-black">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg">
        <div className="flex flex-col justify-between items-center p-4 pb-0 px-8 ">
          <h2 className="text-xl font-semibold">Crie sua tarefa</h2>
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
        </div>
        <div className="flex justify-end p-4 gap-2 px-8 pt-0">
          <button
            onClick={() => setOpen(false)}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
