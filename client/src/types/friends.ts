/**Интерфейс запроса в друзья */
export interface IFriendRequest {
  /**ID запроса */
  id: number;
  /**Отправитель */
  sender: number;
  /**Получатель */
  recipient: number;
  /**Статус запроса */
  friendstatusId: number;
}
