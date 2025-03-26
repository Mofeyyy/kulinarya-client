import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_NODE_ENV === "prod"
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL_DEV;

const API = axios.create({
  baseURL: `"${BASE_URL}/api"`,
  withCredentials: true, // ✅ Ensure cookies are sent with requests
});

export default API;
