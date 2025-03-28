import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_APP_ENV === "prod"
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL_DEV;

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

export default API;
