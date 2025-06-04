import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common"
import { User } from "./users.model"
import { InjectModel } from "@nestjs/sequelize"
import { createUserDto } from "./dto/create-user.dto"
import { RolesService } from "src/roles/roles.service"
import { Wish } from "src/wish/wish.model"
import { WishStatus } from "src/wishstatus/wishstatus.model"
import { WishList } from "src/wishlist/wishlist.model"
import { FileService } from "src/file/file.service"
import { UpdateUserDto } from "./dto/update-user.dto"
import * as bcrypt from "bcryptjs"
import { UserResponseDto } from "./dto/user-response.dto"
import { ProfanityService } from "src/profanity/profanity.service"
import { AccessLevel } from "src/accesslevel/accesslevel.model"
import { Sequelize } from 'sequelize-typescript';
import { FriendService } from "src/friend/friend.service"
import { WishListWish } from "src/wishlist/wishlist-wish.model"
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
    private fileService: FileService,
    private readonly profanity: ProfanityService,
    private readonly sequelize: Sequelize,
    private readonly friendService: FriendService,
    @InjectModel(WishList) private readonly wishListRepository: typeof WishList,
    @InjectModel(WishListWish) private readonly wishListWishRepository: typeof WishListWish,
    @InjectModel(Wish) private readonly wishRepository: typeof Wish,
  ) {}

  async createUser(dto: createUserDto) {
    if (this.profanity.containsProfanity(dto.login) || this.profanity.containsProfanity(dto.email)) {
      throw new BadRequestException("В тексте найдены запрещенные слова")
    }

    const role = await this.roleService.getRoleByValue("user")

    if (!role) {
      throw new Error('Роль "user" не найдена')
    }

    const user = await this.userRepository.create({ ...dto, roleId: role.id })

    user.role = role

    return user
  }

  private normalizeData(input?: string): string | undefined {
    if (!input) {
      return undefined
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      return input
    }

    const match = input.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
    if (!match) {
      throw new BadRequestException(`Неподдерживаемый формат даты. Ожидается dd.mm.yyyy`)
    }

    const [, dd, mm, yyyy] = match
    return `${yyyy}-${mm}-${dd}`
  }

  async updateUser(id: number, dto: UpdateUserDto, image?: Express.Multer.File): Promise<User> {
    const user = await this.userRepository.findByPk(id)
    if (!user) {
      throw new Error("Пользователь не найден")
    }

    const updatedData: any = {}
    if ("fullname" in dto) {
      if (dto.fullname && this.profanity.containsProfanity(dto.fullname)) {
        throw new BadRequestException("Обнаружены запрещенные слова")
      }
      updatedData.fullname = dto.fullname
    }
    if ("birthDate" in dto) {
      updatedData.birthDate = dto.birthDate ? this.normalizeData(dto.birthDate) : null
    }
    if ("phone" in dto) {
      updatedData.phone = dto.phone
    }
    if ("gender" in dto) {
      updatedData.gender = dto.gender
    }
    if ("socials" in dto) {
      if (dto.socials) {
        for (const value of Object.values(dto.socials)) {
          if (typeof value === "string" && this.profanity.containsProfanity(value)) {
            throw new BadRequestException("Обнаружены запрещенные слова")
          }
        }
      }
      updatedData.socials = dto.socials
    }
    if (image) {
      const fileName = await this.fileService.createFile(image)
      if (user.image) {
        await this.fileService.deleteFile(user.image)
      }
      updatedData.image = fileName
    } else if ("image" in dto) {
      if (dto.image === null) {
        updatedData.image = null
      } else if (typeof dto.image === "string" && dto.image.startsWith("http")) {
        const fileName = await this.fileService.downloadImage(dto.image)
        if (user.image) {
          await this.fileService.deleteFile(user.image)
        }
        updatedData.image = fileName
      }
    }

    await user.update(updatedData)
    return user
  }

  async getAllUsers(page: number, perPage: number) {
    const offset = (page - 1) * perPage
    const result = await this.userRepository.findAndCountAll({
      attributes: [
        "id",
        "login",
        "email",
        "fullname",
        "image",
        "birthDate",
        "phone",
        "gender",
        "socials",
        "roleId",
        "banId",
        "createdAt",
        "updatedAt",
      ],
      limit: perPage,
      offset,
      order: [["id", "ASC"]],
    })

    return result
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: WishList,
          as: "wishlist",
          include: [
            {
              model: AccessLevel,
              as: "accesslevel",
              attributes: ["id", "name"],
            },
            {
              model: Wish,
              through: { attributes: [] },
              include: [
                {
                  model: WishStatus,
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
    })
    if (!user) {
      throw Error("пользователь не найден (id)")
    }
    return user
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email }, include: { all: true } })
    return user
  }

  async getUserByLogin(login: string) {
    const user = await this.userRepository.findOne({ where: { login }, include: { all: true } })
    return user
  }

  async deleteUserById(userId: number): Promise<{ message: string }> {
    const transaction = await this.sequelize.transaction();
    try {
      const user = await this.userRepository.findByPk(userId, { transaction });
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      const oldImage = user.image;

      await this.friendService.removeAllForUser(userId, { transaction });

      const wishlists = await this.wishListRepository.findAll({
        where: { userId },
        transaction,
      });

      for (const wl of wishlists) {
        const links = await this.wishListWishRepository.findAll({
          where: { wishlistId: wl.id },
          transaction,
        });

        await this.wishListWishRepository.destroy({
          where: { wishlistId: wl.id },
          transaction,
        });

        for (const link of links) {
          const otherLinks = await this.wishListWishRepository.count({
            where: { wishId: link.wishId, wishlistId: { [Op.ne]: wl.id } },
            transaction,
          });

          if (!otherLinks) {
            await this.wishRepository.destroy({
              where: { id: link.wishId },
              transaction,
            });
          }
        }

        await this.wishListRepository.destroy({
          where: { id: wl.id },
          transaction,
        });
      }

      await user.destroy({ transaction });

      if (oldImage) {
        await this.fileService.deleteFile(oldImage);
      }

      await transaction.commit();
      return { message: 'Пользователь и все связанные данные успешно удалены' };
    } catch (err) {
      await transaction.rollback();
      if (err instanceof NotFoundException) throw err;
      console.error('deleteUserById failed:', err);
      throw new HttpException('Ошибка при удалении пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findByPk(userId)
    if (!user) {
      throw new BadRequestException("Пользователь не найден")
    }

    const matches = await bcrypt.compare(oldPassword, user.password)
    if (!matches) {
      throw new BadRequestException("Старый пароль неверен")
    }

    const hash = await bcrypt.hash(newPassword, 10)
    await user.update({ password: hash })
  }

  async forceChangePassword(userId: number, newPassword: string): Promise<void> {
    const user = await this.userRepository.findByPk(userId)
    if (!user) {
      throw new BadRequestException("Пользователь не найден")
    }

    const hash = await bcrypt.hash(newPassword, 10)
    await user.update({ password: hash })
  }

  async getProfileDto(id: number): Promise<UserResponseDto> {
    const user = await this.getUserById(id)
    const plain = user.get({ plain: true }) as any
    const { password, wishlist, ...rest } = plain

    return {
      ...rest,
      wishlists: Array.isArray(wishlist)
        ? wishlist.map((l: any) => ({ id: l.id, name: l.name, description: l.description, eventDate: l.eventDate, accesslevelId: l.accesslevelId }))
        : [],
    }
  }
}
