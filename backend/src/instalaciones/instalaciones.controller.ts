import { 
  Controller, Post, Body, Get, Param, Res, HttpStatus, 
  InternalServerErrorException, UseInterceptors, UploadedFiles, BadRequestException 
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express'; 
import { InstalacionesService } from './instalaciones.service';
import { ReporteService } from './reporte.service';
import { RecuperacionService } from './recuperacion.service'; 
import { PrismaService } from '../prisma.service';
import { Response } from 'express';
import { EquipoEstado } from '@prisma/client'; 

@Controller('instalaciones')
export class InstalacionesController {
  constructor(
    private readonly instService: InstalacionesService,
    private readonly reporteService: ReporteService,
    private readonly prisma: PrismaService,
    private readonly recuperacionService: RecuperacionService 
  ) {}

  // ======================================================
  // 1. ESTADÍSTICAS REALES PARA EL DASHBOARD (CORREGIDO)
  // ======================================================
  @Get('stats/globales')
  async obtenerStatsGlobales() {
    try {
      const [equiposStock, enCampo, totalRecuperados, pendientes] = await Promise.all([
        // Equipos disponibles en almacén
        this.prisma.equipo.count({ where: { estado: EquipoEstado.DISPONIBLE } }),
        
        // Equipos que tienen los técnicos
        this.prisma.equipo.count({ where: { estado: EquipoEstado.ASIGNADO } }),
        
        // Conteo de la tabla EquipoRecuperado (lo que Armin retira)
        this.prisma.equipoRecuperado.count(),
        
        // Tareas pendientes (Usamos la tabla Asignacion de tu esquema)
        this.prisma.asignacion.count({ where: { completada: false } })
      ]);

      // Calculamos el total de fibra usada sumando la tabla MaterialUsado
      const materiales = await this.prisma.materialUsado.findMany({
        where: { material: { nombre: { contains: 'DROP', mode: 'insensitive' } } }
      });
      const fibraKm = materiales.reduce((acc, curr) => acc + curr.cantidad, 0) / 1000;

      return {
        equiposStock,
        enCampo,
        totalRecuperados,
        pendientes,
        fibraKm: parseFloat(fibraKm.toFixed(2))
      };
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: 'Error al calcular estadísticas globales',
        error: error.message
      });
    }
  }

  // ======================================================
  // 2. REGISTRAR RECUPERO (ARMIN)
  // ======================================================
  @Post('recuperar')
  async registrarRecupero(@Body() data: any) {
    try {
      if (!data.tecnicoId) {
        throw new BadRequestException('El ID del técnico es obligatorio.');
      }
      return await this.recuperacionService.registrar(data, data.tecnicoId);
    } catch (error: any) { 
      throw new InternalServerErrorException({ 
        message: 'Error al procesar el recupero', 
        error: error.message 
      });
    }
  }

  // ======================================================
  // 3. HISTORIAL DE RECUPERACIONES
  // ======================================================
  @Get('recuperaciones/todas')
  async obtenerTodasLasRecuperaciones() {
    try {
      return await this.prisma.equipoRecuperado.findMany({
        include: {
          tecnico: {
            select: { nombre: true }
          }
        },
        orderBy: { fechaRetiro: 'desc' }
      });
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: 'Error al obtener el historial',
        error: error.message
      });
    }
  }

  // 4. CREAR INSTALACIÓN
  @Post()
  @UseInterceptors(FilesInterceptor('fotos')) 
  async crear(@Body() data: any, @UploadedFiles() files?: Express.Multer.File[]) {
    try {
      if (!data.tecnicoId) {
        throw new BadRequestException('El ID del técnico es obligatorio.');
      }
      const nombresFotos = files?.map(f => f.filename) || [];
      const payload = {
        ...data,
        fotos: nombresFotos.length > 0 ? nombresFotos : (data.fotos || [])
      };
      return await this.instService.crear(payload, data.tecnicoId);
    } catch (error: any) {
      throw new InternalServerErrorException({ 
        message: 'Error al crear la instalación', 
        error: error.message 
      });
    }
  }

  // 5. HISTORIAL PARA EL TÉCNICO
  @Get('tecnico/:tecnicoId')
  async obtenerHistorialTecnico(@Param('tecnicoId') tecnicoId: string) {
    try {
      return await this.prisma.instalacion.findMany({
        where: { tecnicoId },
        include: {
          materialesUsados: { include: { material: true } }
        },
        orderBy: { fecha: 'desc' }
      });
    } catch (error: any) {
      throw new InternalServerErrorException({ 
        message: 'Error al obtener historial', 
        error: error.message 
      });
    }
  }

  // 6. REPORTE DEL DÍA
  @Get('reporte-dia/:tecnicoId')
  async reporteDia(@Param('tecnicoId') tecnicoId: string) {
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);
    const finDia = new Date();
    finDia.setHours(23, 59, 59, 999);

    return this.prisma.instalacion.findMany({
      where: {
        tecnicoId,  
        fecha: { gte: inicioDia, lte: finDia }
      },
      include: { tecnico: { select: { nombre: true } } },
      orderBy: { fecha: 'desc' }
    });
  }

  // 7. DETALLE Y PDF
  @Get(':id')
  async obtenerUna(@Param('id') id: string) {
    return this.instService.obtenerDetalleCompleto(id);
  }

  @Get(':id/pdf')
  async descargarPdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const instalacion = await this.instService.obtenerDetalleCompleto(id);
      if (!instalacion) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'No encontrado' });
      }
      return await this.reporteService.generarActaInstalacion(instalacion, res);
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        message: 'Error PDF', 
        error: error.message 
      });
    }
  }
}