"use client";
import { api } from "@/api";
import { AxiosError } from "axios";
import { createContext, useContext } from "react";
import { setCookie } from "cookies-next";
import { ILogin } from "@/interface/authentication";
import { toast } from "react-toastify";

type AuthContextType = {
  login: (login: ILogin) => Promise<boolean>;
  register: (register: ILogin) => Promise<boolean>;
};
export const AuthContext = createContext({} as AuthContextType);
export const Auth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
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
      setCookie("taskManager.token", data.token, {
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

  return <AuthContext.Provider value={{ login, register }}> {children} </AuthContext.Provider>;
}
