/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangePasswordDto } from 'src/dto/change-password.dto';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { CreateVendorDto } from 'src/dto/vendor/create-vendor.dto';
import { SearchVendorDto } from 'src/dto/vendor/search-vendor.dto';
import { UpdateVendorDto } from 'src/dto/vendor/update-vendor.dto';
import { SearchUserDto } from 'src/dto/search-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { VendorRepository } from 'src/repositories/vendor.repository';
import { ApiResponse } from 'src/utils/response.util';

@Injectable()
export class VendorService {

  constructor(
    @InjectRepository(VendorRepository)
    public vendorRepository: VendorRepository,
  ) {}
  create(createDto: CreateVendorDto, userId: number) {
    return this.vendorRepository.createVendor(createDto, userId);
  }
  async findAll(filterDto: SearchVendorDto) {
    return this.vendorRepository.getVendors(filterDto);
  }
  async remove(id: number) {
    return this.vendorRepository.removeUser(id);
  }

  findById(userId: number) {
    return this.vendorRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });
  }
  findByUsername(username: string) {
    return this.vendorRepository.findOne({
      where: { username: username },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async findOne(id: number) {
    const user = await this.vendorRepository.findOne({
      where: { id: id },
      relations: [
        'roles',
        'shop',
        'shop.logo',
        'shop.banner',
        'created_by',
        'updated_by',
      ],
    });
    if (!user) {
      return new NotFoundException({
        statusCode: 404,
        message: `Vendor with ID ${id} not found`,
      });
    }
    const { password, ...others } = user;
    return others;
  }

  findSessionToken(toke: string) {
    return this.vendorRepository.findSessionToken(toke);
  }

  updateUser(userId: any, updateDto: UpdateVendorDto, user: any) {
    return this.vendorRepository.updateUser(userId, updateDto, user);
  }

  changePassword(dtoReq: ChangePasswordDto) {
    return this.vendorRepository.changePassword(dtoReq);
  }

  async findSlug(slug: string) {
    const data = await this.vendorRepository.find({
      select: {
        id: true,
      },
      relations: {
        shop: true,
      },
      where: {
        shop: {
          slug: slug,
        },
      },
    });

    return ApiResponse.success(data, 200);
  }

  findShop(slug: string) {
    return this.vendorRepository.findShop(slug);
  }
}
