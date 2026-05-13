import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private prisma: PrismaService) {}

  // 1. Método para CREAR personal (POST /usuarios)
  @Post()
  async create(@Body() data: any) {
    return this.prisma.usuario.create({
      data: {
        username: data.username,
        password: data.password, 
        nombre: data.nombre,
        rol: data.rol || 'TECNICO',
        activo: data.activo ?? true,
        // Al crear un técnico, Prisma ya sabe que stockPersonal empieza vacío
      },
    });
  }

  // Login simple (POST /usuarios/login)
  @Post('login')
  async login(@Body() data: any) {
    const user = await this.prisma.usuario.findUnique({
      where: { username: data.username },
    });
    if (!user || user.password !== data.password) throw new Error('Credenciales inválidas');
    return user;
  }

  // Cambio de estado (PATCH /usuarios/:id/asistencia)
  @Patch(':id/asistencia')
  async toggleAsistencia(@Param('id') id: string, @Body('activo') activo: boolean) {
    return this.prisma.usuario.update({
      where: { id },
      data: { activo },
    });
  }

  @Get()
  async findAll() {
    return this.prisma.usuario.findMany({
      include: { 
        _count: { 
          select: { instalaciones: true } 
        },
        
        stockPersonal: {
          include: {
            material: true
          }
        }
      }
    });
  }
}