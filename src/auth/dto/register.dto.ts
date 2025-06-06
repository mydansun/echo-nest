import { IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(4, 16)
  username: string;

  @IsString()
  @Length(6, 32)
  password: string;
}
