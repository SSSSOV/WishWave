import api from "@/api"
import { IActivity, IRecommedation } from "@/types/recommendations"
import { IUser } from "@/types/user"
import { AxiosError } from "axios"
import { createEffect, createEvent, createStore, sample } from "effector"
import toast from "react-hot-toast"

export const $recommendations = createStore<IRecommedation[]>([] as IRecommedation[])
export const $activities = createStore<IActivity[]>([] as IActivity[])

export const handleFetchRecomendations = createEvent()
export const handleFetchActivities = createEvent()

export const fetchRecomendationsFx = createEffect(async () => {
  const token = localStorage.getItem("auth")

  try {
    const { data } = await api.get(`/api/recommendation`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    return data as IRecommedation[]
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Ошибка получения пользователя: " + error)
    throw error
  }
})
export const fetchActivitiesFx = createEffect(async () => {
  const token = localStorage.getItem("auth")

  try {
    const { data } = await api.get(`/api/friend/activity`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    return data as IActivity[]
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Ошибка получения пользователя: " + error)
    throw error
  }
})

$recommendations.on(fetchRecomendationsFx.doneData, (state, result) => (result ? result : state))
$activities.on(fetchActivitiesFx.doneData, (state, result) => (result ? result : state))

sample({ clock: handleFetchRecomendations, target: fetchRecomendationsFx })
sample({ clock: handleFetchActivities, target: fetchActivitiesFx })
