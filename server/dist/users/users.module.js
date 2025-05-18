"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const sequelize_1 = require("@nestjs/sequelize");
const users_model_1 = require("./users.model");
const roles_model_1 = require("../roles/roles.model");
const friend_model_1 = require("../friend/friend.model");
const friend_users_model_1 = require("../friend/friend-users.model");
const ban_model_1 = require("../ban/ban.model");
const wishlist_model_1 = require("../wishlist/wishlist.model");
const roles_module_1 = require("../roles/roles.module");
const wish_model_1 = require("../wish/wish.model");
const auth_module_1 = require("../auth/auth.module");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        imports: [
            sequelize_1.SequelizeModule.forFeature([users_model_1.User, friend_model_1.Friend, friend_users_model_1.FriendUsers, ban_model_1.Ban, roles_model_1.Role, wishlist_model_1.WishList, wish_model_1.Wish]),
            roles_module_1.RolesModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        exports: [
            users_service_1.UsersService,
        ]
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map