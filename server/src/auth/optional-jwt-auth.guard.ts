import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { JwtAuthGuard } from "./jwt-auth.guard"
import { firstValueFrom, Observable } from "rxjs"

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtGuard: JwtAuthGuard) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = await Promise.resolve(this.jwtGuard.canActivate(context))
      return result === true
    } catch {
      return true
    }
  }
}
