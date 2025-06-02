# WishWave Server Documentation

Документация серверной части WishWave раскрывает всю архитектуру и ключевые механизмы работы бэкенда на Nest.js, объединяя продуманный дизайн моделей, надёжную безопасность и удобный функционал для взаимодействия с фронтендом.

## API URL

В основе API лежит единый префикс:

`/api`

Это позволяет быстро понять, что все маршруты начинаются с этого пути и гарантируют одинаковый базовый URL на разных окружениях. 

При запуске сервера в точке входа (main.ts) вызывается:

```ts
  app.setGlobalPrefix("api") 
```

Поэтому, будь то запрос на авторизацию, на получение списка пользователей или на управление желаниями, адрес всегда выглядит как:

```makefile
  http://<host>:<port>/api/....
```

## JSON Web Token

Безопасность аутентификации обеспечивается с помощью JWT. Когда пользователь регистрируется или входит в систему через:

`/api/auth/login` или `/api/auth/registration`

Ему возвращается токен, вида:

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InNoYWthIiwiaWQiOjMsImVtYWlsIjoic2hha2FAbWFpbC5ydSIsImZ1bGxuYW1lIjoi0JLQsNC00LjQvCIsInJvbGVzIjp7ImlkIjoxLCJ2YWx1ZSI6InVzZXIiLCJkZXNjcmlwdGlvbiI6ItCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCIsImNyZWF0ZWRBdCI6IjIwMjUtMDUtMjdUMTQ6NDU6MTIuMzQyWiIsInVwZGF0ZWRBdCI6IjIwMjUtMDUtMjdUMTQ6NDU6MTIuMzQyWiJ9LCJpYXQiOjE3NDg4NDQ2NTgsImV4cCI6MTc0ODkzMTA1OH0.zDSMhdyZYCddLRlUOE5SjCNbSilS2ArXPde0FVrJS4Q"
}
```

Который подписан секретным ключом, описанным в переменном окружении:

```makefile
  PORT=5000
  POSTGRES_HOST=localhost
  POSTGRES_USER=postgres
  POSTGRES_DB=server_db
  POSTGRES_PASSWORD=root
  POSTGRES_PORT=5432
  PRIVATE_KEY=secret_key
```

Данный токен содержит следующую информацию о пользователе:

```json
{
  "login": "string",
  "id": "number",
  "email": "string",
  "fullname": "string",
  "roles": {
    "id": "number",
    "value": "string",
    "description": "string",
    "createdAt": "string",
    "updatedAt": "string"
  },
  "iat": "number",
  "exp": "number"
}
```

Дальнейшие запросы к защищённым ресурсам требуют передачи JWT в заголовке

```makefile
  Authorization: Bearer <token>
```

На стороне сервера каждый маршрут, помеченный как

```ts
  @UseGuards(JwtAuthGuard)
```

Сначала проверяет заголовок, извлекает и верифицирует токен, а затем помещает данные пользователя в объект req.user. В коде контроллеров и сервисов на основе 

```ts
  req.user.roles.value и req.user.id 
