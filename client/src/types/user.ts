/**Интерфейс пользователя */
export interface IUser {
  /**ID пользователя */
  id: number
  /**Логин пользователя */
  login: string
  /**Почта пользователя */
  email: string
  /**Имя пользователя */
  fullname?: string
  /**Фото пользователя */
  image?: string
  /**Дата рождения пользователя */
  birthday?: string
  /**Телефон пользователя */
  phone?: string
  /**Пол пользователя */
  gender?: gender
}
/**Интерфейс проверки авторизации */
export interface ILoginCheckFx {
  /**Токен сессии */
  jwt: string
}
/**Интервейс редактирования пользователя */
export interface IUpdateInfoFx {
  /**Имя пользователя */
  fullname?: string
  /**Фото пользователя */
  image?: string
  /**Дата рождения пользователя */
  birthday?: string
  /**Телефон пользователя */
  phone?: string
  /**Пол пользователя */
  gender?: gender
}

/**Тип пола */
export type gender = "male" | "female"
