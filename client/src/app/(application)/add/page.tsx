"use client";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import Monogram from "@/components/ui/monogram/Monogram";
import NavigationBar from "@/components/ui/navigation_bar/NavigationBar";
import Section from "@/components/ui/section/Section";
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar";
import { $wish, handleCreateWish } from "@/context/wish";
import { $wishLists, handleFetchWishLists } from "@/context/wish_lists";
import { useUnit } from "effector-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AddPage() {
  const router = useRouter();

  const [image, setImage] = useState("");
  const [list, setList] = useState<number>(0);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>({} as number);
  const [link, setLink] = useState("");

  const [wish, wishLists, createWish, fetchWishLists] = useUnit([$wish, $wishLists, handleCreateWish, handleFetchWishLists]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!list) {
      toast("Пожалуйста, выберите список", {
        icon: "⚠️",
      });
      return;
    }

    createWish({ listId: list, name: name, price: price, productLink: link, image: image });
  };

  useEffect(() => {
    fetchWishLists;
  }, []);

  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <Section title="" padding_top_size="lg" padding_bot_size="xs" items_direction="row" align_items="right">
          <Monogram letter="ww" size="sm" monogram_type="icon" icon="image" color="primary"></Monogram>
          <Input
            labelText="Ссылка на изображение"
            isFull
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
            }}
          />
        </Section>
        <Section title="" padding_top_size="xs">
          <Input
            labelText="Название"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Input
            labelText="Цена"
            value={price}
            type="number"
            onChange={(e) => {
              setPrice(Number(e.target.value));
            }}
          />
          <Input
            labelText="Ссылка на маркетплейс"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
            }}
          />
          <div className="mb-4">
            <select className="w-full p-2 border border-gray-300 rounded-md" value={list} onChange={(e) => setList(Number(e.target.value))} required>
              <option value="">Выберите список</option>
              {wishLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name} ({new Date(list.eventDate).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        </Section>
        <Section align_items="right" padding_bot_size="lg">
          <Section items_direction="row" isFit withoutPad>
            <Button variant="text" type="reset">
              Отмена
            </Button>
            <Button variant="filled" type="submit">
              Добавить
            </Button>
          </Section>
        </Section>
      </form>
    </>
  );
}
