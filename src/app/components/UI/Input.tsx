type InputProps = {
  label: string;
  type?: "text" | "number" | "password";
  name: string;
  value: string | number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: { [key: string]: string };
};

export function Input({ label, type, name, value, handleChange, errors }: InputProps) {
  return (
    <label className={`${errors?.[name] ? "pb-0" : "pb-6"} flex flex-col w-full`}>
      {label}
      <input
        type={type || "text"}
        value={value}
        name={name}
        onChange={handleChange}
        className={` ${errors?.[name] && "border-red-600"} border rounded p-1 pl-2 w-full`}
      />
      {errors?.[name] && <p className="text-xs text-red-500 py-1">{errors?.[name]}</p>}
    </label>
  );
}
