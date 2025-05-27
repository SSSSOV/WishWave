import { $user } from "@/context/user"
import { useUnit } from "effector-react"

export const useRequireAuth = () => {
  const user = useUnit($user)

  if (!user) {
    throw new Error("Unauthorized")
  }
}
