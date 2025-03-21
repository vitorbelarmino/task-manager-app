import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : "http://localhost:3333";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
  },
});
