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

Для всех защищенных маршрутов требуется заголовок

```makefile
Authorization: Bearer <token>
```

### Get All User

`GET /api/user/all`
Получить список всех пользователей (только для администратора)

**Responses:**

- 200:

```json
[
    {
        "id": 2,
        "fullname": "Вадим",
        "login": "sanya",
        "email": "sanya@mail.ru",
        "image": null,
        "birthDate": "2003-10-06",
        "phone": null,
        "gender": "male",
        "socials": null,
        "roleId": 1,
        "banId": null,
        "createdAt": "2025-05-26T16:24:56.731Z",
        "updatedAt": "2025-05-27T11:20:24.520Z",
        "friend": [
            {
                "id": 1,
                "userid1": 2,
                "userid2": 3,
                "friendstatusId": 2,
                "createdAt": "2025-05-27T09:15:30.293Z",
                "updatedAt": "2025-05-27T09:15:44.255Z",
                "FriendUsers": {
                    "id": 1,
                    "userId": 2,
                    "friendId": 1
                }
            }
        ],
        "ban": null,
        "role": {
            "id": 1,
            "value": "user",
            "description": "Пользователь",
            "createdAt": "2025-05-26T16:18:39.012Z",
            "updatedAt": "2025-05-26T16:18:39.012Z"
        },
        "wishstatuses": []
    },
    {
        "id": 3,
        "fullname": null,
        "login": "dima",
        "email": "dima@mail.ru",
        "image": null,
        "birthDate": null,
        "phone": null,
        "gender": null,
        "socials": null,
        "roleId": 1,
        "banId": null,
        "createdAt": "2025-05-27T06:58:26.671Z",
        "updatedAt": "2025-05-27T12:01:19.634Z",
        "friend": [
            {
                "id": 1,
                "userid1": 2,
                "userid2": 3,
                "friendstatusId": 2,
                "createdAt": "2025-05-27T09:15:30.293Z",
                "updatedAt": "2025-05-27T09:15:44.255Z",
                "FriendUsers": {
                    "id": 2,
                    "userId": 3,
                    "friendId": 1
                }
            }
        ],
        "ban": null,
        "role": {
            "id": 1,
            "value": "user",
            "description": "Пользователь",
            "createdAt": "2025-05-26T16:18:39.012Z",
            "updatedAt": "2025-05-26T16:18:39.012Z"
        },
        "wishstatuses": []
    },
    {
        "id": 1,
        "fullname": null,
        "login": "root",
        "email": "root@mail.ru",
        "image": null,
        "birthDate": null,
        "phone": null,
        "gender": null,
        "socials": null,
        "roleId": 2,
        "banId": null,
        "createdAt": "2025-05-26T16:18:39.123Z",
        "updatedAt": "2025-05-26T16:18:39.123Z",
        "friend": [],
        "ban": null,
        "role": {
            "id": 2,
            "value": "admin",
            "description": "Администратор",
            "createdAt": "2025-05-26T16:18:39.015Z",
            "updatedAt": "2025-05-26T16:18:39.015Z"
        },
        "wishstatuses": []
    }
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

### Check Authentication Status

`GET /api/user/checkAuth`
Проверить, валиден ли JWT и получить статус авторизации без дополнительной нагрузки

### Get User

`GET /api/user`
Получить данные пользователя (того, кто отправляет запрос)

**Responses:**

- 200:

```json
{
    "id": 2,
    "fullname": "Вадим",
    "login": "sanya",
    "email": "sanya@mail.ru",
    "image": null,
    "birthDate": "2003-10-06",
    "phone": null,
    "gender": "male",
    "socials": null,
    "roleId": 1,
    "banId": null,
    "createdAt": "2025-05-26T16:24:56.731Z",
    "updatedAt": "2025-05-27T11:20:24.520Z"
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

### Get User by Id for Friends and Admin

`GET /api/user/:id`
Получить данные пользователя по Id (если пользователь - друг или пользователь - администратор)

**Path Parametrs:**

```makefile
  id (number)
```

**Responses:**

- 200:

```json
{
    "id": 2,
    "fullname": null,
    "login": "dima",
    "email": "dima@mail.ru",
    "image": null,
    "birthDate": null,
    "phone": null,
    "gender": null,
    "socials": null,
    "roleId": 1,
    "banId": null,
    "createdAt": "2025-05-27T14:45:24.141Z",
    "updatedAt": "2025-05-27T14:45:24.141Z",
    "isFriend": true
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Профиль доступен только друзьям",
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

`PATCH /api/user`
Обновить профиль пользователя (только сам пользователь)

**Request Body:**

```json
{
  "fullName?": "string" | null,
  "image?": "string" | null,
  "birthDate?": "string" | null,
  "phone?": "string" | null,
  "male?": "male | female" | null,
  "socials?": { "string": "string" } | null
}
```

**Responses:**

- 200:

```json
{
    "id": 2,
    "fullname": "Вадим",
    "login": "sanya",
    "email": "sanya@mail.ru",
    "image": null,
    "birthDate": "2003-10-06",
    "phone": null,
    "gender": "male",
    "socials": null,
    "roleId": 1,
    "banId": null,
    "createdAt": "2025-05-26T16:24:56.731Z",
    "updatedAt": "2025-05-27T11:20:24.520Z"
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

### Update User for Admin

`PATCH /api/user/:id`
Обновить профиль пользователя (только администратор)

**Path Parametrs:**

```makefile
  id (number)
```

**Request Body:**

```json
{
  "fullName?": "string",
  "image?": "string",
  "birthDate?": "string",
  "phone?": "string",
  "male?": "male | female",
  "socials?": { "string": "string" }
}
```

**Responses:**

- 200:

```json
{
    "id": 2,
    "fullname": "Вадим",
    "login": "sanya",
    "email": "sanya@mail.ru",
    "image": null,
    "birthDate": "2003-10-06",
    "phone": null,
    "gender": "male",
    "socials": null,
    "roleId": 1,
    "banId": null,
    "createdAt": "2025-05-26T16:24:56.731Z",
    "updatedAt": "2025-05-27T11:20:24.520Z"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав редактировать этот профиль",
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

`PATCH /api/user/password`
Сменить пароль (только сам пользователь)

**Request Body:**

```json
{
  "oldPassword": "string",
  "newPassword": "string",
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

### Change Password for Admin

`PATCH /api/user/password/:id`
Сменить пароль (только админ)

**Path Parametrs:**

```makefile
  id (number)
```

**Request Body:**

```json
{
  "newPassword": "string",
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
  "message": "Нет прав для изменения пароля у другого пользователят",
  "error": "Bad Request"
}
```

### Delete User

`DELETE /api/user/`
Удалить аккаунт пользователя (только владелец)

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

### Delete User for Admin

`DELETE /api/user/:id`
Удалить аккаунт пользователя (только админ)

**Path Parametrs:**

```makefile
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

Для всех защищенных маршрутов требуется заголовок

```makefile
Authorization: Bearer <token>
```

### Send Friend Request

`POST /api/friend/request`
Отправить заявку в друзья

**Request Body:**

```json
{
  "targetUserId": "number"
}
```

**Responses:**

- 200:

```json
{
    "id": 9,
    "friendStatusId": 1,
    "createdAt": "2025-05-27T16:18:43.442Z",
    "updatedAt": "2025-05-27T16:18:43.442Z",
    "sender": {
        "id": 3,
        "fullname": null,
        "login": "shaka",
        "image": null
    },
    "recipient": {
        "id": 1,
        "fullname": null,
        "login": "root",
        "image": null
    }
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
        "id": 8,
        "friendStatusId": 1,
        "createdAt": "2025-05-27T15:53:43.060Z",
        "updatedAt": "2025-05-27T15:53:43.060Z",
        "sender": {
            "id": 3,
            "login": "shaka",
            "email": "shaka@mail.ru",
            "fullname": null,
            "image": null
        },
        "recipient": {
            "id": 2,
            "login": "dima",
            "email": "dima@mail.ru",
            "fullname": null,
            "image": null
        }
    }
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
        "id": 8,
        "friendStatusId": 1,
        "createdAt": "2025-05-27T15:53:43.060Z",
        "updatedAt": "2025-05-27T15:53:43.060Z",
        "sender": {
            "id": 3,
            "login": "shaka",
            "email": "shaka@mail.ru",
            "fullname": null,
            "image": null
        },
        "recipient": {
            "id": 2,
            "login": "dima",
            "email": "dima@mail.ru",
            "fullname": null,
            "image": null
        }
    }
]
```

### Accept Friend Request

`PATCH /api/friend/request/:requestId/accept`
Принять входящую заявку

**Path Parametrs:**

```makefile
  requestId (number)
```

**Responses:**

- 200:

```json
{
    "id": 8,
    "friendStatusId": 2,
    "createdAt": "2025-05-27T15:53:43.060Z",
    "updatedAt": "2025-05-27T16:00:06.700Z",
    "sender": {
        "id": 3,
        "login": "shaka",
        "email": "shaka@mail.ru",
        "fullname": null,
        "image": null
    },
    "recipient": {
        "id": 2,
        "login": "dima",
        "email": "dima@mail.ru",
        "fullname": null,
        "image": null
    }
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

```makefile
  requestId (number)
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

```makefile
  requestId (number)
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

**Responses:**

- 200:

```json
[
    {
        "id": 2,
        "fullname": null,
        "login": "dima",
        "password": "$2b$05$Sn8KhGsCMKubwwHnMUKn.uEBrNlBqB4bTYDpn2d3DUesqFrV3AP3O",
        "email": "dima@mail.ru",
        "image": null,
        "gender": null,
        "roleId": 1,
        "banId": null,
        "createdAt": "2025-05-27T14:45:24.141Z",
        "updatedAt": "2025-05-27T14:45:24.141Z"
    }
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

```makefile
  friendshipId (number)
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

Для всех защищенных маршрутов требуется заголовок

```makefile
Authorization: Bearer <token>
```

### Create Wishlist

`POST /api/wishlist`
Создать новый список желаний

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
    "id": 9,
    "name": "Для друзей",
    "accesslevelId": 3,
    "description": "подарки для друга",
    "eventDate": "2003-06-10",
    "userId": 2,
    "shareToken": "477128df-242f-4082-98b7-a677eb5824a5",
    "owner": {
        "id": 2,
        "fullname": null,
        "login": "dima",
        "image": null
    }
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

`GET /api/wishlist?userId=<number>`
Получить все списки (если userId нет, то выводятся списки пользователя, который послал запрос)

**Query Parametrs:**

```makefile
  userId (number)
```

**Responses:**

- 200:

```json
[
    {
        "id": 6,
        "name": "8 марта",
        "accessLevelId": 2,
        "description": "подарки на 8 марта",
        "eventDate": "2003-06-30",
        "shareToken": null,
        "owner": {
            "id": 2,
            "fullname": null,
            "login": "dima",
            "image": null
        }
    },
    {
        "id": 7,
        "name": "Для друзей",
        "accessLevelId": 4,
        "description": "подарки для друга",
        "eventDate": "2003-06-10",
        "shareToken": null,
        "owner": {
            "id": 2,
            "fullname": null,
            "login": "dima",
            "image": null
        }
    },
    {
        "id": 8,
        "name": "Для друзей",
        "accessLevelId": 3,
        "description": "подарки для друга",
        "eventDate": "2003-06-10",
        "shareToken": "5c161d4c-a2ff-4f8f-a805-5de4594a0635",
        "owner": {
            "id": 2,
            "fullname": null,
            "login": "dima",
            "image": null
        }
    },
    {
        "id": 9,
        "name": "Для друзей",
        "accessLevelId": 3,
        "description": "подарки для друга",
        "eventDate": "2003-06-10",
        "shareToken": "477128df-242f-4082-98b7-a677eb5824a5",
        "owner": {
            "id": 2,
            "fullname": null,
            "login": "dima",
            "image": null
        }
    }
]
```

### Get Wishlist Details & Wishes

`GET /api/wishlist/:id?token=<shareToken>`
Получить все желания в списке

**Path Parametrs:**

```makefile
  id (number)
```

**Query Parametrs:**

```makefile
  token? (string)
```

**Responses:**

- 200:

```json
{
    "id": 9,
    "name": "Для друзей",
    "accessLevelId": 3,
    "description": "подарки для друга",
    "eventDate": "2003-06-10",
    "shareToken": "477128df-242f-4082-98b7-a677eb5824a5",
    "owner": {
        "id": 2,
        "fullname": null,
        "login": "dima",
        "image": null
    },
    "wishes": [
        {
            "id": 5,
            "name": "айфон",
            "price": null,
            "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
            "image": "",
            "wishStatusId": 1,
            "bookedByUser": null
        },
        {
            "id": 6,
            "name": "айфон",
            "price": null,
            "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
            "image": "",
            "wishStatusId": 1,
            "bookedByUser": null
        },
        {
            "id": 7,
            "name": "айфон",
            "price": null,
            "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
            "image": "",
            "wishStatusId": 1,
            "bookedByUser": null
        },
        {
            "id": 2,
            "name": "айфон",
            "price": null,
            "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
            "image": "",
            "wishStatusId": 2,
            "bookedByUser": {
                "id": 3,
                "fullname": null,
                "login": "shaka",
                "image": null
            }
        },
        {
            "id": 4,
            "name": "айфон",
            "price": null,
            "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
            "image": "",
            "wishStatusId": 2,
            "bookedByUser": {
                "id": 3,
                "fullname": null,
                "login": "shaka",
                "image": null
            }
        }
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

### Update Wishlist

`PATCH /api/wishlist`
Обновить поля списка (только владелец)

**Request Body:**

```json
{
  "id": "number",
  "name": "string",
  "accesslevelId": "number",
  "description?": "string",
  "eventDate?": "dd.mm.yyyy"
}
```

**Responses:**

- 200:

```json
{
    "id": 6,
    "name": "8 марта",
    "accesslevelId": 2,
    "description": "подарки на 8 марта",
    "eventDate": "2003-06-30",
    "userId": 2,
    "shareToken": null,
    "owner": {
        "id": 2,
        "fullname": null,
        "login": "dima",
        "image": null
    }
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

**Path Parametrs:**

```json
  Id (number)
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

### Duplicate a Wish into Another List

`PATCH /api/wishlist/duplicate`
Дублировать желание в другой список

**Request Body:**

```json
{
  "wishId": "number",
  "targetListId": "number"
}
```

**Responses:**

- 200:

```json
{
    "id": 21,
    "name": "айфон",
    "price": null,
    "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
    "image": "",
    "wishStatusId": 1,
    "bookedByUser": null,
    "createdAt": "2025-05-28T11:24:07.858Z",
    "updatedAt": "2025-05-28T11:24:07.858Z",
    "shareToken": "477128df-242f-4082-98b7-a677eb5824a5",
    "owner": {
        "id": 2,
        "fullname": null,
        "login": "dima",
        "image": null
    },
    "list": {
        "id": 9,
        "name": "Для друзей",
        "eventDate": "2003-06-10",
        "accessLevelId": 3
    }
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

`PACTH /api/wishlist/copy`
Добавить то же самое желание (с таким же id) в другой список

**Request Body:**

```json
{
  "wishId": "number",
  "targetListId": "number"
}
```

**Responses:**

- 200:

```json
{
    "id": 2,
    "name": "айфон",
    "price": null,
    "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
    "image": "",
    "wishStatusId": 2,
    "bookedByUser": {
        "id": 3,
        "fullname": null,
        "login": "shaka",
        "image": null
    },
    "createdAt": "2025-05-28T07:22:01.157Z",
    "updatedAt": "2025-05-28T08:24:55.441Z",
    "shareToken": null,
    "owner": {
        "id": 2,
        "fullname": null,
        "login": "dima",
        "image": null
    },
    "list": {
        "id": 10,
        "name": "Для друзей",
        "eventDate": "2003-06-10",
        "accessLevelId": 4
    }
}
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

Для всех защищенных маршрутов требуется заголовок

```makefile
Authorization: Bearer <token>
```

### Create a Wish in a Wishlist

`POST /api/wish`
Добавить желание в список (только владелец)

**Request Body:**

```json
{
  "listId": "number",
  "name": "string",
  "price?": "number",
  "productLink?": "string",
  "image?": "string"
}

```

**Responses:**

- 200:

```json
{
    "id": 18,
    "name": "айфон",
    "price": null,
    "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
    "image": "",
    "wishStatusId": 1,
    "createdAt": "2025-05-28T11:15:32.050Z",
    "updatedAt": "2025-05-28T11:15:32.050Z",
    "shareToken": "e06a5842-e88d-445f-96c8-c2421f9e07ac",
    "owner": {
        "id": 2,
        "fullname": null,
        "login": "dima",
        "image": null
    },
    "list": {
        "id": 11,
        "name": "Для друзей",
        "eventDate": "2003-06-10",
        "accessLevelId": 3
    },
    "bookedByUser": null
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

```json
{
  "statusCode": 400,
  "message": "В тексте найдены запрещенные слова",
  "error": "Bad Request"
}
```

### List All Your Wishes

`GET /api/wish`
Получить все желания из всех ваших списков

**Responses:**

- 200:

```json
[
    {
        "id": 2,
        "name": "айфон",
        "price": null,
        "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
        "image": "",
        "wishStatusId": 2,
        "createdAt": "2025-05-28T07:22:01.157Z",
        "updatedAt": "2025-05-28T08:24:55.441Z",
        "shareToken": "477128df-242f-4082-98b7-a677eb5824a5",
        "owner": {
            "id": 2,
            "fullname": null,
            "login": "dima",
            "image": null
        },
        "list": {
            "id": 9,
            "name": "Для друзей",
            "eventDate": "2003-06-10",
            "accessLevelId": 3
        },
        "bookedByUser": {
            "id": 3,
            "fullname": null,
            "login": "shaka",
            "image": null
        }
    },
    {
        "id": 3,
        "name": "айфон",
        "price": null,
        "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
        "image": "",
        "wishStatusId": 1,
        "createdAt": "2025-05-28T07:34:54.927Z",
        "updatedAt": "2025-05-28T07:34:54.927Z",
        "shareToken": "5c161d4c-a2ff-4f8f-a805-5de4594a0635",
        "owner": {
            "id": 2,
            "fullname": null,
            "login": "dima",
            "image": null
        },
        "list": {
            "id": 8,
            "name": "Для друзей",
            "eventDate": "2003-06-10",
            "accessLevelId": 3
        },
        "bookedByUser": null
    }
]
```

### List Booked Wishes

`GET /api/wish/booked`
Получить все желания, которые вы забронировали

**Responses:**

- 200:

```json
[
    {
        "id": 1,
        "name": "айфон",
        "price": null,
        "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
        "image": "",
        "wishStatusId": 2,
        "createdAt": "2025-05-28T07:21:53.875Z",
        "updatedAt": "2025-05-28T08:22:38.048Z",
        "shareToken": null,
        "owner": {
            "id": 3,
            "fullname": null,
            "login": "shaka",
            "image": null
        },
        "list": {
            "id": 2,
            "name": "Личный",
            "eventDate": "2003-06-10",
            "accessLevelId": 2
        },
        "bookedByUser": {
            "id": 3,
            "fullname": null,
            "login": "shaka",
            "image": null
        }
    },
    {
        "id": 2,
        "name": "айфон",
        "price": null,
        "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
        "image": "",
        "wishStatusId": 2,
        "createdAt": "2025-05-28T07:22:01.157Z",
        "updatedAt": "2025-05-28T08:24:55.441Z",
        "shareToken": "477128df-242f-4082-98b7-a677eb5824a5",
        "owner": {
            "id": 2,
            "fullname": null,
            "login": "dima",
            "image": null
        },
        "list": {
            "id": 9,
            "name": "Для друзей",
            "eventDate": "2003-06-10",
            "accessLevelId": 3
        },
        "bookedByUser": {
            "id": 3,
            "fullname": null,
            "login": "shaka",
            "image": null
        }
    }
]
```

### Get Wish by Id

`GET /api/wish/:id?token=<shareToken>`
Получить информации о желании (если доступ разрешен)

**Path Parametrs:**

```makefile
  id (number)
```

**Query:**

```makefile
  token? (string)
```

**Responses:**

- 200:

```json
{
    "id": 18,
    "name": "айфон",
    "price": null,
    "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
    "image": "",
    "wishStatusId": 1,
    "createdAt": "2025-05-28T11:15:32.050Z",
    "updatedAt": "2025-05-28T11:15:32.050Z",
    "shareToken": "e06a5842-e88d-445f-96c8-c2421f9e07ac",
    "owner": {
        "id": 2,
        "fullname": null,
        "login": "dima",
        "image": null
    },
    "list": {
        "id": 11,
        "name": "Для друзей",
        "eventDate": "2003-06-10",
        "accessLevelId": 3
    },
    "bookedByUser": null
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

`PATCH /api/wish`
Обновить желание (только владелец)

**Request Body:**

```json
{
  "id": "number",
  "name?": "string",
  "price?": "number",
  "productLink?": "string",
  "image?": "string"
}
```

**Responses:**

- 200:

```json
{
    "id": 4,
    "name": "sony",
    "price": 25000,
    "productLink": null,
    "image": "",
    "wishStatusId": 2,
    "createdAt": "2025-05-28T07:35:10.165Z",
    "updatedAt": "2025-05-28T10:04:35.772Z",
    "shareToken": "477128df-242f-4082-98b7-a677eb5824a5",
    "owner": {
        "id": 2,
        "fullname": null,
        "login": "dima",
        "image": null
    },
    "list": {
        "id": 9,
        "name": "Для друзей",
        "eventDate": "2003-06-10",
        "accessLevelId": 3
    },
    "bookedByUser": {
        "id": 3,
        "fullname": null,
        "login": "shaka",
        "image": null
    }
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

`DELETE /api/wish`
Удалить желание (владелец списка или админ)

**Request Body:**

```json
{
  "id": "number"
}
```

**Responses:**

- 201:

```json
{
    "message": "Желание c Id:20 успешно удалено"
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

`PATCH /api/wish/book?token=<shareToken>`
Забронировать желание

**Request Body:**

```json
{
  "id": "number"
}
```

**Query:**

```makefile
  token? (string)
```

**Responses:**

- 200:

```json
{
    "id": 17,
    "name": "айфон",
    "price": null,
    "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
    "image": "",
    "wishStatusId": 2,
    "createdAt": "2025-05-28T10:33:23.780Z",
    "updatedAt": "2025-05-28T10:33:28.358Z",
    "shareToken": null,
    "owner": {
        "id": 2,
        "fullname": null,
        "login": "dima",
        "image": null
    },
    "list": {
        "id": 10,
        "name": "Для друзей",
        "eventDate": "2003-06-10",
        "accessLevelId": 4
    },
    "bookedByUser": {
        "id": 3,
        "fullname": null,
        "login": "shaka",
        "image": null
    }
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
  "message": "Желание с id 25 уже забронировано",
  "error": "Bad Request"
}
```

### Unbook a Wish

`PATCH /api/wish/unbook?token=<shareToken>`
Снять бронь (тот, кто забронировал или владелец желания)

**Request Body:**

```json
{
  "id": "number"
}
```

**Query:**

```makefile
  token? (string)
```

**Responses:**

- 200:

```json
{
    "id": 14,
    "name": "айфон",
    "price": null,
    "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
    "image": "",
    "wishStatusId": 1,
    "createdAt": "2025-05-28T10:28:57.707Z",
    "updatedAt": "2025-05-28T10:29:09.215Z",
    "shareToken": null,
    "owner": {
        "id": 2,
        "fullname": null,
        "login": "dima",
        "image": null
    },
    "list": {
        "id": 10,
        "name": "Для друзей",
        "eventDate": "2003-06-10",
        "accessLevelId": 4
    },
    "bookedByUser": null
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Нет доступа к cнятию брони этого желания",
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
  "message": "Вы не можете снять бронь, т.к. не являетесь её владельцем или владельцем списка",
  "error": "Bad Request"
}
```

### Complete a Wish

`PATCH /api/wish/complete`
Завершить желание (только владелец списка)

**Request Body:**

```json
{
  "id": "number"
}
```

**Responses:**

- 201:

```json
{
    "id": 17,
    "name": "айфон",
    "price": null,
    "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
    "image": "",
    "wishStatusId": 3,
    "createdAt": "2025-05-28T10:33:23.780Z",
    "updatedAt": "2025-05-28T10:33:36.436Z",
    "shareToken": null,
    "owner": {
        "id": 2,
        "fullname": null,
        "login": "dima",
        "image": null
    },
    "list": {
        "id": 10,
        "name": "Для друзей",
        "eventDate": "2003-06-10",
        "accessLevelId": 4
    },
    "bookedByUser": {
        "id": 3,
        "fullname": null,
        "login": "shaka",
        "image": null
    }
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

## Public Wishlist

Все эти маршруты не требуют JWT-авторизации, они работают по shareToken

### Create a Public Wishlist

`POST /api/publicwishlist`
Создать новый публичный список желаний. Он доступен всем для просмотра, но редактируется только по токену.

**Request Body:**

```json
{
  "name": "string",
  "description?": "string",
  "eventDate?": "YYYY-MM-DD || DD.MM.YYYY",
  "accesslevelId?": 1    
}

```

**Responses:**

- 201:

```json
{
    "id": 24,
    "token": "77abf0aa-e65d-4553-917b-6b785d9eda71"
}
```

- 400: 

```json
{
  "statusCode": 400,
  "message": "В тексте найдены запрещенные слова",
  "error": "Bad Request"
}
```

## Get a Public Wishlist

`GET /api/publicwishlist/:id?token=<shareToken?>`
Получить все данные списка со всеми желаниями

**Responses:**

- 200:

```json
{
    "id": 22,
    "name": "23 февраля",
    "description": null,
    "eventDate": "2003-06-10",
    "shareToken": null,
    "userId": null,
    "accesslevelId": 1,
    "createdAt": "2025-05-26T07:19:26.710Z",
    "updatedAt": "2025-05-26T07:20:04.851Z",
    "accesslevel": {
        "id": 1,
        "name": "public"
    },
    "user": null,
    "wishes": []
}
```

- 403: 

```json
{
  "statusCode": 403,
  "message": "Нужен корректный токен для просмотра этого списка",
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

### Update a Public Wishlist

`PATCH /api/publicwishlist/:id?token=<shareToken>`
Обновить список если у вас есть токен

**Request Body:**

```json
{
  "name?": "string",
  "description?": "string",
  "eventDate?": "YYYY-MM-DD"
}
```

**Responses:**

- 200:

```json
{
    "id": 24,
    "name": "23 февраля",
    "description": null,
    "eventDate": "2003-06-10",
    "shareToken": "77abf0aa-e65d-4553-917b-6b785d9eda71",
    "userId": null,
    "accesslevelId": 1,
    "createdAt": "2025-05-26T07:38:57.498Z",
    "updatedAt": "2025-05-26T07:39:29.598Z"
}
```

- 403: 

```json
{
  "statusCode": 403,
  "message": "Нужен корректный токен для просмотра этого списка",
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

### Add a Wish to a Public Wishlist

`POST /api/publicwishlist/:id/wishes?token=<shareToken>`
Добавить новое желание в список, если есть токен

**Request Body:**

```json
{
  "name": "string",
  "price?": "number",
  "productLink?": "string",
  "image?": "string"
}

```

**Responses:**

- 201:

```json
{
    "id": 7,
    "name": "айфон",
    "price": 44000,
    "wishStatusId": 1,
    "updatedAt": "2025-05-26T07:39:40.286Z",
    "createdAt": "2025-05-26T07:39:40.286Z",
    "image": null,
    "productLink": null,
    "bookedByUserId": null
}
```

- 403: 

```json
{
  "statusCode": 403,
  "message": "Нужен корректный токен для просмотра этого списка",
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

### Update a Wish in a Public Wishlist

`PATCH /api/publicwishlist/:listId/wishes/:wishId?token=<shareToken>`
Обновить поля желания если есть токен

**Responses:**

- 201:

```json
{
  "name?": "string",
  "price?": "number",
  "productLink?": "string",
  "image?": "string"
}

```

- 403: 

```json
{
  "statusCode": 403,
  "message": "Нужен корректный токен для просмотра этого списка",
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

### Delete a Wish from a Public Wishlist

`DELETE /api/publicwishlist/:listId/wishes/:wishId?token=<shareToken>`
Удалить желание из списка, если есть токен

**Responses:**

- 201:

```json
{ 
  "message": "Желание удалено" 
}
```

- 403: 

```json
{
  "statusCode": 403,
  "message": "Нужен корректный токен для просмотра этого списка",
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