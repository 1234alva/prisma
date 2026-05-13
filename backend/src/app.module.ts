import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { InstalacionesModule } from './instalaciones/instalaciones.module';
import { UploadsModule } from './uploads/uploads.module';
import { InventarioModule } from './inventario/inventario.module'; 
import { UsuariosModule } from './usuarios/usuarios.module'; 
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HerramientasModule } from './herramientas/herramientas.module';

@Module({
  imports: [
    
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/public/uploads', 
    }),
    
    AuthModule,
    InstalacionesModule, 
    UploadsModule,
    InventarioModule,
    UsuariosModule,
    HerramientasModule,
  ],
  controllers: [],
  providers: [], 
})
export class AppModule {}