import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://comprarla-bot-server.onrender.com:8800",
});

export default API;
