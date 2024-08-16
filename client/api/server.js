import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://23.227.167.112:8800/api",
});

export default API;
