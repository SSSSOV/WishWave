export interface IWish {
  id: number;
  name: string;
  price?: number;
  productLink?: string;
  image?: string;
}

export interface ICreateWish {
  listId: number;
  name: string;
  price: number;
  productLink?: string;
  image?: string;
}

export interface IUpdateWish {
  id: number;
  name?: string;
  price?: number;
  productLink?: string;
  image?: string;
}

export interface IFetchWish {
  id: number;
  shareToken: string;
}
