"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HerramientasModule = void 0;
const common_1 = require("@nestjs/common");
const herramientas_service_1 = require("./herramientas.service");
const herramientas_controller_1 = require("./herramientas.controller");
const prisma_service_1 = require("../prisma.service");
let HerramientasModule = class HerramientasModule {
};
exports.HerramientasModule = HerramientasModule;
exports.HerramientasModule = HerramientasModule = __decorate([
    (0, common_1.Module)({
        controllers: [herramientas_controller_1.HerramientasController],
        providers: [herramientas_service_1.HerramientasService, prisma_service_1.PrismaService],
        exports: [herramientas_service_1.HerramientasService]
    })
], HerramientasModule);
//# sourceMappingURL=herramientas.module.js.map