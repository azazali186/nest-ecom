/* eslint-disable @typescript-eslint/no-unused-vars */
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminPageDto } from 'src/dto/admin-page/create-admin-page.dto';
import { SearchAdminPageDto } from 'src/dto/admin-page/search-admin-page.dto';
import { UpdateAdminPageDto } from 'src/dto/admin-page/update-admin-page.dto';
import { AdminPage } from 'src/entities/admin-page.entity';
import { Repository } from 'typeorm';
import { PermissionRepository } from './permission.repository';
import { Inject, forwardRef } from '@nestjs/common';

export class AdminPageRepository extends Repository<AdminPage> {
  constructor(
    @InjectRepository(AdminPage)
    private apRepo: Repository<AdminPage>,

    @Inject(forwardRef(() => PermissionRepository))
    private paramRepo: PermissionRepository,
  ) {
    super(apRepo.target, apRepo.manager, apRepo.queryRunner);
  }

  findAdminPages(name: SearchAdminPageDto) {
    throw new Error('Method not implemented.');
  }
  getAdminPageId(id: number) {
    throw new Error('Method not implemented.');
  }
  updateAdminPage(id: any, req: UpdateAdminPageDto) {
    throw new Error('Method not implemented.');
  }
  createAdminPage(req: CreateAdminPageDto, user: any) {
    throw new Error('Method not implemented.');
  }
}
