import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true, // ✅ Ensure cookies are sent with requests
});

export default API;
