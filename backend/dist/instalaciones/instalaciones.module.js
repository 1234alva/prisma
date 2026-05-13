"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstalacionesModule = void 0;
const common_1 = require("@nestjs/common");
const instalaciones_controller_1 = require("./instalaciones.controller");
const instalaciones_service_1 = require("./instalaciones.service");
const recuperacion_service_1 = require("./recuperacion.service");
const reporte_service_1 = require("./reporte.service");
const prisma_service_1 = require("../prisma.service");
let InstalacionesModule = class InstalacionesModule {
};
exports.InstalacionesModule = InstalacionesModule;
exports.InstalacionesModule = InstalacionesModule = __decorate([
    (0, common_1.Module)({
        controllers: [instalaciones_controller_1.InstalacionesController],
        providers: [
            instalaciones_service_1.InstalacionesService,
            recuperacion_service_1.RecuperacionService,
            reporte_service_1.ReporteService,
            prisma_service_1.PrismaService
        ],
        exports: [instalaciones_service_1.InstalacionesService, recuperacion_service_1.RecuperacionService]
    })
], InstalacionesModule);
//# sourceMappingURL=instalaciones.module.js.map