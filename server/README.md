# WishWave

Development of a web application for a wish list service for a diploma

Главная:
Недавние обновления друзей
Рекомендации на основе друзей
Рекламные рекомендации

Друзья:
Список друзей
Добавление друзей
Сортировка по дате рождения

Мои:
Виш листы

Профиль:
Настройки

Добавить:

# API Documentation:

## Authentication

### Registration

`POST /api/auth/registration`
Регистрация нового пользователя

**Request Body:**

```json
{
  "login": "string",
  "email": "string",
  "password": "string"
}
```

**Responses:**

- 201: 

```json
{
  "token": "string"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Пользователь с таким email существует",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 400,
  "message": "Пользователь с таким login существует",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 400,
  "message": "Validation error",
  "error": "Bad Request"
}
```


### Login

`POST /api/auth/login`
Авторизация пользователя

**Request Body:**

```json
{
  "loginOrEmail": "string",
  "password": "string"
}
```

**Responses:**

- 200:

```json
{
  "token": "string"
}
```

- 401:

```json
{
  "statusCode": 401,
  "message": "Некорректный email, логин или пароль",
  "error": "Unauthorized"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Validation error",
  "error": "Bad Request"
}
```

---

## User

### Get All User

`GET /api/user`
Получить список всех пользователей (только для администратора)

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 200:

```json
[
  {
    "id": 1,
    "login": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "image": "url_or_filename",
    "birthDate": "yyyy-mm-dd",
    "phone": "+1234567890",
    "socials": { "twitter": "@johndoe" },
    "roleId": 2,
    "wishlists": [ /* ... */ ]
  },
  …
]
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав, чтобы посмотреть всех пользователей",
  "error": "Forbidden"
}
```

### Search User by Email or Login

`GET /api/user/search?email={email}&login={login}`
Найти пользователя по email или login

**Headers:**

```json
Authorization: Bearer <token>
```

**Query Parametrs:**

```json
  email (string)
  login (string)
```
**Responses:**

- 200:

```json
{
  "id": 2,
  "login": "jane_doe",
  "email": "jane@example.com",
  "fullName": "Jane Doe",
  "image": null,
  "birthDate": "yyyy-mm-dd",
  "phone": null,
  "socials": null,
  "roleId": 2,
  "wishlists": [ /* ... */ ]
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Укажите email или login",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 400,
  "message": "Пользователь не найден",
  "error": "Bad Request"
}
```

### Get User by Id

`GET /api/user/:id`
Получить данные пользователя по Id

**Headers:**

```json
Authorization: Bearer <token>
```

**Path Parametrs:**

```json
  id (number)
```

**Responses:**

- 200:

```json
{
  "id": 3,
  "login": "sanya",
  "email": "sanya@mail.ru",
  "fullName": null,
  "image": null,
  "birthDate": null,
  "phone": null,
  "socials": null,
  "roleId": 1,
  "wishlists": [ /* ... */ ]
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Можно смотреть только свой профиль",
  "error": "Forbidden"
}
```

- 404:
```json
{
  "statusCode": 404,
  "message": "пользователь не найден (id)",
  "error": "Not Found"
}
```

### Update User

`PATCH /api/user/:id`
Обновить профиль пользователя (только сам пользователь)

**Headers:**

```json
Authorization: Bearer <token>
```

**Path Parametrs:**

```json
  id (number)
```

**Request Body:**

```json
{
  "fullName": "string",
  "image": "string",
  "birthDate": "string",
  "phone": "string",
  "male": "male" | "female",
  "socials": { "string": "string" }
}
```

**Responses:**

- 200:

```json
{
  "id": 3,
  "login": "sanya",
  "email": "sanya@mail.ru",
  "fullName": "Sanya",
  "image": "filename.jpg",
  "birthDate": "2025-05-22",
  "phone": "+1234567890",
  "socials": { "vk": "sanya_vk" },
  "roleId": 1,
  "wishlists": [ /* ... */ ]
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Можно редактировать только свой профиль",
  "error": "Forbidden"
}
```

