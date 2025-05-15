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
exports.WishList = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const wish_model_1 = require("../wish/wish.model");
const wishlist_wish_model_1 = require("./wishlist-wish.model");
const accesslevel_model_1 = require("../accesslevel/accesslevel.model");
const users_model_1 = require("../users/users.model");
let WishList = class WishList extends sequelize_typescript_1.Model {
    name;
    userId;
    accesslevelId;
    wishs;
    accesslevels;
    users;
};
exports.WishList = WishList;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], WishList.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], WishList.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => users_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], WishList.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => accesslevel_model_1.AccessLevel),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], WishList.prototype, "accesslevelId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => wish_model_1.Wish, () => wishlist_wish_model_1.WishListWish),
    __metadata("design:type", Array)
], WishList.prototype, "wishs", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => accesslevel_model_1.AccessLevel),
    __metadata("design:type", accesslevel_model_1.AccessLevel)
], WishList.prototype, "accesslevels", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => users_model_1.User),
    __metadata("design:type", users_model_1.User)
], WishList.prototype, "users", void 0);
exports.WishList = WishList = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'wish_list' })
], WishList);
//# sourceMappingURL=wishlist.model.js.map