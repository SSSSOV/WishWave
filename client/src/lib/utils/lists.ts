import { IWishList } from "@/types/wish_lists";

/**
 * Сортирует списки желаний по дате события (eventDate)
 * @param wishLists Массив списков желаний
 * @param order Порядок сортировки: 'asc' - по возрастанию, 'desc' - по убыванию
 * @returns Отсортированный массив списков желаний
 */
export const sortWishListsByDate = (wishLists: IWishList[], order: "asc" | "desc" = "asc") => {
  // Создаем копию массива, чтобы не мутировать исходный
  return [...wishLists].sort((a, b) => {
    const dateA = new Date(a.eventDate).getTime();
    const dateB = new Date(b.eventDate).getTime();

    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
};
