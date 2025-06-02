export interface IRecommedation {
  id: number
  name: string
  image: string
  price: number
  productLink: string
}

export interface IActivity {
  id: number
  login: string
  email?: string
  fullname?: string
  image?: string
}
