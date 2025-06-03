import {BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Param,ParseIntPipe,Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common"
import { UsersService } from "./users.service"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { UserResponseDto } from "./dto/user-response.dto"
import { FileInterceptor } from "@nestjs/platform-express"
import { FileService } from "src/file/file.service"
import { UpdateUserDto } from "./dto/update-user.dto"
import { ChangePasswordDto } from "./dto/change-password.dto"
import { FriendService } from "src/friend/friend.service"
import { AuthService } from "src/auth/auth.service"

@Controller("user")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private fileService: FileService,
    private readonly friendService: FriendService,
    private readonly authService: AuthService
  ) {}


  @UseGuards(JwtAuthGuard)
  @Get("all")
  async getAll(
    @Req() req,
    @Query("page") page = "1",
    @Query("limit") limit = "20"
  ): Promise<{ data: Omit<UserResponseDto, "wishlist">[]; page: number; perPage: number; total: number; totalPages: number }> {
    if (req.user.roles?.value !== "admin") {
      throw new ForbiddenException("У вас нет прав, чтобы посмотреть всех пользователей")
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1)
    const perPage = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100)
    const { rows, count } = await this.usersService.getAllUsers(pageNum, perPage)

    const data = rows.map((u) => {
      const plain = u.get({ plain: true }) as any
      const { password, wishlist, ...rest } = plain
      return rest as Omit<UserResponseDto, "wishlist">
    })

    return { data, page: pageNum, perPage, total: count, totalPages: Math.ceil(count / perPage) }
  }

  @UseGuards(JwtAuthGuard)
  @Get("checkAuth")
  checkAuth(): void {}


    @UseGuards(JwtAuthGuard)
    @Get()
    async getSelf(@Req() req): Promise<Omit<UserResponseDto, "wishlist">> {
        const me = req.user.id;
        const user = await this.usersService.getUserById(me);
        const { password, wishlist, ...rest } = user.get({ plain: true }) as any;
        return rest;
    }



  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getById(@Param("id", ParseIntPipe) id: number, @Req() req): Promise<Omit<UserResponseDto, "wishlist"> & { isFriend: boolean }> {
    const viewerId = req.user.id
    const viewerRole = req.user.roles?.value
    const isOwner = viewerRole === "admin" || viewerId === id
    let isFriend = false
    if (!isOwner) {
      isFriend = await this.friendService.areFriends(viewerId, id)
      if (!isFriend) {
        throw new ForbiddenException("Профиль доступен только друзьям")
      }
    } else {
      isFriend = true
    }

    const user = await this.usersService.getUserById(id)
    const { password, wishlist, ...rest } = user.get({ plain: true }) as any

    return { ...rest, isFriend }
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async removeSelf(@Req() req): Promise<{ message: string }> {
    const id = req.user.id
    return this.usersService.deleteUserById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async removeUser(@Param("id", ParseIntPipe) id: number, @Req() req): Promise<{ message: string }> {
    if (req.user.roles?.value !== "admin") {
      throw new ForbiddenException("У вас нет прав для удаления других пользователей")
    }
    return this.usersService.deleteUserById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch("password")
  async changeOwnPassword(@Body() dto: ChangePasswordDto, @Req() req) {
    const userId = req.user.id
    await this.usersService.updatePassword(userId, dto.oldPassword, dto.newPassword)

    return { message: "Пароль успешно изменен" }
  }

  @UseGuards(JwtAuthGuard)
  @Patch("password/:id")
  async changePassword(@Param("id", ParseIntPipe) id: number, @Body() dto: ChangePasswordDto, @Req() req) {
    if (req.user.roles?.value !== "admin") {
      throw new ForbiddenException("Нет прав для изменения пароля у другого пользователя")
    }

    await this.usersService.forceChangePassword(id, dto.newPassword)
    return { message: "Пароль успешно изменен" }
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @UseInterceptors(FileInterceptor("image", { limits: { fileSize: 2 * 1024 * 1024 } }))
  async updateSelf(@UploadedFile() image: Express.Multer.File, @Body() dto: UpdateUserDto, @Req() req): Promise<Omit<UserResponseDto, "wishlists">> {
    const me = req.user.id
    const updated = await this.usersService.updateUser(me, dto, image)
    const plain = updated.get({ plain: true }) as any
    const { password, wishlist, ...rest } = plain
    return rest
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @UseInterceptors(FileInterceptor("image", { limits: { fileSize: 2 * 1024 * 1024 } }))
  async updateUser(
    @Param("id", ParseIntPipe) id: number | null,
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: UpdateUserDto,
    @Req() req
  ): Promise<Omit<UserResponseDto, "wishlists">> {
    const targetId = id ?? req.user.id
    if (req.user.roles?.value !== "admin") {
      throw new ForbiddenException("У вас нет прав редактировать этот профиль")
    }
    const updated = await this.usersService.updateUser(targetId, dto, image)
    const plain = updated.get({ plain: true }) as any
    const { password, wishlist, ...rest } = plain
    return rest
  }
}