```

Реализуются все проверки доступа: от ограничения создания и удаления сущностей до возможности просматривать чужие профили.

## User Registration

Шаг 1 – регистрация и отправка кода.
Когда новый пользователь отправляет на сервер свои данные (логин, электронную почту и пароль), система сначала проверяет, не заняты ли указанные логин или email. Если всё в порядке, пароль сразу превращается в хэш, а сам пользователь ещё не создаётся в основной таблице. Вместо этого сохраняются данные о кандидате в отдельную «временную» таблицу (pending users): логин, email, уже захэшированный пароль, сгенерированный шестизначный код подтверждения и время, до которого этот код действителен (один час). После этого система отправляет на указанный адрес email письмо с текстом, в котором указан именно этот код. Самому пользователю возвращается ответ с сообщением о том, что код отправлен, и предложение ввести его для завершения регистрации.

Шаг 2 – проверка кода и создание реального аккаунта.
Когда пользователь вводит полученный в письме код, он обращается ко второму endpoint­ (verify-email). В этом запросе необходимо передать либо тот же логин, который использовали при регистрации, либо email, и сам шестизначный код. Система ищет запись о временном пользователе по совпадению логина или email и по указанному коду.

Если не нашлось подходящей записи или код уже не совпадает, возвращается ошибка «Неверный логин/email или код подтверждения».

Если запись обнаружена, но срок действия кода истёк (то есть текущее время позже указанного времени окончания жизни кода), временная запись удаляется, и пользователю возвращается сообщение о том, что срок действия кода истек, с указанием «Срок действия кода истёк. Зарегистрируйтесь заново.».
В случае успешного совпадения и если код ещё не просрочен, система перенесёт данные временного пользователя в основную таблицу пользователей: создаётся запись с логином, email и уже захэшированным паролем. После этого временная запись удаляется, и сразу же выдаётся JWT-токен, который пользователь получает в ответе и может использовать для доступа к защищённым ресурсам.

Шаг 3 – вход.
После того как пользователь прошёл верификацию кода и запись появилась в главной таблице, он может авторизоваться обычным способом. Для этого он отправляет логин (или email) и пароль. Система находит строку в таблице пользователей по переданному логину или email, сравнивает указанный пароль с тем, что хранится в базе (через сравнение с хэшем). Если оба параметра совпадают, генерируется новый JWT-токен и возвращается в ответе. В противном случае возвращается ошибка «Некорректный email, логин или пароль» с кодом 401.

## Password Hashing

Пароли пользователей никогда не сохраняются в открытом виде. Хэширование паролей организовано библиотекой bcryptjs. При регистрации или изменении пароля метод сервиса делает хеширование, после чего в базе хранится уже не исходная строка, а её криптографическая производная. При последующих попытках входа сравнение осуществляется также через bcrypt, и только если хеши совпадают, пользователь считается аутентифицированным. Такой подход защищает от простых атак по словарю и затрудняет получение оригинального пароля даже при утечке базы данных.

Параллельно для списков желаний с уровнем доступа linkOnly — это особый режим, при котором список желаний не открыт всем, но и не закрыт полностью, автоматически создаётся уникальный токен shareToken на основе UUID, который играет роль «пароля-ссылки»: владелец списка может передать эту ссылку любому человеку, и тот получит доступ к просмотру.  Благодаря тому, что shareToken хранится в базе как случайный UUID, он обладает высокой стойкостью к подбору — по сути это хеш-ключ, по которому сервер однозначно идентифицирует разрешённый доступ.

## Checking Bad Words

Для защиты от нежелательного контента в текстовых полях применяется модуль ProfanityService на основе библиотеки BadWordsNext. Эта библиотека содержит фильтры для английских, русских и «ру-латиницей» написанных плохих слов. Все поля, где пользователь может ввести свободный текст — логин или почта при регистрации, названия списков и описания желаний, ссылки в соцсетях — перед сохранением проверяются на наличие плохих слов, а также другие. Если фильтр обнаруживает неподобающий контент, генерируется исключение BadRequestException, и клиент получает ответ с кодом 400 и текстовым пояснением о том, что в тексте найдены запрещённые слова.

## Working with Files

Загрузку файлов, прежде всего изображений для желания или аватарок пользователей, обеспечивает FileInterceptor из @nestjs/platform-express. В файле 

```ts
  file.service.ts 
```

Реализована логика сохранения картинок в папку static: уникальное имя генерируется через uuid.v4(), создаётся нужная директория при её отсутствии, а затем файл пишется на диск. При замене уже существующего изображения старая копия удаляется для экономии пространства. Папка static раздаётся самим приложением через ServeStaticModule на маршруте /static, что позволяет фронтенду обращаться к сохранённым файлам по прямым URL.

## Recommendation

Рекомендации строятся на основе публичных желаний (то есть тех, которые выставлены в списках с уровнем доступа public). Любой пользователь (включая неавторизованных) может видеть эти желания. Если пользователь передаёт JWT-токен и у его профиля заполнены пол (gender) и дата рождения (birthDate), система вычисляет текущий возраст и формирует диапазон ± 5 лет (например, для мужчины 25 лет будут подбираться желания от мужчин 20–30 лет). Затем из таблицы желаний выбираются только те записи, которые:

 - принадлежат спискам с уровнем доступа public,

 - у которых владелец (автор списка) совпадает по полу и попадает в возрастной диапазон пользователя.

Результат сортируется по дате создания (createdAt) — от новых к старым — и берутся первые 30 записей. Если пользователь не вошёл в систему, либо для его демографической группы не нашлось желаний, возвращаются просто последние 30 публичных желаний. При этом каждый раз выводимые желания перемешиваются между собой.

Также для авторизованного пользователя собирает список его друзей (тех, у кого статус «accepted»), затем для каждого друга вычисляет, когда в последний раз обновлялся любой из его достоупных списков («public» или «friends») или любое желание внутри них.
Отдаёт до 15 друзей, отсортированных от самых «свежих» (больше createdAt у списка/желаний) к менее активным.

## Stats

Эндпоинт /stats позволяет администраторам получить сводную информацию о системе: общее число пользователей, списков желаний, самих желаний и баг-репортов. При запросе проверяется роль из JWT-токена (доступен только пользователям с ролью admin); если проверка пройдена, возвращается JSON с четырьмя полями – users, wishLists, wishes и bugReports – соответствующими количественными показателями.

## Database Seeding

При старте приложения автоматически запускается SeedService, который по принципу «findOrCreate» наполняет базу начальными данными. По умолчанию создаются:

- Уровни доступа:

```ts
  const defaultLevels = ["public", "private", "linkOnly", "friends"];
