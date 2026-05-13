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
exports.InventarioController = void 0;
const common_1 = require("@nestjs/common");
const inventario_service_1 = require("./inventario.service");
const prisma_service_1 = require("../prisma.service");
let InventarioController = class InventarioController {
    constructor(invService, prisma) {
        this.invService = invService;
        this.prisma = prisma;
    }
    async regMaterial(data) {
        return this.invService.registrarIngresoAlmacen(data);
    }
    async asignarTodo(data) {
        if (!data.tecnicoId)
            throw new common_1.BadRequestException('Se requiere el ID del técnico');
        return this.invService.asignarTodoAlTecnico(data.tecnicoId, data);
    }
    async buscar(solicitud) {
        if (!solicitud)
            throw new common_1.BadRequestException('Debe ingresar un número de solicitud');
        return this.invService.buscarSolicitud(solicitud);
    }
    async toggleEstado(id, data) {
        return this.prisma.usuario.update({
            where: { id },
            data: { activo: data.activo }
        });
    }
    async getStock(id) {
        return this.invService.getStockTecnico(id);
    }
    async getInventarioGeneral() {
        return this.invService.getStockGlobalCompleto();
    }
    async getEquiposRecuperados() {
        return this.prisma.equipo.findMany({
            where: { estado: 'RECUPERADO' },
            include: {
                poseedor: { select: { nombre: true } }
            },
            orderBy: { updatedAt: 'desc' }
        });
    }
    async getHerramientas() {
        return this.prisma.herramienta.findMany({
            include: {
                poseedor: { select: { nombre: true } }
            }
        });
    }
    async asignarMaterial(data) {
        if (data.cantidad <= 0)
            throw new common_1.BadRequestException('La cantidad debe ser mayor a 0');
        return this.invService.asignarTodoAlTecnico(data.tecnicoId, {
            materiales: [{ id: data.materialId, cantidad: data.cantidad }]
        });
    }
    async asignarEquipo(data) {
        return this.invService.asignarTodoAlTecnico(data.tecnicoId, {
            equiposIds: [data.equipoId]
        });
    }
    async ingresoAlternativo(data) {
        return this.invService.registrarIngresoAlmacen(data);
    }
    async getDisponible() {
        const stock = await this.invService.getStockGlobalCompleto();
        return stock.equiposBodega;
    }
    async procesarRecuperado(id, data) {
        return this.prisma.equipo.update({
            where: { id },
            data: {
                estado: data.nuevoEstado,
                poseedorId: null
            }
        });
    }
    async getHistorial() {
        return this.prisma.movimientoInventario.findMany({
            take: 100,
            orderBy: { createdAt: 'desc' },
            include: {
                usuario: { select: { nombre: true } },
                material: { select: { nombre: true } },
            }
        });
    }
};
exports.InventarioController = InventarioController;
__decorate([
    (0, common_1.Post)('registrar-material'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "regMaterial", null);
__decorate([
    (0, common_1.Post)('asignar-todo'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "asignarTodo", null);
__decorate([
    (0, common_1.Get)('buscar'),
    __param(0, (0, common_1.Query)('solicitud')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "buscar", null);
__decorate([
    (0, common_1.Patch)('estado-tecnico/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "toggleEstado", null);
__decorate([
    (0, common_1.Get)('tecnico/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "getStock", null);
__decorate([
    (0, common_1.Get)('general'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "getInventarioGeneral", null);
__decorate([
    (0, common_1.Get)('equipos-recuperados'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "getEquiposRecuperados", null);
__decorate([
    (0, common_1.Get)('herramientas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "getHerramientas", null);
__decorate([
    (0, common_1.Post)('asignar-material'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "asignarMaterial", null);
__decorate([
    (0, common_1.Post)('asignar-equipo'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "asignarEquipo", null);
__decorate([
    (0, common_1.Post)('ingreso'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "ingresoAlternativo", null);
__decorate([
    (0, common_1.Get)('stock/disponible'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "getDisponible", null);
__decorate([
    (0, common_1.Patch)('procesar-recuperado/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "procesarRecuperado", null);
__decorate([
    (0, common_1.Get)('historial'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "getHistorial", null);
exports.InventarioController = InventarioController = __decorate([
    (0, common_1.Controller)('inventario'),
    __metadata("design:paramtypes", [inventario_service_1.InventarioService,
        prisma_service_1.PrismaService])
], InventarioController);
//# sourceMappingURL=inventario.controller.js.map