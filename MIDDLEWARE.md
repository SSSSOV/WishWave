Для ограничения доступа к страницам админки в Next.js приложении можно использовать несколько подходов. Вот комплексное решение:

### 1. Middleware (рекомендуемый способ для Next.js 12+)

Создайте файл `middleware.js` в корне проекта:

```javascript
import { NextResponse } from 'next/server'
import { parse } from 'cookie'

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const cookies = parse(request.headers.get('cookie') || '')
  const authToken = cookies.auth // или ваш токен

  // Защищаем все пути начинающиеся с /admin
  if (pathname.startsWith('/admin')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Проверка роли пользователя
    const user = await fetchUser(authToken) // Ваша функция получения пользователя
    if (user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/403', request.url))
    }
  }

  return NextResponse.next()
}
```

### 2. Higher-Order Component (HOC) для клиентских страниц

Создайте компонент `withAdminAuth.js`:

```javascript
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUnit } from 'effector-react'
import { $user } from '@/context/user'

export default function withAdminAuth(WrappedComponent) {
  return (props) => {
    const router = useRouter()
    const user = useUnit($user)

    useEffect(() => {
      if (!user) {
        router.push('/login')
      } else if (user.role !== 'admin') {
        router.push('/')
      }
    }, [user])

    if (!user || user.role !== 'admin') {
      return <div>Проверка доступа...</div>
    }

    return <WrappedComponent {...props} />
  }
}
```

Использование в страницах админки:
```javascript
import withAdminAuth from '@/hocs/withAdminAuth'

function AdminPage() {
  return <div>Админ панель</div>
}

export default withAdminAuth(AdminPage)
```

### 3. Серверная проверка (getServerSideProps)

Для страниц с SSR:

```javascript
export async function getServerSideProps(context) {
  const cookies = parse(context.req.headers.cookie || '')
  const authToken = cookies.auth

  if (!authToken) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const user = await fetchUser(authToken)
  if (user?.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return { props: {} }
}
```

### 4. Защита API-роутов

Создайте утилиту для проверки:

```javascript
// utils/adminAuth.js
import { NextApiRequest, NextApiResponse } from 'next'
import { parse } from 'cookie'

export const checkAdminAuth = async (req, res) => {
  const cookies = parse(req.headers.cookie || '')
  const authToken = cookies.auth

  if (!authToken) {
    res.status(401).json({ error: 'Не авторизован' })
    return false
  }

  const user = await fetchUser(authToken)
  if (user?.role !== 'admin') {
    res.status(403).json({ error: 'Доступ запрещен' })
    return false
  }

  return user
}
```

Использование в API:
```javascript
import { checkAdminAuth } from '@/utils/adminAuth'

export default async function handler(req, res) {
  const user = await checkAdminAuth(req, res)
  if (!user) return

  // Логика для админа
  res.status(200).json({ data: 'Секретные данные' })
}
```

### 5. Дополнительные меры безопасности

1. **Роли пользователей**:
   - Добавьте поле `role` в модель пользователя
   - Пример значений: 'user', 'moderator', 'admin'

2. **JWT-токены**:
   - Храните роль в токене
   - Проверяйте на сервере при каждом запросе

3. **Логирование доступа**:
   ```javascript
   // middleware.js
   console.log(`Attempt to access ${pathname} by ${user?.id}`)
   ```

4. **Ограничение по IP** (для особо важных роутов):
   ```javascript
   const allowedIPs = ['192.168.1.1']
   const ip = request.ip || request.headers.get('x-real-ip')
   
   if (!allowedIPs.includes(ip)) {
     return NextResponse.redirect(new URL('/403', request.url))
   }
   ```

### Важные замечания:

1. Всегда проверяйте права на сервере - клиентская проверка ненадежна
2. Используйте HTTPS для защиты cookie
3. Регулярно обновляйте зависимости
4. Логируйте попытки несанкционированного доступа

Выберите подход в зависимости от вашей архитектуры:
- Для статических страниц - HOC + Middleware
- Для SSR - getServerSideProps
- Для API-роутов - серверная проверка

Комбинация этих методов обеспечит надежную защиту админ-панели.
