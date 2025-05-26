"use client";

import List from "@/components/ui/list/List";
import ListItem from "@/components/ui/list/ListItem";
import Monogram from "@/components/ui/monogram/Monogram";
import Section from "@/components/ui/section/Section";
import { $friend, handleFetchFriend } from "@/context/friends";
import { useUnit } from "effector-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IWishList } from "@/types/wish_list";
import { sortWishListsByDate } from "@/lib/utils/lists";
import { handleSetWishList } from "@/context/wish_lists";
import toast from "react-hot-toast";
import { hasNameContent } from "@/lib/utils/hasNameContent";
import { getInitials } from "@/lib/utils/getInitials";

export default function UserPage() {
  // Роутер
  const router = useRouter();

  // Переменные
  const { id } = useParams(); // Получаем ID из URL

  const [friend, fetchFriend, setWishList] = useUnit([$friend, handleFetchFriend, handleSetWishList]);
  const [shownLists, setShownLists] = useState<IWishList[] | undefined>(undefined);

  useEffect(() => {
    fetchFriend(Number(id));
  }, []);

  useEffect(() => {
    if (friend && friend.wishlists && friend.wishlists?.length > 0) setShownLists(friend.wishlists);
    else setShownLists(undefined);
  }, [friend]);

  const handleOpen = (listId: number) => {
    const list = friend.wishlists?.find((list) => list.id == listId);
    if (list) {
      setWishList(list);
      router.push(`/friends/${id}/${listId}`);
    } else toast.error("Список не найден!");
  };

  return (
    <>
      <Section padding_top_size="lg">
        <Section align_items="center" withoutPad>
          <Monogram
            monogram_type={friend.image ? "image" : hasNameContent(friend.fullname) ? "monogram" : "icon"}
            letter={hasNameContent(friend.fullname) ? getInitials(friend.fullname) : "person"}
            icon="person"
            size="lg"
            url={process.env.NEXT_PUBLIC_SERVER_URL + "static/" + friend.image}
          />
        </Section>
        <List withoutPad>
          <ListItem condition={2} headline={friend.login} overline="логин" />
          {friend.fullname ? <ListItem condition={2} headline={friend.fullname} overline="имя" /> : ""}
          {friend.birthday ? (
            <ListItem
              condition={2}
              headline={new Date(friend.birthday).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              overline="дата рождения"
            />
          ) : (
            ""
          )}
          {friend.gender ? <ListItem condition={2} headline={friend.gender} overline="дата рождения" /> : ""}
        </List>
      </Section>
      <Section>
        <hr />
      </Section>
      <Section title={`Списки желаний пользовтеля ${friend.login}`} padding_top_size="md">
        <List withoutPad>
          {shownLists && shownLists.length > 0 ? (
            sortWishListsByDate(shownLists, "asc").map((list) => {
              return (
                <ListItem
                  key={list.id}
                  condition={2}
                  headline={list.name}
                  overline={
                    list.eventDate != null
                      ? new Date(list.eventDate).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : ""
                  }
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
