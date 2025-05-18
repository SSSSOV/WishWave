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
exports.WishService = void 0;
const common_1 = require("@nestjs/common");
const wish_model_1 = require("./wish.model");
const sequelize_1 = require("@nestjs/sequelize");
const file_service_1 = require("../file/file.service");
const wishlist_wish_model_1 = require("../wishlist/wishlist-wish.model");
let WishService = class WishService {
    wishRepository;
    fileService;
    wishListWishRepository;
    constructor(wishRepository, fileService, wishListWishRepository) {
        this.wishRepository = wishRepository;
        this.fileService = fileService;
        this.wishListWishRepository = wishListWishRepository;
    }
    async create(dto, image, listId) {
        let fileName = null;
        if (image) {
            fileName = await this.fileService.createFile(image);
        }
        else if (dto.image && dto.image.startsWith('http')) {
            fileName = await this.fileService.downloadImage(dto.image);
        }
        const data = { ...dto };
        if (fileName) {
            data.image = fileName;
        }
        data.wishStatusId = 1;
        const wish = await this.wishRepository.create(data);
        await this.wishListWishRepository.create({ wishlistId: listId, wishId: wish.id });
        return wish;
    }
    async getAll() {
        return await this.wishRepository.findAll();
    }
    async findById(id) {
        const wish = await this.wishRepository.findByPk(id);
        if (!wish) {
            throw new common_1.NotFoundException(`Желание с id ${id} не было найдено`);
        }
        return wish;
    }
    async update(id, dto) {
        const wish = await this.wishRepository.findByPk(id);
        if (!wish) {
            throw new common_1.NotFoundException(`Желание с id ${id} не было найдено`);
        }
        await wish.update(dto);
        return wish;
    }
    async delete(id) {
        const wish = await this.findById(id);
        await wish.destroy();
    }
    async bookWish(wishId, userId) {
        const wish = await this.findById(wishId);
        if (wish.bookedByUserId != null) {
            throw new common_1.BadRequestException(`Желание с id ${wishId} уже забронировано`);
        }
        wish.wishStatusId = 2;
        wish.bookedByUserId = userId;
        return await wish.save();
    }
    async unbookWish(wishId, userId) {
        const wish = await this.findById(wishId);
        if (wish.bookedByUserId == null) {
            throw new common_1.BadRequestException(`Желание с id ${wishId} не забронировано или бронь уже снята`);
        }
        if (wish.bookedByUserId !== userId) {
            throw new common_1.BadRequestException(`Вы не можете снять бронь, т.к. не являетесь её владельцем`);
        }
        wish.wishStatusId = 1;
        wish.bookedByUserId = null;
        return await wish.save();
    }
};
exports.WishService = WishService;
exports.WishService = WishService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(wish_model_1.Wish)),
    __param(2, (0, sequelize_1.InjectModel)(wishlist_wish_model_1.WishListWish)),
    __metadata("design:paramtypes", [Object, file_service_1.FileService, Object])
], WishService);
//# sourceMappingURL=wish.service.js.map