```

- Роли пользователей:

```ts
  const roles = [
      { value: "user", description: "Пользователь" },
      { value: "admin", description: "Администратор" },
    ];
```

- Статусы желаний:

```ts
  const statuses = ["active", "reserved", "completed"];
```

- Статусы дружбы:

```ts
  const statuses = ["pending", "accepted", "rejected"];
```

А также генерируется администратор, со следующим набором данных:

```ts
  const adminRole = await this.roleModel.findOne({ where: { value: "admin" } });
  const login = "root";
  const email = "root@mail.ru";
  const passwordHash = await bcrypt.hash("root", 10);
  await this.userModel.create({
    login,
    email,
    password: passwordHash,
    roleId: adminRole.id,
    fullName: "Администратор",
  });
```
Такой механизм позволяет сразу после поднятия системы получить работу всех сценариев без ручного ввода справочных данных.

## Database Model

Модель данных чётко отражает предметную область:

![Концептуальная модель](Conceptual.png)

Она строится вокруг пользователей, каждый из которых имеет логин, почту, хеш пароля, профильные поля (ФИО, фото, дату рождения, телефон, пол и соцсети) и связан с ролью. Заявки в друзья хранятся в отдельной таблице с отправителем, получателем и статусом из справочника FriendStatus, что позволяет отслеживать «pending», «accepted» или «rejected». Списки желаний содержат название, описание, при желании дату события, уровень доступа (public, private, linkOnly или friends) и опциональный UUID-токен для режима linkOnly, а сами желания связаны со списками через таблицу многие-ко-многим и имеют собственный статус (active, reserved, completed), цену, ссылку и изображение. При бронировании желания меняется его статус на «reserved» и фиксируется пользователь-бронирующий (bookedByUserId), а при завершении бронь снимается и статус переводится в «completed». Такая схема с явными внешними ключами и справочниками позволяет легко проверять права доступа и строить гибкую бизнес-логику на стороне сервера. Кроме того, введена сущность BugReport, которая позволяет любому пользователю — авторизованному (по JWT) или гостю — создавать отчёты об ошибках.

## Errors

Все ошибки обрабатываются через встроенные в Nest.js исключения: 

- Eсли переданы некорректные данные, бросается BadRequestException (400) 

- Eсли нет авторизации — UnauthorizedException (401)

- Eсли нет прав доступа — ForbiddenException (403)

- Eсли не найден ресурс — NotFoundException (404)

- А в случае конфликтов — ConflictException (409) 

Такой подход создаёт единый формат ответов и позволяет клиенту легко реагировать на различные ситуации.

# API Documentation:

WishWave API позволяет пользователям регистрироваться, аутентифицироваться и управлять данными своего аккаунта, создавать, менять и удалять списки желаний, а также сами желания. Возможно формирование дружеских связей, при помощи который открывается дополнительный функционал пользователю: бронирование желаний, просмотр списков желаний "для друзей".

Администратор данной системы управляет статусами дружбы, ролями, уровнями доступа и статусами желания. Также у него есть следующие возможности: раздача банов пользователям, управление аккаунтом пользователя, управление его желаниями и списками.

## Access Level

Для всех защищенных маршрутов требуется заголовок

```makefile
Authorization: Bearer <token>
```

Управлять уровнями доступа может только администратор

### List All Access Levels

`GET /api/accesslevel`
Получить все уровни доступа

**Responses:**

- 200:

```json
[
    {
        "id": 1,
        "name": "public",
        "createdAt": "2025-05-27T14:45:12.311Z",
        "updatedAt": "2025-05-27T14:45:12.311Z"
    },
    {
        "id": 2,
        "name": "private",
        "createdAt": "2025-05-27T14:45:12.324Z",
        "updatedAt": "2025-05-27T14:45:12.324Z"
    },
    {
        "id": 3,
        "name": "linkOnly",
        "createdAt": "2025-05-27T14:45:12.333Z",
        "updatedAt": "2025-05-27T14:45:12.333Z"
    },
    {
        "id": 4,
        "name": "friends",
        "createdAt": "2025-05-27T14:45:12.337Z",
        "updatedAt": "2025-05-27T14:45:12.337Z"
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

### Get Access Level by Id

`GET /api/accesslevel/:id`
Получить уровень доступа по Id

**Path Parametrs:**

```makefile
  id (number)
```

**Responses:**

- 200:

```json
{
    "id": 1,
    "name": "public",
    "createdAt": "2025-05-27T14:45:12.311Z",
    "updatedAt": "2025-05-27T14:45:12.311Z"
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
  "message": "Уровень доступа не найден",
  "error": "Not Found"
}
```

### Create Access Level

`POST /api/accesslevel`
Создать новый уровень доступа

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
  "name": "private",
  "createdAt": "2025-05-22T12:34:56.789Z",
  "updatedAt": "2025-05-22T12:34:56.789Z"
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

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав для этой операции",
  "error": "Forbidden"
}
```


### Update Access Level

`PATCH /api/accesslevel/:id`
Обновить название уровня доступа

**Path Parametrs:**

```makefile
  id (number)
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
  "id": 2,
  "name": "public",
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
  "message": "Уровень доступа не найден",
  "error": "Not Found"
}
```

### Delete Access Level

`DELETE /api/accesslevel/:id`
Удалить уровень доступа

**Path Parametrs:**

```makefile
  id (number)
