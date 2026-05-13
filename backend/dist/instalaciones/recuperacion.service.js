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
exports.RecuperacionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
let RecuperacionService = class RecuperacionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async registrar(data, tecnicoId) {
        return this.prisma.$transaction(async (tx) => {
            try {
                const estadoFinal = data.estadoEquipo === 'BUENO'
                    ? client_1.EquipoEstado.ASIGNADO
                    : client_1.EquipoEstado.RECUPERADO;
                const registro = await tx.equipoRecuperado.create({
                    data: {
                        numSolicitud: String(data.numSolicitud),
                        clienteNombre: String(data.clienteNombre || 'CLIENTE S/N'),
                        sn_mac: String(data.sn_mac).trim().toUpperCase(),
                        mac_deco: data.tipo === 'IPTV' ? String(data.mac_iptv).trim().toUpperCase() : null,
                        tipo_servicio: String(data.tipo || 'ROUTER'),
                        estadoEquipo: String(data.estadoEquipo || 'MALO'),
                        accesorios: String(data.accesorios || 'Completo'),
                        observaciones: String(data.observaciones || ''),
                        tecnicoId: tecnicoId,
                    }
                });
                await tx.equipo.upsert({
                    where: { sn: String(data.sn_mac).trim().toUpperCase() },
                    update: {
                        estado: estadoFinal,
                        poseedorId: tecnicoId,
                    },
                    create: {
                        id: (0, crypto_1.randomUUID)(),
                        tipo: 'ROUTER',
                        sn: String(data.sn_mac).trim().toUpperCase(),
                        estado: estadoFinal,
                        poseedorId: tecnicoId,
                        marca: 'GENERICA',
                        modelo: 'RECUPERADO',
                        fuente: true,
                        hdmi: false,
                        patchcord_sc: false,
                        patchcord_utp: false
                    },
                });
                if (data.tipo === 'IPTV' && data.mac_iptv) {
                    await tx.equipo.upsert({
                        where: { mac: String(data.mac_iptv).trim().toUpperCase() },
                        update: {
                            estado: estadoFinal,
                            poseedorId: tecnicoId,
                        },
                        create: {
                            id: (0, crypto_1.randomUUID)(),
                            tipo: 'IPTV',
                            mac: String(data.mac_iptv).trim().toUpperCase(),
                            estado: estadoFinal,
                            poseedorId: tecnicoId,
                            marca: 'GENERICA',
                            modelo: 'RECUPERADO',
                            fuente: true,
                            hdmi: true,
                            patchcord_sc: false,
                            patchcord_utp: false
                        },
                    });
                }
                return registro;
            }
            catch (error) {
                console.error('ERROR EN OPERACIÓN DE RECUPERO:', error);
                throw new common_1.InternalServerErrorException({
                    message: 'Error al procesar el recupero y asignar stock circulante',
                    detail: error.message
                });
            }
        });
    }
};
exports.RecuperacionService = RecuperacionService;
exports.RecuperacionService = RecuperacionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RecuperacionService);
//# sourceMappingURL=recuperacion.service.js.map