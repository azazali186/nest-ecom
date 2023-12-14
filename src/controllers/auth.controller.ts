import { Controller, Post, Body, Request, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ForgetPasswordDto } from 'src/dto/forget-password.dto.ts';
import { LoginDto } from 'src/dto/login.dto';
import { RegisterVendorDto } from 'src/dto/register-vendor.dto';
import { RegisterDto } from 'src/dto/register.dto';
import { ResetPasswordDto } from 'src/dto/reset-password.dto';
import { VerifyEmailDto } from 'src/dto/verify-email.dto.ts';
import { AuthService } from 'src/services/auth.service';

@ApiTags('Auth Management')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post(`${process.env.MEMBER_ROLE_NAME}/register`)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto, process.env.MEMBER_ROLE_NAME);
  }

  @Post(`${process.env.VENDOR_ROLE_NAME}/register`)
  registerVendor(@Body() registerDto: RegisterVendorDto) {
    return this.authService.register(registerDto, process.env.VENDOR_ROLE_NAME);
  }

  @Post('forgot-password')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('verify-email')
  verifyEmail(@Body() verifyEmaildto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmaildto);
  }

  @Get('user')
  getUserInfo(@Request() r) {
    return this.authService.getUserInfo(r.user);
  }
}