```

**Responses:**

- 201:

```json
{
  "message": "Уровень доступа удален"
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
  "message": "Код подтверждения отправлен на ваш email. Введите код для завершения регистрации."
}
```

### Verify Email

`POST /api/auth/verify-email`
Подтверждение кода, полученного на e-mail

**Request Body:**
```json
{
  "loginOrEmail": "string",
  "code": "string"
}
```

**Responses:**

- 201: 

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InJ1c3lhIiwiaWQiOjIsImVtYWlsIjoiZnV3ZWd1NTBAZ21haWwuY29tIiwiZnVsbG5hbWUiOm51bGwsInJvbGVzIjp7ImlkIjoxLCJ2YWx1ZSI6InVzZXIiLCJkZXNjcmlwdGlvbiI6ItCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCIsImNyZWF0ZWRBdCI6IjIwMjUtMDYtMDJUMDk6MTk6MzIuNjQ3WiIsInVwZGF0ZWRBdCI6IjIwMjUtMDYtMDJUMDk6MTk6MzIuNjQ3WiJ9LCJpYXQiOjE3NDg4NTYxNDcsImV4cCI6MTc0ODk0MjU0N30.SpDWY2und9j2V2E2gkt-gL5spqiNGFC18Z3qpdXyKzw"
}
```

- 400:

