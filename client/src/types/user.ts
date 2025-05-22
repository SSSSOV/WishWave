// Характеристики пользователя
export interface IUser {
  _id: string;
  role: string;
  login: string;
  password: string;
  email: string;
  fullname?: string;
  image?: string;
  phone?: string;
}

// Данные для проверки авторизации
export interface ILoginCheckFx {
  jwt: string;
  setShouldShowContent?: (arg0: boolean) => void;
}
