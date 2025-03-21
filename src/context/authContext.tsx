"use client";
import { api } from "@/api";
import { AxiosError } from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { deleteCookie, setCookie } from "cookies-next";
import { ILogin } from "@/interface/authentication";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";

type AuthContextType = {
  login: (login: ILogin) => Promise<boolean>;
  register: (register: ILogin) => Promise<boolean>;
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
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data.error) {
          toast.error("Email ou senha incorretos!");
          return false;
        }
        if (error.message === "Network Error") {
          toast.error("Backend fora do ar! Por favor entre em contato");
          return false;
        }
        toast.error("Algo deu errado! Error inesperado!");
      }
      return false;
    }
  };

  const register = async (register: ILogin) => {
    try {
      const { data } = await api.post("user/create", register);
      setCookie("TaskManager.token", data.token, {
        expires: new Date(Date.now() + 86400000),
        path: "/",
      });
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.message === "Network Error") {
          toast.error("Backend fora do ar! Por favor entre em contato");
          return false;
        }
        if (error.status === 409) {
          toast.error("Email já cadastrado!");
          return false;
        }
        toast.error("Algo deu errado! Error inesperado!");
      }
      return false;
    }
  };

  const claimToken = async () => {
    try {
      const { data } = await api.get("auth/claim");
      setUserId(data.id);
    } catch (error) {
      deleteCookie("TaskManager.token");
      router.push("/login");
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
