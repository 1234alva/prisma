import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EquipoEstado, SolicitudEstado, Role } from '@prisma/client';

@Injectable()
export class InventarioService {
  constructor(private prisma: PrismaService) {}

  // ==========================================
  // 1. REGISTRAR INGRESO (ALMACENERO) - MODIFICADO
  // ==========================================
  async registrarIngresoAlmacen(data: any) {
    try {
      // MODIFICACIÓN: Si el tipo es 'MATERIAL', ignoramos la lógica de equipos
      // Esto permite ingresar tensores, anillas, etc., sin que pida SN.
      const esEquipo = data.tipo !== 'MATERIAL' && (
        data.tipo === 'ROUTER' || 
        data.tipo === 'IPTV' || 
        data.tipo === 'MESH' || 
        (data.sn && data.sn.trim() !== "")
      );

      if (esEquipo) {
        const serial = (data.sn || data.identificador || '').toUpperCase().trim();
        if (!serial) throw new BadRequestException('El Número de Serie (SN) es obligatorio para equipos.');

        return await this.prisma.equipo.upsert({
          where: { sn: serial },
          update: {
            estado: EquipoEstado.DISPONIBLE,
            poseedorId: null,
            modelo: (data.modelo || 'GENERICO').toUpperCase(),
            updatedAt: new Date(),
          },
          create: {
            sn: serial,
            tipo: data.tipo || 'ROUTER',
            modelo: (data.modelo || 'GENERICO').toUpperCase(),
            estado: EquipoEstado.DISPONIBLE,
            mac: data.mac ? data.mac.toUpperCase() : null,
            fuente: data.fuente ?? true,
            hdmi: data.hdmi ?? false,
            patchcord_sc: data.patchcord_sc ?? false,
            patchcord_utp: data.patchcord_utp ?? false,
          }
        });
      }

      // Lógica para Materiales (Tensores, Cable, Hebillas, Rosetas, etc.)
      const nombreMat = (data.nombre || data.modelo || '').toUpperCase().trim();
      const cant = Math.floor(Number(data.cantidad || data.identificador || 0));

      if (!nombreMat) throw new BadRequestException('El nombre del material es obligatorio.');
      if (isNaN(cant) || cant <= 0) throw new BadRequestException('La cantidad debe ser un número válido mayor a 0.');

      return await this.prisma.material.upsert({
        where: { nombre: nombreMat },
        update: { 
          cantidadTotal: { increment: cant } 
        },
        create: { 
          nombre: nombreMat, 
          unidad: (data.unidad || 'UNIDADES').toUpperCase(), 
          cantidadTotal: cant 
        }
      });
    } catch (error: any) {
      console.error('Error en registrarIngresoAlmacen:', error.message);
      throw new BadRequestException(error.message);
    }
  }

  // ==========================================
  // 2. ASIGNACIÓN MASIVA A TÉCNICO
  // ==========================================
  async asignarTodoAlTecnico(tecnicoId: string, data: any) {
    return this.prisma.$transaction(async (tx) => {
      // Asignar Equipos (Validando disponibilidad)
      if (data.equiposIds && data.equiposIds.length > 0) {
        const equiposDisponibles = await tx.equipo.findMany({
          where: { id: { in: data.equiposIds }, estado: EquipoEstado.DISPONIBLE }
        });

        if (equiposDisponibles.length !== data.equiposIds.length) {
          throw new BadRequestException('Uno o más equipos no están disponibles o ya fueron asignados.');
        }

        await tx.equipo.updateMany({
          where: { id: { in: data.equiposIds } },
          data: { poseedorId: tecnicoId, estado: EquipoEstado.ASIGNADO }
        });
      }

      // Asignar Materiales
      if (data.materiales && data.materiales.length > 0) {
        for (const m of data.materiales) {
          const matId = m.id || m.materialId;
          const cantidad = Math.floor(Number(m.cantidad));

          const material = await tx.material.findUnique({ where: { id: matId } });
          if (!material || material.cantidadTotal < cantidad) {
            throw new BadRequestException(`Stock insuficiente en bodega para: ${material?.nombre || 'Material'}`);
          }

          await tx.material.update({
            where: { id: matId },
            data: { cantidadTotal: { decrement: cantidad } }
          });

          await tx.stockTecnico.upsert({
            where: { tecnicoId_materialId: { tecnicoId, materialId: matId } },
            update: { asignado: { increment: cantidad } },
            create: { tecnicoId, materialId: matId, asignado: cantidad, utilizado: 0 }
          });
        }
      }

      // Asignar Herramientas
      if (data.herramientasIds && data.herramientasIds.length > 0) {
        await tx.herramienta.updateMany({
          where: { id: { in: data.herramientasIds } },
          data: { poseedorId: tecnicoId, estado: 'ASIGNADA' }
        });
      }
    });
  }

