import { $authHost } from ".";

// Отправить запрос в друзья
export const invite_friend = async (userId: number, friendId: number) => {
  const { data } = await $authHost.post("api/friend");
};
