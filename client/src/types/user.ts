// Характеристики пользователя
export interface IUser {
  id: string; // -
  login: string; // -
  email: string; // -
  fullname?: string;
  image?: string;
  phone?: string;
  birthday?: string;
  gender?: string;
}

// Данные для проверки авторизации
export interface ILoginCheckFx {
  jwt: string;
  setShouldShowContent?: (arg0: boolean) => void;
}

export interface IUpdateInfoFx {
  fullname?: string;
  birthday?: string;
  phone?: string;
  image?: string;
}
