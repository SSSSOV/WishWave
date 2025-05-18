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
exports.WishstatusService = void 0;
const common_1 = require("@nestjs/common");
const wishstatus_model_1 = require("./wishstatus.model");
const sequelize_1 = require("@nestjs/sequelize");
let WishstatusService = class WishstatusService {
    wishStatusRepository;
    constructor(wishStatusRepository) {
        this.wishStatusRepository = wishStatusRepository;
    }
    async create(dto) {
        return this.wishStatusRepository.create(dto);
    }
    async getAll() {
        return this.wishStatusRepository.findAll({ include: { all: true } });
    }
    async getById(id) {
        const status = await this.wishStatusRepository.findByPk(id);
        if (!status) {
            throw new common_1.NotFoundException(`Статус желания с id ${id} не найден`);
        }
        return status;
    }
};
exports.WishstatusService = WishstatusService;
exports.WishstatusService = WishstatusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(wishstatus_model_1.WishStatus)),
    __metadata("design:paramtypes", [Object])
], WishstatusService);
//# sourceMappingURL=wishstatus.service.js.map