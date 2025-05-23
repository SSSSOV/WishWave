"use client";

import Button from "@/components/ui/buttons/Button";
import List from "@/components/ui/list/List";
import ListItem from "@/components/ui/list/ListItem";
import NavigationBar from "@/components/ui/navigation_bar/NavigationBar";
import Section from "@/components/ui/section/Section";
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar";
import { $count, incClicked } from "@/context/counter";
import { useUnit } from "effector-react";
import type { Metadata } from "next";

export default function FriendsPage() {
  return (
    <>
      <Section title="Заявки в друзья" title_size="lg">
        <List>
          <ListItem
            condition={1}
            headline="Куклин Леонид"
            leading_type="monogram"
            leading="КЛ"
            trailing_type="icon"
          />
          <ListItem
            condition={1}
            headline="Класс Руслан"
            leading_type="monogram"
            leading="КР"
            trailing_type="icon"
          />
        </List>
      </Section>
      <Section title="Список ваших друзей" title_size="lg">
        <List>
          <ListItem
            condition={1}
            headline="Куклин Леонид"
            leading_type="monogram"
            leading="КЛ"
            trailing_type="icon"
          />
          <ListItem
            condition={1}
            headline="Класс Руслан"
            leading_type="monogram"
            leading="КР"
            trailing_type="icon"
          />
          <ListItem
            condition={1}
            headline="Класс Руслан"
            leading_type="monogram"
            leading="КР"
            trailing_type="icon"
          />
          <ListItem
            condition={1}
            headline="Класс Руслан"
            leading_type="monogram"
            leading="КР"
            trailing_type="icon"
          />
          <ListItem
            condition={1}
            headline="Класс Руслан"
            leading_type="monogram"
            leading="КР"
            trailing_type="icon"
          />
          <ListItem
            condition={1}
            headline="Класс Руслан"
            leading_type="monogram"
            leading="КР"
            trailing_type="icon"
          />
          <ListItem
            condition={1}
            headline="Класс Руслан"
            leading_type="monogram"
            leading="КР"
            trailing_type="icon"
          />
          <ListItem
            condition={1}
            headline="Класс Руслан"
            leading_type="monogram"
            leading="КР"
            trailing_type="icon"
          />
          <ListItem
            condition={1}
            headline="Класс Руслан"
            leading_type="monogram"
            leading="КР"
            trailing_type="icon"
          />
          <ListItem
            condition={1}
            headline="Класс Руслан"
            leading_type="monogram"
            leading="КР"
            trailing_type="icon"
          />
        </List>
      </Section>
    </>
  );
}
