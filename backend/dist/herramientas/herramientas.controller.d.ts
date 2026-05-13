import { HerramientasService } from './herramientas.service';
export declare class HerramientasController {
    private readonly herramientasService;
    constructor(herramientasService: HerramientasService);
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
    create(data: {
        nombre: string;
    }): Promise<{
        id: string;
        estado: string;
        nombre: string;
        poseedorId: string | null;
    }>;
    devolver(id: string): Promise<{
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
}
