"use client"

import Button from "@/components/ui/buttons/Button"
import Input from "@/components/ui/inputs/Input"
import List from "@/components/ui/list/List"
import ListItem from "@/components/ui/list/ListItem"
import Loader from "@/components/ui/loader/Loader"
import Section from "@/components/ui/section/Section"
import {
  $recivedRequests,
  $sentRequests,
  handleAcceptFriendRequest,
  handleCancelFriendRequest,
  handleFetchRecivedRequests,
  handleFetchSentRequests,
  handleRejectFriendRequest,
  handleSendFriendRequest,
} from "@/context/friends"
import { $user, handleFetchUser } from "@/context/user"
import { IFriendRequest } from "@/types/friends"
import { IUser } from "@/types/user"
import { useUnit } from "effector-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AddFriendPage() {
  // Роутер
  const router = useRouter()

  // Параметры
  const params = useSearchParams() // Получаем ID из URL
  const targetId = params.get("addFriend") // Получаем listId из URL

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
    fetchUser,
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
    handleFetchUser,
  ])

  // Состояния
  const [targetUserId, setTargetUserId] = useState("")

  useEffect(() => {
    fetchRecivedRequests()
    fetchSentRequests()
    fetchUser(null)
  }, [])

  useEffect(() => {
    if (targetId) {
      setTargetUserId(targetId)
      sendFriendRequest(Number(targetUserId))
    }
  }, [targetId])

  const handleSend = () => {
    if (Number(targetUserId)) {
      sendFriendRequest(Number(targetUserId))
      setTargetUserId("")
    }
  }

  const handleCopyToClipboard = async () => {
    if (user) {
      try {
        await navigator.clipboard.writeText(String(user.id))
        toast.success("ID успешно скопирован!")
      } catch (err) {
        toast.error("Не удалось скопировать ID: " + err)
      }
    }
  }

  const handleCreateFriendLink = async () => {
    if (user) {
      try {
        await navigator.clipboard.writeText(
          `Добавляй меня в друзья 🤝 на сервисе обмена списками желаний 🎁 WishWave!\n${process.env.NEXT_PUBLIC_CLIENT_URL}friends/add?addFriend=${user.id}`
        )
        toast.success("Ссылка успешно скопирована!")
      } catch (err) {
        toast.error("Не удалось скопировать ссылку: " + err)
      }
    }
  }

  useEffect(() => {
    console.log(recivedRequests, sentRequests, user)
  }, [recivedRequests, sentRequests, user])

  const handleCancel = (id: number) => {
    cancelFriendRequest(id)
  }
  const handleAccept = (id: number) => {
    acceptFriendRequest(id)
  }
  const handleReject = (id: number) => {
    rejectFriendRequest(id)
  }

  if (!recivedRequests || !sentRequests || !user) return <Loader />

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
                setTargetUserId(e.target.value)
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
            ? sentRequests.map(({ id, recipient }) => {
                return (
                  <Section key={id} items_direction="row" withoutPad align_items="center">
                    <ListItem
                      condition={2}
                      url={recipient.image ? process.env.NEXT_PUBLIC_SERVER_URL + "static/" + recipient.image : ""}
                      leading_type={recipient.image ? "image" : "icon"}
                      leading="person"
                      headline={recipient ? (recipient.fullname ? recipient.fullname : recipient.login) : ""}
                      overline={recipient ? (recipient.fullname ? recipient.login : "") : ""}
                    />
                    <Button
                      variant="text"
                      icon="cancel"
                      color="error"
                      onClick={() => {
                        handleCancel(id)
                      }}
                    />
                  </Section>
                )
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
            ? recivedRequests.map(({ id, recipient }) => {
                return (
                  <Section key={id} items_direction="row" withoutPad align_items="center">
                    <ListItem
                      condition={2}
                      leading_type="icon"
                      leading="person"
                      headline={recipient.fullname ? recipient.fullname : recipient.login}
                      overline={recipient.fullname ? recipient.login : ""}
                    />
                    <Button
                      variant="text"
                      icon="check_circle"
                      color="access"
                      onClick={() => {
                        handleAccept(id)
                      }}
                    />
                    <Button
                      variant="text"
                      icon="cancel"
                      color="error"
                      onClick={() => {
                        handleReject(id)
                      }}
                    />
                  </Section>
                )
              })
            : "пусто"}
        </List>
      </Section>
    </>
  )
}
