"use client";

import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import List from "@/components/ui/list/List";
import ListItem from "@/components/ui/list/ListItem";
import NavigationBar from "@/components/ui/navigation_bar/NavigationBar";
import Section from "@/components/ui/section/Section";
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar";
import { $wishLists, handleCreateWishList, handleFetchWishLists, handleSetWishList } from "@/context/wish_lists";
import { sortWishListsByDate } from "@/lib/utils/lists";
import { IWishList } from "@/types/wish_lists";
import { useUnit } from "effector-react";
import type { Metadata } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ListsPage() {
  // Роутер
  const router = useRouter();

  // Стор
  const [wishLists, fetchWishLists, setWishList] = useUnit([$wishLists, handleFetchWishLists, handleSetWishList]);

  // Эффекты
  useEffect(() => {
    fetchWishLists();
  }, []);

  // Обработчики событий
  const handleOpen = (id: number) => {
    setWishList(wishLists.find((list) => list.id == id) as IWishList);
    router.push(`/lists/${id}`);
  };

  return (
    <>
      <Section padding_top_size="lg" padding_bot_size="xs">
        <Input labelText="Название" leadingIcon="search" trailingIcon="cancel"></Input>
        <Section withoutPad align_items="right">
          <Button
            variant="text"
            icon="add"
            onClick={() => {
              router.push("lists/add/");
            }}>
            список
          </Button>
        </Section>
      </Section>
      <Section>
        <hr />
      </Section>
      <Section title="Все ваши списки" padding_top_size="xs">
        <List withoutPad>
          {wishLists.length > 0 ? (
            sortWishListsByDate(wishLists, "asc").map((list) => {
              return (
                <ListItem
                  key={list.id}
                  condition={2}
                  headline={list.name}
                  overline={new Date(list.eventDate).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  leading_type="icon"
                  leading={
                    list.accesslevelId == 1 ? "visibility" : list.accesslevelId == 2 ? "visibility_off" : list.accesslevelId == 3 ? "link" : "group"
                  }
                  trailing_type="icon"
                  onClick={() => handleOpen(list.id)}
                />
              );
            })
          ) : (
            <Section align_items="center" withoutPad>
              пусто
            </Section>
          )}
        </List>
      </Section>
    </>
  );
}
