import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchPermissionDto } from 'src/dto/search-permission.dto';
import { AdminPage } from 'src/entities/admin-page.entity';
import { PermissionService } from 'src/services/permission.service';
import { ApiResponse } from 'src/utils/response.util';

@ApiTags('Permissions Management')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  findAll(filterDto: SearchPermissionDto): Promise<ApiResponse<AdminPage[]>> {
    return this.permissionService.findAll(filterDto);
  }
}