  // ==========================================
  // 3. OBTENER STOCK COMPLETO DEL TÉCNICO
  // ==========================================
  async getStockTecnico(tecnicoId: string) {
    const [materialesStock, todosLosEquipos, herramientas] = await Promise.all([
      this.prisma.stockTecnico.findMany({
        where: { tecnicoId },
        include: { material: true }
      }),
      this.prisma.equipo.findMany({
        where: { poseedorId: tecnicoId },
      }),
      this.prisma.herramienta.findMany({
        where: { poseedorId: tecnicoId }
      })
    ]);

    return {
      materiales: materialesStock.map(item => ({
        id: item.materialId,
        nombre: item.material.nombre,
        unidad: item.material.unidad,
        cantidad: item.asignado - item.utilizado,
      })),
      equipos: todosLosEquipos
        .filter(e => e.estado === EquipoEstado.ASIGNADO || e.estado === EquipoEstado.DISPONIBLE)
        .map(e => ({
          id: e.id,
          tipo: e.tipo,
          serie: e.sn || e.mac || 'S/N',
          estado: e.estado,
          modelo: e.modelo
        })),
      herramientas: herramientas.map(h => ({
        id: h.id,
        nombre: h.nombre,
        serie: 'ASIGNADA'
      })),
      recuperados: todosLosEquipos
        .filter(e => e.estado === EquipoEstado.RECUPERADO)
        .map((e: any) => ({
          id: e.id,
          tipo: e.tipo,
          serie: e.sn || e.mac || 'S/N',
          estado: e.estado,
          modelo: e.modelo,
          fecha: e.updatedAt
        }))
    };
  }

