import { IUser } from "./user"

/**Интерфейс запроса в друзья */
export interface IFriendRequest {
  /**ID запроса */
  id: number
  /**Отправитель {id, fullname, login, image} */
  sender: IUser
  /**Получатель {id, fullname, login, image}*/
  recipient: IUser
  /**Статус запроса */
  friendstatusId: number
}