```json
{
  "statusCode": 400,
  "message": "Неверный логин/email или код подтверждения",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 400,
  "message": "Срок действия кода истёк. Зарегистрируйтесь заново.",
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

- 400:

```json
{
  "statusCode": 400,
  "message": "Validation error",
  "error": "Bad Request"
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

### Login

`POST /api/auth/logout`
Выход пользователя с очисткой куки и токена

**Responses:**

- 200:

```json
{
  "message": "Вы вышли из системы"
}
```

---

## Ban

Для всех защищенных маршрутов требуется заголовок

```makefile
Authorization: Bearer <token>
```

Управлять банами может только администратор

### List All Ban

`GET /api/ban`
Получить все баны

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

```makefile
  id (number)
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
  "message": "Бан не найден",
  "error": "Not Found"
}
```

### Create Ban

`POST /api/ban`
Создать новый бан

**Request Body:**

```json
{
  "userId": "number",
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

- 400:

```json
{
  "statusCode": 400,
  "message": "Validation error",
  "error": "Bad Request"
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

### Delete Ban

`DELETE /api/ban/:id`
Удалить бан

**Path Parametrs:**

```makefile
  id (number)
```

**Responses:**

- 201:

```json
{
  "message": "Бан удален"
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
  "message": "Бан не найден",
  "error": "Not Found"
}
```

--- 

## Bug Report

Для всех защищенных маршрутов требуется заголовок, кроме POST

```makefile
Authorization: Bearer <token>
```

### Get a Bugreports by Id

`GET /api/bugreport/:id`
Получить баг репорт пользователя по id

**Path Parametrs:**

```makefile
  id (number)
```

**Responses:**

- 201:

```json
{
    "id": 6,
    "title": "Баг",
    "description": "Не работает добавление желания",
    "email": null,
    "owner": {
        "id": 2,
        "fullname": null,
        "login": "shaka",
        "image": "4a303142-2242-4681-8329-fe9531a0edbb.jpg"
    },
    "createdAt": "2025-05-29T09:37:05.657Z",
    "updatedAt": "2025-05-29T09:37:05.657Z"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Нет прав на просмотр этого списка",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Баг-репорт не найден",
  "error": "Forbidden"
}
```

### Get a List Your Bugreports

`GET /api/bugreport`
Посмотреть все баг репорты одного пользователя (который авторизован)

**Responses:**

- 201:

```json
[
    {
        "id": 4,
        "title": "Баг",
        "description": "Не работает добавление желания",
        "email": null,
        "owner": {
            "id": 2,
            "fullname": null,
            "login": "shaka",
            "image": "4a303142-2242-4681-8329-fe9531a0edbb.jpg"
        },
        "createdAt": "2025-05-29T09:20:00.501Z",
        "updatedAt": "2025-05-29T09:20:00.501Z"
    },
    {
        "id": 6,
        "title": "Баг",
        "description": "Не работает добавление желания",
        "email": null,
        "owner": {
            "id": 2,
            "fullname": null,
            "login": "shaka",
            "image": "4a303142-2242-4681-8329-fe9531a0edbb.jpg"
        },
        "createdAt": "2025-05-29T09:37:05.657Z",
        "updatedAt": "2025-05-29T09:37:05.657Z"
    }
]
```

### Get All Bugreports

`GET /api/bugreport/all`
Получить список всех багрепортов (только для администратора)

**Responses:**

- 201:

```json
[
    {
        "id": 4,
        "title": "Баг",
        "description": "Не работает добавление желания",
        "email": null,
        "owner": {
            "id": 2,
            "fullname": null,
            "login": "shaka",
            "image": "4a303142-2242-4681-8329-fe9531a0edbb.jpg"
        },
        "createdAt": "2025-05-29T09:20:00.501Z",
        "updatedAt": "2025-05-29T09:20:00.501Z"
    },
    {
        "id": 6,
        "title": "Баг",
        "description": "Не работает добавление желания",
        "email": null,
        "owner": {
            "id": 3,
            "fullname": null,
            "login": "dima",
            "image": "4a303142-2242-4681-8329-fe9531a0edbb.jpg"
        },
        "createdAt": "2025-05-29T09:37:05.657Z",
        "updatedAt": "2025-05-29T09:37:05.657Z"
    }
]
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Нет прав на просмотр этого списка",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Баг-репорт не найден",
  "error": "Forbidden"
}
```

### Create Bagreport

`POST /api/bugreport`
Создать багрепорт (может как авторизованный, так и неавторизованный пользователи)

**Request Body:**

```json
{
    "title": "string",
    "description": "string",
    "email?": "string"
}
```

**Responses:**

- 201:

```json
{
    "id": 12,
    "title": "Баг",
    "description": "Не работает добавление желания",
    "email": null,
    "owner": {
        "id": 2,
        "fullname": null,
        "login": "shaka",
        "image": "4a303142-2242-4681-8329-fe9531a0edbb.jpg"
    },
    "createdAt": "2025-05-29T11:23:09.150Z",
    "updatedAt": "2025-05-29T11:23:09.150Z"
}
```

### Edit Bugreport

`PATCH /api/bugreport/:id`
Редактировать багрепорт (может только автор)

**Path Parametrs:**

```makefile
  id (number)
```

**Request Body:**

```json
{
    "title?": "string",
    "description?": "string",
    "email?": "string"
}
```

**Responses:**

- 201:

```json
{
    "id": 12,
    "title": "Баг",
    "description": "Не работает добавление желания",
    "email": null,
    "owner": {
        "id": 2,
        "fullname": null,
        "login": "shaka",
        "image": "4a303142-2242-4681-8329-fe9531a0edbb.jpg"
    },
    "createdAt": "2025-05-29T11:23:09.150Z",
    "updatedAt": "2025-05-29T11:23:09.150Z"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Редактировать может только автор",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Баг-репорт не найден",
  "error": "Forbidden"
}
```

### Delete Bugreport

`DELETE /api/bugreport/:id`
Удалять баг репорт (может либо автор, либо администратор)

**Path Parametrs:**

```makefile
  id (number)
```

**Responses:**

- 201:

```json
{
    "message": "Баг репорт удален"
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "Нет прав на удаление этого баг-репорта",
  "error": "Forbidden"
}
```

- 404:

```json
{
  "statusCode": 404,
  "message": "Баг-репорт не найден",
  "error": "Forbidden"
}
```

---

## Friend

Для всех защищенных маршрутов требуется заголовок

```makefile
Authorization: Bearer <token>
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

- 404:

```json
{
  "statusCode": 404,
  "message": "Не удалось найти информацию о другом пользователе",
  "error": "Not Found"
}
```

### Get Friends Activity

`GET /api/friend/activity`
Получить 15 последних друзей, отсортированных по их активности

**Responses:**

- 200:

```json
[
    {
        "id": 3,
        "login": "dima",
        "email": "dima@mail.ru",
        "fullname": null,
        "image": null,
        "lastActivity": "2025-05-30T04:30:04.700Z"
    },
    {
        "id": 4,
        "login": "sanya",
        "email": "sanya@mail.ru",
        "fullname": null,
        "image": null,
        "lastActivity": "2025-05-30T04:29:10.688Z"
    }
]
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

```json
{
  "statusCode": 400,
  "message": "Пользователь уже отправил вам заявку в друзья",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 400,
  "message": "Вы уже друзья с этим пользователем",
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

```json
{
  "statusCode": 404,
  "message": "Отправитель не найден",
  "error": "Not Found"
}
```

```json
{
  "statusCode": 404,
  "message": "Не удалось загрузить созданную заявку",
  "error": "Not Found"
}
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

- 400:

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


- 404:

```json
{
  "statusCode": 404,
  "message": "Заявка не найдена",
  "error": "Not Found"
}
```

```json
{
  "statusCode": 404,
  "message": "Не удалось загрузить обновленную заявку",
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

- 400:

```json
{
  "statusCode": 400,
  "message": "Нельзя отменять заявку после её обработки",
  "error": "Bad Request"
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

- 404:

```json
{
  "statusCode": 404,
  "message": "Заявка не найдена",
  "error": "Not Found"
}
```

### Unfriend

`DELETE /api/friend/:userId`
Удалить пользователя из друзей

**Path Parametrs:**

```makefile
  userId (number)
```

**Responses:**

- 200:

```json
{
  "message": "Вы больше не друзья"
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

- 404:

```json
{
  "statusCode": 404,
  "message": "Дружба не найдена",
  "error": "Not Found"
}
```

---

## Friend Status

Для всех защищенных маршрутов требуется заголовок

```makefile
Authorization: Bearer <token>
```

Управлять статусами друзей может только администратор

### List Friend Statuses

`GET /api/friendstatus`
Получить все статусы дружбы

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

```makefile
  id (number)
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
  "message": "Статус дружбы не найден",
  "error": "Not Found"
}
```

### Create Friend Status

`POST /api/friendstatus`
Создать новый статус дружбы

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

### Update Friend Status

`PATCH /api/friendstatus/:id`
Обновить название статуса дружбы

**Path Parametrs:**

```makefile
  id (number)
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
  "message": "Статус дружбы не найден",
  "error": "Not Found"
}
```

### Delete Friend Status

`DELETE /api/friendstatus/:id`
Удалить статус дружбы

**Path Parametrs:**

```makefile
  id (number)
```

**Responses:**

- 201:

```json
{
  "message": "Статус дружбы удален"
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
  "message": "Статус дружбы не найден",
  "error": "Not Found"
}
```

---

## Public Wishlist

Все эти маршруты не требуют JWT-авторизации, они работают по shareToken.

### Get a Public Wishlist

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

- 400: 

```json
{
  "statusCode": 400,
  "message": "Требует параметр token",
  "error": "Not Found"
}
```

- 403: 

```json
{
  "statusCode": 403,
  "message": "Неверный токен для редактирования",
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
  "message": "Неверный токен для редактирования",
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

- 400: 

```json
{
  "statusCode": 400,
  "message": "Требует параметр token",
  "error": "Not Found"
}
```

- 403: 

```json
{
  "statusCode": 403,
  "message": "Неверный токен для редактирования списка",
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

- 400: 

```json
{
  "statusCode": 400,
  "message": "Требует параметр token",
  "error": "Not Found"
}
```

- 403: 

```json
{
  "statusCode": 403,
  "message": "Неверный токен для редактирования списка",
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

## Recommendation

Для всех маршрутов заголовок не обязателен, но при наличии JWT-токена выдаёт персонализированные рекомендации.

```makefile
Authorization: Bearer <token>
```

### Get Recommendation List

`GET /api/recommendation`
Выводить список, состоящий из 30 желаний. Для зарегистрированных пользователей список основан на возрасте и поле, а для незарегестрированных пользователей просто выводится 30 последних созданных желаний.

**Responses:**

- 201:

```json
[
    {
        "id": 26,
        "name": "плей",
        "image": "",
        "price": null,
        "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
        "createdAt": "2025-05-30T06:11:23.069Z"
    },
    {
        "id": 25,
        "name": "сони",
        "image": "",
        "price": null,
        "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
        "createdAt": "2025-05-30T06:11:11.106Z"
    },
    {
        "id": 24,
        "name": "айфон",
        "image": "",
        "price": null,
        "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
        "createdAt": "2025-05-30T06:10:51.408Z"
    },
    {
        "id": 23,
        "name": "самсунг",
        "image": "",
        "price": null,
        "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
        "createdAt": "2025-05-30T06:10:47.050Z"
    },
    {
        "id": 22,
        "name": "sony",
        "image": "",
        "price": 25000,
        "productLink": null,
        "createdAt": "2025-05-30T06:10:40.698Z"
    }
]
```

---

## Role

Для всех защищенных маршрутов требуется заголовок

```makefile
Authorization: Bearer <token>
```

Управлять ролями может только администратор

### List All Roles

`GET /api/role`
Получить все роли

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

### Create Role

`POST /api/role`
Создать новыую роль

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

### Update Role

`PATCH /api/role/:id`
Обновить название роли

**Path Parametrs:**

```makefile
  id (number)
```

**Request Body:**

```json
{
  "description": "string"
}
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
  "message": "Роль не найдена",
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

```makefile
  id (number)
```

**Responses:**

- 201:

```json
{
  "message": "Роль удалена"
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
  "message": "Роль не найдена",
  "error": "Not Found"
}
```

---

## Stats

Для всех защищенных маршрутов требуется заголовок

```makefile
Authorization: Bearer <token>
```

### Get All Stats

`GET /api/stats`
Получить статистику сервиса (только администратор)

**Responses:**

- 201:

```json
{
    "bugReports": 0,
    "wishes": 39,
    "wishLists": 26,
    "users": 4
}
```

---

## User

Для всех защищенных маршрутов требуется заголовок

```makefile
Authorization: Bearer <token>
```

### Get All User

`GET /api/user/all?page=<number>&limit=<number>`
Получить список всех пользователей (только для администратора)

**Query Parametrs:**

```makefile
  page (number) // по умолчанию 1
```

```makefile
  limit (number) // по умолчанию 20, максимум 100
```

**Responses:**

- 200:

```json
{
    "data": [
        {
            "id": 1,
            "login": "root",
            "email": "root@mail.ru",
            "fullname": null,
            "image": null,
            "birthDate": null,
            "phone": null,
            "gender": null,
            "socials": null,
            "roleId": 2,
            "banId": null,
            "createdAt": "2025-05-27T14:45:12.491Z",
            "updatedAt": "2025-05-27T14:45:12.491Z"
        },
        {
            "id": 2,
            "login": "dima",
            "email": "dima@mail.ru",
            "fullname": "хуй",
            "image": "d8b12332-505a-40ff-b69e-3e49316846ba.jpg",
            "birthDate": "2003-06-11",
            "phone": null,
            "gender": null,
            "socials": null,
            "roleId": 1,
            "banId": null,
            "createdAt": "2025-05-27T14:45:24.141Z",
            "updatedAt": "2025-06-01T09:02:50.659Z"
        },
        {
            "id": 3,
            "login": "shaka",
            "email": "shaka@mail.ru",
            "fullname": "Вадим",
            "image": "224aa3f9-9a6b-40a4-b30a-6426015be5f9.jpg",
            "birthDate": null,
            "phone": null,
            "gender": null,
            "socials": null,
            "roleId": 1,
            "banId": null,
            "createdAt": "2025-05-27T14:45:52.526Z",
            "updatedAt": "2025-05-28T12:11:50.586Z"
        },
        {
            "id": 4,
            "login": "rusya",
            "email": "rusya@mail.ru",
            "fullname": null,
            "image": null,
            "birthDate": null,
            "phone": null,
            "gender": null,
            "socials": null,
            "roleId": 1,
            "banId": null,
            "createdAt": "2025-06-01T05:54:40.598Z",
            "updatedAt": "2025-06-01T05:54:40.598Z"
        }
    ],
    "page": 1,
    "perPage": 20,
    "total": 4,
    "totalPages": 1
}
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
  "fullName?": "string | null",
  "image?": "string | null",
  "birthDate?": "string | null",
  "phone?": "string | null",
  "male?": "male | female | null",
  "socials?": { "string | null": "string | null" } 
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

## Wish

Для всех защищенных маршрутов требуется заголовок

```makefile
Authorization: Bearer <token>
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
    "id": 1,
    "name": "плей",
    "price": null,
    "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
    "image": "",
    "wishStatusId": 1,
    "createdAt": "2025-06-02T09:26:43.365Z",
    "updatedAt": "2025-06-02T09:26:43.365Z",
    "shareToken": null,
    "owner": {
        "id": 2,
        "fullname": null,
        "login": "rusya",
        "image": null
    },
    "list": {
        "id": 1,
        "name": "Для друзей",
        "eventDate": "2003-06-10",
        "accessLevelId": 1
    },
    "bookedByUser": null,
    "canBook": false
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

### Get All Wish

`GET /api/wish/all?page=<number>&limit=<number>`
Получить список всех желаний (только для администратора)

**Query Parametrs:**

```makefile
  page (number) // по умолчанию 1
```

```makefile
  limit (number) // по умолчанию 20, максимум 100
```

**Responses:**

- 200:

```json
{
    "data": [
        {
            "id": 21,
            "name": "айфон",
            "image": "",
            "price": null,
            "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
            "wishStatusId": 1,
            "bookedByUserId": null,
            "createdAt": "2025-05-28T11:24:07.858Z",
            "updatedAt": "2025-05-28T11:24:07.858Z"
        },
        {
            "id": 22,
            "name": "sony",
            "image": "",
            "price": 25000,
            "productLink": null,
            "wishStatusId": 1,
            "bookedByUserId": null,
            "createdAt": "2025-05-30T06:10:40.698Z",
            "updatedAt": "2025-06-01T05:06:09.045Z"
        },
        {
            "id": 23,
            "name": "самсунг",
            "image": "",
            "price": null,
            "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
            "wishStatusId": 1,
            "bookedByUserId": null,
            "createdAt": "2025-05-30T06:10:47.050Z",
            "updatedAt": "2025-05-30T06:10:47.050Z"
        },
        {
            "id": 24,
            "name": "говно",
            "image": "",
            "price": null,
            "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
            "wishStatusId": 1,
            "bookedByUserId": null,
            "createdAt": "2025-05-30T06:10:51.408Z",
            "updatedAt": "2025-05-30T06:10:51.408Z"
        },
        {
            "id": 25,
            "name": "сони",
            "image": "",
            "price": null,
            "productLink": "https://www.ozon.ru/product/shapka-1823110217/?__rr=1",
            "wishStatusId": 1,
            "bookedByUserId": null,
            "createdAt": "2025-05-30T06:11:11.106Z",
            "updatedAt": "2025-05-30T06:11:11.106Z"
        }
    ],
    "page": 2,
    "perPage": 20,
    "total": 36,
    "totalPages": 2
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав, чтобы посмотреть все желания",
  "error": "Forbidden"
}
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

### Update a Wish

`PATCH /api/wish`
Обновить желание

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
Завершить желание

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

### Delete a Wish

`DELETE /api/wish/:id`
Удалить желание (владелец списка или админ)

**Path Parametrs:**

```makefile
  id (number)
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

---

## Wishlist

Для всех защищенных маршрутов требуется заголовок

```makefile
Authorization: Bearer <token>
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

### Get All Wishlists

`GET /api/wishlist/all?page=<number>&limit=<number>`
Получить все спики желаний (только для администратора)

**Query Parametrs:**

```makefile
  page (number) // по умолчанию 1
```

```makefile
  limit (number) // по умолчанию 20, максимум 100
```

**Responses:**

- 200:

```json
{
    "data": [
        {
            "id": 25,
            "name": "Для друзей",
            "description": null,
            "eventDate": "2003-06-10",
            "shareToken": "ea055f95-70e8-4bf0-a576-e1df09f5c5ad",
            "userId": 2,
            "accesslevelId": 3,
            "createdAt": "2025-06-01T11:37:13.464Z",
            "updatedAt": "2025-06-01T11:37:13.464Z"
        }
    ],
    "page": 2,
    "perPage": 20,
    "total": 21,
    "totalPages": 2
}
```

- 403:

```json
{
  "statusCode": 403,
  "message": "У вас нет прав, чтобы посмотреть все списки",
  "error": "Forbidden"
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

### Create Wishlist

`POST /api/wishlist`
Создать новый список желаний

**Request Body:**

```json
{
  "name": "string",
  "accesslevelId": 1,
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

### Delete Wishlist

`DELETE /api/wishlist/:id`
Удалить список (только владелец)

**Path Parametrs:**

```makefile
  id (number)
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

---

## Wish Status

Для всех защищенных маршрутов требуется заголовок

```makefile
Authorization: Bearer <token>
```

Управлять статусами желания может только администратор

### List All Wish Statuses

`GET /api/wishstatus`
Получить все статусы желаний

**Responses:**

- 201:

```json
[
  { "id": 1, "name": "new" },
  { "id": 2, "name": "booked" },
  { "id": 3, "name": "completed" },
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

```makefile
  id (number)
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
  "message": "Статус желания не найден",
  "error": "Not Found"
}
```

### Create Wish Status

`POST /api/wishstatus`
Создать новый статус желания

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

### Update Wish status

`PATCH /api/wishstatus/:id`
Обновить название статуса желания 

**Path Parametrs:**

```makefile
  id (number)
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
  "message": "Статус желания не найден",
  "error": "Not Found"
}
```

### Delete Wish Status

`DELETE /api/wishstatus/:id`
Удалить статус желания

**Path Parametrs:**

```makefile
  id (number)
```

**Responses:**

- 201:

```json
{
  "message": "Статус удален"
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
  "message": "Статус желания не найден",
  "error": "Not Found"
}
```