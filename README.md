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

## API:

### Auth (Для регистрации и авторизации)

`POST /api/auth/login` - для авторизации пользователя `{"loginOrEmail": "string", "password": "string"}`;
`POST /api/auth/registration` - для регистрации пользователя `{"login": "string", "email": "string", "password": "string"}`;

### AccessLevel (Уровень доступа)

На стадии запуска сервера создается 4 уровня доступа:

- `"public"`
- `"private"`
- `"linkOnly"`
- `"friends"`

### Управлять уровнями доступа может только админ, вот запросы для него:

`POST /api/accesslevel` - создание уровня доступа `{"name": "название"}`;
`GET /api/accesslevel` - получить список всех уровней доступа;
`GET /api/accesslevel/:id` - получить увроень доступа по id;
`PATCH /api/accesslevel/:id` - изменить уровень доступа по id `{"name": "string"}`;
`DELETE /api/accesslevel/:id` - удалить уровень доступа по id;

### Ban (Блокировки пользователей (реализованы не до конца))

> Блокировки может раздавать только администратор

`POST /api/ban` - создать бан для пользователя `{"userId": "number", "description": "string"}`;
`DELETE /api/ban/:id` - удалить бан по id `{"banId": "number"}`;
`GET /api/ban` - посмотреть все баны, которые существуют;
`GET /api/ban/:id` - посмотреть бан по конкретному id(надо будет вывести пользователей у которых есть эта причина бана) `{"banId": "number"}`;

### Roles (Роли пользователей)

> На стадии запуска сервера создаются 2 роли:
>
> - `{value: 'user', description: 'Пользователь'}`
> - `{value: 'admin', description: 'Администратор'}`

> Роли управляет только администратор, роль `"user"` выдается пользователю автоматически при регистрации

`POST /api/role` - создать роль `{"value": "string"; "description": "string"}`;
`GET /api/role` - получить все роли;
`PATCH /api/role/:id` - изменить роль по id `{"value": "string"}`;
`DELETE /api/role/:id `- удалить роль по id;

> На стадии запуска сервера создается администратор:
> `{"login": "root", "email": "root@mail.ru", "password": "root", "fullName": "Администратор", "roleId": 2}`

`GET /api/user` - получить всех созданных пользователей (может только админ)
`GET /api/user/:id` - посмотреть профиль конкретного пользователя по id (может либо админ, либо пользователь только свой профиль)
`DELETE /api/user/:id` - удалить пользователя по id (может либо админ, либо пользователь только свой профиль)
`PATCH /api/user/:id` - изменить профиль пользователя по id (может только пользователь свой) `{"fullName": "string", "image": "string", "birthDate": string, "phone": "string", "socials": "string","string"}`
`PATCH /api/user/:id/password` - изменить пароль пользователя по id (может только пользователь свой) `{"oldPassword": "string", "newPassword": "string", "confirmPassword": "string"}`

### Wish (Желания)

`POST /api/wish/:listId` - создать желание с id списка `{"name": "string", "price": "number", "image": "string", "productLink": "string"}`
`GET /api/wish` - получить все желания (надо поправить, нет проверки на пользователя)
`GET /api/wish/:id` - получить желание по id (надо поправить, нет проверки на пользователя)
`PATCH /api/wish/:id` - редактировать желание по id (может редактировать только владелец желания)`{"name": "string", "price": "number", "image": "string", "productLink": "string"}`
`DELETE /api/wish/:id` - удалять желание по id (может удалять только владелец желания)
`PATCH /api/wish/:id/book` - забронировать желание (проверяется доступ списка желания и бронь желания)
`PATCH /api/wish/:id/unbook` - снять бронь с желания (проверяется есть ли бронь на желании и являетесь ли вы владельцем брони)

### WishList (Список желаний)

