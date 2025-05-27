import { IWish } from "./wish"

/**Интерфейс списка желаний */
export interface IWishList {
  /**ID списка */
  id: number
  /**Название списка */
  name: string
  /**Уровень доступа списка */
  accesslevelId: number
  /**Описание списка */
  description?: string
  /**Дата события списка */
  eventDate?: string
  /**ID пользователя которому принадлежит список */
  userId: number
  /**Желания в списке */
  wishes?: IWish[]
}
/**Интерфейс изменения списка желаний */
export interface IUpdateWishList {
  /**ID списка */
  id: number
  /**Название списка */
  name?: string
  /**Уровень доступа списка */
  accesslevelId?: number
  /**Описание списка */
  description?: string
  /**Дата события списка */
  eventDate?: string
}
/**Интерфейс создания списка желаний */
export interface ICreateWishList {
  /**Название списка */
  name: string
  /**Уровень доступа списка */
  accesslevelId: number
  /**Описание списка */
  description?: string
  /**Дата события списка */
  eventDate?: string
}
/**Интерфейс получения списка желаний */
export interface IFetchWishList {
  /**ID списка желаний */
  id: number
  /**Токен доступа */
  shareToken?: string
}
