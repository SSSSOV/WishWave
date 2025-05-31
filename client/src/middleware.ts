import { NextRequest, NextResponse } from "next/server"
import { parse } from "cookie"
import { jwtDecode } from "jwt-decode"
import { IJWT, IUser } from "./types/user"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const cookies = parse(request.headers.get("cookie") || "")
  const authToken = cookies.authToken

  // Защищаем все пути начинающиеся с /admin
  if (pathname.startsWith("/admin")) {
    if (!authToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Проверка роли пользователя
    const user = jwtDecode<IJWT>(authToken) // Ваша функция получения пользователя
    if (user?.roles.id !== 2) {
      return NextResponse.redirect(new URL("/403", request.url))
    }
  }

  return NextResponse.next()
}
