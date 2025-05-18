import axios from "axios";

const $host = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL, // Базовый URL сервера
  timeout: 5000,
});

const $authHost = axios.create({
  baseURL: "https://your-api-server.com/api", // Базовый URL сервера
  timeout: 5000,
});

// Добавляем интерсептор для авторизации
$authHost.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { $host, $authHost };

/*
  API Routes:

    Х [GET /wishes] - Получить все желания (Не делать, поскольку скорее всего не будет использоваться)
    [GET /wishes?listId=1] - Получить желания из списка с id = 1
    [GET /wishes/1] - Получить желание с id = 1
    [POST /wishes] (with body) - Создать желание из body
    Х [PUT /wishes/1] (with body) - Поместить желание под индекс id = 1 (Пока не делать)
    [PATCH /wishes/1] (with body) - Изменить желание с id = 1

    Х [GET /lists] - Получить все списки (Не делать, поскольку скорее всего не будет использоваться)
    [GET /lists?userId=1] - Получить списки принадлежащие пользователю с id = 1
    [GET /lists/1] - Получить список с id = 1
    [POST /lists] (with body) - Создать список из body
    Х [PUT /lists/1] (with body) - Поместить список под индекс id = 1 (Пока не делать)
    [PATCH /lists/1] (with body) - Изменить список с id = 1

    Х [GET /users] - Получить всех пользователей (Не делать, поскольку скорее всего не будет использоваться)
    [GET /users/1] - Получить пользователя с id = 1
    [POST /users] (with body) - Создать пользователя
    Х [PUT /users/1] (with body) - Поместить пользователя под индекс id = 1 (Пока не делать)
    [PATCH /users/1] (with body) - Изменить пользователя с id = 1

*/
