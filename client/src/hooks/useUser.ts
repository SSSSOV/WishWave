import {
  $user,
  handleDeleteUser,
  handleFetchUser,
  handleLogeOut,
  handleSetAuth,
  handleSetUser,
  handleSignIn,
  handleSignUp,
  handleUpdateInfo,
} from "@/context/user"
import { useUnit } from "effector-react"

export function useUser() {
  const [data, setAuth, setUser, signIn, signUp, fetchUser, updateInfo, logOut, deleteUser] = useUnit([
    $user,
    handleSetAuth,
    handleSetUser,
    handleSignIn,
    handleSignUp,
    handleFetchUser,
    handleUpdateInfo,
    handleLogeOut,
    handleDeleteUser,
  ])

  return { data, setAuth, setUser, signIn, signUp, fetchUser, updateInfo, logOut, deleteUser }
}
