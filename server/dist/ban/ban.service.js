"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const ban_model_1 = require("./ban.model");
const users_model_1 = require("../users/users.model");
let BanService = class BanService {
    banRepository;
    userRepository;
    constructor(banRepository, userRepository) {
        this.banRepository = banRepository;
        this.userRepository = userRepository;
    }
    async banUser(userId, description) {
        const user = await this.userRepository.findByPk(userId);
        if (!user) {
            throw new common_1.NotFoundException('Пользователь не найден');
        }
        const ban = await this.banRepository.create({ description });
        await this.userRepository.update({ banId: ban.id }, { where: { id: userId } });
        return { message: `Пользователь ${user.login} забанен`, ban };
    }
};
exports.BanService = BanService;
exports.BanService = BanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(ban_model_1.Ban)),
    __param(1, (0, sequelize_1.InjectModel)(users_model_1.User)),
    __metadata("design:paramtypes", [Object, Object])
], BanService);
//# sourceMappingURL=ban.service.js.map