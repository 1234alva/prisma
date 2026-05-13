import { Module } from '@nestjs/common';
import { InstalacionesController } from './instalaciones.controller';
import { InstalacionesService } from './instalaciones.service';
import { RecuperacionService } from './recuperacion.service';
import { ReporteService } from './reporte.service';
import { PrismaService } from '../prisma.service';

@Module({
  
  controllers: [InstalacionesController],
  
 
  providers: [
    InstalacionesService, 
    RecuperacionService,  
    ReporteService,      
    PrismaService         
  ],
  
  exports: [InstalacionesService, RecuperacionService]
})
export class InstalacionesModule {}