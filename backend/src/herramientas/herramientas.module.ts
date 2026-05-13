import { Module } from '@nestjs/common';
import { HerramientasService } from './herramientas.service';
import { HerramientasController } from './herramientas.controller';
import { PrismaService } from '../prisma.service'; // Ruta al archivo original

@Module({
  controllers: [HerramientasController],
  providers: [HerramientasService, PrismaService], // Inyectamos el servicio original
  exports: [HerramientasService]
})
export class HerramientasModule {}