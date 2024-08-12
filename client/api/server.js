import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://comprarla-bot-server.onrender.com/api",
});

export default API;
