import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // const authToken = localStorage.getItem("auth") || "" // или ваш токен

  // Защищаем все пути начинающиеся с /admin
  if (pathname.startsWith("/admin")) {
    // if (!authToken) {
    //   return NextResponse.redirect(new URL("/login", request.url))
    // }
    // Проверка роли пользователя
    // const user = await fetchUserFx(null) // Ваша функция получения пользователя
    // if (user?.roleId !== 2) {
    //   return NextResponse.redirect(new URL("/403", request.url))
    // }
  }

  return NextResponse.next()
}
