Переход с хранения токена в `localStorage` на HTTP-only cookies требует изменений как на сервере (Nest.js), так и на клиенте (Next.js). Вот пошаговое руководство:

---

### 🔐 **1. Настройка сервера (Nest.js)**

#### Установите нужные пакеты
```bash
npm install cookie-parser @types/cookie-parser
```

#### Подключите `cookie-parser` в `main.ts`
```typescript
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await app.listen(3000);
}
```

#### Модифицируйте Auth Controller
Раньше:
```typescript
@Post('login')
async login(@Body() dto: LoginDto) {
  const { token } = await this.authService.login(dto);
  return { token }; // Отправка в теле ответа
}
```

Теперь:
```typescript
@Post('login')
async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
  const { token, user } = await this.authService.login(dto);
  
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
    path: '/',
  });

  return { user }; // Возвращаем только пользователя
}
```

#### Добавьте logout endpoint
```typescript
@Post('logout')
async logout(@Res({ passthrough: true }) res: Response) {
  res.clearCookie('authToken');
  return { success: true };
}
```

---

### 🌐 **2. Настройка клиента (Next.js)**

#### Модифицируйте логику авторизации
Раньше:
```typescript
const res = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
const { token } = await res.json();
localStorage.setItem('authToken', token);
```

Теперь:
```typescript
const res = await fetch('/api/auth/login', {
  method: 'POST',
  credentials: 'include', // Важно для cookies!
  body: JSON.stringify({ email, password })
});
const { user } = await res.json();
// Токен теперь в cookie, не нужно ничего сохранять
```

#### Создайте хук для проверки аутентификации
```typescript
// hooks/useAuth.ts
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  return { user };
};
```

#### Добавьте API route в Next.js для проверки auth
```typescript
// pages/api/auth/me.ts
export default async function handler(req, res) {
  const cookies = req.cookies;
  const token = cookies.authToken;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Проверка токена на сервере Nest.js
    const userResponse = await fetch('http://your-nest-server:3000/auth/validate', {
      headers: {
        Cookie: `authToken=${token}`
      }
    });
    
    const userData = await userResponse.json();
    res.status(200).json({ user: userData });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

---

### 🔄 **3. Защита роутов**

#### Middleware для защищенных страниц
```typescript
// middleware.ts
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = request.cookies.get('authToken')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

#### Пример защищенной страницы
```typescript
// pages/dashboard.tsx
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return <div>Welcome, {user.name}!</div>;
}
```

---

### 🛡️ **4. Дополнительная защита**

#### CSRF защита
1. Генерируйте CSRF-токен на сервере:
```typescript
// В Nest.js контроллере
const csrfToken = generateRandomToken();
res.cookie('csrfToken', csrfToken, { httpOnly: true, secure: true });
```

2. Добавляйте в формы:
```html
<input type="hidden" name="_csrf" value={csrfToken} />
```

3. Проверяйте на сервере:
```typescript
@Post('protected')
async protectedRoute(
  @Body() body: { _csrf: string },
  @Cookies('csrfToken') csrfToken: string
) {
  if (body._csrf !== csrfToken) {
    throw new UnauthorizedException('Invalid CSRF token');
  }
  // ...
}
```

---

### 🔧 **5. Миграция существующих пользователей**

Добавьте временный код для переноса токенов:
```typescript
useEffect(() => {
  // Только для миграции
  const lsToken = localStorage.getItem('authToken');
  if (lsToken) {
    fetch('/api/auth/migrate', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ token: lsToken })
    }).then(() => {
      localStorage.removeItem('authToken');
    });
  }
}, []);
```

---

### ⚠️ **Важные замечания**
1. Убедитесь, что все API-запросы включают `credentials: 'include'`
2. В production обязательно используйте HTTPS
3. Настройте CORS на сервере Nest.js:
```typescript
app.enableCors({
  origin: process.env.CLIENT_URL,
  credentials: true,
});
```

4. Для локального тестирования:
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Это решение обеспечит:
- Безопасное хранение токенов
- Автоматическую отправку учетных данных
- Защиту от XSS/CSRF атак
- Совместимость с SSR
