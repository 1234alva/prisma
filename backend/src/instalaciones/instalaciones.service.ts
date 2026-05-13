import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SolicitudEstado } from '@prisma/client';

@Injectable()
export class InstalacionesService {
  constructor(private prisma: PrismaService) {}

  async crear(data: any, tecnicoId: string) {
    // 1. Validar que el técnico existe
    const tecnico = await this.prisma.usuario.findUnique({ where: { id: tecnicoId } });
    if (!tecnico) {
      throw new BadRequestException('El técnico no existe en la base de datos.');
    }

    return this.prisma.$transaction(async (tx) => {
      try {
        const lat = data.latitud ? parseFloat(data.latitud) : null;
        const lon = data.longitud ? parseFloat(data.longitud) : null;

        // 2. Crear el registro de la Instalación
        const instalacion = await tx.instalacion.create({
          data: {
            numSolicitud: String(data.solicitud || data.numSolicitud),
            cliente: data.cliente || 'CLIENTE NUEVO',
            tipo: data.tipo || 'SIMPLE',
            router_sn: data.snRouter,
            iptv_macs: data.macs ? (typeof data.macs === 'string' ? JSON.parse(data.macs) : data.macs) : [],
            latitud: lat,
            longitud: lon,
            fotos: data.fotos || [],
            tecnicoId: tecnicoId,
            estado: SolicitudEstado.EJECUTADA,
            observacion: data.observaciones || '',
          },
        });

        // 3. Actualizar el estado del Equipo (Router)
        // Sincronización: Pasa de 'ASIGNADO' a 'INSTALADO' y deja de pertenecer al técnico
        if (data.snRouter) {
          await tx.equipo.update({
            where: { sn: data.snRouter },
            data: { 
              estado: 'INSTALADO',
              poseedorId: null 
            }
          });
        }

        // 4. Procesar Materiales (Descuento de Stock y Registro de Uso)
        const materialesAProcesar = [
          { key: 'cableDrop', nombreBD: 'CABLE DROP' },
          { key: 'tensores', nombreBD: 'TENSORES' },
          { key: 'rosetas', nombreBD: 'ROSETAS' },
          { key: 'conectores', nombreBD: 'CONECTORES' },
          { key: 'grampas', nombreBD: 'GRAMPAS' }, // Añadido grampas por si acaso
        ];

        for (const mat of materialesAProcesar) {
          const cantidad = Number(data[mat.key]);
          if (cantidad > 0) {
            const materialGlobal = await tx.material.findFirst({ where: { nombre: mat.nombreBD } });
            
            if (materialGlobal) {
              // A. Descontar del Stock Personal del Técnico
              await tx.stockTecnico.update({
                where: {
                  tecnicoId_materialId: {
                    tecnicoId: tecnicoId,
                    materialId: materialGlobal.id,
                  },
                },
                data: { utilizado: { increment: cantidad } },
              });

              // B. Registrar en MaterialUsado (Para el reporte detallado del Admin)
              await tx.materialUsado.create({
                data: {
                  cantidad: cantidad,
                  instalacionId: instalacion.id,
                  materialId: materialGlobal.id
                }
              });
            }
          }
        }

        return instalacion;
      } catch (error: any) {
        console.error("Error en transacción de instalación:", error);
        throw new InternalServerErrorException({
          message: 'Error al procesar la instalación en la base de datos',
          detail: error.message
        });
      }
    });
  }

  // Obtener detalle para ver el historial o generar PDF
  async obtenerDetalleCompleto(id: string) {
    const instalacion = await this.prisma.instalacion.findUnique({
      where: { id },
      include: {
        tecnico: {
          select: { nombre: true, username: true }
        },
        materialesUsados: {
          include: { material: true }
        }
      },
    });

    if (!instalacion) throw new NotFoundException('La instalación no existe.');
    
    return instalacion;
  }

  // BUSCADOR PARA EL ADMIN (Por solicitud)
  async buscarPorSolicitud(num: string) {
    return this.prisma.instalacion.findUnique({
      where: { numSolicitud: num },
      include: { 
        tecnico: { select: { nombre: true } },
        materialesUsados: { include: { material: true } }
      }
    });
  }
}