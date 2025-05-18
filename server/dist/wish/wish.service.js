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
let WishService = class WishService {
    wishRepository;
    fileService;
    constructor(wishRepository, fileService) {
        this.wishRepository = wishRepository;
        this.fileService = fileService;
    }
    async create(dto, image) {
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
        const wish = await this.wishRepository.create(data);
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
};
exports.WishService = WishService;
exports.WishService = WishService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(wish_model_1.Wish)),
    __metadata("design:paramtypes", [Object, file_service_1.FileService])
], WishService);
//# sourceMappingURL=wish.service.js.map