"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./users/users.module");
const roles_module_1 = require("./roles/roles.module");
const ban_module_1 = require("./ban/ban.module");
const friend_module_1 = require("./friend/friend.module");
const wishlist_module_1 = require("./wishlist/wishlist.module");
const friendstatus_module_1 = require("./friendstatus/friendstatus.module");
const accesslevel_module_1 = require("./accesslevel/accesslevel.module");
const wish_module_1 = require("./wish/wish.module");
const wishstatus_module_1 = require("./wishstatus/wishstatus.module");
const wishstatus_model_1 = require("./wishstatus/wishstatus.model");
const wish_model_1 = require("./wish/wish.model");
const wishlist_wish_model_1 = require("./wishlist/wishlist-wish.model");
const wishlist_model_1 = require("./wishlist/wishlist.model");
const accesslevel_model_1 = require("./accesslevel/accesslevel.model");
const users_model_1 = require("./users/users.model");
const friend_users_model_1 = require("./friend/friend-users.model");
const friend_model_1 = require("./friend/friend.model");
const ban_model_1 = require("./ban/ban.model");
const roles_model_1 = require("./roles/roles.model");
const friendstatus_model_1 = require("./friendstatus/friendstatus.model");
const auth_module_1 = require("./auth/auth.module");
const file_module_1 = require("./file/file.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [],
        providers: [],
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: `.${process.env.NODE_ENV}.env`
            }),
            sequelize_1.SequelizeModule.forRoot({
                dialect: 'postgres',
                host: process.env.POSTGRES_HOST,
                port: Number(process.env.POSTGRES_PORT),
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DB,
                models: [wishstatus_model_1.WishStatus, wish_model_1.Wish, wishlist_wish_model_1.WishListWish, wishlist_model_1.WishList, accesslevel_model_1.AccessLevel, users_model_1.User, friend_users_model_1.FriendUsers, friend_model_1.Friend, ban_model_1.Ban, roles_model_1.Role, friendstatus_model_1.FriendStatus],
                autoLoadModels: true
            }),
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            ban_module_1.BanModule,
            friend_module_1.FriendModule,
            wishlist_module_1.WishlistModule,
            friendstatus_module_1.FriendstatusModule,
            accesslevel_module_1.AccesslevelModule,
            wish_module_1.WishModule,
            wishstatus_module_1.WishstatusModule,
            auth_module_1.AuthModule,
            file_module_1.FileModule,
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map