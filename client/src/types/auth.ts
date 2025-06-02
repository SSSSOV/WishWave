/**Интерфейс регистрации */
export interface ISignUpFx {
  /**Логин пользователя */
  login: string
  /**Почта пользователя */
  email: string
  /**Пароль пользователя */
  password: string
}
/**Интерфейс выерификации email */
export interface IVerifyFx {
  /**Логин или почта */
  loginOrEmail: string
  /**Пароль пользователя */
  code: string
}
/**Интерфейс авторизации */
export interface ISignInFx {
  /**Логин или почта */
  loginOrEmail: string
  /**Пароль пользователя */
  password: string
}
