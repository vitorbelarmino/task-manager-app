import axios from "axios";
import { getCookie } from "cookies-next";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : "http://localhost:3333";

const token = getCookie("TaskManager.token");

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
});
