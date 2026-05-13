import { Controller, Post, Body, Get, Param, BadRequestException, Patch, Query, InternalServerErrorException } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { PrismaService } from '../prisma.service';

@Controller('inventario')
export class InventarioController {
  constructor(
    private invService: InventarioService,
    private prisma: PrismaService
  ) {}

  // ======================================================
  // 1. REGISTRO DE ENTRADA (ALMACENERO)
  // Equipos (SN) o Materiales Consumibles
  // ======================================================
  @Post('registrar-material')
  async regMaterial(@Body() data: any) {
    try {
      return await this.invService.registrarIngresoAlmacen(data);
    } catch (error) {
      console.error('Error en registrar-material:', error);
      throw new InternalServerErrorException('Error al registrar material en BD');
    }
  }

  // ======================================================
  // 2. ASIGNACIÓN MASIVA (ALMACENERO -> TÉCNICO)
  // Sincroniza materiales, equipos y herramientas de un solo golpe
  // ======================================================
  @Post('asignar-todo')
  async asignarTodo(@Body() data: { tecnicoId: string, materiales: any[], equiposIds: string[], herramientasIds: string[] }) {
    if (!data.tecnicoId) throw new BadRequestException('Se requiere el ID del técnico');
    try {
      return await this.invService.asignarTodoAlTecnico(data.tecnicoId, data);
    } catch (error) {
      console.error('Error en asignar-todo:', error);
      throw new InternalServerErrorException('Error al procesar la asignación');
    }
  }

  // ======================================================
  // 3. RECEPCIÓN DE RECUPERADOS (ALMACENERO RECIBE DE TÉCNICO)
  // Limpia el stock del técnico y devuelve los equipos a bodega
  // ======================================================
  @Patch('recibir-recuperados')
  async recibirRecuperados(@Body() data: { equipoIds: string[] }) {
    if (!data.equipoIds || data.equipoIds.length === 0) {
      throw new BadRequestException('Debe proporcionar al menos un ID de equipo');
    }
    try {
      return await this.invService.recibirRecuperadosEnBodega(data.equipoIds);
    } catch (error) {
      console.error('Error en recibir-recuperados:', error);
      throw new InternalServerErrorException('Error al recibir equipos en bodega');
    }
  }

  // ======================================================
  // 4. BUSCADOR UNIVERSAL (ADMIN / ALMACENERO)
  // Busca por Número de Solicitud en Instalaciones o Recuperaciones
  // ======================================================
  @Get('buscar')
  async buscar(@Query('solicitud') solicitud: string) {
    if (!solicitud) throw new BadRequestException('Debe ingresar un número de solicitud');
    return this.invService.buscarSolicitud(solicitud);
  }

  // ======================================================
  // 5. CONTROL DE PERSONAL Y ESTADO
  // ======================================================
  @Patch('estado-tecnico/:id')
  async toggleEstado(@Param('id') id: string, @Body() data: { activo: boolean }) {
    return this.prisma.usuario.update({
      where: { id },
      data: { activo: data.activo }
    });
  }

  // ======================================================
  // 6. RUTAS DE CONSULTA (TÉCNICO / DASHBOARD)
  // ======================================================
  
  // Stock que el técnico ve en su celular (incluye sus recuperados)
  @Get('tecnico/:id')
  async getStock(@Param('id') id: string) {
    return this.invService.getStockTecnico(id);
  }

  // Inventario General para el Dashboard de Logística
  @Get('general')
  async getInventarioGeneral() {
    return this.invService.getStockGlobalCompleto();
  }

  // RUTA AGREGADA: Para corregir el error 404 del Frontend
  @Get('materiales')
  async getMateriales() {
    return this.invService.getMaterialesGlobal();
  }

  // Ver lista de lo que está en estado RECUPERADO (pendientes de ingreso a bodega)
  @Get('equipos-recuperados')
  async getEquiposRecuperados() {
    return this.prisma.equipo.findMany({
      where: { estado: 'RECUPERADO' },
      include: {
        poseedor: { select: { nombre: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  // Listado de herramientas y quién las tiene
  @Get('herramientas')
  async getHerramientas() {
    return this.prisma.herramienta.findMany({
      include: { 
        poseedor: { select: { nombre: true } } 
      }
    });
  }

  // ======================================================
  // 7. COMPATIBILIDAD Y REPORTES
  // ======================================================
  
  @Get('stock/disponible')
  async getDisponible() {
    const stock = await this.invService.getStockGlobalCompleto();
    return stock.equiposBodega;
  }

  @Patch('procesar-recuperado/:id')
  async procesarRecuperado(
    @Param('id') id: string, 
    @Body() data: { nuevoEstado: 'DISPONIBLE' | 'DANADO' }
  ) {
    return this.prisma.equipo.update({
      where: { id },
      data: { 
        estado: data.nuevoEstado,
        poseedorId: null 
      }
    });
  }

  @Get('historial')
  async getHistorial() {
    return this.prisma.movimientoInventario.findMany({
      take: 100, 
      orderBy: { createdAt: 'desc' },
      include: {
        usuario: { select: { nombre: true } },
        material: { select: { nombre: true } },
      }
    });
  }

  // ======================================================
  // 8. MÉTODOS LEGACY (SINCRONIZACIÓN CON FRONTEND)
  // ======================================================

  @Post('asignar-material')
  async asignarMaterial(@Body() data: { tecnicoId: string, materialId: string, cantidad: number }) {
    if (data.cantidad <= 0) throw new BadRequestException('La cantidad debe ser mayor a 0');
    return this.invService.asignarTodoAlTecnico(data.tecnicoId, {
      materiales: [{ id: data.materialId, cantidad: data.cantidad }]
    });
  }

  @Post('asignar-equipo')
  async asignarEquipo(@Body() data: { tecnicoId: string, equipoId: string }) {
    return this.invService.asignarTodoAlTecnico(data.tecnicoId, {
      equiposIds: [data.equipoId]
    });
  }

  @Post('ingreso')
  async ingresoAlternativo(@Body() data: any) {
    try {
      console.log('Datos recibidos en /ingreso:', data);
      return await this.invService.registrarIngresoAlmacen(data);
    } catch (error) {
      console.error('Error detallado en /ingreso:', error);
      throw new InternalServerErrorException('Error en el proceso de ingreso');
    }
  }
}