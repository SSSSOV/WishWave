import { createDomain, createEffect, createEvent, createStore, sample } from "effector";

export const dom = createDomain();

export const incClicked = dom.createEvent();
export const decClicked = dom.createEvent();
export const clrClicked = dom.createEvent();
export const addClicked = dom.createEvent<number>();

export const $count = dom.createStore<number>(0);

export const clearFx = createEffect(() => {
  console.log("Вызван эффектор clearFx");
});

$count.on(incClicked, (x) => x + 1);
$count.on(decClicked, (x) => x + 1);
$count.on(addClicked, (x, y) => x + y);
$count.on(clearFx.done, () => 0);
$count.on(clearFx.fail, () => console.log("clearFx завершил работу неуспешно"));

sample({
  clock: clrClicked,
  target: clearFx,
});
