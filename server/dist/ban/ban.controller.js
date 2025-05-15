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
exports.BanController = void 0;
const common_1 = require("@nestjs/common");
const ban_service_1 = require("./ban.service");
const ban_user_dto_1 = require("./dto/ban-user.dto");
let BanController = class BanController {
    banService;
    constructor(banService) {
        this.banService = banService;
    }
    banUser(dto) {
        return this.banService.banUser(dto.userId, dto.description);
    }
};
exports.BanController = BanController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ban_user_dto_1.BanUserDto]),
    __metadata("design:returntype", void 0)
], BanController.prototype, "banUser", null);
exports.BanController = BanController = __decorate([
    (0, common_1.Controller)('ban'),
    __metadata("design:paramtypes", [ban_service_1.BanService])
], BanController);
//# sourceMappingURL=ban.controller.js.map