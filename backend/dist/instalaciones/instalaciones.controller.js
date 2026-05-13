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
exports.InstalacionesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const instalaciones_service_1 = require("./instalaciones.service");
const reporte_service_1 = require("./reporte.service");
const recuperacion_service_1 = require("./recuperacion.service");
const prisma_service_1 = require("../prisma.service");
let InstalacionesController = class InstalacionesController {
    constructor(instService, reporteService, prisma, recuperacionService) {
        this.instService = instService;
        this.reporteService = reporteService;
        this.prisma = prisma;
        this.recuperacionService = recuperacionService;
    }
    async obtenerStatsGlobales() {
        try {
            const [totalEquipos, enCampo, totalRecuperados] = await Promise.all([
                this.prisma.equipo.count({ where: { estado: 'DISPONIBLE' } }),
                this.prisma.equipo.count({ where: { estado: 'ASIGNADO' } }),
                this.prisma.equipoRecuperado.count(),
            ]);
            return {
                totalEquipos,
                enCampo,
                totalRecuperados
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({
                message: 'Error al calcular estadísticas globales',
                error: error.message
            });
        }
    }
    async crear(data, files) {
        try {
            if (!data.tecnicoId) {
                throw new common_1.BadRequestException('El ID del técnico es obligatorio.');
            }
            const nombresFotos = files?.map(f => f.filename) || [];
            const payload = {
                ...data,
                fotos: nombresFotos.length > 0 ? nombresFotos : (data.fotos || [])
            };
            return await this.instService.crear(payload, data.tecnicoId);
        }
        catch (error) {
            console.error("Error en POST /instalaciones:", error);
            throw new common_1.InternalServerErrorException({ message: 'Error al crear la instalación', error: error.message });
        }
    }
    async registrarRecupero(data) {
        try {
            if (!data.tecnicoId) {
                throw new common_1.BadRequestException('El ID del técnico es obligatorio.');
            }
            return await this.recuperacionService.registrar(data, data.tecnicoId);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Error al procesar el recupero', error: error.message });
        }
    }
    async obtenerTodasLasRecuperaciones() {
        try {
            return await this.prisma.equipoRecuperado.findMany({
                include: {
                    tecnico: {
                        select: { nombre: true }
                    }
                },
                orderBy: {
                    fechaRetiro: 'desc'
                }
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({
                message: 'Error al obtener el historial de recuperaciones',
                error: error.message
            });
        }
    }
    async obtenerHistorialTecnico(tecnicoId) {
        try {
            return await this.prisma.instalacion.findMany({
                where: { tecnicoId },
                select: {
                    id: true, numSolicitud: true, cliente: true, fecha: true,
                    tipo: true, estado: true, fotos: true, observacion: true,
                    materialesUsados: { include: { material: true } }
                },
                orderBy: { fecha: 'desc' }
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Error al obtener historial', error: error.message });
        }
    }
    async reporteDia(tecnicoId) {
        const inicioDia = new Date();
        inicioDia.setHours(0, 0, 0, 0);
        const finDia = new Date();
        finDia.setHours(23, 59, 59, 999);
        return this.prisma.instalacion.findMany({
            where: {
                tecnicoId,
                fecha: { gte: inicioDia, lte: finDia }
            },
            include: { tecnico: { select: { nombre: true } } },
            orderBy: { fecha: 'desc' }
        });
    }
    async obtenerUna(id) {
        return this.instService.obtenerDetalleCompleto(id);
    }
    async descargarPdf(id, res) {
        try {
            const instalacion = await this.instService.obtenerDetalleCompleto(id);
            if (!instalacion) {
                return res.status(common_1.HttpStatus.NOT_FOUND).json({ message: 'No encontrado' });
            }
            return await this.reporteService.generarActaInstalacion(instalacion, res);
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error PDF', error: error.message });
        }
    }
};
exports.InstalacionesController = InstalacionesController;
__decorate([
    (0, common_1.Get)('stats/globales'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstalacionesController.prototype, "obtenerStatsGlobales", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('fotos')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], InstalacionesController.prototype, "crear", null);
__decorate([
    (0, common_1.Post)('recuperar'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InstalacionesController.prototype, "registrarRecupero", null);
__decorate([
    (0, common_1.Get)('recuperaciones/todas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstalacionesController.prototype, "obtenerTodasLasRecuperaciones", null);
__decorate([
    (0, common_1.Get)('tecnico/:tecnicoId'),
    __param(0, (0, common_1.Param)('tecnicoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstalacionesController.prototype, "obtenerHistorialTecnico", null);
__decorate([
    (0, common_1.Get)('reporte-dia/:tecnicoId'),
    __param(0, (0, common_1.Param)('tecnicoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstalacionesController.prototype, "reporteDia", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstalacionesController.prototype, "obtenerUna", null);
__decorate([
    (0, common_1.Get)(':id/pdf'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InstalacionesController.prototype, "descargarPdf", null);
exports.InstalacionesController = InstalacionesController = __decorate([
    (0, common_1.Controller)('instalaciones'),
    __metadata("design:paramtypes", [instalaciones_service_1.InstalacionesService,
        reporte_service_1.ReporteService,
        prisma_service_1.PrismaService,
        recuperacion_service_1.RecuperacionService])
], InstalacionesController);
//# sourceMappingURL=instalaciones.controller.js.map