import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async crearUsuario(data: any) {
    return this.prisma.usuario.create({ data });
  }

  async obtenerTodos() {
    return this.prisma.usuario.findMany({
      include: {
        // Traemos el stock personal y entramos a ver el nombre del material
        stockPersonal: {
          include: {
            material: true,
          },
        },
        // Traemos el conteo de instalaciones para el "Resumen de Carga"
        _count: {
          select: {
            instalaciones: true,
          },
        },
      },
    });
  }

  async actualizarAsistencia(id: string, activo: boolean) {
    return this.prisma.usuario.update({
      where: { id },
      data: { activo },
    });
  }
}