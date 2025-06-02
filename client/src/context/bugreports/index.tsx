"use client"

import api from "@/api"
import { IBugreport, ICreateBugreport } from "@/types/bugreport"
import { AxiosError } from "axios"
import { createEffect, createEvent, createStore, sample } from "effector"
import toast from "react-hot-toast"

export const $bugreports = createStore<IBugreport[] | null>(null)

export const handleCreateBugreport = createEvent<ICreateBugreport>()
export const handleFetchBugreports = createEvent()

export const createBugreportFx = createEffect(async (params: ICreateBugreport) => {
  const token = localStorage.getItem("auth")

  if (!token) {
    toast.error("Отсутствует токен авторизации!")
    return null
  }
  try {
    const { data } = await api.post(`/api/bugreport`, params, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    return data as IBugreport
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Произошла непредвиденная ошибка: " + error)
    throw error
  }
})
export const fetchBugreportsFx = createEffect(async () => {
  const token = localStorage.getItem("auth")

  if (!token) {
    toast.error("Отсутствует токен авторизации!")
    return null
  }
  try {
    const { data } = await api.get(`/api/bugreport`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    return data as IBugreport[]
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Произошла непредвиденная ошибка: " + error)
    throw error
  }
})

$bugreports.on(fetchBugreportsFx.doneData, (_, result) => (result ? result : null))

sample({ clock: handleCreateBugreport, target: createBugreportFx })
sample({ clock: handleFetchBugreports, target: fetchBugreportsFx })
