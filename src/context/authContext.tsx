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
  logout: () => void;
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
      api.defaults.headers.Authorization = `Bearer ${data.token}`;
      await claimToken();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401 || error.response?.status === 404) {
          toast.error("Email ou senha incorretos!");
          throw new Error(error.message);
        }
        if (error.message === "Network Error") {
          toast.error("Backend fora do ar! Por favor entre em contato");
          throw new Error(error.message);
        }
        toast.error("Algo deu errado! Error Interno!");
        throw new Error(error.message);
      }
      throw new Error("Erro de autenticação");
    }
  };

  const register = async (register: ILogin) => {
    try {
      const { data } = await api.post("auth/register", register);
      setCookie("TaskManager.token", data.token, {
        expires: new Date(Date.now() + 86400000),
        path: "/",
      });
      api.defaults.headers.Authorization = `Bearer ${data.token}`;
      await claimToken();
      toast.success("Cadastro realizado com sucesso!");
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
      setUserId(data.userId);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 401 || error.status === 404) {
          deleteCookie("TaskManager.token");
          router.push("/login");
          throw new Error("Erro de Autenticação");
        }
        if (error.message === "Network Error") {
          toast.error("Backend fora do ar! Por favor entre em contato");
          deleteCookie("TaskManager.token");
          router.push("/login");
          throw new Error(error.message);
        }
        toast.error("Algo deu errado! Error inesperado!");
        deleteCookie("TaskManager.token");
        router.push("/login");
        throw new Error(error.message);
      }
    }
  };

  const logout = () => {
    deleteCookie("TaskManager.token");
    router.push("/login");
  };

  useEffect(() => {
    if (pathname !== "/login" && pathname !== "/register") {
      claimToken();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ login, register, logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
}
