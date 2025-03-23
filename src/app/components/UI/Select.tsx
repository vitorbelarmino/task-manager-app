import { ITaskTable, TaskStatus } from "@/interface/ITask";

type InputProps = {
  label: string;
  name: string;
  value: string;
  task?: ITaskTable;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors?: { [key: string]: string };
};

export function Select({ label, name, handleChange, errors, task }: InputProps) {
  const options = [
    { label: "Selecione um Status", value: "" },
    { label: "Pendente", value: TaskStatus.PENDING },
    { label: "Concluído", value: TaskStatus.DONE },
  ];
  return (
    <label className={`${errors?.[name] ? "pb-0" : "pb-6"} flex flex-col w-full`}>
      {label}
      <select
        name={name}
        className={`${errors?.doctorId && "border-red-600"} border rounded p-1 pl-2 w-full`}
        onChange={(e) => handleChange(e)}
        value={task?.status}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value} disabled={option.value === ""}>
            {option.label}
          </option>
        ))}
      </select>
      {errors?.[name] && <p className="text-xs text-red-500 py-1">{errors?.[name]}</p>}
    </label>
  );
}
