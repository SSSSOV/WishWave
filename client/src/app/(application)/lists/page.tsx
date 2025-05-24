"use client";

import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import List from "@/components/ui/list/List";
import ListItem from "@/components/ui/list/ListItem";
import NavigationBar from "@/components/ui/navigation_bar/NavigationBar";
import Section from "@/components/ui/section/Section";
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar";
import { $wishLists, handleAddWishList, handleFetchWishLists } from "@/context/wish_lists";
import { sortWishListsByDate } from "@/lib/utils/lists";
import { useUnit } from "effector-react";
import type { Metadata } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ListsPage() {
  // Роутер
  const router = useRouter();

  // Стор
  const [wishLists, fetchWishLists] = useUnit([$wishLists, handleFetchWishLists]);

  // Эффекты
  useEffect(() => {
    fetchWishLists();
    console.log(wishLists);
  }, []);

  useEffect(() => {
    console.log(wishLists);
  }, [wishLists]);

  return (
    <>
      <Section padding_top_size="lg">
        <Input labelText="Название" leadingIcon="search" trailingIcon="cancel"></Input>
        <Section withoutPad align_items="center">
          <Button
            variant="filled"
            icon="add"
            onClick={() => {
              router.push("lists/add/");
            }}>
            Создать список
          </Button>
        </Section>
      </Section>

      <Section title="Все ваши списки" padding_top_size="lg">
        <List withoutPad>
          {wishLists.length > 0
            ? sortWishListsByDate(wishLists, "asc").map((list) => {
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
                    onClick={() => router.push(`/lists/${list.id}`)}
                  />
                );
              })
            : "Пусто"}
        </List>
      </Section>
    </>
  );
}
