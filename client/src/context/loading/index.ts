import { createEvent, createStore } from "effector";

export const setLoading = createEvent<boolean>();
export const startLoading = createEvent();
export const stopLoading = createEvent();

export const $isLoading = createStore<boolean>(false)
  .on(setLoading, (_, value) => value)
  .on(startLoading, () => true)
  .on(stopLoading, () => false);
