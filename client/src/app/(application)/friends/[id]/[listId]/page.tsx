"use client";

import List from "@/components/ui/list/List";
import ListItem, { list_item_icon_color } from "@/components/ui/list/ListItem";
import Monogram from "@/components/ui/monogram/Monogram";
import Section from "@/components/ui/section/Section";
import { $friend, handleFetchFriend } from "@/context/friends";
import { useUnit } from "effector-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getInitials, hasNameContent } from "../../../profile/page";
import { IWishList } from "@/types/wish_list";
import { sortWishListsByDate } from "@/lib/utils/lists";
import { $wishList, handleFetchWishList } from "@/context/wish_lists";
import Button from "@/components/ui/buttons/Button";

export default function UserListPage() {
  // Роутер
  const router = useRouter();

  // Переменные
  const { listId } = useParams(); // Получаем ID из URL

  // Стор
  const [wishList, fetchWishList] = useUnit([$wishList, handleFetchWishList]);

  const [friend, fetchFriend] = useUnit([$friend, handleFetchFriend]);

  useEffect(() => {
    if (listId) fetchWishList(Number(listId));
  }, []);

  useEffect(() => {
    console.log(wishList);
  }, [wishList]);

  // useEffect(() => {
  //   if (friend && friend.wishlists && friend.wishlists?.length > 0) setShownLists(friend.wishlists);
  //   else setShownLists(undefined);
  // }, [friend]);

  const colors = ["primary", "secondary", "tertiary"];
  const access_lvls = ["Публичный", "Приватный", "По ссылке", "Для друзей"];

  if (!wishList) {
    return (
      <Section align_items="center" padding_top_size="lg">
        <p>Список не найден</p>
        <Button variant="text" onClick={() => router.push("/lists")}>
          Вернуться к спискам
        </Button>
      </Section>
    );
  }

  const handleOpen = (id: number) => {
    router.push(`/wish/${id}`);
  };

  return (
    <>
      <Section withoutPad>
        <List>
          <ListItem condition={2} headline={wishList.name} overline="название" />
          <ListItem
            condition={2}
            headline={
              wishList.eventDate != null
                ? new Date(wishList.eventDate).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Не указано"
            }
            overline="дата события"
          />
          <ListItem condition={2} headline={access_lvls[wishList.accesslevelId - 1]} overline="доступ" />
          <ListItem condition={2} headline={wishList.description} overline="описание" />
        </List>
      </Section>
      <Section>
        <hr />
      </Section>
      <Section title="желания" padding_top_size="lg" padding_bot_size="lg">
        <List withoutPad>
          {wishList.wishes && wishList.wishes.length > 0 ? (
            wishList.wishes.map((wish) => (
              <ListItem
                nowrap
                key={wish.id}
                condition={2}
                headline={wish.name}
                overline={`${wish.price ? `${wish.price} ₽` : "Цена не указана"}`}
                leading_type={wish.image ? "image" : "icon"}
                leading="featured_seasonal_and_gifts"
                trailing_type="icon"
                url={process.env.NEXT_PUBLIC_SERVER_URL + "static/" + wish.image}
                color={colors[wish.id % 3] as list_item_icon_color}
                onClick={() => handleOpen(wish.id)}
              />
            ))
          ) : (
            <p>В этом списке пока нет желаний</p>
          )}
        </List>
      </Section>
    </>
  );
}
