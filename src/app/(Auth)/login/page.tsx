"use client";
import { Auth } from "@/context/authContext";
import { ILogin } from "@/interface/authentication";
import { loginSchema } from "@/schema/IAuthenticationSchema";
import { validateErrorsYup } from "@/utils/validateErrorsYup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import { Loading } from "../../components/UI/Loading";
import { Input } from "@/app/components/UI/Input";

export default function Login() {
  const { login } = Auth();
  const [loginInfo, setLoginInfo] = useState<ILogin>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    try {
      setLoading(true);
      await loginSchema.validate(loginInfo, { abortEarly: false });
      setErrors({});
      await login(loginInfo);
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
    setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
  };
  return (
    <div className="flex flex-col justify-center items-center py-4">
      <h1 className="text-3xl">Login</h1>
      <div className="flex flex-col gap-0.5 min-w-[360px] w-full">
        <Input
          label="Email"
          name="email"
          value={loginInfo.email}
          handleChange={handleChange}
          errors={errors}
        />

        <Input
          label="Senha"
          type="password"
          name="password"
          value={loginInfo.password}
          handleChange={handleChange}
          errors={errors}
        />
        <div className="flex flex-col items-center gap-2">
          <button
            disabled={loading}
            onClick={onSubmit}
            className="bg-blue-500 p-2 w-full rounded-md disabled:bg-gray-400 text-white cursor-pointer"
          >
            {!loading ? "Entrar" : <Loading size={25} />}
          </button>
          <p className="text-sm">
            Ainda não possui uma conta?{" "}
            <a href="/register" className="text-blue-700">
              Crie Agora
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
