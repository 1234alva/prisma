import { PrismaService } from '../prisma.service';
export declare class UsuariosService {
    private prisma;
    constructor(prisma: PrismaService);
    crearUsuario(data: any): Promise<{
        id: string;
        nombre: string;
        username: string;
        password: string;
        rol: import(".prisma/client").$Enums.Role;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    obtenerTodos(): Promise<({
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
    actualizarAsistencia(id: string, activo: boolean): Promise<{
        id: string;
        nombre: string;
        username: string;
        password: string;
        rol: import(".prisma/client").$Enums.Role;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
