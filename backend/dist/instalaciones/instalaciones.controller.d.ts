import { InstalacionesService } from './instalaciones.service';
import { ReporteService } from './reporte.service';
import { RecuperacionService } from './recuperacion.service';
import { PrismaService } from '../prisma.service';
import { Response } from 'express';
export declare class InstalacionesController {
    private readonly instService;
    private readonly reporteService;
    private readonly prisma;
    private readonly recuperacionService;
    constructor(instService: InstalacionesService, reporteService: ReporteService, prisma: PrismaService, recuperacionService: RecuperacionService);
    obtenerStatsGlobales(): Promise<{
        totalEquipos: number;
        enCampo: number;
        totalRecuperados: number;
    }>;
    crear(data: any, files?: Express.Multer.File[]): Promise<{
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
    registrarRecupero(data: any): Promise<{
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
    obtenerTodasLasRecuperaciones(): Promise<({
        tecnico: {
            nombre: string;
        };
    } & {
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
    })[]>;
    obtenerHistorialTecnico(tecnicoId: string): Promise<{
        id: string;
        numSolicitud: string;
        cliente: string;
        tipo: string;
        estado: import(".prisma/client").$Enums.SolicitudEstado;
        observacion: string;
        fotos: string[];
        fecha: Date;
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
    }[]>;
    reporteDia(tecnicoId: string): Promise<({
        tecnico: {
            nombre: string;
        };
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
    })[]>;
    obtenerUna(id: string): Promise<{
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
    descargarPdf(id: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
}
