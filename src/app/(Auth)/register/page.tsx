"use client";
import { Auth } from "@/context/authContext";
import { IRegister } from "@/interface/authentication";
import { registerSchema } from "@/schema/IAuthenticationSchema";
import { validateErrorsYup } from "@/utils/validateErrorsYup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import { Loading } from "../../components/UI/Loading";
import { Input } from "@/app/components/UI/Input";

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
      await register({
        email: registerInfo.email,
        password: registerInfo.password,
      });
      setLoading(false);
      router.push("/");
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
        <div className="flex flex-col items-center gap-2">
          <button
            disabled={loading}
            onClick={onSubmit}
            className="bg-blue-500 p-2 w-full rounded-md disabled:bg-gray-400 text-white"
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
