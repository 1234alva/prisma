import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; 

@Injectable()
export class HerramientasService {
  constructor(private prisma: PrismaService) {}

  
  async findAll() {
    return this.prisma.herramienta.findMany({
      include: {
        poseedor: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
  }

  // Lógica para devolver una herramienta
  async marcarComoDevuelta(id: string) {
    // Verificamos si existe
    const herramienta = await this.prisma.herramienta.findUnique({ where: { id } });
    if (!herramienta) throw new NotFoundException('La herramienta no existe');

    return this.prisma.herramienta.update({
      where: { id },
      data: {
        poseedorId: null,
        estado: 'DISPONIBLE',
      },
      include: { poseedor: true }
    });
  }

  // Opcional: Crear herramientas iniciales si no tienes ninguna
  async create(data: { nombre: string }) {
    return this.prisma.herramienta.create({
      data: {
        nombre: data.nombre,
        estado: 'DISPONIBLE',
      },
    });
  }
}