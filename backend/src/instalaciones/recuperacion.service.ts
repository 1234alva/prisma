import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EquipoEstado } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class RecuperacionService {
  constructor(private prisma: PrismaService) {}

  async registrar(data: any, tecnicoId: string) {
    return this.prisma.$transaction(async (tx) => {
      try {
        
        const estadoFinal: EquipoEstado = data.estadoEquipo === 'BUENO' 
          ? EquipoEstado.ASIGNADO 
          : EquipoEstado.RECUPERADO;

        const snLimpio = String(data.sn_mac || '').trim().toUpperCase();
        const macIptvLimpia = data.mac_iptv ? String(data.mac_iptv).trim().toUpperCase() : null;

        // 2. Crear el registro histórico (La boleta que ve el Admin)
        const registro = await tx.equipoRecuperado.create({
          data: {
            numSolicitud: String(data.numSolicitud),
            clienteNombre: String(data.clienteNombre || 'CLIENTE S/N'),
            sn_mac: snLimpio,
            mac_deco: macIptvLimpia,
            tipo_servicio: String(data.tipo || 'ROUTER'),
            estadoEquipo: String(data.estadoEquipo || 'MALO'),
            accesorios: String(data.accesorios || 'Completo'),
            observaciones: String(data.observaciones || ''),
            tecnicoId: tecnicoId,
          }
        });

        // 3. UPSERT DEL ROUTER / ONT
        // Si el equipo ya existe por SN, solo actualizamos el estado y quién lo tiene.
        if (snLimpio && snLimpio !== '') {
          await tx.equipo.upsert({
            where: { sn: snLimpio },
            update: {
              estado: estadoFinal,
              poseedorId: tecnicoId, // Sigue en manos del técnico hasta que lo entregue al almacén
            },
            create: {
              id: randomUUID(),
              tipo: 'ROUTER',
              sn: snLimpio,
              estado: estadoFinal,
              poseedorId: tecnicoId,
              marca: 'GENERICA',
              modelo: 'RECUPERADO',
              fuente: true,
              hdmi: false,
              patchcord_sc: false,
              patchcord_utp: false
            },
          });
        }

        // 4. UPSERT DEL DECO (Solo si el servicio es IPTV y viene la MAC)
        if (data.tipo === 'IPTV' && macIptvLimpia) {
          await tx.equipo.upsert({
            where: { mac: macIptvLimpia },
            update: {
              estado: estadoFinal,
              poseedorId: tecnicoId,
            },
            create: {
              id: randomUUID(),
              tipo: 'IPTV',
              mac: macIptvLimpia,
              estado: estadoFinal,
              poseedorId: tecnicoId,
              marca: 'GENERICA',
              modelo: 'RECUPERADO',
              fuente: true,
              hdmi: true,
              patchcord_sc: false,
              patchcord_utp: false
            },
          });
        }

        return registro;

      } catch (error: any) {
        console.error('ERROR EN OPERACIÓN DE RECUPERO:', error);
        throw new InternalServerErrorException({
          message: 'Error al procesar el recupero y asignar stock circulante',
          detail: error.message
        });
      }
    });
  }
}