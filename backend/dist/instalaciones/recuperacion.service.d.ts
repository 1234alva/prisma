import { PrismaService } from '../prisma.service';
export declare class RecuperacionService {
    private prisma;
    constructor(prisma: PrismaService);
    registrar(data: any, tecnicoId: string): Promise<{
        id: string;
        numSolicitud: string;
        firmaDigital: string | null;
        tecnicoId: string;
        clienteNombre: string;
        tecnicoCelular: string | null;
        fechaRetiro: Date;
        sn_mac: string;
        mac_deco: string | null;
        tipo_servicio: string;
        estadoEquipo: string;
        accesorios: string;
        observaciones: string | null;
    }>;
}
