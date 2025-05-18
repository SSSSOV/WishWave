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
exports.WishController = void 0;
const common_1 = require("@nestjs/common");
const wish_service_1 = require("./wish.service");
const create_wish_dto_1 = require("./dto/create-wish.dto");
const platform_express_1 = require("@nestjs/platform-express");
let WishController = class WishController {
    wishService;
    constructor(wishService) {
        this.wishService = wishService;
    }
    createWish(dto, image) {
        return this.wishService.create(dto, image);
    }
    getAllWishes() {
        return this.wishService.getAll();
    }
    async getWIshById(id) {
        return this.wishService.findById(id);
    }
    async updateWish(id, dto) {
        return this.wishService.update(id, dto);
    }
};
exports.WishController = WishController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_wish_dto_1.CreateWishDto, Object]),
    __metadata("design:returntype", void 0)
], WishController.prototype, "createWish", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WishController.prototype, "getAllWishes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WishController.prototype, "getWIshById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], WishController.prototype, "updateWish", null);
exports.WishController = WishController = __decorate([
    (0, common_1.Controller)('wish'),
    __metadata("design:paramtypes", [wish_service_1.WishService])
], WishController);
//# sourceMappingURL=wish.controller.js.map