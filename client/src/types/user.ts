/**Интерфейс пользователя */
export interface IUser {
  /**ID пользователя */
  id: number
  /**Логин пользователя */
  login: string
  /**Почта пользователя */
  email?: string
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
  /**Роль пользователя */
  roleId: number
}

export interface IJWT {
  login: string
  id: number
  email: string
  fullname: string
  roles: {
    id: number
    value: string
    description: string
  }
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

export interface IUpdatePasswordFx {
  oldPassword: string
  newPassword: string
}

/**Тип пола */
export type gender = "male" | "female"
