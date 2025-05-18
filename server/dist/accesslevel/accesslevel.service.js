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
exports.AccesslevelService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const accesslevel_model_1 = require("./accesslevel.model");
let AccesslevelService = class AccesslevelService {
    accessLevelRepository;
    constructor(accessLevelRepository) {
        this.accessLevelRepository = accessLevelRepository;
    }
    async create(name) {
        const existing = await this.accessLevelRepository.findOne({ where: { name } });
        return this.accessLevelRepository.create({ name });
    }
};
exports.AccesslevelService = AccesslevelService;
exports.AccesslevelService = AccesslevelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(accesslevel_model_1.AccessLevel)),
    __metadata("design:paramtypes", [Object])
], AccesslevelService);
//# sourceMappingURL=accesslevel.service.js.map