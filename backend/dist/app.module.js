"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const instalaciones_module_1 = require("./instalaciones/instalaciones.module");
const uploads_module_1 = require("./uploads/uploads.module");
const inventario_module_1 = require("./inventario/inventario.module");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const herramientas_module_1 = require("./herramientas/herramientas.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/public/uploads',
            }),
            auth_module_1.AuthModule,
            instalaciones_module_1.InstalacionesModule,
            uploads_module_1.UploadsModule,
            inventario_module_1.InventarioModule,
            usuarios_module_1.UsuariosModule,
            herramientas_module_1.HerramientasModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map