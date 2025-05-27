import { createEvent, createStore } from "effector"

export const handleSetPageTitle = createEvent<string | null>()
export const handleClearPageTitle = createEvent()

export const $pageTitle = createStore<string | null>(null, { skipVoid: false })
  .on(handleSetPageTitle, (_, value) => value)
  .on(handleClearPageTitle, () => null)
