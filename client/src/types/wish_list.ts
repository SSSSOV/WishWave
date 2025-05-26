/**Интерфейс списка желаний */
export interface IWishList {
  /**ID списка */
  id: number;
  /**Название списка */
  name: string;
  /**Уровень доступа списка */
  accesslevelId: number;
  /**Описание списка */
  description: string | undefined;
  /**Дата события списка */
  eventDate: string | undefined;
  /**ID пользователя которому принадлежит список */
  userId: number;
}
/**Интерфейс изменения списка желаний */
export interface IUpdateWishList {
  /**ID списка */
  id: number;
  /**Название списка */
  name: string | undefined;
  /**Уровень доступа списка */
  accesslevelId: number | undefined;
  /**Описание списка */
  description: string | undefined;
  /**Дата события списка */
  eventDate: string | undefined;
}
/**Интерфейс создания списка желаний */
export interface ICreateWishList {
  /**Название списка */
  name: string;
  /**Уровень доступа списка */
  accesslevelId: number;
  /**Описание списка */
  description: string | undefined;
  /**Дата события списка */
  eventDate: string | undefined;
}
/**Интерфейс получения списка желаний */
export interface IFetchWishList {
  /**ID списка желаний */
  id: number;
  /**Токен доступа */
  shareToken: string | undefined;
}
