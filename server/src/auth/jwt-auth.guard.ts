import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Observable } from "rxjs"
import { Request } from "express"

interface AuthenticatedRequest extends Request {
  user: any // Или конкретный тип пользователя
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>()
    try {
      // 1. Пробуем получить токен из cookies (для браузерных запросов)
      const tokenFromCookies = req.cookies?.authToken

      // 2. Пробуем получить токен из заголовка Authorization (для API запросов)
      const authHeader = req.headers.authorization
      const tokenFromHeader = authHeader?.split(" ")[1]

      // 3. Определяем, какой токен использовать
      const token = tokenFromCookies || tokenFromHeader

      if (!token) {
        throw new UnauthorizedException({ message: "Пользователь не авторизован" })
      }

      const user = this.jwtService.verify(token)
      req.user = user
      return true
    } catch (e) {
      throw new UnauthorizedException({ message: "Пользователь не авторизован" })
    }
  }
}
