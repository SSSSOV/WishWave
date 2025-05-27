import NonAuthPage from "@/components/shared/nonAuthPage/NonAuthPage"
import { $isAuth, $user, handleUpdateInfo } from "@/context/user"
import { useUnit } from "effector-react"
import { useRouter } from "next/navigation"

export default function EmailPage() {
  //Роутер
  const router = useRouter()

  // Контекст
  const [isAuth, user, handle] = useUnit([$isAuth, $user, handleUpdateInfo])

  if (!user) return <NonAuthPage />
  return
}
