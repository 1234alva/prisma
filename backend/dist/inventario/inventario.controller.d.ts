import { InventarioService } from './inventario.service';
import { PrismaService } from '../prisma.service';
export declare class InventarioController {
    private invService;
    private prisma;
    constructor(invService: InventarioService, prisma: PrismaService);
    regMaterial(data: any): Promise<{
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
    asignarTodo(data: {
        tecnicoId: string;
        materiales: any[];
        equiposIds: string[];
        herramientasIds: string[];
    }): Promise<void>;
    buscar(solicitud: string): Promise<{
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
    toggleEstado(id: string, data: {
        activo: boolean;
    }): Promise<{
        id: string;
        updatedAt: Date;
        createdAt: Date;
        nombre: string;
        username: string;
        password: string;
        rol: import(".prisma/client").$Enums.Role;
        activo: boolean;
    }>;
    getStock(id: string): Promise<{
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
    getInventarioGeneral(): Promise<{
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
    getEquiposRecuperados(): Promise<({
        poseedor: {
            nombre: string;
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
    })[]>;
    getHerramientas(): Promise<({
        poseedor: {
            nombre: string;
        };
    } & {
        id: string;
        estado: string;
        poseedorId: string | null;
        nombre: string;
    })[]>;
    asignarMaterial(data: {
        tecnicoId: string;
        materialId: string;
        cantidad: number;
    }): Promise<void>;
    asignarEquipo(data: {
        tecnicoId: string;
        equipoId: string;
    }): Promise<void>;
    ingresoAlternativo(data: any): Promise<{
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
    getDisponible(): Promise<{
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
    }[]>;
    procesarRecuperado(id: string, data: {
        nuevoEstado: 'DISPONIBLE' | 'DANADO';
    }): Promise<{
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
    }>;
    getHistorial(): Promise<({
        material: {
            nombre: string;
        };
        usuario: {
            nombre: string;
        };
    } & {
        id: string;
        tipo: string;
        createdAt: Date;
        materialId: string;
        cantidad: number;
        usuarioId: string;
        motivo: string | null;
    })[]>;
}
