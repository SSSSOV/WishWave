/**Интерфейс желания */
export interface IWish {
  /**ID желания */
  id: number;
  /**Название желания */
  name: string;
  /**Цена желания */
  price: number | undefined;
  /**Ссылка на товар */
  productLink: string | undefined;
  /**Изображение желания */
  image: string | undefined;
  /**ID пользователя которому принадлежит желание */
  userId: number;
  /**Статус бронирования */
  wishStatusId: number;
  /**Пользователь который забронировал */
  bookedByUserId?: number;
  /**Токен доступа */
  shareToken?: string;
}
/**Интерфейс создания желания */
export interface ICreateWish {
  /**Название желания */
  name: string;
  /**Цена желания */
  price?: number;
  /**Ссылка на товар */
  productLink?: string;
  /**Изображение желания */
  image?: string;
  /**ID списка в котором создается */
  listId: number;
}
/**Интерфейс редактирования желания */
export interface IUpdateWish {
  /**ID желания */
  id: number;
  /**Название желания */
  name?: string;
  /**Цена желания */
  price?: number;
  /**Ссылка на товар */
  productLink?: string;
  /**Изображение желания */
  image?: string;
}
/**Интерфейс получения желания */
export interface IFetchWish {
  /**ID желания */
  id: number;
  /**Токен доступа */
  shareToken?: string;
}
