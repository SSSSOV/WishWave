import { jwtDecode } from "jwt-decode";
import { $host } from ".";
import { Bounce, toast } from "react-toastify";

export type User = {
  id: number;
  fullname?: string;
  login: string;
  password: string;
  email?: string;
};

export const api_login = async (email: String, password: String) => {
  // const { data } = await $host.post("api/user/login", { email, password });
  const { data } = {
    data: {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30",
    },
  };

  if (!data) {
    toast.error("Ошибка авторизации!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
      className: "rounded-full mx-1 p-1 min-h-1 m-0",
    });

    return;
  }

  toast.success("Вы успешно авторизовались!", {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
    className: "rounded-full mx-1 p-1 min-h-1 m-0",
  });
  console.log("success");

  localStorage.setItem("token", data.token);
  return jwtDecode(data.token);
};

export const api_signup = async (email: String, login: String, password: String) => {
  const { data } = await $host.post("api/user/signup", { email, login, password });
  localStorage.setItem("token", data.token);
  return jwtDecode(data.token);
};
