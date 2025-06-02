// src/auth/auth.service.ts
import {Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createUserDto } from "src/users/dto/create-user.dto";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcryptjs";
import { LoginUserDto } from "src/users/dto/login-user.dto";
import { ProfanityService } from "src/profanity/profanity.service";
import { InjectModel } from "@nestjs/sequelize";
import { PendingUser } from "./pending-user.model";
import { Op } from "sequelize";
import { MailerService } from "src/mailer/mailer.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly profanity: ProfanityService,
    private readonly mailerService: MailerService,
    @InjectModel(PendingUser) private readonly pendingRepo: typeof PendingUser,
  ) {}

  async registration(userDto: createUserDto) {
    const { login, email, password } = userDto;

    if (
      this.profanity.containsProfanity(login) ||
      this.profanity.containsProfanity(email)
    ) {
      throw new BadRequestException("В тексте найдены запрещенные слова");
    }

    const existUserByEmail = await this.userService.getUserByEmail(email);
    if (existUserByEmail) {
      throw new BadRequestException("Пользователь с таким email уже существует");
    }
    const existUserByLogin = await this.userService.getUserByLogin(login);
    if (existUserByLogin) {
      throw new BadRequestException("Пользователь с таким login уже существует");
    }

    const existPending = await this.pendingRepo.findOne({
      where: { [Op.or]: [{ login }, { email }] },
    });
    if (existPending) {
      await existPending.destroy();
    }

    const passwordHash = await bcrypt.hash(password, 5);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await this.pendingRepo.create({
      login,
      email,
      passwordHash,
      code,
      expiresAt,
    });

    try {
      await this.mailerService.sendVerificationEmail(email, code);
    } catch (e) {
      await this.pendingRepo.destroy({ where: { email } });
      throw new InternalServerErrorException("Не удалось отправить код подтверждения");
    }

    return {
      message: "Код подтверждения отправлен на ваш email. Введите код для завершения регистрации.",
    };
  }

  async verifyEmail(loginOrEmail: string, code: string) {
    const pending = await this.pendingRepo.findOne({
      where: {
        [Op.or]: [{ login: loginOrEmail }, { email: loginOrEmail }],
        code,
      },
    });
    if (!pending) {
      throw new BadRequestException("Неверный логин/email или код подтверждения");
    }

    if (pending.expiresAt.getTime() < Date.now()) {
      await pending.destroy();
      throw new BadRequestException("Срок действия кода истёк. Зарегистрируйтесь заново.");
    }

    const newUser = await this.userService.createUser({
      login: pending.login,
      email: pending.email,
      password: pending.passwordHash,
    } as any);

    await pending.destroy();

    return this.generateToken(newUser);
  }

  async login(userDto: LoginUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  private async generateToken(user: any) {
    const payload = {
      login: user.login,
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      roles: user.role,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: LoginUserDto) {
    let user = await this.userService.getUserByEmail(userDto.loginOrEmail);
    if (!user) {
      user = await this.userService.getUserByLogin(userDto.loginOrEmail);
    }
    if (!user) {
      throw new UnauthorizedException("Некорректный email, логин или пароль");
    }
    const passwordEquals = await bcrypt.compare(userDto.password, user.password);
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException("Некорректный email, логин или пароль");
  }
}
