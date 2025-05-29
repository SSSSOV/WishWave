import { IUser } from "./user"
import { IWishList } from "./wish_list"

/**Интерфейс желания */
export interface IWish {
  /**ID желания */
  id: number
  /**Название желания */
  name: string
  /**Цена желания */
  price?: number
  /**Ссылка на товар */
  productLink?: string
  /**Изображение желания */
  image?: string
  /**Статус бронирования */
  wishStatusId: number
  /**Токен доступа */
  shareToken?: string
  /**Пользователь которому принадлежит желание */
  owner: IUser
  /**Список которому принадлежит желание */
  list: IWishList
  /**Пользователь который забронировал */
  bookedByUser?: IUser
}
/**Интерфейс создания желания */
export interface ICreateWish {
  /**Название желания */
  name: string
  /**Цена желания */
  price?: number
  /**Ссылка на товар */
  productLink?: string
  /**Изображение желания */
  image?: string
  /**ID списка в котором создается */
  listId: number
}
/**Интерфейс редактирования желания */
export interface IUpdateWish {
  /**ID желания */
  id: number
  /**Название желания */
  name?: string
  /**Цена желания */
  price?: number
  /**Ссылка на товар */
  productLink?: string
  /**Изображение желания */
  image?: string
}
/**Интерфейс получения желания */
export interface IFetchWish {
  /**ID желания */
  id: number
  /**Токен доступа */
  shareToken?: string
}
