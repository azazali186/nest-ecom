import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from 'src/dto/change-password.dto';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { SearchUserDto } from 'src/dto/search-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { UserStatus } from 'src/enum/user-status.enum';
import { UserStatusValidationPipes } from 'src/pipes/user-status-validation.pipe';
import { UserService } from 'src/services/user.service';
import { ApiResponse } from 'src/utils/response.util';

@ApiTags('User Management')
@ApiBearerAuth()
@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete('users/:id')
  remove(@Param('id') id: number) {
    console.log('remove user called', id);
    return this.userService.remove(id);
  }

  @ApiQuery({ name: 'status', enum: UserStatus })
  @Get('users')
  findAll(
    @Query(UserStatusValidationPipes) filterDto: SearchUserDto,
  ): Promise<ApiResponse<any>> {
    filterDto.role = 'admin';
    return this.userService.findAll(filterDto);
  }

  @ApiQuery({ name: 'status', enum: UserStatus })
  @Get(`${process.env.VENDOR_ROLE_NAME}`)
  findAllVendors(
    @Query(UserStatusValidationPipes) filterDto: SearchUserDto,
  ): Promise<ApiResponse<any>> {
    filterDto.role = `${process.env.VENDOR_ROLE_NAME}`;
    return this.userService.findAll(filterDto);
  }

  @ApiQuery({ name: 'status', enum: UserStatus })
  @Get(`${process.env.MEMBER_ROLE_NAME}`)
  findAllMembers(
    @Query(UserStatusValidationPipes) filterDto: SearchUserDto,
  ): Promise<ApiResponse<any>> {
    filterDto.role = `${process.env.MEMBER_ROLE_NAME}`;
    return this.userService.findAll(filterDto);
  }

  @Get('users/:id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post('users')
  CreateUser(
    @Body() updateUserDto: CreateUserDto,
    @Request() req,
  ): Promise<ApiResponse<any>> {
    return this.userService.create(updateUserDto, req.user.id);
  }

  @Patch('users/change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req,
  ): Promise<ApiResponse<any>> {
    return this.userService.changePassword(changePasswordDto, req);
  }

  @Patch('users/:id')
  updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ): Promise<ApiResponse<any>> {
    return this.userService.updateUser(id, updateUserDto, req.user);
  }
}
