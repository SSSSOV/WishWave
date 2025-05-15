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
exports.Wish = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const wishlist_wish_model_1 = require("../wishlist/wishlist-wish.model");
const wishlist_model_1 = require("../wishlist/wishlist.model");
const wishstatus_model_1 = require("../wishstatus/wishstatus.model");
let Wish = class Wish extends sequelize_typescript_1.Model {
    name;
    image;
    price;
    product_link;
    wishstatusId;
    wishlists;
    wishstuses;
};
exports.Wish = Wish;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], Wish.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Wish.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], Wish.prototype, "image", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.FLOAT, allowNull: false }),
    __metadata("design:type", Number)
], Wish.prototype, "price", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], Wish.prototype, "product_link", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => wishstatus_model_1.WishStatus),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Wish.prototype, "wishstatusId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => wishlist_model_1.WishList, () => wishlist_wish_model_1.WishListWish),
    __metadata("design:type", Array)
], Wish.prototype, "wishlists", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => wishstatus_model_1.WishStatus),
    __metadata("design:type", wishstatus_model_1.WishStatus)
], Wish.prototype, "wishstuses", void 0);
exports.Wish = Wish = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'wish' })
], Wish);
//# sourceMappingURL=wish.model.js.map