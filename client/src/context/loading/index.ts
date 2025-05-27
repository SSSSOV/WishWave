import { createEvent, createStore, sample } from "effector"

// События
export const startLoading = createEvent<string>() // с идентификатором
export const stopLoading = createEvent<string>()
export const resetLoading = createEvent()

// Стор
export const $isLoading = createStore<boolean>(false)
  .on(startLoading, () => true)
  .on(stopLoading, () => false)
  .reset(resetLoading)

// Для отслеживания нескольких загрузок
export const $activeLoaders = createStore<string[]>([])
  .on(startLoading, (loaders, id) => [...loaders, id])
  .on(stopLoading, (loaders, id) => loaders.filter((loaderId) => loaderId !== id))
  .reset(resetLoading)
