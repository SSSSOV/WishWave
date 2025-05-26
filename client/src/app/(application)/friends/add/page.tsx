"use client";

import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import List from "@/components/ui/list/List";
import ListItem from "@/components/ui/list/ListItem";
import Section from "@/components/ui/section/Section";
import {
  $recivedRequests,
  $sentRequests,
  handleAcceptFriendRequest,
  handleCancelFriendRequest,
  handleFetchRecivedRequests,
  handleFetchSentRequests,
  handleRejectFriendRequest,
  handleSendFriendRequest,
} from "@/context/friends";
import { $user } from "@/context/user";
import { useUnit } from "effector-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AddFriendPage() {
  // Роутер
  const router = useRouter();

  // Параметры
  const params = useSearchParams(); // Получаем ID из URL
  const targetId = params.get("addFriend"); // Получаем listId из URL

  // Стор
  const [
    recivedRequests,
    sentRequests,
    user,
    fetchRecivedRequests,
    fetchSentRequests,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
  ] = useUnit([
    $recivedRequests,
    $sentRequests,
    $user,
    handleFetchRecivedRequests,
    handleFetchSentRequests,
    handleSendFriendRequest,
    handleCancelFriendRequest,
    handleAcceptFriendRequest,
    handleRejectFriendRequest,
  ]);

  // Состояния
  const [targetUserId, setTargetUserId] = useState("");

  useEffect(() => {
    fetchRecivedRequests();
    fetchSentRequests();
  }, []);

  useEffect(() => {
    if (targetId) {
      setTargetUserId(targetId);
      sendFriendRequest(Number(targetUserId));
    } else {
      toast.error("Ошибка в ссылке!");
    }
  }, [targetId]);

  const handleSend = () => {
    if (Number(targetUserId)) {
      sendFriendRequest(Number(targetUserId));
      setTargetUserId("");
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(user.id);
      toast.success("ID успешно скопирован!");
    } catch (err) {
      toast.error("Не удалось скопировать ID: " + err);
    }
  };

  const handleCreateFriendLink = async () => {
    try {
      await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_CLIENT_URL}friends/add&addFriend=${user.id}`);
      toast.success("ID успешно скопирован!");
    } catch (err) {
      toast.error("Не удалось скопировать ID: " + err);
    }
  };

  const handleCancel = (id: number) => {
    cancelFriendRequest(id);
  };
  const handleAccept = (id: number) => {
    acceptFriendRequest(id);
  };
  const handleReject = (id: number) => {
    rejectFriendRequest(id);
  };

  return (
    <>
      <Section title="Добавить" padding_top_size="lg">
        <Section items_direction="row" withoutPad align_items="center">
          <Section withoutPad>
            <Input
              labelText="ID пользователя"
              isFull
              value={targetUserId}
              onChange={(e) => {
                setTargetUserId(e.target.value);
              }}
            />
          </Section>
          <Section isFit withoutPad>
            <Button variant="filled" icon="forward_to_inbox" onClick={handleSend} />
          </Section>
        </Section>
        <Section withoutPad align_items="center">
          <Section items_direction="row" withoutPad isFit>
            <Button variant="text" icon="content_copy" onClick={handleCopyToClipboard}>
              {"Ваш ID: " + user.id}
            </Button>
            <Button variant="text" icon="share" onClick={handleCreateFriendLink}>
              Ссылкой
            </Button>
          </Section>
        </Section>
      </Section>
      <Section>
        <hr />
      </Section>
      <Section title="Исходящие заявки">
        <List withoutPad>
          {sentRequests && sentRequests.length > 0
            ? sentRequests.map((req) => {
                const recId = req.users[0].id == user.id ? 1 : 0;
                return (
                  <Section key={req.id} items_direction="row" withoutPad align_items="center">
                    <ListItem
                      condition={2}
                      url={req.users[recId].image ? process.env.NEXT_PUBLIC_SERVER_URL + "static/" + req.users[recId].image : ""}
                      leading_type={req.users[recId].image ? "image" : "icon"}
                      leading="person"
                      headline={req.users[recId] ? (req.users[recId].fullname ? req.users[recId].fullname : req.users[recId].login) : ""}
                      overline={req.users[recId] ? (req.users[recId].fullname ? req.users[recId].login : "") : ""}
                    />
                    <Button
                      variant="text"
                      icon="cancel"
                      color="error"
                      onClick={() => {
                        handleCancel(req.id);
                      }}
                    />
                  </Section>
                );
              })
            : "пусто"}
        </List>
      </Section>
      <Section>
        <hr />
      </Section>
      <Section title="Входящие заявки">
        <List withoutPad>
          {recivedRequests.length > 0
            ? recivedRequests.map((req) => {
                const recId = req.users[0].id == user.id ? 1 : 0;
                return (
                  <Section key={req.id} items_direction="row" withoutPad align_items="center">
                    <ListItem
                      condition={2}
                      leading_type="icon"
                      leading="person"
                      headline={req.users[recId].fullname ? req.users[recId].fullname : req.users[recId].login}
                      overline={req.users[recId].fullname ? req.users[recId].login : ""}
                    />
                    <Button
                      variant="text"
                      icon="check_circle"
                      color="access"
                      onClick={() => {
                        handleAccept(req.id);
                      }}
                    />
                    <Button
                      variant="text"
                      icon="cancel"
                      color="error"
                      onClick={() => {
                        handleReject(req.id);
                      }}
                    />
                  </Section>
                );
              })
            : "пусто"}
        </List>
      </Section>
    </>
  );
}