- 400:
```json
{
  "statusCode": 400,
  "message": "Неподдерживаемый формат даты: 31-12-2025. Ожидается dd.mm.yyyy",
  "error": "Bad Request"
}
```

### Change Password

`PATCH /api/user/:id/password`
Сменить пароль (только сам пользователь)

**Headers:**

```json
Authorization: Bearer <token>
```

**Path Parametrs:**

```json
  id (number)
```

**Request Body:**

```json
{
  "oldPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**Responses:**

- 200:

```json
{
  "message": "Пароль успешно изменен"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Новые пароли не совпадают",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 400,
  "message": "Старый пароль неверен",
  "error": "Bad Request"
}
```

### Delete User

`DELETE /api/user/:id`
Удалить аккаунт пользователя (владелец аккаунта или админ)

**Headers:**

```json
Authorization: Bearer <token>
```

**Path Parametrs:**

```json
  id (number)
```

**Responses:**

- 200:

```json
{
  "message": "Пользователь username с ID id удалён"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Можно удалить только свой аккаунт",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Пользователь не найден",
  "error": "Not Found"
}
```

---

## Friend

### Send Friend Request

`POST /api/friend/request`
Отправить заявку в друзья

**Request Body:**

```json
{
  "targetUserId": number
}
```

**Responses:**

- 200:

```json
{
  "id": 10,
  "userid1": 1,
  "userid2": 2,
  "friendstatusId": 1,
  "createdAt": "2025-05-24T12:34:56.000Z",
  "updatedAt": "2025-05-24T12:34:56.000Z"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Нельзя отправить заявку самому себе",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 400,
  "message": "Заявка уже отправлена или вы являетесь друзьями",
  "error": "Bad Request"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Целевой пользователь не найден",
  "error": "Not Found"
}
```

### Get Received Friend Requests

`GET /api/friend/requests/received`
Получить входящие заявки

**Responses:**

- 200:

```json
[
  {
    "id": 10,
    "userid1": 2,
    "userid2": 1,
    "friendstatusId": 1,
    "users": {
      "id": 2,
      "login": "friend_login",
      "email": "friend@example.com",
      "fullName": "Имя Фамилия"
    }
  },
  ...
]
```

### Get Sent Friend Requests

`GET /api/friend/requests/sent`
Получить исходящие заявки

**Responses:**

- 200:

```json
[
  {
    "id": 11,
    "userid1": 1,
    "userid2": 3,
    "friendstatusId": 1,
    "users": {
      "id": 3,
      "login": "other_login",
      "email": "other@example.com",
      "fullName": "Другое Имя"
    }
  },
  ...
]
```

### Accept Friend Request

`PATCH /api/friend/request/:requestId/accept`
Принять входящую заявку

**Path Parametrs:**

```json
  requestId (number)
```

**Responses:**

- 200:

```json
{
  "id": 10,
  "userid1": 2,
  "userid2": 1,
  "friendstatusId": 2,
  "createdAt": "2025-05-24T12:34:56.000Z",
  "updatedAt": "2025-05-24T12:40:00.000Z"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Это не ваша входящая заявка",
  "error": "Forbidden"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Эту заявку уже обработали",
  "error": "Bad Request"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Заявка не найдена",
  "error": "Not Found"
}
```

### Reject Friend Request

`PATCH /api/friend/request/:requestId/reject`
Отклонить входящую заявку

**Path Parametrs:**

```json
  requestId (number)
```

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 200:

```json
{
  "message": "Заявка отклонена и удалена"
}
```

- 400:

```json
{
  "statusCode": 404,
  "message": "Заявка не найдена",
  "error": "Not Found"
}
```

```json
{
  "statusCode": 400,
  "message": "Эту заявку уже обработали",
  "error": "Bad Request"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Это не ваша входящая заявка",
  "error": "Forbidden"
}
```

### Cancel Sent Friend Request

`DELETE /api/friend/request/:requestId`
Отменить исходящую заявку

**Path Parametrs:**

```json
  requestId (number)
