"use client";

import api from "@/api";
import { onAuthSuccess } from "@/lib/utils/auth";
import { IUser } from "@/types/user";
import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

type UserContextType = {
  user: IUser;
  signIn: (loginOrEmail: string, password: string) => Promise<any>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser>({} as IUser);

  const signIn = async (loginOrEmail: string, password: string) => {
    try {
      const { data } = await api.post("/api/auth/login", { loginOrEmail, password });

      if (data.warningMessage) {
        toast.error(data.warningMessage);
        return;
      }

      onAuthSuccess("Вход выполнен!", data);

      return data;
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return <UserContext.Provider value={{ user, signIn }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
