import { PrismaService } from '../prisma.service';
export declare class UsuariosController {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: string;
        nombre: string;
        username: string;
        password: string;
        rol: import(".prisma/client").$Enums.Role;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(data: any): Promise<{
        id: string;
        nombre: string;
        username: string;
        password: string;
        rol: import(".prisma/client").$Enums.Role;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    toggleAsistencia(id: string, activo: boolean): Promise<{
        id: string;
        nombre: string;
        username: string;
        password: string;
        rol: import(".prisma/client").$Enums.Role;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        stockPersonal: ({
            material: {
                id: string;
                nombre: string;
                unidad: string;
                cantidadTotal: number;
            };
        } & {
            id: string;
            tecnicoId: string;
            materialId: string;
            asignado: number;
            utilizado: number;
        })[];
        _count: {
            instalaciones: number;
        };
    } & {
        id: string;
        nombre: string;
        username: string;
        password: string;
        rol: import(".prisma/client").$Enums.Role;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
