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
exports.UsuariosController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let UsuariosController = class UsuariosController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.usuario.create({
            data: {
                username: data.username,
                password: data.password,
                nombre: data.nombre,
                rol: data.rol || 'TECNICO',
                activo: data.activo ?? true,
            },
        });
    }
    async login(data) {
        const user = await this.prisma.usuario.findUnique({
            where: { username: data.username },
        });
        if (!user || user.password !== data.password)
            throw new Error('Credenciales inválidas');
        return user;
    }
    async toggleAsistencia(id, activo) {
        return this.prisma.usuario.update({
            where: { id },
            data: { activo },
        });
    }
    async findAll() {
        return this.prisma.usuario.findMany({
            include: {
                _count: {
                    select: { instalaciones: true }
                },
                stockPersonal: {
                    include: {
                        material: true
                    }
                }
            }
        });
    }
};
exports.UsuariosController = UsuariosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "login", null);
__decorate([
    (0, common_1.Patch)(':id/asistencia'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('activo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "toggleAsistencia", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "findAll", null);
exports.UsuariosController = UsuariosController = __decorate([
    (0, common_1.Controller)('usuarios'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsuariosController);
//# sourceMappingURL=usuarios.controller.js.map