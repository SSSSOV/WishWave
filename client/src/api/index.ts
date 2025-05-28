import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL, // Базовый URL сервера
  timeout: 5000,
})

export default api