```

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 200:

```json
{
  "message": "Заявка отменена"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Заявка не найдена",
  "error": "Not Found"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Это не ваша исходящая заявка",
  "error": "Forbidden"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Нельзя отменять заявку после её обработки",
  "error": "Bad Request"
}
```

### List Friend

`GET /api/friend`
Получить список друзей

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 200:

```json
[
  {
    "id": 2,
    "login": "friend_login",
    "email": "friend@example.com",
    "fullName": "Имя Фамилия"
  },
  ...
]
```

- 401:

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Unfriend

`DELETE /api/friend/:friendshipId`
Удалить пользователя из друзей

**Path Parametrs:**

```json
  friendshipId (number)
```

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 200:

```json
{
  "message": "Вы больше не друзья"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Дружба не найдена",
  "error": "Not Found"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Вы не участник этой дружбы",
  "error": "Forbidden"
}
```

- 401:

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## Wishlist

### Create Wishlist

`POST /api/wishlist`
Создать новый список желаний

**Headers:**

```json
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "string",
  "accesslevelId": 1,            // 1–private, 2–friends, 3–linkOnly, 4–public
  "description?": "string",       
  "eventDate?": "dd.mm.yyyy"      
}
```

**Responses:**

- 201:

```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "eventDate": "yyyy-mm-dd",
  "accesslevelId": 3,
  "userId": 42,
  "shareToken": "https://host/api/wishlist/1?token=uuid",
  "createdAt": "2025-05-23T...",
  "updatedAt": "2025-05-23T..."
}
```

- 400: 

```json
{
  "statusCode": 400,
  "message": "Неподдерживаемый формат даты: XX.XX.XXXX. Ожидается dd.mm.yyyy",
  "error": "Bad Request"
}
```

### List All Yor Wishlists

`GET /api/wishlist`
Получить все свои списки

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 200:

```json
[
  {
    "id": 1,
    "name": "string",
    "description": "string",
    "eventDate": "yyyy-mm-dd",
    "accesslevelId": 2,
    "userId": 42,
    "shareToken": null,
    "createdAt": "...",
    "updatedAt": "..."
  },
  …
]
```

### Get Wishlist Details & Wishes

`GET /api/wishlist/:id?token=<shareToken>`
Получить все желания в списке

**Path Parametrs:**

```json
  id (number)
  token? (string)
```

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 200:

```json
{
  "wishes": [
    {
      "id": 7,
      "name": "string",
      "price": 123.45,
      "image": "file.jpg",
      "productLink": "string",
      "wishStatusId": 1,
      "bookedByUserId": null,
      "wishstuses": { "id": 1, "name": "available" },
      …
    },
    …
  ]
}
```

- 403: 

```json
{
  "statusCode": 403,
  "message": "Доступ к списку запрещен",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Список желаний не найден или уровень доступа не найден",
  "error": "Not Found"
}
```

### Search Friends Wishlists by Name

`GET /api/wishlist/friend/:friendId/seacrh?name=substring`
Найти вишлисты друга по названию (только если вы друзья)

**Path Parametrs:**

```json
  friendId (number)
```

***Query:**

```json
  name (string)
```

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 200:

```json
[
  {
    "id": 3,
    "name": "Birthday",
    "description": null,
    "eventDate": "2025-06-01",
    "accesslevelId": 2,
    "userId": 99,
    "shareToken": null,
    "accesslevel": { "id": 2, "name": "friends", … }
  },
  …
]
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Укажите параметр name",
  "error": "Bad Request"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Вы не являетесь друзьями",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Статус дружбы accepted не найден",
  "error": "Not Found"
}
```

### Update Wishlist

`PATCH /api/wishlist/:id`
Обновить поля списка (только владелец)

**Headers:**

```json
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "string",
  "accesslevelId": number,
  "description": "string",
  "eventDate": "dd.mm.yyyy"
}
```

**Responses:**

- 200:

```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "eventDate": "yyyy-mm-dd",
  "accesslevelId": 1,
  "shareToken": null,
  …
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Только владелец может редактировать список",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Список не найден",
  "error": "Not Found"
}
```

### Delete Wishlist

`DELETE /api/wishlist/:id`
Удалить список (только владелец)

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 200:

```json
{
  "message": "Список 1 удален" 
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Только владелец может удалить список",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Список не найден",
  "error": "Not Found"
}
```

### Duplicare a Wish into Another List

`PATCH /api/wishlist/duplicate`
Дублировать желание в другой список

**Headers:**

```json
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "wishId": number,
  "targetListId": number
}
```

**Responses:**

- 200:

```json
{
  "id": 8,
  "name": "string",
  "price": 123.45,
  …
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Вы не можете копировать желание в чужой список",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Желание не найдено ни в одном списке",
  "error": "Not Found"
}
```

### Copy an Existing Wish into Another List

`PACTH /api/wishlist/:targetListId/copy/:wishId`
Добавить то же самое желание (с таким же id) в другой список

**Path Parametrs:**

```json
  targetListId (number)
  wishId (number)
