import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "process.env.NEXT_PUBLIC_BACKEND_URL",
});

export default axiosInstance;
