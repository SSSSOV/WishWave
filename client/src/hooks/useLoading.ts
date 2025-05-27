import { useUnit } from "effector-react"
import { $isLoading, $activeLoaders } from "@/context/loading"

export function useLoading(id?: string) {
  const [isLoading, activeLoaders] = useUnit([$isLoading, $activeLoaders])

  return {
    isLoading: id ? activeLoaders.includes(id) : isLoading,
    activeLoaders,
  }
}
