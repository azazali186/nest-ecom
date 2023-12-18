import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchUserDto } from 'src/dto/search-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { UserStatus } from 'src/enum/user-status.enum';
import { UserStatusValidationPipes } from 'src/pipes/user-status-validation.pipe';
import { UserService } from 'src/services/user.service';
import { ApiResponse } from 'src/utils/response.util';

@ApiTags('User Management')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiQuery({ name: 'status', enum: UserStatus })
  @Get('')
  findAll(
    @Query(UserStatusValidationPipes) filterDto: SearchUserDto,
  ): Promise<ApiResponse<any>> {
    filterDto.role = 'admin';
    return this.userService.findAll(filterDto);
  }

  @Get('/:id')
  findOne(@Param('id', ParseUUIDPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch('/:id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ): Promise<ApiResponse<any>> {
    return this.userService.updateUser(id, updateUserDto, req.user);
  }

  @Delete('/:id')
  remove(@Param() id: number) {
    return this.userService.remove(id);
  }
}