```

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 200:

```json
{ "message": "Желание 5 скопировано в список 2" }
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Копировать можно только свои желания",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Оригинальное желание не найдено ни в одном списке",
  "error": "Not Found"
}
```

- 409:

```json
{
  "statusCode": 409,
  "message": "Желание уже есть в целевом списке",
  "error": "Conflict"
}
```

---

## Wish

### Create a Wish in a Wishlist

`POST /api/wish/:listId`
Добавить желание в список (только владелец)

**Path Parametrs:**

```json
  listId (number)
```

**Headers:**

```json
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "string",
  "price": number,
  "productLink": "string",
  "image": "string"
}
```

**Responses:**

- 201:

```json
{
  "id": 10,
  "name": "string",
  "price": 123.45,
  "image": "filename.jpg",
  "productLink": "string",
  "wishStatusId": 1,
  "bookedByUserId": null,
  "createdAt": "...",
  "updatedAt": "..."
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Только владелец списка может добавлять в него желания",
  "error": "Forbidden"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "File too large",
  "error": "Bad Request"
}
```

### List All Your Wishes

`GET /api/wish`
Получить все желания из всех ваших списков

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
[
  {
    "id": 10,
    "name": "string",
    "price": 123.45,
    "image": "filename.jpg",
    "productLink": "string",
    "wishStatusId": 1,
    "bookedByUserId": null,
    "createdAt": "...",
    "updatedAt": "..."
  },
  …
]
```

### List Booked Wishes

`GET /api/wush/booked`
Получить все желания, которые вы забронировали

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
[
  {
    "id": 5,
    "name": "string",
    "price": 99.99,
    "image": "filename.jpg",
    "productLink": "string",
    "bookedByUserId": 42,
    "wishlists": [
      {
        "id": 3,
        "name": "string",
        "owner": {
          "id": 7,
          "login": "user7",
          "fullName": "User Seven",
          "email": "seven@mail.com",
          "image": null
        }
      }
    ]
  },
  …
]
```

### Get Wish by Id

`GET /api/wish/:id?token=<shareToken>`
Получить информации о желании (если доступ разрешен)

**Path Parametrs:**

```json
  Id (number)
```

**Query:**

```json
  token? (string)
```

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "id": 5,
  "name": "string",
  "price": 99.99,
  "image": "filename.jpg",
  "productLink": "string",
  "wishStatusId": 1,
  "bookedByUserId": null,
  "createdAt": "...",
  "updatedAt": "..."
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Доступ к желанию запрещен",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Желание не найдено ни в списках",
  "error": "Not Found"
}
```

### Update a Wish

`PATCH /api/wish/:id`
Обновить желание (только владелец)

**Path Parametrs:**

```json
  Id (number)
```

**Request Body:**

```json
{
  "name": "string",
  "price": number,
  "productLink": "string",
  "image": "string"
}
```

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "id": 5,
  "name": "updated",
  "price": 150.00,
  …
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Только владелец может редактировать желание",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Желание не найдено в списках",
  "error": "Not Found"
}
```

### Delete a Wish

`DELETE /api/wish/:id`
Удалить желание (владелец списка или админ)

**Path Parametrs:**

```json
  Id (number)
```

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{ 
  "message": "Желание 5 удалено" 
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Только владелец может удалять желание",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Желание не найдено в списках",
  "error": "Not Found"
}
```

### Book a Wish

