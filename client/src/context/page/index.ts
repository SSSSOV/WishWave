import { createEvent, createStore } from "effector";

export const handleSetPageTitle = createEvent<string>();

export const $pageTitle = createStore<string>("").on(handleSetPageTitle, (_, value) => {
  console.log(value);
  return String(value);
});
