"use client";

import { IWishList } from "@/types/wish_lists";
import { createEffect, createEvent, createStore, sample } from "effector";
import toast from "react-hot-toast";
import { setAuth } from "../user";
import api from "@/api";

// Сторы
export const $wishLists = createStore<IWishList[]>([] as IWishList[]);

// События
export const setWishLists = createEvent<IWishList[]>();
export const handleFetchWishLists = createEvent();
export const handleAddWishList = createEvent<IWishList>();

// Подписки
$wishLists.on(setWishLists, (_, lists) => lists);

// Эффекты
export const fetchWishListsFx = createEffect(async () => {
  try {
    const token = localStorage.getItem("auth");

    if (!token) {
      toast.error("Отсутствует токен авторизации!");
      setAuth(false);
      return;
    }

    const { data } = await api.get("/api/wishlist", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.warningMessage) {
      toast.error(data.warningMessage);
      setAuth(false);
      return;
    }

    setWishLists(data);
  } catch (error) {
    toast.error("Ошибка получения списка желаний: " + error);
    throw error;
  }
});

export const addWishListFx = createEffect(async ({ name, accesslevelId, description, eventDate }: IWishList) => {
  try {
    console.log("start addWishListFx");
    const token = localStorage.getItem("auth");

    if (!token) {
      toast.error("Отсутствует токен авторизации!");
      setAuth(false);
      return;
    }

    const { data } = await api.post(
      "/api/wishlist",
      { name, accesslevelId, description, eventDate },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (data.warningMessage) {
      toast.error(data.warningMessage);
      setAuth(false);
      return;
    }

    console.log(data);
    console.log("end addWishListFx");
  } catch (error) {
    toast.error("Ошибка получения списка желаний: " + error);
    setAuth(false);
    throw error;
  }
});

export const deleteWishListFx = createEffect(async () => {});
// Тригеры
sample({
  clock: handleFetchWishLists,
  target: fetchWishListsFx,
});
sample({
  clock: handleAddWishList,
  target: addWishListFx,
});
