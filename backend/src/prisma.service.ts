import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Se ejecuta cuando el servidor arranca
  async onModuleInit() {
    await this.$connect();
  }

  // Se ejecuta cuando el servidor se apaga (evita fugas de memoria)
  async onModuleDestroy() {
    await this.$disconnect();
  }
}