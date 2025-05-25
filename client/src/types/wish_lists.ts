import { IWish } from "./wish";

/** Интерфейс списка желаний */
export interface IWishList {
  id: number;
  name: string;
  accesslevelId: number;
  description: string;
  eventDate: string;
  wishes?: IWish[];
}

/** Интерфейс изменения списка желаний */
export interface IUpdateWishList {
  id: number;
  name?: string;
  accesslevelId?: number;
  description?: string;
  eventDate?: string;
}

export interface ICreateWishList {
  name: string;
  accesslevelId: number;
  description: string;
  eventDate: string;
}
