"use client";
import { api } from "@/api";
import { AxiosError } from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { deleteCookie, setCookie } from "cookies-next";
import { ILogin } from "@/interface/authentication";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";

type AuthContextType = {
  login: (login: ILogin) => Promise<void>;
  register: (register: ILogin) => Promise<void>;
  userId: string;
};
export const AuthContext = createContext({} as AuthContextType);
export const Auth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const login = async (login: ILogin) => {
    try {
      const { data } = await api.post("auth/login", login);
      setCookie("TaskManager.token", data.token, {
        expires: new Date(Date.now() + 86400000),
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data.error) {
          toast.error("Email ou senha incorretos!");
          throw new Error(error.message);
        }
        if (error.message === "Network Error") {
          toast.error("Backend fora do ar! Por favor entre em contato");
          throw new Error(error.message);
        }
        toast.error("Algo deu errado! Error inesperado!");
      }
      throw new Error("Erro de autenticação");
    }
  };

  const register = async (register: ILogin) => {
    try {
      const { data } = await api.post("user/create", register);
      setCookie("TaskManager.token", data.token, {
        expires: new Date(Date.now() + 86400000),
        path: "/",
      });
      api.defaults.headers.Authorization = `Bearer ${data.token}`;
      await claimToken();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.message === "Network Error") {
          toast.error("Backend fora do ar! Por favor entre em contato");
          throw new Error("Backend fora do ar! Por favor entre em contato");
        }
        if (error.status === 409) {
          toast.error("Email já cadastrado!");
          throw new Error("Email já cadastrado!");
        }
        toast.error("Algo deu errado! Error inesperado!");
        throw new Error(error.message);
      }
    }
  };

  const claimToken = async () => {
    try {
      const { data } = await api.get("auth/claim");
      setUserId(data.id);
    } catch (error) {
      deleteCookie("TaskManager.token");
      router.push("/login");
      console.error(error);
      throw new Error("Erro de autenticação");
    }
  };

  useEffect(() => {
    if (pathname !== "/login" && pathname !== "/register") {
      claimToken();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ login, register, userId }}> {children} </AuthContext.Provider>
  );
}
