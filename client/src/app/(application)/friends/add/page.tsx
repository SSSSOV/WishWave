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
import { sample } from "effector"
import { useUnit } from "effector-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import toast from "react-hot-toast"

function AddFriendPageContent() {
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
  const [isCopied, setIsCopied] = useState(false)
  const [isCopiedLink, setIsCopiedLink] = useState(false)

  useEffect(() => {
    fetchRecivedRequests()
    fetchSentRequests()
    fetchUser(null)
  }, [])

  useEffect(() => {
    if (Number(targetId)) {
      sendFriendRequest(Number(targetId))
      router.replace("/friends/add")
    }
  }, [targetId])

  const handleSend = () => {
    if (Number(targetUserId)) {
      sendFriendRequest(Number(targetUserId))
      setTargetUserId("")
    }
  }

  const handleCopyToClipboard = async () => {
    if (!user?.id) return

    try {
      // Создаем временный input элемент
      const tempInput = document.createElement("input")
      tempInput.value = String(user.id)
      document.body.appendChild(tempInput)
      tempInput.select()

      // Пробуем использовать современный API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(String(user.id))
      }
      // Fallback для старых браузеров
      else {
        document.execCommand("copy")
      }

      document.body.removeChild(tempInput)
      toast.success("ID успешно скопирован!")

      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      toast.error("Не удалось скопировать ID")
      console.error("Copy error:", err)
    }
  }

  const handleCopyFriendLink = async () => {
    const link = `Добавь меня в друзья на WishWave!\n${process.env.NEXT_PUBLIC_CLIENT_URL}friends/add?addFriend=${user?.id}`

    try {
      // Modern API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(link)
        toast.success("Ссылка скопирована!")
        setIsCopiedLink(true)
        setTimeout(() => setIsCopiedLink(false), 2000)
      }
      // Legacy method
      else {
        const textarea = document.createElement("textarea")
        textarea.value = link
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
        toast.success("Ссылка скопирована!")
        setIsCopiedLink(true)
        setTimeout(() => setIsCopiedLink(false), 2000)
      }
    } catch (err) {
      toast.error("Не удалось скопировать ссылку")
      console.error("Copy error:", err)
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
            <Button variant="text" icon={isCopied ? "check" : "content_copy"} onClick={handleCopyToClipboard}>
              {`Ваш ID: ${user.id}`}
            </Button>
            <Button variant="text" icon={isCopiedLink ? "check" : "content_copy"} onClick={handleCopyFriendLink}>
              Ссылку
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
                  <ListItem
                    key={id}
                    condition={2}
                    url={recipient.image ? process.env.NEXT_PUBLIC_SERVER_URL + "static/" + recipient.image : ""}
                    leading_type={recipient.image ? "image" : "icon"}
                    leading="person"
                    headline={recipient ? (recipient.fullname ? recipient.fullname : recipient.login) : ""}
                    overline={recipient ? (recipient.fullname ? recipient.login : "") : ""}>
                    <Button
                      variant="text"
                      icon="cancel"
                      color="error"
                      onClick={() => {
                        handleCancel(id)
                      }}
                    />
                  </ListItem>
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
            ? recivedRequests.map(({ id, sender }) => {
                return (
                  <ListItem
                    condition={2}
                    url={sender.image ? process.env.NEXT_PUBLIC_SERVER_URL + "static/" + sender.image : ""}
                    leading_type={sender.image ? "image" : "icon"}
                    leading="person"
                    headline={sender.fullname ? sender.fullname : sender.login}
                    overline={sender.fullname ? sender.login : ""}>
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
                  </ListItem>
                )
              })
            : "пусто"}
        </List>
      </Section>
    </>
  )
}

export default function AddFriendPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <AddFriendPageContent />
    </Suspense>
  )
}
