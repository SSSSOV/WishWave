# Документация к клиентской части приложения

## Интерфейсы системы желаний

### IWish - Основной интерфейс желания

```typescript
export interface IWish {
  id: number;
  name: string;
  price?: number;
  productLink?: string;
  image?: string;
  userId: number;
  wishStatusId: number;
  bookedByUserId?: number;
}
```

### ICreateWish - Интерфейс создания желания

```typescript
export interface ICreateWish {
  name: string;
  price?: number;
  productLink?: string;
  image?: string;
}
```

### IUpdateWish - Интерфейс редактирования желания

```typescript
export interface IUpdateWish {
  id: number;
  name?: string;
  price?: number;
  productLink?: string;
  image?: string;
}
```

### IFetchWish - Интерфейс получения желания

```typescript
export interface IFetchWish {
  id: number;
  shareToken?: string;
}
```

### Описание полей

- **id** - уникальный идентификатор записи в системе
- **name** - название желания
- **price** - цена желания
- **productLink** - ссылка на товар
- **image** - изображение желания
- **userId** - идентификатор владельца желания
- **wishStatusId** - идентификатор статуса бронирования
- **bookedByUserId** - идентификатор пользователя, осуществившего бронирование
- **shareToken** - токен для совместного доступа к желанию

### Рекомендации по использованию

- При создании нового желания использовать **ICreateWish**
- При редактировании существующего желания использовать **IUpdateWish**
- При получении информации о желании использовать **IFetchWish**
- Для работы с полным набором данных использовать **IWish**