`PATCH /api/wish/:id/book?=token=<shareToken>`
Забронировать желание

**Path Parametrs:**

```json
  Id (number)
```

**Query:**

```json
  token? (string)
```

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "id": 5,
  "name": "string",
  "price": 99.99,
  "wishStatusId": 2,
  "bookedByUserId": 42,
  …
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Нет доступа к бронироваю этого желания",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Желание не найдено в списках",
  "error": "Not Found"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Желание с id 5 уже забронировано",
  "error": "Bad Request"
}
```

### Unbook a Wish

`PATCH /api/wish/:id/unbook?=token=<shareToken>`
Снять бронь (тот, кто забронировал)

**Path Parametrs:**

```json
  Id (number)
```

**Query:**

```json
  token? (string)
```

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "id": 5,
  "name": "string",
  "price": 99.99,
  "wishStatusId": 1,
  "bookedByUserId": null,
  …
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Нет доступа к бронироваю этого желания",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Желание не найдено в списках",
  "error": "Not Found"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Желание с id 5 не забронировано или бронь уже снята",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 400,
  "message": "Вы не можете снять бронь, т.к. не являетесь её владельцем",
  "error": "Bad Request"
}
```

### Complete a Wish

`PATCH /api/wish/:id/complete`
Завершить желание (только владелец списка)

**Path Parametrs:**

```json
  Id (number)
```
**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "id": 5,
  "wishStatusId": 3,
  "bookedByUserId": null,
  …
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Только владелец списка может завершать желания",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Статус \"completed\" не найден",
  "error": "Not Found"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Желание уже завершено",
  "error": "Bad Request"
}
```

---

## Access Level

### Create Access Level

`POST /api/accesslevel`
Создать новый уровень доступа (только админ)

**Headers:**

```json
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "string"
}
```

**Responses:**

- 201:

```json
{
  "id": 4,
  "name": "string",
  "createdAt": "2025-05-22T12:34:56.789Z",
  "updatedAt": "2025-05-22T12:34:56.789Z"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав для этой операции",
  "error": "Forbidden"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Validation error",
  "error": "Bad Request"
}
```

### List All Access Levels

`GET /api/accesslevel`
Получить все уровни доступа

**Headers:**

```json
Authorization: Bearer <token>
```
**Responses:**

- 201:

```json
[
  { "id": 1, "name": "public" },
  { "id": 2, "name": "private" },
  { "id": 3, "name": "linkOnly" },
  …
]
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав для этой операции",
  "error": "Forbidden"
}
```

### Get Access Level by Id

`GET /api/accesslevel/:id`
Получить уровень доступа по Id

**Path Parametrs:**

```json
  Id (number)
```
**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "id": 2,
  "name": "private",
  "createdAt": "2025-05-22T12:00:00.000Z",
  "updatedAt": "2025-05-22T12:00:00.000Z"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав для этой операции",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Уровень доступа с id 99 не найден",
  "error": "Not Found"
}
```

### Update Access Level

`PATCH /api/accesslevel/:id`
Обновить название уровня доступа

**Path Parametrs:**

```json
  Id (number)
```

**Request Body:**

```json
{
  "name": "string"
}
```

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "id": 2,
  "name": "newName",
  "createdAt": "2025-05-22T12:00:00.000Z",
  "updatedAt": "2025-05-22T12:34:56.789Z"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав для этой операции",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Уровень доступа с id 99 не найден",
  "error": "Not Found"
}
```

### Delete Access Level

`DELETE /api/accesslevel/:id`
Удалить уровень доступа

**Path Parametrs:**

```json
  Id (number)
```
**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "message": "Уровень доступа private удален"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав для этой операции",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Уровень доступа с id 99 не найден",
  "error": "Not Found"
}
```

--- 

## Wish Status

### Create Wish Status

`POST /api/wishstatus`
Создать новый статус желания (только админ)

**Headers:**

```json
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "string"
}
```

**Responses:**

- 201:

```json
{
  "id": 4,
  "name": "string",
  "createdAt": "2025-05-22T12:34:56.789Z",
  "updatedAt": "2025-05-22T12:34:56.789Z"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав для этой операции",
  "error": "Forbidden"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Validation error",
  "error": "Bad Request"
}
```

