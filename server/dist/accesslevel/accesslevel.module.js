"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesslevelModule = void 0;
const common_1 = require("@nestjs/common");
const accesslevel_controller_1 = require("./accesslevel.controller");
const accesslevel_service_1 = require("./accesslevel.service");
let AccesslevelModule = class AccesslevelModule {
};
exports.AccesslevelModule = AccesslevelModule;
exports.AccesslevelModule = AccesslevelModule = __decorate([
    (0, common_1.Module)({
        controllers: [accesslevel_controller_1.AccesslevelController],
        providers: [accesslevel_service_1.AccesslevelService]
    })
], AccesslevelModule);
//# sourceMappingURL=accesslevel.module.js.map