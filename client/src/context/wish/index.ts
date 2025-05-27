"use client"

import { ICreateWish, IFetchWish, IUpdateWish, IWish } from "@/types/wish"
import { createEffect, createEvent, createStore, sample } from "effector"
import toast from "react-hot-toast"
import { handleSetAuth } from "../user"
import api from "@/api"
import { AxiosError } from "axios"

// СТОРЫ

export const $wish = createStore<IWish>({} as IWish)

// СОБЫТИЯ

export const handleSetWish = createEvent<IWish>()
export const handleFetchWish = createEvent<IFetchWish>()
export const handleCreateWish = createEvent<ICreateWish>()
export const handleUpdateWish = createEvent<IUpdateWish>()
export const handleDeleteWish = createEvent<number>()

// ЭФФЕКТЫ

export const fetchWishFx = createEffect(async (params: IFetchWish) => {
  const token = localStorage.getItem("auth")

  if (!token) {
    toast.error("Отсутствует токен авторизации!")
    handleSetAuth(false)
    return null
  }
  try {
    const { data } = await api.get(`/api/wish/${params.id + (params.shareToken ? `?token=<${params.shareToken}>` : "")}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    return data as IWish
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Произошла непредвиденная ошибка: " + error)
    throw error
  }
})

export const createWishFx = createEffect(async (params: ICreateWish) => {
  const token = localStorage.getItem("auth")

  if (!token) {
    toast.error("Отсутствует токен авторизации!")
    handleSetAuth(false)
    return null
  }
  try {
    const { data } = await api.post(`/api/wish/${params.listId}`, params, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    return data as IWish
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Произошла непредвиденная ошибка: " + error)
    throw error
  }
})

export const updateWishFx = createEffect(async (params: IUpdateWish) => {
  const token = localStorage.getItem("auth")

  if (!token) {
    toast.error("Отсутствует токен авторизации!")
    handleSetAuth(false)
    return null
  }
  try {
    const { data } = await api.patch(`/api/wish/${params.id}`, params, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    return data as IWish
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Произошла непредвиденная ошибка: " + error)
    throw error
  }
})

export const deleteWishFx = createEffect(async (id: number) => {
  const token = localStorage.getItem("auth")

  if (!token) {
    toast.error("Отсутствует токен авторизации!")
    handleSetAuth(false)
    return null
  }
  try {
    const { data } = await api.delete(`/api/wish/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    return data
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Произошла непредвиденная ошибка: " + error)
    throw error
  }
})

// ПОДПИСКИ

$wish
  .on(handleSetWish, (_, wish) => wish) //
  .on(fetchWishFx.doneData, (state, result) => (result ? result : state)) //
  .on(createWishFx.doneData, (state, result) => (result ? result : state)) //
  .on(updateWishFx.doneData, (state, result) => (result ? result : state)) //

// ТРИГГЕРЫ
sample({ clock: handleFetchWish, target: fetchWishFx })
sample({ clock: handleCreateWish, target: createWishFx })
sample({ clock: handleUpdateWish, target: updateWishFx })
sample({ clock: handleDeleteWish, target: deleteWishFx })