### List All Wish Statuses

`GET /api/wishstatus`
Получить все статусы желаний

**Headers:**

```json
Authorization: Bearer <token>
```
**Responses:**

- 201:

```json
[
  { "id": 1, "name": "new" },
  { "id": 2, "name": "booked" },
  { "id": 3, "name": "completed" },
  …
]
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав для этой операции",
  "error": "Forbidden"
}
```

### Get Wish Status by Id

`GET /api/wishstatus/:id`
Получить статус желания по Id

**Path Parametrs:**

```json
  Id (number)
```
**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "id": 2,
  "name": "booked",
  "createdAt": "2025-05-23T12:45:00.000Z",
  "updatedAt": "2025-05-23T12:45:00.000Z"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав для этой операции",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Статус желания с id 99 не найден",
  "error": "Not Found"
}
```

### Update Wish status

`PATCH /api/wishstatus/:id`
Обновить название статуса желания 

**Path Parametrs:**

```json
  Id (number)
```

**Request Body:**

```json
{
  "name": "string"
}
```

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "id": 2,
  "name": "newName",
  "createdAt": "2025-05-22T12:00:00.000Z",
  "updatedAt": "2025-05-22T12:34:56.789Z"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав для этой операции",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Статус желания с id 99 не найден",
  "error": "Not Found"
}
```

### Delete Wish Status

`DELETE /api/wishstatus/:id`
Удалить статус желания

**Path Parametrs:**

```json
  Id (number)
```
**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "message": "Статус с id 2 удален"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав для этой операции",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Статус желания с id 99 не найден",
  "error": "Not Found"
}
```

--- 

## Ban

### Create Ban

`POST /api/ban`
Создать новый бан (только админ)

**Headers:**

```json
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "userId": number,
  "description": "string"
}
```

**Responses:**

- 201:

```json
{
  "message": "Пользователь someLogin забанен",
  "ban": {
    "id": 5,
    "description": "Причина бана",
    "createdAt": "2025-05-24T14:00:00.000Z",
    "updatedAt": "2025-05-24T14:00:00.000Z"
  }
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав выдавать баны",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Пользователь не найден",
  "error": "Not Found"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Validation error",
  "error": "Bad Request"
}
```

### List All Ban

`GET /api/ban`
Получить все баны

**Headers:**

```json
Authorization: Bearer <token>
```
**Responses:**

- 201:

```json
[
  {
    "id": 1,
    "description": "Нарушение правил",
    "createdAt": "2025-05-20T10:00:00.000Z",
    "updatedAt": "2025-05-20T10:00:00.000Z"
  },
  {
    "id": 2,
    "description": "Спам",
    "createdAt": "2025-05-21T11:00:00.000Z",
    "updatedAt": "2025-05-21T11:00:00.000Z"
  }
]
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав выдавать баны",
  "error": "Forbidden"
}
```

### Get Ban by Id

`GET /api/ban/:id`
Получить бан по Id

**Path Parametrs:**

```json
  Id (number)
```
**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "id": 3,
  "description": "Нецензурная лексика",
  "createdAt": "2025-05-22T12:00:00.000Z",
  "updatedAt": "2025-05-22T12:00:00.000Z"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав выдавать баны",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Ban с id 99 не найден",
  "error": "Not Found"
}
```

### Delete Ban

`DELETE /api/ban/:id`
Удалить бан

**Path Parametrs:**

