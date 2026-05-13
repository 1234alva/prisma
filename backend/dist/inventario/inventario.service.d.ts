import { PrismaService } from '../prisma.service';
export declare class InventarioService {
    private prisma;
    constructor(prisma: PrismaService);
    registrarIngresoAlmacen(data: any): Promise<{
        id: string;
        tipo: string;
        sn: string | null;
        mac: string | null;
        estado: import(".prisma/client").$Enums.EquipoEstado;
        updatedAt: Date;
        marca: string | null;
        modelo: string | null;
        fuente: boolean;
        hdmi: boolean;
        patchcord_sc: boolean;
        patchcord_utp: boolean;
        createdAt: Date;
        poseedorId: string | null;
    } | {
        id: string;
        nombre: string;
        unidad: string;
        cantidadTotal: number;
    }>;
    asignarTodoAlTecnico(tecnicoId: string, data: any): Promise<void>;
    getStockTecnico(tecnicoId: string): Promise<{
        materiales: {
            id: string;
            nombre: string;
            unidad: string;
            cantidad: number;
            stockMax: number;
        }[];
        equipos: {
            id: string;
            tipo: string;
            serie: string;
            estado: import(".prisma/client").$Enums.EquipoEstado;
            modelo: string;
        }[];
        herramientas: {
            id: string;
            nombre: string;
            serie: string;
        }[];
        recuperados: {
            id: any;
            tipo: any;
            serie: any;
            estado: any;
            modelo: any;
            fecha: any;
        }[];
    }>;
    getReporteSincronizado(): Promise<{
        stockAlmacen: {
            id: string;
            nombre: string;
            unidad: string;
            cantidadTotal: number;
        }[];
        equiposEnBodega: ({
            poseedor: {
                id: string;
                updatedAt: Date;
                createdAt: Date;
                nombre: string;
                username: string;
                password: string;
                rol: import(".prisma/client").$Enums.Role;
                activo: boolean;
            };
        } & {
            id: string;
            tipo: string;
            sn: string | null;
            mac: string | null;
            estado: import(".prisma/client").$Enums.EquipoEstado;
            updatedAt: Date;
            marca: string | null;
            modelo: string | null;
            fuente: boolean;
            hdmi: boolean;
            patchcord_sc: boolean;
            patchcord_utp: boolean;
            createdAt: Date;
            poseedorId: string | null;
        })[];
        equiposEnCampo: ({
            poseedor: {
                id: string;
                updatedAt: Date;
                createdAt: Date;
                nombre: string;
                username: string;
                password: string;
                rol: import(".prisma/client").$Enums.Role;
                activo: boolean;
            };
        } & {
            id: string;
            tipo: string;
            sn: string | null;
            mac: string | null;
            estado: import(".prisma/client").$Enums.EquipoEstado;
            updatedAt: Date;
            marca: string | null;
            modelo: string | null;
            fuente: boolean;
            hdmi: boolean;
            patchcord_sc: boolean;
            patchcord_utp: boolean;
            createdAt: Date;
            poseedorId: string | null;
        })[];
        tecnicosEstado: {
            id: string;
            nombre: string;
            activo: boolean;
        }[];
    }>;
    buscarSolicitud(numSolicitud: string): Promise<{
        tipo: string;
        data: {
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
                materialId: string;
                cantidad: number;
                instalacionId: string;
            })[];
        } & {
            id: string;
            tipo: string;
            estado: import(".prisma/client").$Enums.SolicitudEstado;
            tecnicoId: string;
            fecha: Date;
            numSolicitud: string;
            cliente: string;
            observacion: string | null;
            latitud: number | null;
            longitud: number | null;
            fotos: string[];
            firmaDigital: string | null;
            router_sn: string | null;
            iptv_macs: string[];
        };
    } | {
        tipo: string;
        data: {
            tecnico: {
                nombre: string;
            };
        } & {
            id: string;
            tecnicoId: string;
            numSolicitud: string;
            firmaDigital: string | null;
            clienteNombre: string;
            tecnicoCelular: string | null;
            fechaRetiro: Date;
            sn_mac: string;
            mac_deco: string | null;
            tipo_servicio: string;
            estadoEquipo: string;
            accesorios: string;
            observaciones: string | null;
        };
    }>;
    getMaterialesGlobal(): Promise<{
        id: string;
        nombre: string;
        unidad: string;
        cantidadTotal: number;
    }[]>;
    getStockGlobalCompleto(): Promise<{
        materiales: {
            id: string;
            nombre: string;
            unidad: string;
            cantidadTotal: number;
        }[];
        equiposBodega: {
            id: string;
            tipo: string;
            sn: string | null;
            mac: string | null;
            estado: import(".prisma/client").$Enums.EquipoEstado;
            updatedAt: Date;
            marca: string | null;
            modelo: string | null;
            fuente: boolean;
            hdmi: boolean;
            patchcord_sc: boolean;
            patchcord_utp: boolean;
            createdAt: Date;
            poseedorId: string | null;
        }[];
    }>;
    registrarInstalacion(data: {
        tecnicoId: string;
        clienteNombre: string;
        solicitudNumero: string;
        equiposIds: string[];
        materiales: {
            id: string;
            cantidad: number;
        }[];
    }): Promise<{
        id: string;
        tipo: string;
        estado: import(".prisma/client").$Enums.SolicitudEstado;
        tecnicoId: string;
        fecha: Date;
        numSolicitud: string;
        cliente: string;
        observacion: string | null;
        latitud: number | null;
        longitud: number | null;
        fotos: string[];
        firmaDigital: string | null;
        router_sn: string | null;
        iptv_macs: string[];
    }>;
}
