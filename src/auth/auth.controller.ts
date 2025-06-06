import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { LocalStrategy } from './local.strategy';
import type { JwtStrategy } from './jwt.strategy';
import { RegisterDto } from './dto/register.dto';
type LocalValidatedUser = Awaited<ReturnType<LocalStrategy['validate']>>;

type JwtValidatedUser = Awaited<ReturnType<JwtStrategy['validate']>>;

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body.username, body.password);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: { user: LocalValidatedUser }) {
    return this.authService.login(req.user);
  }

  // JWT测试
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req: { user: JwtValidatedUser }) {
    return req.user;
  }
}
