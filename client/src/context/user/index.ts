"use client"

import api from "@/api"
import { ISignInFx, ISignUpFx } from "@/types/auth"
import { IUpdateInfoFx, IUser } from "@/types/user"
import { AxiosError } from "axios"
import { createDomain, createEffect, createEvent, createStore, sample } from "effector"
import { jwtDecode } from "jwt-decode"
import toast from "react-hot-toast"

// Сторы
export const $isAuth = createStore<boolean>(false)
export const $user = createStore<IUser | null>(null)

// События
export const handleSetAuth = createEvent<boolean>()
export const handleSetUser = createEvent<IUser | null>()

export const handleSignIn = createEvent<ISignInFx>()
export const handleSignUp = createEvent<ISignUpFx>()
export const handleFetchUser = createEvent<number | null>()
export const handleUpdateInfo = createEvent<IUpdateInfoFx>()
export const handleCheckAuth = createEvent()
export const handleLogeOut = createEvent()

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
    const { id } = jwtDecode<IUser>(token)

    const { data } = await api.get("/api/user/" + id, {
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
    }

    return userData
  } catch (error) {
    toast.error("Ошибка получения пользователя: " + error)
    throw error
  }
})

export const logOutFx = createEffect(() => {
  localStorage.removeItem("auth")
  handleSetAuth(false)
  handleSetUser(null)
})

export const updateInfoFx = createEffect(async ({ fullname, birthday, phone, image }: IUpdateInfoFx) => {
  const token = localStorage.getItem("auth")

  if (!token) {
    handleSetAuth(false)
    return null
  }

  try {
    const { data } = await api.patch(
      "/api/user/" + jwtDecode<IUser>(token).id,
      { fullname, birthDate: birthday, phone, image },
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
    }

    toast.success("Изменения сохранены!")
    return userData
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

    console.log(data, !!data)
    return !!data
  } catch (error) {
    if (error instanceof AxiosError) toast.error(error.response?.data.message)
    else toast.error("Ошибка сохранения: " + error)
    throw error
  }
})

// Подписки
$isAuth
  .on(handleSetAuth, (_, value) => value) // Установка значения
  .on(signInFx.doneData, (_, result) => !!result)
  .on(signUpFx.doneData, (_, result) => !!result)
  .on(checkAuthFx.doneData, (_, result) => !!result)
  .on(checkAuthFx.fail, () => false)
  .reset(handleLogeOut)

$user
  .on(handleSetUser, (_, value) => value)
  .on(updateInfoFx.doneData, (_, value) => value)
  .on(fetchUserFx.doneData, (_, value) => value)
  .reset(handleLogeOut)

// Тригеры
sample({
  clock: handleSignIn,
  target: signInFx,
})

// sample({
//   clock: signInFx.doneData,
//   filter: (user) => !!user,
//   target: fetchUserFx,
// })

// sample({
//   clock: signUpFx.doneData,
//   filter: (user) => !!user,
//   target: fetchUserFx,
// })

sample({
  clock: handleSignUp,
  target: signUpFx,
})
sample({
  clock: handleUpdateInfo,
  target: updateInfoFx,
})
sample({
  clock: handleFetchUser,
  target: fetchUserFx,
})
sample({
  clock: handleLogeOut,
  target: logOutFx,
})
sample({
  clock: handleCheckAuth,
  target: checkAuthFx,
})
