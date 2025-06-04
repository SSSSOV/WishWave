"use client"

import api from "@/api"
import { ISignInFx, ISignUpFx, IVerifyFx } from "@/types/auth"
import { IUpdateInfoFx, IUpdatePasswordFx, IUser } from "@/types/user"
import { AxiosError } from "axios"
import { createEffect, createEvent, createStore, sample } from "effector"
import toast from "react-hot-toast"

// Сторы
export const $isAuth = createStore<boolean>(false)
export const $user = createStore<IUser | null>(null)

// События
export const handleSetAuth = createEvent<boolean>()
export const handleSetUser = createEvent<IUser | null>()

export const handleSignIn = createEvent<ISignInFx>()
export const handleSignUp = createEvent<ISignUpFx>()
export const handleVerify = createEvent<IVerifyFx>()
export const handleFetchUser = createEvent<number | null>()
export const handleUpdateInfo = createEvent<IUpdateInfoFx>()
export const handleUpdatePassword = createEvent<IUpdatePasswordFx>()
export const handleCheckAuth = createEvent()
export const handleLogeOut = createEvent()
export const handleDeleteUser = createEvent<number | null>()
export const handleResetUser = createEvent()

// Эффекты
export const signInFx = createEffect(async ({ loginOrEmail, password }: ISignInFx) => {
  try {
    const { data } = await api.post("/api/auth/login", {
      loginOrEmail,
      password,
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return
    }

    if (!data.token) {
      toast.error("Не получили токен от сервера")
      throw new Error("No token received")
    }

    // Сохраняем токен в localStorage
    localStorage.setItem("auth", data.token)

    toast.success("Вы успешно вошли!")

    return data
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message + " (" + error.status + ")")
    else toast.error("Произошла непредвиденная ошибка")
    throw error
  }
})
export const signUpFx = createEffect(async ({ login, email, password }: ISignUpFx) => {
  try {
    const { data } = await api.post("/api/auth/registration", {
      login,
      email,
      password,
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return
    }

    toast.success("Код для подтверждения отправлен!")
    return data
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message + " (" + error.status + ")")
    else toast.error("Ошибка регистрации: " + error)
    throw error
  }
})
export const verifyFx = createEffect(async ({ loginOrEmail, code }: IVerifyFx) => {
  try {
    const { data } = await api.post("/api/auth/verify-email", {
      loginOrEmail,
      code,
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return
    }

    if (!data.token) {
      toast.error("Не получили токен от сервера")
      throw new Error("No token received")
    }

    // Сохраняем токен в localStorage
    localStorage.setItem("auth", data.token)

    toast.success("Вы успешно зарегистрировались!")

    return data
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message + " (" + error.status + ")")
    else toast.error("Ошибка регистрации: " + error)
    throw error
  }
})
export const fetchUserFx = createEffect(async (id: number | null) => {
  const token = localStorage.getItem("auth")

  if (!token) {
    handleSetAuth(false)
    return null
  }

  try {
    const { data } = await api.get(`/api/user${id ? "/" + id : ""}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      handleSetAuth(false)
      return null
    }
    const userData: IUser = {
      id: data.id.toString(),
      login: data.login,
      email: data.email,
      fullname: data.fullname || undefined,
      image: data.image || undefined,
      phone: data.phone || undefined,
      birthday: data.birthDate || undefined, // Преобразуем birthDate в birthday
      gender: data.gender || undefined, // Серверные данные не содержат gender
      roleId: data.roleId,
    }

    return userData
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Ошибка получения пользователя: " + error)
    throw error
  }
})
export const logOutFx = createEffect(async () => {
  const token = localStorage.getItem("auth")

  if (!token) {
    handleSetAuth(false)
    return null
  }

  try {
    const { data } = await api.post(`/api/auth/logout`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      handleSetAuth(false)
      return null
    }

    localStorage.removeItem("auth")
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Ошибка выхода: " + error)
    throw error
  }
})
export const updateInfoFx = createEffect(async ({ fullname, birthday, phone, image, gender }: IUpdateInfoFx) => {
  const token = localStorage.getItem("auth")

  if (!token) {
    handleSetAuth(false)
    return null
  }

  try {
    const { data } = await api.patch(
      "/api/user/",
      { fullname, birthDate: birthday, phone, image, gender },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth")}` },
      }
    )

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    const userData: IUser = {
      id: data.id.toString(),
      login: data.login,
      email: data.email,
      fullname: data.fullname || undefined,
      image: data.image || undefined,
      phone: data.phone || undefined,
      birthday: data.birthDate || undefined, // Преобразуем birthDate в birthday
      gender: data.gender || undefined, // Серверные данные не содержат gender
      roleId: data.roleId,
    }

    toast.success("Изменения сохранены!")
    return userData
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Ошибка сохранения: " + error)
    throw error
  }
})
export const updatePasswordFx = createEffect(async (props: IUpdatePasswordFx) => {
  const token = localStorage.getItem("auth")

  if (!token) {
    handleSetAuth(false)
    return null
  }

  try {
    const { data } = await api.patch("/api/user/password", props, {
      headers: { Authorization: `Bearer ${localStorage.getItem("auth")}` },
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return null
    }

    toast.success("Изменения сохранены!")
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Ошибка сохранения: " + error)
    throw error
  }
})
export const checkAuthFx = createEffect(async () => {
  const token = localStorage.getItem("auth")

  if (!token) {
    return false
  }

  try {
    const data = await api.get("/api/user/checkAuth/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("auth")}` },
    })

    if (data.status != 200) {
      return false
    }

    return !!data
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Ошибка авторизации: " + error)
    throw error
  }
})
export const deleteUserFx = createEffect(async (id: number | null) => {
  const token = localStorage.getItem("auth")

  if (!token) {
    return false
  }

  try {
    const data = await api.delete(`/api/user/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("auth")}` },
    })

    if (data.status != 200) {
      return false
    }

    return !!data
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Ошибка удаления: " + error)
    throw error
  }
})

// Подписки
$isAuth
  .on(handleSetAuth, (_, value) => value) // Установка значения
  .on(signInFx.doneData, (_, result) => !!result)
  .on(verifyFx.doneData, (_, result) => !!result)
  .on(checkAuthFx.doneData, (_, result) => !!result)
  .on(checkAuthFx.fail, () => false)
  .reset(logOutFx.done)

$user
  .on(handleSetUser, (_, value) => value)
  .on(updateInfoFx.doneData, (_, value) => value)
  .on(fetchUserFx.doneData, (_, value) => value)
  .reset(handleLogeOut)
  .reset(handleResetUser)
  .reset(logOutFx.done)

// Тригеры
sample({ clock: handleSignIn, target: signInFx })

sample({ clock: handleSignUp, target: signUpFx })
sample({ clock: handleVerify, target: verifyFx })
sample({ clock: handleUpdateInfo, target: updateInfoFx })
sample({ clock: handleUpdatePassword, target: updatePasswordFx })
sample({ clock: handleFetchUser, target: fetchUserFx })
sample({ clock: handleLogeOut, target: logOutFx })
sample({ clock: handleCheckAuth, target: checkAuthFx })
sample({ clock: handleDeleteUser, target: deleteUserFx })
