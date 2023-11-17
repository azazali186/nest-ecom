import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString({
    message: 'INVALID_FORMAT_USERNAME',
  })
  @MaxLength(20, {
    message: 'MAX_LENGTH_USERNAME_ERROR',
  })
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'INVALID_FORMAT_USERNAME',
  })
  @IsNotEmpty({
    message: 'USERNAME_IS REQUIRED',
  })
  username: string;

  @ApiProperty()
  @IsString({
    message: 'INVALID_FORMAT_PASSWORD',
  })
  @MinLength(6, {
    message: 'MIN_LENGTH_PASSWORD_ERROR',
  })
  @Matches(/^(?=.*?[A-Za-z])(?=.*?[0-9]).*$/, {
    message: 'INVALID_FORMAT_PASSWORD',
  })
  @IsNotEmpty({
    message: 'PASSWORD_IS REQUIRED',
  })
  password: string;
}
