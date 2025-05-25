"use client";

import api from "@/api";
import { ISignInFx, ISignUpFx } from "@/types/auth";
import { IUpdateInfoFx, IUser } from "@/types/user";
import { AxiosError } from "axios";
import { createDomain, createEffect, createEvent, createStore, sample } from "effector";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

// Сторы
export const $isAuth = createStore<boolean>(false);
export const $user = createStore<IUser>({} as IUser);

// События
export const setAuth = createEvent<boolean>();
export const setUser = createEvent<IUser>();
export const updateFullname = createEvent<string>();
export const updatePhone = createEvent<string>();
export const updateBirthday = createEvent<string>();
export const updateInfo = createEvent<IUpdateInfoFx>();

export const handleSignIn = createEvent<ISignInFx>();
export const handleSignUp = createEvent<ISignUpFx>();
export const handleFetchUser = createEvent();
export const handleLogeOut = createEvent();

export const handleUpdateInfo = createEvent<IUpdateInfoFx>();

// Подписки
$isAuth.on(setAuth, (_, isAuth) => isAuth);
$user
  .on(setUser, (_, user) => user)
  .on(updateInfo, (state, { fullname, birthday, phone, image }) => ({
    ...state,
    ...(fullname && { fullname }),
    ...(birthday && { birthday }),
    ...(phone && { phone }),
    ...(image && { image }),
  }));

// Эффекты
export const signInFx = createEffect(async ({ loginOrEmail, password }: ISignInFx) => {
  try {
    const { data } = await api.post("/api/auth/login", {
      loginOrEmail,
      password,
    });

    if (data.warningMessage) {
      toast.error(data.warningMessage);
      return;
    }

    if (!data.token) {
      toast.error("Не получили токен от сервера");
      throw new Error("No token received");
    }

    // Сохраняем токен в localStorage
    localStorage.setItem("auth", data.token);

    setUser(jwtDecode<IUser>(data.token));
    setAuth(true);

    toast.success("Вы успешно вошли!");
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message + " (" + error.status + ")");
    else toast.error("Произошла непредвиденная ошибка");
    throw error;
  }
});

export const signUpFx = createEffect(async ({ login, email, password }: ISignUpFx) => {
  try {
    const { data } = await api.post("/api/auth/registration", {
      login,
      email,
      password,
    });

    if (data.warningMessage) {
      toast.error(data.warningMessage);
      return;
    }

    if (!data.token) {
      toast.error("Не получили токен от сервера");
      throw new Error("No token received");
    }

    // Сохраняем токен в localStorage
    localStorage.setItem("auth", data.token);

    setUser(jwtDecode<IUser>(data.token));
    setAuth(true);

    toast.success("Вы успешно зарегистрировались!");
  } catch (error) {
    toast.error("Ошибка регистрации: " + error);
    throw error;
  }
});

export const fetchUserFx = createEffect(async () => {
  try {
    const token = localStorage.getItem("auth");

    if (!token) {
      toast.error("Отсутствует токен авторизации!");
      setAuth(false);
      return;
    }

    const { id } = jwtDecode<IUser>(token);

    const { data } = await api.get("/api/user/" + id, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.warningMessage) {
      toast.error(data.warningMessage);
      setAuth(false);
      return;
    }

    const userData: IUser = {
      id: data.id.toString(),
      login: data.login,
      email: data.email,
      fullname: data.fullname || undefined,
      image: data.image || undefined,
      phone: data.phone || undefined,
      birthday: data.birthDate || undefined, // Преобразуем birthDate в birthday
      gender: undefined, // Серверные данные не содержат gender
    };

    setUser(userData);
    setAuth(true);
  } catch (error) {
    toast.error("Ошибка получения пользователя: " + error);
    setAuth(false);
    throw error;
  }
});

export const logOutFx = createEffect(() => {
  localStorage.removeItem("auth");
  setAuth(false);
  setUser({} as IUser);
});

export const updateInfoFx = createEffect(async ({ fullname, birthday, phone, image }: IUpdateInfoFx) => {
  try {
    const { data } = await api.patch(
      "/api/user/" + $user.getState().id,
      { fullname, birthDate: birthday, phone, image },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth")}` },
      }
    );

    if (data.warningMessage) {
      toast.error(data.warningMessage);
      return;
    }

    updateInfo({ fullname, birthday, phone, image: data.image });

    toast.success("Изменения сохранены!");
  } catch (error) {
    toast.error("Ошибка сохранения: " + error);
    throw error;
  }
});

// Тригеры
sample({
  clock: handleSignIn,
  target: signInFx,
});
sample({
  clock: handleSignUp,
  target: signUpFx,
});
sample({
  clock: handleUpdateInfo,
  target: updateInfoFx,
});
sample({
  clock: handleFetchUser,
  target: fetchUserFx,
});
sample({
  clock: handleLogeOut,
  target: logOutFx,
});
