import { PrismaService } from '../prisma.service';
export declare class HerramientasService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        poseedor: {
            id: string;
            nombre: string;
        };
    } & {
        id: string;
        estado: string;
        nombre: string;
        poseedorId: string | null;
    })[]>;
    marcarComoDevuelta(id: string): Promise<{
        poseedor: {
            id: string;
            nombre: string;
            username: string;
            password: string;
            rol: import(".prisma/client").$Enums.Role;
            activo: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        estado: string;
        nombre: string;
        poseedorId: string | null;
    }>;
    create(data: {
        nombre: string;
    }): Promise<{
        id: string;
        estado: string;
        nombre: string;
        poseedorId: string | null;
    }>;
}
