import { Controller, Get, Patch, Param, Body, Post } from '@nestjs/common';
import { HerramientasService } from './herramientas.service';

@Controller('herramientas')
export class HerramientasController {
  constructor(private readonly herramientasService: HerramientasService) {}

  @Get()
  findAll() {
    return this.herramientasService.findAll();
  }

  @Post()
  create(@Body() data: { nombre: string }) {
    return this.herramientasService.create(data);
  }

  @Patch(':id/devolver')
  devolver(@Param('id') id: string) {
    return this.herramientasService.marcarComoDevuelta(id);
  }
}