  // ==========================================
  // 4. DASHBOARD GLOBAL Y REPORTES
  // ==========================================
  async getStockGlobalCompleto() {
    const [materiales, equiposBodega] = await Promise.all([
      this.prisma.material.findMany({ orderBy: { nombre: 'asc' } }),
      this.prisma.equipo.findMany({
        where: { poseedorId: null, estado: EquipoEstado.DISPONIBLE },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const fibraKm = materiales
      .filter(m => m.nombre.includes('CABLE') || m.nombre.includes('DROP'))
      .reduce((acc, curr) => acc + (curr.cantidadTotal / 1000), 0);

    return { 
      materiales, 
      equiposBodega, 
      equiposStock: equiposBodega.length, 
      fibraKm: fibraKm.toFixed(2) 
    };
  }

  async getReporteSincronizado() {
    const [materiales, equipos, tecnicos] = await Promise.all([
      this.prisma.material.findMany({ orderBy: { nombre: 'asc' } }),
      this.prisma.equipo.findMany({ include: { poseedor: true } }),
      this.prisma.usuario.findMany({ where: { rol: Role.TECNICO }, orderBy: { nombre: 'asc' } })
    ]);

    return {
      stockAlmacen: materiales,
      equiposEnBodega: equipos.filter(e => !e.poseedorId),
      equiposEnCampo: equipos.filter(e => e.poseedorId),
      tecnicosEstado: tecnicos.map(t => ({
        id: t.id,
        nombre: t.nombre,
        activo: t.activo 
      }))
    };
  }

  // ==========================================
  // 5. BUSCADOR POR SOLICITUD
  // ==========================================
  async buscarSolicitud(numSolicitud: string) {
    const instalacion = await this.prisma.instalacion.findUnique({
      where: { numSolicitud },
      include: { 
        tecnico: { select: { nombre: true } }, 
        materialesUsados: { include: { material: true } } 
      }
    });
    
    if (instalacion) return { tipo: 'INSTALACION', data: instalacion };

    const recuperado = await this.prisma.equipoRecuperado.findFirst({
      where: { numSolicitud },
      include: { tecnico: { select: { nombre: true } } }
    });

    if (recuperado) return { tipo: 'RECUPERACION', data: recuperado };
    
    throw new NotFoundException(`No se encontró registro para la solicitud: ${numSolicitud}`);
  }

  async getMaterialesGlobal() {
    return this.prisma.material.findMany({ orderBy: { nombre: 'asc' } });
  }

  // ==========================================
  // 6. REGISTRAR INSTALACIÓN (CON TRAZABILIDAD)
  // ==========================================
  async registrarInstalacion(data: { 
    tecnicoId: string, 
    clienteNombre: string, 
    solicitudNumero: string,
    equiposIds: string[], 
    materiales: { id: string, cantidad: number }[] 
  }) {
    return await this.prisma.$transaction(async (tx) => {
      let routerSnReal = "S/N";

      for (const equipoId of data.equiposIds) {
        const equipo = await tx.equipo.update({
          where: { id: equipoId },
          data: {
            estado: EquipoEstado.INSTALADO,
            poseedorId: null
          }
        });
        if (equipo.tipo === 'ROUTER') routerSnReal = equipo.sn;
      }

      for (const mat of data.materiales) {
        await tx.stockTecnico.update({
          where: { 
            tecnicoId_materialId: { 
              tecnicoId: data.tecnicoId, 
              materialId: mat.id 
            } 
          },
          data: { utilizado: { increment: Math.floor(Number(mat.cantidad)) } }
        });
      }

      return tx.instalacion.create({
        data: {
          numSolicitud: data.solicitudNumero,
          cliente: data.clienteNombre,
          tecnicoId: data.tecnicoId,
          tipo: "INSTALACION FIBRA", 
          estado: SolicitudEstado.EJECUTADA,
          router_sn: routerSnReal,
          materialesUsados: {
            create: data.materiales.map(m => ({
              materialId: m.id,
              cantidad: Math.floor(Number(m.cantidad))
            }))
          }
        }
      });
    });
  }
  
  // ==========================================
  // 7. REGISTRAR EQUIPO RECUPERADO
  // ==========================================
  async registrarRecuperacion(data: any) {
    return await this.prisma.$transaction(async (tx) => {
      const registro = await tx.equipoRecuperado.create({
        data: {
          numSolicitud: data.numSolicitud,
          clienteNombre: data.clienteNombre,
          sn_mac: data.sn.toUpperCase(),
          tipo_servicio: data.tipo || 'ROUTER',
          estadoEquipo: data.estadoEquipo, 
          observaciones: data.observaciones,
          tecnicoId: data.tecnicoId,
        }
      });

      await tx.equipo.upsert({
        where: { sn: data.sn.toUpperCase() },
        update: { 
          estado: EquipoEstado.RECUPERADO, 
          poseedorId: data.tecnicoId, 
          modelo: 'RECUPERADO' 
        },
        create: {
          sn: data.sn.toUpperCase(),
          tipo: data.tipo || 'ROUTER',
          estado: EquipoEstado.RECUPERADO,
          poseedorId: data.tecnicoId,
          modelo: 'RECUPERADO'
        }
      });

      return registro;
    });
  }

  // ==========================================
  // 8. RECEPCIÓN DE EQUIPOS RECUPERADOS (BODEGA)
  // ==========================================
  async recibirRecuperadosEnBodega(equipoIds: string[]) {
    if (!equipoIds || equipoIds.length === 0) {
      throw new BadRequestException('No se proporcionaron IDs de equipos');
    }

    return this.prisma.equipo.updateMany({
      where: { 
        id: { in: equipoIds },
        estado: EquipoEstado.RECUPERADO
      },
      data: {
        poseedorId: null,
        estado: EquipoEstado.DISPONIBLE,
        updatedAt: new Date()
      }
    });
  }
}