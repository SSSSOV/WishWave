"use client"

import api from "@/api"
import { IBugreport, ICreateBugreport, IStats } from "@/types/bugreport"
import { AxiosError } from "axios"
import { createEffect, createEvent, createStore, sample } from "effector"
import toast from "react-hot-toast"

export const $bugreports = createStore<IBugreport[] | null>(null)
export const $stats = createStore<IStats | null>(null)

export const handleFetchBugreports = createEvent()
export const handleDeleteBugreport = createEvent<number>()
export const handleFetchStats = createEvent()
export const handleCreateBugreport = createEvent<ICreateBugreport>()

export const fetchBugreportsFx = createEffect(async () => {
  const token = localStorage.getItem("auth")

  if (!token) {
    toast.error("Отсутствует токен авторизации!")
    return null
  }
  try {
    const { data } = await api.get(`/api/bugreport/all`, {
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
export const createBugreportFx = createEffect(async (params: ICreateBugreport) => {
  const token = localStorage.getItem("auth")

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
export const deleteBugreportFx = createEffect(async (id: number) => {
  const token = localStorage.getItem("auth")

  try {
    const { data } = await api.delete(`/api/bugreport/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Произошла непредвиденная ошибка: " + error)
    throw error
  }
})
export const fetchStatsFx = createEffect(async () => {
  const token = localStorage.getItem("auth")

  if (!token) {
    toast.error("Отсутствует токен авторизации!")
    return null
  }
  try {
    const { data } = await api.get(`/api/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    return data as IStats
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Произошла непредвиденная ошибка: " + error)
    throw error
  }
})

$bugreports.on(fetchBugreportsFx.doneData, (_, result) => (result ? result : null))
$stats.on(fetchStatsFx.doneData, (_, result) => (result ? result : null))

sample({ clock: handleCreateBugreport, target: createBugreportFx })
sample({ clock: handleFetchBugreports, target: fetchBugreportsFx })
sample({ clock: handleFetchStats, target: fetchStatsFx })
sample({ clock: handleDeleteBugreport, target: deleteBugreportFx })
sample({ clock: deleteBugreportFx.done, target: handleFetchBugreports })
