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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishListWish = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const wishlist_model_1 = require("./wishlist.model");
const wish_model_1 = require("../wish/wish.model");
let WishListWish = class WishListWish extends sequelize_typescript_1.Model {
    wishlistid;
    wishid;
};
exports.WishListWish = WishListWish;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], WishListWish.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => wishlist_model_1.WishList),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], WishListWish.prototype, "wishlistid", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => wish_model_1.Wish),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], WishListWish.prototype, "wishid", void 0);
exports.WishListWish = WishListWish = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'wishlist_wish', createdAt: false, updatedAt: false })
], WishListWish);
//# sourceMappingURL=wishlist-wish.model.js.map