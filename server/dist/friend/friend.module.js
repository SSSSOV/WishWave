"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendModule = void 0;
const common_1 = require("@nestjs/common");
const friend_service_1 = require("./friend.service");
const friend_controller_1 = require("./friend.controller");
const sequelize_1 = require("@nestjs/sequelize");
const friend_model_1 = require("./friend.model");
const users_model_1 = require("../users/users.model");
const friend_users_model_1 = require("./friend-users.model");
const friendstatus_model_1 = require("../friendstatus/friendstatus.model");
let FriendModule = class FriendModule {
};
exports.FriendModule = FriendModule;
exports.FriendModule = FriendModule = __decorate([
    (0, common_1.Module)({
        providers: [friend_service_1.FriendService],
        controllers: [friend_controller_1.FriendController],
        imports: [
            sequelize_1.SequelizeModule.forFeature([friend_model_1.Friend, users_model_1.User, friend_users_model_1.FriendUsers, friendstatus_model_1.FriendStatus]),
        ]
    })
], FriendModule);
//# sourceMappingURL=friend.module.js.map