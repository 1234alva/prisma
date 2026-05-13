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
exports.InstalacionesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let InstalacionesService = class InstalacionesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async crear(data, tecnicoId) {
        const tecnico = await this.prisma.usuario.findUnique({ where: { id: tecnicoId } });
        if (!tecnico) {
            throw new common_1.BadRequestException('El técnico no existe en la base de datos.');
        }
        return this.prisma.$transaction(async (tx) => {
            try {
                const lat = data.latitud ? parseFloat(data.latitud) : null;
                const lon = data.longitud ? parseFloat(data.longitud) : null;
                const instalacion = await tx.instalacion.create({
                    data: {
                        numSolicitud: String(data.solicitud || data.numSolicitud),
                        cliente: data.cliente || 'CLIENTE NUEVO',
                        tipo: data.tipo || 'SIMPLE',
                        router_sn: data.snRouter,
                        iptv_macs: data.macs ? (typeof data.macs === 'string' ? JSON.parse(data.macs) : data.macs) : [],
                        latitud: lat,
                        longitud: lon,
                        fotos: data.fotos || [],
                        tecnicoId: tecnicoId,
                        estado: client_1.SolicitudEstado.EJECUTADA,
                        observacion: data.observaciones || '',
                    },
                });
                if (data.snRouter) {
                    await tx.equipo.update({
                        where: { sn: data.snRouter },
                        data: {
                            estado: 'INSTALADO',
                            poseedorId: null
                        }
                    });
                }
                const materialesAProcesar = [
                    { key: 'cableDrop', nombreBD: 'CABLE DROP' },
                    { key: 'tensores', nombreBD: 'TENSORES' },
                    { key: 'rosetas', nombreBD: 'ROSETAS' },
                    { key: 'conectores', nombreBD: 'CONECTORES' },
                    { key: 'grampas', nombreBD: 'GRAMPAS' },
                ];
                for (const mat of materialesAProcesar) {
                    const cantidad = Number(data[mat.key]);
                    if (cantidad > 0) {
                        const materialGlobal = await tx.material.findFirst({ where: { nombre: mat.nombreBD } });
                        if (materialGlobal) {
                            await tx.stockTecnico.update({
                                where: {
                                    tecnicoId_materialId: {
                                        tecnicoId: tecnicoId,
                                        materialId: materialGlobal.id,
                                    },
                                },
                                data: { utilizado: { increment: cantidad } },
                            });
                            await tx.materialUsado.create({
                                data: {
                                    cantidad: cantidad,
                                    instalacionId: instalacion.id,
                                    materialId: materialGlobal.id
                                }
                            });
                        }
                    }
                }
                return instalacion;
            }
            catch (error) {
                console.error("Error en transacción de instalación:", error);
                throw new common_1.InternalServerErrorException({
                    message: 'Error al procesar la instalación en la base de datos',
                    detail: error.message
                });
            }
        });
    }
    async obtenerDetalleCompleto(id) {
        const instalacion = await this.prisma.instalacion.findUnique({
            where: { id },
            include: {
                tecnico: {
                    select: { nombre: true, username: true }
                },
                materialesUsados: {
                    include: { material: true }
                }
            },
        });
        if (!instalacion)
            throw new common_1.NotFoundException('La instalación no existe.');
        return instalacion;
    }
    async buscarPorSolicitud(num) {
        return this.prisma.instalacion.findUnique({
            where: { numSolicitud: num },
            include: {
                tecnico: { select: { nombre: true } },
                materialesUsados: { include: { material: true } }
            }
        });
    }
};
exports.InstalacionesService = InstalacionesService;
exports.InstalacionesService = InstalacionesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InstalacionesService);
//# sourceMappingURL=instalaciones.service.js.map