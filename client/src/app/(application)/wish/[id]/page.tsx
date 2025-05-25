"use client";

import Button from "@/components/ui/buttons/Button";
import List from "@/components/ui/list/List";
import ListItem from "@/components/ui/list/ListItem";
import Monogram from "@/components/ui/monogram/Monogram";
import Section from "@/components/ui/section/Section";
import { $wish, handleDeleteWish, handleFetchWish } from "@/context/wish";
import { IWish } from "@/types/wish";
import { useUnit } from "effector-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WishPage() {
  // Роутер
  const router = useRouter();

  // Переменные
  const { id, shareToken } = useParams(); // Получаем ID из URL

  // Стор
  const [wish, fetchWish, deleteWish] = useUnit([$wish, handleFetchWish, handleDeleteWish]);

  // Эффекты

  useEffect(() => {
    fetchWish({ id: Number(id), shareToken: String(shareToken) });
  }, []);

  // Обработчики

  const handleOpenProduct = (url: string) => {
    window.open(url, "_blank")?.focus();
  };

  const handleEdit = () => {
    router.push(`/wish/${wish.id}/edit`);
  };

  const handleDelete = () => {
    deleteWish(wish.id);
    router.back();
  };

  if (!wish) {
    return (
      <Section align_items="center" padding_top_size="lg">
        <p>Желание не найдено</p>
        <Button variant="text" onClick={() => router.push("/lists")}>
          Вернуться
        </Button>
      </Section>
    );
  }

  return (
    <>
      <Section align_items="center" padding_top_size="md">
        <Section withoutPad isFit>
          <Monogram
            monogram_type={wish.image ? "image" : "icon"}
            icon="featured_seasonal_and_gifts"
            size="md"
            url={process.env.NEXT_PUBLIC_SERVER_URL + "static/" + wish.image}
          />
        </Section>
      </Section>
      <Section>
        <ListItem condition={2} headline={wish.name} overline="название" />
        <ListItem condition={2} headline={String(wish.price) + " руб."} overline="цена" />
        {wish.productLink ? (
          <ListItem
            condition={2}
            headline={wish.productLink ? wish.productLink : "Не указано"}
            overline="ссылка"
            onClick={() => handleOpenProduct(wish.productLink ? wish.productLink : "")}
          />
        ) : (
          <ListItem condition={2} headline={wish.productLink ? wish.productLink : "Не указано"} overline="ссылка" />
        )}
      </Section>
      <Section align_items="right">
        <Section items_direction="row" withoutPad isFit>
          <Button variant="text" icon="edit" onClick={handleEdit}>
            желание
          </Button>
          <Button variant="text" icon="delete" color="error" onClick={handleDelete}>
            желание
          </Button>
        </Section>
      </Section>
    </>
  );
}
