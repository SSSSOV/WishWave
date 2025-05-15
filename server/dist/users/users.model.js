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
exports.User = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const ban_model_1 = require("../ban/ban.model");
const friend_users_model_1 = require("../friend/friend-users.model");
const friend_model_1 = require("../friend/friend.model");
const roles_model_1 = require("../roles/roles.model");
const wishlist_model_1 = require("../wishlist/wishlist.model");
let User = class User extends sequelize_typescript_1.Model {
    full_name;
    login;
    password;
    email;
    roleId;
    banId;
    friends;
    bans;
    rolеs;
    wishlists;
};
exports.User = User;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], User.prototype, "full_name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, unique: true, allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "login", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, unique: true, allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => roles_model_1.Role),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], User.prototype, "roleId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => ban_model_1.Ban),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], User.prototype, "banId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => friend_model_1.Friend, () => friend_users_model_1.FriendUsers),
    __metadata("design:type", Array)
], User.prototype, "friends", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => ban_model_1.Ban),
    __metadata("design:type", ban_model_1.Ban)
], User.prototype, "bans", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => roles_model_1.Role),
    __metadata("design:type", roles_model_1.Role)
], User.prototype, "rol\u0435s", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => wishlist_model_1.WishList),
    __metadata("design:type", Array)
], User.prototype, "wishlists", void 0);
exports.User = User = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'users' })
], User);
//# sourceMappingURL=users.model.js.map