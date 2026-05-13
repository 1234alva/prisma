import { PrismaService } from '../prisma.service';
export declare class InstalacionesService {
    private prisma;
    constructor(prisma: PrismaService);
    crear(data: any, tecnicoId: string): Promise<{
        id: string;
        numSolicitud: string;
        cliente: string;
        tipo: string;
        estado: import(".prisma/client").$Enums.SolicitudEstado;
        observacion: string | null;
        latitud: number | null;
        longitud: number | null;
        fotos: string[];
        firmaDigital: string | null;
        router_sn: string | null;
        iptv_macs: string[];
        fecha: Date;
        tecnicoId: string;
    }>;
    obtenerDetalleCompleto(id: string): Promise<{
        tecnico: {
            nombre: string;
            username: string;
        };
        materialesUsados: ({
            material: {
                id: string;
                nombre: string;
                unidad: string;
                cantidadTotal: number;
            };
        } & {
            id: string;
            cantidad: number;
            instalacionId: string;
            materialId: string;
        })[];
    } & {
        id: string;
        numSolicitud: string;
        cliente: string;
        tipo: string;
        estado: import(".prisma/client").$Enums.SolicitudEstado;
        observacion: string | null;
        latitud: number | null;
        longitud: number | null;
        fotos: string[];
        firmaDigital: string | null;
        router_sn: string | null;
        iptv_macs: string[];
        fecha: Date;
        tecnicoId: string;
    }>;
    buscarPorSolicitud(num: string): Promise<{
        tecnico: {
            nombre: string;
        };
        materialesUsados: ({
            material: {
                id: string;
                nombre: string;
                unidad: string;
                cantidadTotal: number;
            };
        } & {
            id: string;
            cantidad: number;
            instalacionId: string;
            materialId: string;
        })[];
    } & {
        id: string;
        numSolicitud: string;
        cliente: string;
        tipo: string;
        estado: import(".prisma/client").$Enums.SolicitudEstado;
        observacion: string | null;
        latitud: number | null;
        longitud: number | null;
        fotos: string[];
        firmaDigital: string | null;
        router_sn: string | null;
        iptv_macs: string[];
        fecha: Date;
        tecnicoId: string;
    }>;
}
