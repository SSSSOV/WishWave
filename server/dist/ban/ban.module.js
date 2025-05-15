"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanModule = void 0;
const common_1 = require("@nestjs/common");
const ban_service_1 = require("./ban.service");
const ban_controller_1 = require("./ban.controller");
const sequelize_1 = require("@nestjs/sequelize");
const ban_model_1 = require("./ban.model");
const users_model_1 = require("../users/users.model");
let BanModule = class BanModule {
};
exports.BanModule = BanModule;
exports.BanModule = BanModule = __decorate([
    (0, common_1.Module)({
        providers: [ban_service_1.BanService],
        controllers: [ban_controller_1.BanController],
        imports: [
            sequelize_1.SequelizeModule.forFeature([ban_model_1.Ban, users_model_1.User])
        ]
    })
], BanModule);
//# sourceMappingURL=ban.module.js.map