"use client";

import { ICreateWishList, IUpdateWishList, IWishList } from "@/types/wish_list";
import { createEffect, createEvent, createStore, sample } from "effector";
import toast from "react-hot-toast";
import { setAuth } from "../user";
import api from "@/api";
import { IWish } from "@/types/wish";

// СТОРЫ

/** Хранилище со списоком желаний */
export const $wishList = createStore<IWishList>({} as IWishList, { skipVoid: false });
/** Хранилище со списками желаний */
export const $wishLists = createStore<IWishList[]>([] as IWishList[], { skipVoid: false });

// СОБЫТИЯ

/** Обработчик события смены состояния $wishLists */
export const handleSetWishLists = createEvent<IWishList[]>();
/** Обработчик события получения списков желаний */
export const handleFetchWishLists = createEvent();

/** Обработчик события смены состояния $wishList */
export const handleSetWishList = createEvent<IWishList>();
/** Обработчик события получения списка желаний */
export const handleFetchWishList = createEvent<number>();
/** Обработчик события добавления списка желаний */
export const handleCreateWishList = createEvent<ICreateWishList>();
/** Обработчик события удаления списка желаний */
export const handleDeleteWishList = createEvent<number>();
/** Обработчик события изменения списка желаний */
export const handleUpdateWishList = createEvent<IUpdateWishList>();

export const handleAddWishInList = createEvent<IWish>();

// ЭФФЕКТЫ

/** Эффект для получения списков желаний через API */
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

    console.log(data);
    return data as IWishList[];
  } catch (error) {
    toast.error("Ошибка получения списка желаний: " + error);
    throw error;
  }
});

/** Эффект для получения списка желаний через API */
export const fetchWishListFx = createEffect(async (id: number) => {
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

    handleSetWishLists(data);
  } catch (error) {
    toast.error("Ошибка получения списка желаний: " + error);
    throw error;
  }
});
/** Эффект для создания списка желаний через API */
export const createWishListFx = createEffect(async (params: ICreateWishList) => {
  try {
    const token = localStorage.getItem("auth");

    if (!token) {
      toast.error("Отсутствует токен авторизации!");
      setAuth(false);
      return null;
    }

    const { data } = await api.post("/api/wishlist", params, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.warningMessage) {
      toast.error(data.warningMessage);
      return null;
    }

    return data as IWishList;
  } catch (error) {
    toast.error("Ошибка получения списка желаний: " + error);
    throw error;
  }
});
/** Эффект для удаления списка желаний через API */
export const deleteWishListFx = createEffect(async (id: number) => {
  try {
    const token = localStorage.getItem("auth");

    if (!token) {
      toast.error("Отсутствует токен авторизации!");
      setAuth(false);
      return;
    }

    const { data } = await api.delete("/api/wishlist/" + id, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.warningMessage) {
      toast.error(data.warningMessage);
      return;
    }
  } catch (error) {
    toast.error("Ошибка получения списка желаний: " + error);
    throw error;
  }
});
/** Эффект для изменения списка желаний через API */
export const updateWishListFx = createEffect(async (params: IUpdateWishList) => {
  try {
    const token = localStorage.getItem("auth");

    if (!token) {
      toast.error("Отсутствует токен авторизации!");
      setAuth(false);
      return null;
    }

    const { data } = await api.patch("/api/wishlist/" + params.id, params, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.warningMessage) {
      toast.error(data.warningMessage);
      return null;
    }

    return data as IWishList;
  } catch (error) {
    toast.error("Ошибка получения списка желаний: " + error);
    throw error;
  }
});

// ПОДПИСКИ

$wishLists
  .on(handleSetWishLists, (_, lists) => lists) // Установка значения для $wishLists
  .on(handleDeleteWishList, (state, id) => state.filter((list) => list.id != id)) // Удаление списка из стора
  .on(createWishListFx.doneData, (state, result) => (result ? [...state, result] : state))
  .on(updateWishListFx.doneData, (state, result) => (result ? state.map((list) => (list.id == result.id ? result : list)) : state))
  .on(fetchWishListsFx.doneData, (state, result) => (result ? result : state));

$wishList
  .on(handleSetWishList, (_, list) => list) // Установка значения для $wishList
  .on(createWishListFx.doneData, (state, result) => (result ? result : state))
  .on(updateWishListFx.doneData, (state, result) => (result ? result : state))
  .on(handleDeleteWishList, (state, id) => (state.id == id ? ({} as IWishList) : state))
  .on(handleAddWishInList, (state, wish) => {
    return {
      ...state,
      wishes: [...(state.wishes || []), wish],
    };
  });

// ТРИГГЕРЫ

/** Эффект получения списков при событии получения */
sample({ clock: handleFetchWishLists, target: fetchWishListsFx });
/** Эффект создания списка через API при событии создания */
sample({ clock: handleCreateWishList, target: createWishListFx });
/** Эффект удаления списка через API при событии удаления */
sample({ clock: handleDeleteWishList, target: deleteWishListFx });
/** Эффект изменения списка через API при событии изменения */
sample({ clock: handleUpdateWishList, target: updateWishListFx });