`POST /api/wishlist` - создать список желания `{"name": "string", "accesslevelId": "number", "description": "string", "eventDate": "string"}`
`GET /api/wishlist` - получить все списки пользователя (который залогинен)
`PATCH /api/wishlist/duplicate` - дублировать желание из одного списка в другой (`"targetListId": "number", "wishId": "number"`)
`PATCH /api/wishlist/:id` - редактировать список желаний (может только хозяин списка) `{"name": "string", "accesslevelId": "number", "description": "string", "eventDate": "string"}`
`DELETE /api/wishlist/:id` - удалить список желаний (может только хозяин списка)
`GET /api/wishlist/:id` - получить все желания какого-то списка (не работает, надо исправить)

### WishStatus (Статусы желаний)

Должен управлять только администратор(надо исправить)

> Статусы автоматически создаются:
> `'active', 'reserved', 'completed'`

`POST api/wishstatus` - для создания статуса желания `{"name": "string", "bookedByUserId": "number"}`
`GET api/wishstatus` - для просмотра всех статусов желания
`GET api/wishstatus/:id` - для просмотра информации о статусе по id

---

---

````markdown
# API Documentation

## Authentication

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
````

**Responses:**

- 200: Success
- 401: Invalid credentials
- 400: Validation error

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

---

## Access Levels

**Default levels:**

- `public`
- `private`
- `linkOnly`
- `friends`

### Create Access Level

`POST /api/accesslevel`  
_(Admin only)_

**Request Body:**

```json
{
  "name": "string"
}
```

### Get All Access Levels

`GET /api/accesslevel`

### Get Access Level by ID

`GET /api/accesslevel/:id`

### Update Access Level

`PATCH /api/accesslevel/:id`  
_(Admin only)_

**Request Body:**

```json
{
  "name": "string"
}
```

### Delete Access Level

`DELETE /api/accesslevel/:id`  
_(Admin only)_

---

## User Management

### Get All Users

`GET /api/user`  
_(Admin only)_

### Get User by ID

`GET /api/user/:id`  
_(User can only view own profile)_

### Update User Profile

`PATCH /api/user/:id`  
_(User can only update own profile)_

**Request Body:**

```json
{
  "fullName": "string",
  "image": "string",
  "birthDate": "string",
  "phone": "string",
  "socials": "string"
}
```

### Change Password

`PATCH /api/user/:id/password`  
_(User can only change own password)_

**Request Body:**

```json
{
  "oldPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

---

## Wish Management

### Create Wish

`POST /api/wish/:listId`

**Request Body:**

```json
{
  "name": "string",
  "price": number,
  "image": "string",
  "productLink": "string"
}
```

### Book Wish

`PATCH /api/wish/:id/book`  
_Book a wish (checks wishlist access)_

### Unbook Wish

`PATCH /api/wish/:id/unbook`  
_Unbook a wish (checks booking ownership)_

---

## Wishlist Management

### Create Wishlist

`POST /api/wishlist`

**Request Body:**

```json
{
  "name": "string",
  "accesslevelId": number,
  "description": "string",
  "eventDate": "string"
}
```

### Duplicate Wish

`PATCH /api/wishlist/duplicate`

**Request Body:**

```json
{
  "targetListId": number,
  "wishId": number
}
```

---

## Admin Endpoints

### Roles Management

`POST/GET/PATCH/DELETE /api/role`  
_(Admin only)_

### Ban Management

`POST/GET/DELETE /api/ban`  
_(Admin only)_

### Wish Status Management

`POST/GET /api/wishstatus`  
_(Admin only)_

**Default statuses:**

- `active`
- `reserved`
- `completed`

```

Рекомендации по дальнейшему улучшению:

1. Добавьте примеры ответов для каждого endpoint
2. Укажите коды статусов HTTP для всех возможных сценариев
3. Добавьте раздел с ошибками и их описанием
4. Для production-версии рассмотрите использование Swagger UI или Redoc
5. Добавьте информацию об аутентификации (какие заголовки требуются)
6. Укажите ограничения (rate limiting, если есть)

Вы можете автоматизировать генерацию этой документации с помощью:
- Swagger для NestJS (`@nestjs/swagger`)
- Комментариев JSDoc в коде
- Специальных инструментов типа Postman или Insomnia
```
