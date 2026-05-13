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
exports.InventarioService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let InventarioService = class InventarioService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async registrarIngresoAlmacen(data) {
        if (data.sn || data.tipo === 'ROUTER' || data.tipo === 'IPTV') {
            return this.prisma.equipo.create({
                data: {
                    tipo: data.tipo || 'ROUTER',
                    sn: data.sn?.toUpperCase(),
                    mac: data.mac ? data.mac.toUpperCase() : '',
                    modelo: (data.modelo || 'GENERICO').toUpperCase(),
                    estado: 'DISPONIBLE',
                    fuente: data.fuente ?? true,
                    hdmi: data.hdmi ?? false,
                    patchcord_sc: data.patchcord_sc ?? false,
                    patchcord_utp: data.patchcord_utp ?? false,
                }
            });
        }
        return this.prisma.material.upsert({
            where: { nombre: data.nombre.toUpperCase() },
            update: {
                cantidadTotal: { increment: Number(data.cantidad) }
            },
            create: {
                nombre: data.nombre.toUpperCase(),
                unidad: data.unidad || 'UNIDADES',
                cantidadTotal: Number(data.cantidad)
            }
        });
    }
    async asignarTodoAlTecnico(tecnicoId, data) {
        return this.prisma.$transaction(async (tx) => {
            if (data.equiposIds && data.equiposIds.length > 0) {
                await tx.equipo.updateMany({
                    where: { id: { in: data.equiposIds } },
                    data: { poseedorId: tecnicoId, estado: 'ASIGNADO' }
                });
            }
            if (data.materiales && data.materiales.length > 0) {
                for (const m of data.materiales) {
                    const matId = m.id || m.materialId;
                    const cantidad = Number(m.cantidad);
                    const material = await tx.material.findUnique({ where: { id: matId } });
                    if (!material || material.cantidadTotal < cantidad) {
                        throw new common_1.BadRequestException(`Stock insuficiente para: ${material?.nombre || 'Material'}`);
                    }
                    await tx.material.update({
                        where: { id: matId },
                        data: { cantidadTotal: { decrement: cantidad } }
                    });
                    await tx.stockTecnico.upsert({
                        where: { tecnicoId_materialId: { tecnicoId, materialId: matId } },
                        update: { asignado: { increment: cantidad } },
                        create: { tecnicoId, materialId: matId, asignado: cantidad, utilizado: 0 }
                    });
                }
            }
            if (data.herramientasIds && data.herramientasIds.length > 0) {
                await tx.herramienta.updateMany({
                    where: { id: { in: data.herramientasIds } },
                    data: { poseedorId: tecnicoId, estado: 'ASIGNADA' }
                });
            }
        });
    }
    async getStockTecnico(tecnicoId) {
        const [materialesStock, todosLosEquipos, herramientas] = await Promise.all([
            this.prisma.stockTecnico.findMany({
                where: { tecnicoId },
                include: { material: true }
            }),
            this.prisma.equipo.findMany({
                where: { poseedorId: tecnicoId },
            }),
            this.prisma.herramienta.findMany({
                where: { poseedorId: tecnicoId }
            })
        ]);
        return {
            materiales: materialesStock.map(item => ({
                id: item.materialId,
                nombre: item.material.nombre,
                unidad: item.material.unidad,
                cantidad: item.asignado - item.utilizado,
                stockMax: 100
            })),
            equipos: todosLosEquipos
                .filter(e => e.estado === 'ASIGNADO' || e.estado === 'DISPONIBLE')
                .map(e => ({
                id: e.id,
                tipo: e.tipo,
                serie: e.sn || e.mac || 'S/N',
                estado: e.estado,
                modelo: e.modelo
            })),
            herramientas: herramientas.map(h => ({
                id: h.id,
                nombre: h.nombre,
                serie: 'ASIGNADA'
            })),
            recuperados: todosLosEquipos
                .filter(e => e.estado === 'RECUPERADO')
                .map((e) => ({
                id: e.id,
                tipo: e.tipo,
                serie: e.sn || e.mac || 'S/N',
                estado: e.estado,
                modelo: e.modelo,
                fecha: e.updatedAt
            }))
        };
    }
    async getReporteSincronizado() {
        const [materiales, equipos, tecnicos] = await Promise.all([
            this.prisma.material.findMany({ orderBy: { nombre: 'asc' } }),
            this.prisma.equipo.findMany({ include: { poseedor: true } }),
            this.prisma.usuario.findMany({ where: { rol: 'TECNICO' }, orderBy: { nombre: 'asc' } })
        ]);
        return {
            stockAlmacen: materiales,
            equiposEnBodega: equipos.filter(e => !e.poseedorId),
            equiposEnCampo: equipos.filter(e => e.poseedorId),
            tecnicosEstado: tecnicos.map(t => ({
                id: t.id,
                nombre: t.nombre,
                activo: t.activo
            }))
        };
    }
    async buscarSolicitud(numSolicitud) {
        const instalacion = await this.prisma.instalacion.findUnique({
            where: { numSolicitud },
            include: {
                tecnico: { select: { nombre: true } },
                materialesUsados: { include: { material: true } }
            }
        });
        if (instalacion)
            return { tipo: 'INSTALACION', data: instalacion };
        const recuperado = await this.prisma.equipoRecuperado.findFirst({
            where: { numSolicitud },
            include: { tecnico: { select: { nombre: true } } }
        });
        if (recuperado)
            return { tipo: 'RECUPERACION', data: recuperado };
        throw new common_1.NotFoundException(`No se encontró registro para la solicitud: ${numSolicitud}`);
    }
    async getMaterialesGlobal() {
        return this.prisma.material.findMany({ orderBy: { nombre: 'asc' } });
    }
    async getStockGlobalCompleto() {
        const [materiales, equiposBodega] = await Promise.all([
            this.prisma.material.findMany({ orderBy: { nombre: 'asc' } }),
            this.prisma.equipo.findMany({
                where: { poseedorId: null, estado: 'DISPONIBLE' },
                orderBy: { createdAt: 'desc' }
            })
        ]);
        return { materiales, equiposBodega };
    }
    async registrarInstalacion(data) {
        return await this.prisma.$transaction(async (tx) => {
            for (const equipoId of data.equiposIds) {
                await tx.equipo.update({
                    where: { id: equipoId },
                    data: {
                        estado: 'INSTALADO',
                        poseedorId: null
                    }
                });
            }
            for (const mat of data.materiales) {
                await tx.stockTecnico.update({
                    where: {
                        tecnicoId_materialId: {
                            tecnicoId: data.tecnicoId,
                            materialId: mat.id
                        }
                    },
                    data: { utilizado: { increment: mat.cantidad } }
                });
            }
            return tx.instalacion.create({
                data: {
                    numSolicitud: data.solicitudNumero,
                    cliente: data.clienteNombre,
                    tecnicoId: data.tecnicoId,
                    tipo: "INSTALACION ESTANDAR",
                    estado: 'EJECUTADA',
                    router_sn: data.equiposIds.length > 0 ? "ASIGNADO" : null
                }
            });
        });
    }
};
exports.InventarioService = InventarioService;
exports.InventarioService = InventarioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventarioService);
//# sourceMappingURL=inventario.service.js.map