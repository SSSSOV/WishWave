"use client";

import Button from "@/components/ui/buttons/Button";
import List from "@/components/ui/list/List";
import ListItem from "@/components/ui/list/ListItem";
import Section from "@/components/ui/section/Section";
import { $wishList, $wishLists, handleDeleteWishList, handleFetchWishLists, handleSetWishList } from "@/context/wish_lists";
import { useUnit } from "effector-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WishListPage() {
  // Роутер
  const router = useRouter();

  // Переменные
  const { id } = useParams(); // Получаем ID из URL

  // Стор
  const [wishList, deleteWishList] = useUnit([$wishList, handleDeleteWishList]);

  const handleDelete = () => {
    deleteWishList(Number(id));
    router.back();
  };

  const handleEdit = () => {
    router.push(`/lists/${id}/edit`);
  };

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

  return (
    <>
      <Section withoutPad>
        <List>
          <ListItem condition={2} headline={wishList.name} overline="название" />
          <ListItem
            condition={2}
            headline={new Date(wishList.eventDate).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            overline="дата события"
          />
          <ListItem condition={2} headline={access_lvls[wishList.accesslevelId - 1]} overline="доступ" />
          <ListItem condition={2} headline={wishList.description} overline="описание" />
        </List>
      </Section>
      <Section align_items="right">
        <Section items_direction="row" withoutPad isFit>
          <Button variant="text" icon="add" onClick={() => router.push(`/lists/${id}/add-wish`)}>
            желание
          </Button>
          <Button variant="text" icon="edit" onClick={handleEdit}>
            список
          </Button>
          <Button variant="text" icon="delete" color="error" onClick={handleDelete}>
            список
          </Button>
        </Section>
      </Section>
      <Section>
        <hr />
      </Section>
      <Section title="желания" padding_top_size="lg" padding_bot_size="lg">
        <List withoutPad>
          {wishList.wishes && wishList.wishes.length > 0 ? (
            wishList.wishes.map((wish) => (
              <ListItem
                key={wish.id}
                condition={2}
                headline={wish.name}
                overline={`${wish.price ? `${wish.price} ₽` : "Цена не указана"}`}
                leading_type="icon"
                leading="favorite"
                trailing_type="icon"
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
