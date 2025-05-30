import { Body, Controller, Post, Res } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { createUserDto } from "src/users/dto/create-user.dto"
import { AuthService } from "./auth.service"
import { LoginUserDto } from "src/users/dto/login-user.dto"
import { Response } from "express"

@ApiTags("Авторизация")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/login")
  async login(@Body() userDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.authService.login(userDto)

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 день
      path: "/",
      domain: process.env.CLIENT_DOMAIN,
    })

    return { token }
  }

  @Post("/registration")
  async registartion(@Body() userDto: createUserDto, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.authService.registartion(userDto)

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 день
      path: "/",
      domain: process.env.CLIENT_DOMAIN,
    })

    return { token }
  }
}
