"use client";

import Button from "@/components/ui/buttons/Button";
import List from "@/components/ui/list/List";
import ListItem from "@/components/ui/list/ListItem";
import Section from "@/components/ui/section/Section";
import { $wishLists, handleFetchWishLists } from "@/context/wish_lists";
import { useUnit } from "effector-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WishListPage() {
  const router = useRouter();
  const { id } = useParams(); // Получаем ID из URL
  const [wishLists, fetchWishLists] = useUnit([$wishLists, handleFetchWishLists]);

  // Находим нужный список по ID
  const currentList = wishLists.find((list) => list.id === Number(id));

  // Загружаем списки при монтировании
  useEffect(() => {
    fetchWishLists();
  }, []);

  if (!currentList) {
    return (
      <Section align_items="center" padding_top_size="lg">
        <p>Список не найден</p>
        <Button variant="text" onClick={() => router.push("/lists")}>
          Вернуться к спискам
        </Button>
      </Section>
    );
  }

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <>
      <Section withoutPad>
        <List>
          <ListItem condition={2} headline={currentList.name} overline="Название:" />
          <ListItem
            condition={2}
            headline={new Date(currentList.eventDate).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            overline="Дата события:"
          />
          {/* <ListItem
            condition={2}
            headline={currentList.description + "очень очень очень очень очень очень очень очень очень очень очень очень очень "}
            overline="Описание" /> */}

          <Section title="Описание:" withoutPad padding_top_size="md" padding_bot_size="md">
            <span>{currentList.description}</span>
          </Section>
        </List>
      </Section>
      <Section>
        <hr />
      </Section>
      <Section title="Желания" padding_top_size="lg">
        {/* <List withoutPad>
          {currentList.wishes.length > 0 ? (
            currentList.wishes.map(wish => (
              <ListItem
                key={wish.id}
                condition={2}
                headline={wish.name}
                overline={`${wish.price ? `${wish.price} ₽` : 'Цена не указана'}`}
                leading_type="icon"
                leading="favorite"
                trailing_type="icon"
              />
            ))
          ) : (
            <p>В этом списке пока нет желаний</p>
          )}
        </List> */}
      </Section>

      <Section padding_top_size="lg">
        <Button variant="filled" onClick={() => router.push(`/lists/${id}/add-wish`)}>
          Добавить желание
        </Button>
      </Section>
    </>
  );
}
