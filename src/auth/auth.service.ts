import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

export interface LoginUser {
  id: number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: LoginUser) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // 注册用户（带密码加密）
  async register(username: string, password: string) {
    const existing = await this.usersService.findOneByUsername(username);
    if (existing) {
      throw new BadRequestException('Username already exists!');
    }
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const user = await this.usersService.create({ username, password: hash });
    return { id: user.id, username: user.username };
  }
}
