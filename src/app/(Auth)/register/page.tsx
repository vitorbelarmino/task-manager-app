"use client";
import { Auth } from "@/context/authContext";
import { IRegister } from "@/interface/authentication";
import { registerSchema } from "@/schema/IAuthenticationSchema";
import { validateErrorsYup } from "@/utils/validateErrorsYup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import { Loading } from "../../components/Loading";
import { Input } from "@/app/components/Input";

export default function Register() {
  const { register } = Auth();
  const [registerInfo, setRegisterInfo] = useState<IRegister>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    try {
      setLoading(true);
      await registerSchema.validate(registerInfo, { abortEarly: false });
      setErrors({});
      const resgisterSuccess = await register({
        email: registerInfo.email,
        password: registerInfo.password,
      });
      if (resgisterSuccess) {
        router.push("/");
      }
      setLoading(false);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrors(validateErrorsYup(error));
      }
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterInfo({ ...registerInfo, [e.target.name]: e.target.value });
  };
  return (
    <div className="flex flex-col justify-center items-center py-4">
      <h1 className="text-3xl">Cadastro</h1>
      <div className="flex flex-col gap-0.5 min-w-[360px] w-full">
        {/* <label className={`${errors.email ? "pb-0" : "pb-6"}`}>
          Email
          <input
            type="text"
            name="email"
            onChange={handleChange}
            className={`${errors.email && "border-red-600"} border rounded p-1 pl-2 w-full`}
          />
          {errors.email && <p className="text-xs text-red-500 py-1">{errors.email}</p>}
        </label> */}
        <Input
          label="Email"
          name="email"
          value={registerInfo.email}
          handleChange={handleChange}
          errors={errors}
        />

        <Input
          label="Senha"
          type="password"
          name="password"
          value={registerInfo.password}
          handleChange={handleChange}
          errors={errors}
        />

        <Input
          label="Confirme sua senha"
          type="password"
          name="confirmPassword"
          value={registerInfo.confirmPassword}
          handleChange={handleChange}
          errors={errors}
        />

        {/*         
        <label className={`${errors.password ? "pb-0" : "pb-6"}`}>
          Senha
          <input
            type="password"
            name="password"
            handleChange={handleChange}
            className={` ${errors.password && "border-red-600"} border rounded p-1 pl-2 w-full`}
          />
          {errors.password && <p className="text-xs text-red-500 py-1">{errors.password}</p>}
        </label>
        <label className={`${errors.confirmPassword ? "pb-0" : "pb-6"}`}>
          Confirme sua senha
          <input
            type="password"
            name="confirmPassword"
            handleChange={handleChange}
            className={`${errors.confirmPassword && "border-red-600"} border rounded p-1 pl-2 w-full`}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 py-1">{errors.confirmPassword}</p>
          )}
        </label> */}
        <div className="flex flex-col items-center gap-2">
          <button
            disabled={loading}
            onClick={onSubmit}
            className="bg-blue-500 p-2 w-full rounded-md disabled:bg-gray-400"
          >
            {!loading ? "Entrar" : <Loading size={25} />}
          </button>
          <p className="text-sm">
            Já possui conta?{" "}
            <a href="/login" className="text-blue-700">
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
