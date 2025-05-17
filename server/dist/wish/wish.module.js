"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishModule = void 0;
const common_1 = require("@nestjs/common");
const wish_service_1 = require("./wish.service");
const wish_controller_1 = require("./wish.controller");
const sequelize_1 = require("@nestjs/sequelize");
const wish_model_1 = require("./wish.model");
const wishlist_model_1 = require("../wishlist/wishlist.model");
const wishlist_wish_model_1 = require("../wishlist/wishlist-wish.model");
const wishstatus_model_1 = require("../wishstatus/wishstatus.model");
const file_module_1 = require("../file/file.module");
let WishModule = class WishModule {
};
exports.WishModule = WishModule;
exports.WishModule = WishModule = __decorate([
    (0, common_1.Module)({
        providers: [wish_service_1.WishService],
        controllers: [wish_controller_1.WishController],
        imports: [
            sequelize_1.SequelizeModule.forFeature([wish_model_1.Wish, wishlist_model_1.WishList, wishlist_wish_model_1.WishListWish, wishstatus_model_1.WishStatus]),
            file_module_1.FileModule
        ]
    })
], WishModule);
//# sourceMappingURL=wish.module.js.map