```json
  Id (number)
```
**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "message": "Ban с id 5 удален"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав выдавать баны",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Ban с id 99 не найден",
  "error": "Not Found"
}
```

--- 

## Role

### Create Role

`POST /api/role`
Создать новыую роль (только админ)

**Headers:**

```json
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "value": "string",
  "description": "string"
}
```

**Responses:**

- 201:

```json
{
  "id": 1,
  "value": "user",
  "description": "Обычный пользователь",
  "createdAt": "2025-05-24T15:00:00.000Z",
  "updatedAt": "2025-05-24T15:00:00.000Z"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав доступа для этого",
  "error": "Forbidden"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Validation error",
  "error": "Bad Request"
}
```

### List All Roles

`GET /api/role`
Получить все ролт

**Headers:**

```json
Authorization: Bearer <token>
```
**Responses:**

- 201:

```json
[
  {
    "id": 1,
    "value": "user",
    "description": "Обычный пользователь",
    "createdAt": "2025-05-24T15:00:00.000Z",
    "updatedAt": "2025-05-24T15:00:00.000Z"
  },
  {
    "id": 2,
    "value": "admin",
    "description": "Администратор",
    "createdAt": "2025-05-24T15:00:00.000Z",
    "updatedAt": "2025-05-24T15:00:00.000Z"
  }
]
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав доступа для этого",
  "error": "Forbidden"
}
```

### Update Role

`PATCH /api/role/:id`
Обновить название роли

**Path Parametrs:**

```json
  Id (number)
```

**Request Body:**

```json
{
  "description": "string"
}
```

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "id": 1,
  "value": "user",
  "description": "Новый текст описания",
  "createdAt": "2025-05-24T15:00:00.000Z",
  "updatedAt": "2025-05-24T16:00:00.000Z"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав доступа для этого",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Роль с id 99 не найдена",
  "error": "Not Found"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Validation error",
  "error": "Bad Request"
}
```

### Delete Role

`DELETE /api/role/:id`
Удалить роль по id

**Path Parametrs:**

```json
  Id (number)
```
**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "message": "Роль user удалена"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав доступа для этого",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Роль с id 99 не найдена",
  "error": "Not Found"
}
```

--- 

## Friend Status

### Create Friend Status

`POST /api/friendstatus`
Создать новый статус дружбы (только админ)

**Headers:**

```json
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "string"
}
```

**Responses:**

- 201:

```json
{
  "id": 1,
  "name": "pending",
  "createdAt": "2025-05-24T15:00:00.000Z",
  "updatedAt": "2025-05-24T15:00:00.000Z"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав для этой операции",
  "error": "Forbidden"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Validation error",
  "error": "Bad Request"
}
```

### List Friend Statuses

`GET /api/friendstatus`
Получить все статусы дружбы

**Headers:**

```json
Authorization: Bearer <token>
```
**Responses:**

- 201:

```json
[
  {
    "id": 1,
    "name": "pending",
    "createdAt": "2025-05-24T15:00:00.000Z",
    "updatedAt": "2025-05-24T15:00:00.000Z"
  },
  {
    "id": 2,
    "name": "accepted",
    "createdAt": "2025-05-24T15:00:00.000Z",
    "updatedAt": "2025-05-24T15:00:00.000Z"
  }
]
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав для этой операции",
  "error": "Forbidden"
}
```

### Get Friend Status by Id

`GET /api/friendstatus/:id`
Получить статус дружбы по Id

**Path Parametrs:**

```json
  Id (number)
```
**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "id": 2,
  "name": "accepted",
  "createdAt": "2025-05-24T15:00:00.000Z",
  "updatedAt": "2025-05-24T15:00:00.000Z"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав для этой операции",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Статус дружбы с id 99 не найден",
  "error": "Not Found"
}
```

### Update Friend Status

`PATCH /api/friendstatus/:id`
Обновить название статуса дружбы

**Path Parametrs:**

```json
  Id (number)
```

**Request Body:**

```json
{
  "name": "string"
}
```

**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "id": 2,
  "name": "friends",
  "createdAt": "2025-05-24T15:00:00.000Z",
  "updatedAt": "2025-05-24T16:00:00.000Z"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав для этой операции",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Статус дружбы с id 99 не найден",
  "error": "Not Found"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Validation error",
  "error": "Bad Request"
}
```

### Delete Friend Status

`DELETE /api/friendstatus/:id`
Удалить статус дружбы

**Path Parametrs:**

```json
  Id (number)
```
**Headers:**

```json
Authorization: Bearer <token>
```

**Responses:**

- 201:

```json
{
  "message": "Статус дружбы pending удален"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав для этой операции",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Статус дружбы с id 99 не найден",
  "error": "Not Found"
}
```