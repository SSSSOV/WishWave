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
const users_module_1 = require("./users/users.module");
const config_1 = require("@nestjs/config");
const users_model_1 = require("./users/users.model");
const roles_module_1 = require("./roles/roles.module");
const roles_model_1 = require("./roles/roles.model");
const ban_module_1 = require("./ban/ban.module");
const friend_module_1 = require("./friend/friend.module");
const wishlist_module_1 = require("./wishlist/wishlist.module");
const friendstatus_module_1 = require("./friendstatus/friendstatus.module");
const accesslevel_module_1 = require("./accesslevel/accesslevel.module");
const wish_module_1 = require("./wish/wish.module");
const wishstatus_module_1 = require("./wishstatus/wishstatus.module");
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
                models: [users_model_1.User, roles_model_1.Role],
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
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map