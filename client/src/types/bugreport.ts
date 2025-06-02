import { IUser } from "./user"

export interface IBugreport {
  id: number
  title: string
  description: string
  email?: string
  owner: {
    id: number
    fullname: string
    login: string
    image: string
  }
  createdAt: string
}

export interface ICreateBugreport {
  title: string
  description: string
  email?: string
}
