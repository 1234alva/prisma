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
exports.HerramientasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let HerramientasService = class HerramientasService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.herramienta.findMany({
            include: {
                poseedor: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
            },
        });
    }
    async marcarComoDevuelta(id) {
        const herramienta = await this.prisma.herramienta.findUnique({ where: { id } });
        if (!herramienta)
            throw new common_1.NotFoundException('La herramienta no existe');
        return this.prisma.herramienta.update({
            where: { id },
            data: {
                poseedorId: null,
                estado: 'DISPONIBLE',
            },
            include: { poseedor: true }
        });
    }
    async create(data) {
        return this.prisma.herramienta.create({
            data: {
                nombre: data.nombre,
                estado: 'DISPONIBLE',
            },
        });
    }
};
exports.HerramientasService = HerramientasService;
exports.HerramientasService = HerramientasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HerramientasService);
//# sourceMappingURL=herramientas.service.js.map