"use client"

import { createEffect, createEvent, createStore, sample } from "effector"
import toast from "react-hot-toast"
import { AxiosError } from "axios"
import { IFriendRequest } from "@/types/friends"
import { handleSetAuth } from "../user"
import api from "@/api"
import { IUser } from "@/types/user"

export const $friends = createStore<IUser[] | null>(null, { skipVoid: false })
export const $friend = createStore<IUser | null>(null, { skipVoid: false })
export const $recivedRequests = createStore<IFriendRequest[] | null>(null, { skipVoid: false })
export const $sentRequests = createStore<IFriendRequest[] | null>(null, { skipVoid: false })

export const handleFetchFriends = createEvent()
export const handleFetchFriend = createEvent<number>()
export const handleFetchRecivedRequests = createEvent()
export const handleFetchSentRequests = createEvent()

export const handleSendFriendRequest = createEvent<number>()
export const handleCancelFriendRequest = createEvent<number>()
export const handleAcceptFriendRequest = createEvent<number>()
export const handleRejectFriendRequest = createEvent<number>()

export const handleUnfriend = createEvent<number>()

export const fetchFriendsFx = createEffect(async () => {
  const token = localStorage.getItem("auth")

  if (!token) {
    toast.error("Отсутствует токен авторизации!")
    handleSetAuth(false)
    return null
  }
  try {
    const { data } = await api.get(`/api/friend`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    return data as IUser[]
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Произошла непредвиденная ошибка: " + error)
    throw error
  }
})
export const fetchFriendFx = createEffect(async (id: number) => {
  const token = localStorage.getItem("auth")

  if (!token) {
    toast.error("Отсутствует токен авторизации!")
    handleSetAuth(false)
    return null
  }
  try {
    const { data } = await api.get(`/api/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    const userData: IUser = {
      id: data.id,
      login: data.login,
      email: data.email,
      fullname: data.fullname || undefined,
      image: data.image || undefined,
      phone: data.phone || undefined,
      birthday: data.birthDate || undefined, // Преобразуем birthDate в birthday
      gender: data.gender || undefined, // Серверные данные не содержат gender
    }

    return userData
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Произошла непредвиденная ошибка: " + error)
    throw error
  }
})
export const fetchRecivedRequestsFx = createEffect(async () => {
  const token = localStorage.getItem("auth")

  if (!token) {
    toast.error("Отсутствует токен авторизации!")
    handleSetAuth(false)
    return null
  }
  try {
    const { data } = await api.get(`/api/friend/requests/received`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    return data as IFriendRequest[]
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Произошла непредвиденная ошибка: " + error)
    throw error
  }
})
export const fetchSentRequestsFx = createEffect(async () => {
  const token = localStorage.getItem("auth")

  if (!token) {
    toast.error("Отсутствует токен авторизации!")
    handleSetAuth(false)
    return null
  }
  try {
    const { data } = await api.get(`/api/friend/requests/sent`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    return data as IFriendRequest[]
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Произошла непредвиденная ошибка: " + error)
    throw error
  }
})

export const sendFriendRequestFx = createEffect(async (targetUserId: number) => {
  const token = localStorage.getItem("auth")

  if (!token) {
    toast.error("Отсутствует токен авторизации!")
    handleSetAuth(false)
    return null
  }
  try {
    const { data } = await api.post(
      `/api/friend/request`,
      { targetUserId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    toast.success("Заявка отправлена!")

    return data
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Произошла непредвиденная ошибка: " + error)
    throw error
  }
})
export const cancelFriendRequestFx = createEffect(async (requestId: number) => {
  const token = localStorage.getItem("auth")

  if (!token) {
    toast.error("Отсутствует токен авторизации!")
    handleSetAuth(false)
    return null
  }
  try {
    const { data } = await api.delete(`/api/friend/request/${requestId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    toast.success("Заявка отменена!")
    return data
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Произошла непредвиденная ошибка: " + error)
    throw error
  }
})
export const acceptFriendRequestFx = createEffect(async (requestId: number) => {
  const token = localStorage.getItem("auth")

  if (!token) {
    toast.error("Отсутствует токен авторизации!")
    handleSetAuth(false)
    return null
  }
  try {
    const { data } = await api.patch(`/api/friend/request/${requestId}/accept`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    toast.success("Заявка принята!")
    return data
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Произошла непредвиденная ошибка: " + error)
    throw error
  }
})
export const rejectFriendRequestFx = createEffect(async (requestId: number) => {
  const token = localStorage.getItem("auth")

  if (!token) {
    toast.error("Отсутствует токен авторизации!")
    handleSetAuth(false)
    return null
  }
  try {
    const { data } = await api.patch(`/api/friend/request/${requestId}/reject`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    toast.success("Заявка отклонена!")
    return data
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Произошла непредвиденная ошибка: " + error)
    throw error
  }
})

export const UnfriendFx = createEffect(async (friendId: number) => {
  const token = localStorage.getItem("auth")

  if (!token) {
    toast.error("Отсутствует токен авторизации!")
    handleSetAuth(false)
    return null
  }
  try {
    const { data } = await api.delete(`/api/friend/${friendId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    toast.success("Друг удален!")
    return data
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Произошла непредвиденная ошибка: " + error)
    throw error
  }
})

$friends.on(fetchFriendsFx.doneData, (state, result) => (result ? result : state))
$friend.on(fetchFriendFx.doneData, (state, result) => (result ? result : state))
$sentRequests.on(fetchSentRequestsFx.doneData, (state, result) => (result ? result : state))
$recivedRequests.on(fetchRecivedRequestsFx.doneData, (state, result) => (result ? result : state))

sample({ clock: handleFetchFriends, target: fetchFriendsFx })
sample({ clock: handleFetchFriend, target: fetchFriendFx })
sample({ clock: handleFetchRecivedRequests, target: fetchRecivedRequestsFx })
sample({ clock: handleFetchSentRequests, target: fetchSentRequestsFx })

sample({ clock: handleSendFriendRequest, target: sendFriendRequestFx })
sample({ clock: handleCancelFriendRequest, target: cancelFriendRequestFx })
sample({ clock: handleAcceptFriendRequest, target: acceptFriendRequestFx })
sample({ clock: handleRejectFriendRequest, target: rejectFriendRequestFx })

sample({ clock: handleUnfriend, target: UnfriendFx })

//

sample({ clock: sendFriendRequestFx.done, target: handleFetchSentRequests })
sample({ clock: cancelFriendRequestFx.done, target: handleFetchSentRequests })
sample({ clock: acceptFriendRequestFx.done, target: handleFetchRecivedRequests })
sample({ clock: rejectFriendRequestFx.done, target: handleFetchRecivedRequests })

sample({ clock: acceptFriendRequestFx.done, target: handleFetchFriends })
sample({ clock: rejectFriendRequestFx.done, target: handleFetchFriends })

sample({ clock: UnfriendFx.done, target: handleFetchFriends })
