import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", 
  withCredentials: true, //para enviar cookies
});

export default api;
