"use client"
import { useLoading } from "@/hooks/useLoading"
import { useEffect } from "react"
import { useUnit } from "effector-react"
import { $isAuth, $user, fetchUserFx, handleFetchUser } from "@/context/user"
import { startLoading, stopLoading } from "@/context/loading"
import Loader from "@/components/ui/loader/Loader"
import NonAuthPage from "@/components/shared/nonAuthPage/NonAuthPage"
import Section from "@/components/ui/section/Section"
import Button from "@/components/ui/buttons/Button"
import { useRouter } from "next/navigation"
import { sample } from "effector"
import { handleSetPageTitle } from "@/context/page"
import { jwtDecode } from "jwt-decode"
import { IUser } from "@/types/user"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, isAuth, fetchUser] = useUnit([$user, $isAuth, handleFetchUser])

  useEffect(() => {
    const loadUser = () => {
      fetchUser(null)
    }

    if (!user && isAuth) {
      loadUser()
    }
  }, [user, isAuth, fetchUser])

  if (!isAuth) {
    return <NonAuthPage text="Для того чтобы просматривать профиль, пожалуйста, авторизуйтесь" />
  }

  if (!user || user.id != jwtDecode<IUser>(localStorage.getItem("auth")!).id) return <Loader />

  return <>{children}</>
}
