"use client";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import Monogram from "@/components/ui/monogram/Monogram";
import Section from "@/components/ui/section/Section";
import { $wish, handleCreateWish } from "@/context/wish";
import { $wishLists, handleFetchWishLists } from "@/context/wish_lists";
import { customStyles, OptionType } from "@/types/select";
import { useUnit } from "effector-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactSelect, { SingleValue, StylesConfig } from "react-select";

export default function AddPage() {
  // Роутер
  const router = useRouter();

  // Параметры
  const params = useSearchParams(); // Получаем ID из URL
  const listId = params.get("listId"); // Получаем listId из URL

  // Состояния
  const [image, setImage] = useState("");
  const [list, setList] = useState<number>(0);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [link, setLink] = useState("");
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [options, setOptions] = useState<OptionType[]>([]);

  // Стор
  const [wish, wishLists, createWish, fetchWishLists] = useUnit([$wish, $wishLists, handleCreateWish, handleFetchWishLists]);

  // Обработчики
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedOption) {
        toast("Пожалуйста, выберите список", {
          icon: "⚠️",
        });
        return;
      }

      if (!name) {
        toast("Пожалуйста, введите название", {
          icon: "⚠️",
        });
        return;
      }

      createWish({ listId: selectedOption?.value, name: name, price: price, productLink: link, image: image });
      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  // Еффекты
  useEffect(() => {
    fetchWishLists();
  }, []);

  useEffect(() => {
    if (wishLists.length > 0) {
      setOptions(wishLists.map((list) => ({ value: list.id, label: list.name })));
    } else {
      setOptions([{ value: 0, label: "У вас нет списков!" }]); // Массив с одним элементом
    }
  }, [wishLists]);

  useEffect(() => {
    if (listId && options) {
      setSelectedOption(options.find((option) => option.value == Number(listId)) as OptionType);
    }
  }, [listId, options]);

  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <Section title="" padding_top_size="lg" padding_bot_size="xs" items_direction="row" align_items="right">
          <Monogram letter="ww" size="sm" monogram_type={image ? "image" : "icon"} icon="image" color="primary" url={image}></Monogram>
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
            trailingIcon="currency_ruble"
          />
          <Input
            labelText="Ссылка на маркетплейс"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
            }}
          />
          <ReactSelect
            styles={customStyles}
            instanceId="fixed-select"
            value={selectedOption}
            onChange={(newValue) => setSelectedOption(newValue)}
            options={options}
            isMulti={false}
            placeholder="Выберите список"
          />
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
