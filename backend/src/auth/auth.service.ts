import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    
    const user = await this.prisma.usuario.findUnique({ where: { username } });
    
  
    if (user && (await bcrypt.compare(pass, user.password))) {
      
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    
    const payload = { username: user.username, sub: user.id, rol: user.rol };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nombre: user.nombre,
        rol: user.rol,
      },
    };
  }
}