/**Функция для проверки содержания контента в строке имени.
 * @param fullname Строка проверяемая на наличие контента.
 * @returns Логическая константа.*/
export const hasNameContent = (fullname?: string | null): boolean => {
  // Проверяем, что строка существует и не пустая
  if (!fullname || typeof fullname !== "string") {
    return false;
  }

  // Удаляем все пробелы и проверяем остались ли символы
  const trimmed = fullname.trim();
  if (trimmed.length === 0) {
    return false;
  }

  // Проверяем, содержит ли строка хотя бы одну букву (любого алфавита)
  return /[a-zA-Zа-яА-Я]/.test(trimmed);
};
