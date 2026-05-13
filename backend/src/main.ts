import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors(); // Esto es vital para que React (5173) hable con Nest (3001)
  
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // ESCUCHA EN 3000 (interno Docker) Y 0.0.0.0 (para que deje entrar la señal)
  await app.listen(3000, '0.0.0.0'); 
  console.log(`JH7SRL Backend listo en puerto interno 3000`);
}
bootstrap();