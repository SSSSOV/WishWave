/**Функция для получения инициалов из строки.
 * @param fullname Строка из которой надо получить инициалы.
 * @returns Инициалы полученные из строки слов. */
export const getInitials = (fullname?: string | null): string => {
  if (!fullname || typeof fullname !== "string") {
    return ""; // Возвращаем пустую строку, если имя не передано
  }

  // Удаляем лишние пробелы и разбиваем на слова
  const words = fullname.trim().split(/\s+/);

  // Берем первую букву каждого слова и объединяем
  return words.map((word) => word[0].toUpperCase()).join("");
};
