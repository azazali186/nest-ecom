/* eslint-disable @typescript-eslint/no-unused-vars */
import { In, IsNull, Like, Repository } from 'typeorm';
import { AES, enc } from 'crypto-js';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  Inject,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RoleRepository } from './role.repository';
import { SessionRepository } from './session.repository';
import { PermissionRepository } from './permission.repository';
import { AdminPageRepository } from './admin-page.repository';
import { ApiResponse } from 'src/utils/response.util';
import { LangService } from 'src/services/lang.service';
import { UserStatus } from 'src/enum/user-status.enum';
import { sendTelegramMessage, splitDateRange } from '../utils/helper.utils';
import { ChangePasswordDto } from 'src/dto/change-password.dto';
import { CreateVendorDto } from 'src/dto/vendor/create-vendor.dto';
import { SearchVendorDto } from 'src/dto/vendor/search-vendor.dto';
import { UpdateVendorDto } from 'src/dto/vendor/update-vendor.dto';
import { ShopRepository } from './shop.repository';
import { Telegram } from 'telegraf';

export class VendorRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RoleRepository)
    public roleRepository: RoleRepository,
    @InjectRepository(PermissionRepository)
    public peramRepo: PermissionRepository,
    @InjectRepository(SessionRepository)
    public sessionRepository: SessionRepository,
    @InjectRepository(AdminPageRepository)
    public apRepo: AdminPageRepository,

    @Inject(forwardRef(() => ShopRepository))
    private shopRepo: ShopRepository,

    private jwtService: JwtService,
    private langService: LangService,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async findSessionToken(toke: string) {
    const token = await this.sessionRepository.findOne({
      where: {
        string_token: toke,
      },
    });
    return token;
  }

  async findSessionTokenByUserId(id: number) {
    const token = await this.sessionRepository.findOne({
      where: {
        user: {
          id: id,
        },
      },
      order: {
        id: 'DESC',
      },
    });
    return token;
  }

  async getVendors(filterDto: SearchVendorDto) {
    const { status, search, createdDate } = filterDto;
    const limit =
      filterDto.limit && !isNaN(filterDto.limit) && filterDto.limit > 0
        ? filterDto.limit
        : 10;
    const offset =
      filterDto.offset && !isNaN(filterDto.offset) && filterDto.offset >= 0
        ? filterDto.offset
        : 0;
    const query = this.userRepository.createQueryBuilder('user');

    if (status) {
      query.andWhere('user.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(user.name LIKE :search OR user.username LIKE :search OR user.mobile_number LIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }
    if (createdDate) {
      const { startDate, endDate } = splitDateRange(createdDate);
      query.andWhere('(user.created_at BETWEEN :startDate AND :endDate)', {
        startDate: startDate,
        endDate: endDate,
      });
    }

    query.andWhere('roles.name  = "' + process.env.VENDOR_ROLE_NAME + '" ');

    query
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.shop', 'shop')
      .leftJoinAndSelect('shop.logo', 'logo')
      .leftJoinAndSelect('shop.banner', 'banner')
      .leftJoinAndSelect('user.updated_by', 'updated_by')
      .leftJoinAndSelect('user.created_by', 'created_by')
      .select([
        'user.id',
        'user.username',
        'user.name',
        'user.created_at',
        'user.updated_at',
        'user.status',
        'created_by.id',
        'created_by.username',
        'updated_by.id',
        'updated_by.username',
        'user.mobile_number',
        'roles.name',
        'shop',
        'logo',
        'banner',
      ])
      .skip(filterDto.offset)
      .take(filterDto.limit)
      .cache(30000)
      .orderBy('user.id', 'DESC');

    const [users, count] = await query.getManyAndCount();

    return ApiResponse.paginate(
      { list: users, count: count },
      200,
      this.langService.getTranslation('GET_DATA_SUCCESS', 'Vendor'),
    );
  }

  async findUserWithId(id: number) {
    const user = await this.userRepository.findOne({
      relations: {
        roles: {
          permissions: true,
        },
      },
      where: {
        id: id,
      },
    });

    const role = user.roles;
    delete user.roles;
    const permissions = await this.peramRepo.find();

    const token = await this.findSessionTokenByUserId(user.id);

    return ApiResponse.success({
      token: token.string_token,
      user: user,
      role: role,
      permissions: permissions,
    });
  }

  async updateUser(userId: any, updateDto: UpdateVendorDto, user) {
    const userToUpdate = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['shop'],
    });

    if (!userToUpdate) {
      throw new NotFoundException({
        statusCode: 409,
        message: `INVALID_USER_ID`,
      });
    }

    const shopToUpdate = await this.shopRepo.findOne({
      where: { id: userToUpdate.shop.id },
    });

    const {
      password,
      name,
      username,
      mobileNumber,
      status,
      telegram_id,
      shopName,
      shopSlug,
      bannerId,
      logoId,
    } = updateDto;

    // If a new password is provided, hash it
    if (password) {
      userToUpdate.password = AES.encrypt(
        password,
        process.env.ENCRYPTION_KEY,
      ).toString();
    }

    if (name) {
      userToUpdate.name = name;
    }

    if (shopName) {
      shopToUpdate.name = shopName;
    }

    if (shopSlug) {
      shopToUpdate.slug = shopSlug;
    }
    if (logoId) {
      shopToUpdate.logo_id = logoId;
    }
    if (bannerId) {
      shopToUpdate.banner_id = bannerId;
    }

    if (status) {
      userToUpdate.status = status;
    }

    if (username) {
      const checkUsername = await this.userRepository.findOne({
        where: { username: username },
      });
      if (checkUsername && checkUsername.id != userToUpdate.id) {
        throw new ConflictException({
          statusCode: 409,
          message: `USER_EXIST`,
          param: username,
        });
      }
      userToUpdate.username = username;
    }

    if (mobileNumber) {
      userToUpdate.mobile_number = mobileNumber;
    }

    if (telegram_id) {
      userToUpdate.telegram_id = telegram_id;
    }

    userToUpdate.updated_by = await this.userRepository.findOne({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        name: true,
      },
    });

    await shopToUpdate.save();

    userToUpdate.shop = shopToUpdate;

    await this.userRepository.save(userToUpdate);

    return ApiResponse.success(
      null,
      200,
      this.langService.getTranslation('UPDATED_SUCCESSFULLY', 'Vendor'),
    );
  }

  async createVendor(createDto: CreateVendorDto, userId: number) {
    const {
      name,
      password,
      username,
      mobileNumber,
      shopName,
      shopSlug,
      telegram_id,
    } = createDto;

    const oldUserByEmail = await this.userRepository.findOne({
      where: {
        username: username,
        roles: {
          name: process.env.VENDOR_ROLE_NAME,
        },
      },
    });

    if (oldUserByEmail) {
      throw new ConflictException({
        statusCode: 409,
        message: `USER_EXIST`,
        param: username,
      });
    }

    const oldShopName = await this.shopRepo.findOne({
      where: { name: shopName },
    });

    console.log(oldShopName);

    if (oldShopName) {
      throw new ConflictException({
        statusCode: 409,
        message: `SHOP_NAME_EXIST`,
        param: shopName,
      });
    }

    const oldShopSlug = await this.shopRepo.findOne({
      where: { slug: shopSlug },
    });

    if (oldShopSlug) {
      throw new ConflictException({
        statusCode: 409,
        message: `SHOP_SLUG_EXIST`,
        param: shopSlug,
      });
    }

    const role = await this.roleRepository.findOne({
      where: { name: `${process.env.VENDOR_ROLE_NAME}` },
    });

    const createdByUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    const hashPassword = AES.encrypt(
      password,
      process.env.ENCRYPTION_KEY,
    ).toString();

    const user = this.userRepository.create({
      name: name,
      username: username,
      password: hashPassword,
      mobile_number: mobileNumber,
      roles: role,
      created_by: createdByUser,
      telegram_id,
    });

    await this.userRepository.save(user);

    const shop = this.shopRepo.create({
      name: shopName,
      slug: shopSlug,
      vendor: user,
    });

    await this.shopRepo.save(shop);

    user.shop = shop;
    await user.save();

    return ApiResponse.success(
      null,
      201,
      this.langService.getTranslation('CREATED_SUCCESSFULLY', 'Vendor'),
    );
  }

  async logout(user: any) {
    const userToUpdate = await this.findOne({ where: { id: user.id } });
    userToUpdate.last_login = new Date();
    const session = await this.sessionRepository.findOne({
      where: { string_token: user.token },
    });
    session.is_expired = true;
    await this.sessionRepository.save(session);
    await this.save(userToUpdate);
    return ApiResponse.success(
      null,
      200,
      this.langService.getTranslation('LOGOUT'),
    );
  }

  async changePassword(dtoReq: ChangePasswordDto) {
    const { password, new_password, user } = dtoReq;

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'DISABLED_ACCOUNT',
      });
    }

    // Check password
    const decryptedPassword = AES.decrypt(
      user.password,
      process.env.ENCRYPTION_KEY,
    ).toString(enc.Utf8);
    if (decryptedPassword !== password) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'WRONG_PASSWORD',
      });
    }
    const hashPassord = AES.encrypt(
      new_password,
      process.env.ENCRYPTION_KEY,
    ).toString();
    user.password = hashPassord;

    await this.userRepository.save(user);

    await this.logout(user);

    return ApiResponse.success(
      null,
      200,
      this.langService.getTranslation(
        'UPDATED_SUCCESSFULLY',
        'Vendor Password',
      ),
    );
  }

  async removeUser(id: number) {
    try {
      this.sessionRepository.softDelete({
        user: {
          id: id,
        },
      });
      const result = await this.userRepository.softDelete(id);
      console.log(result);
      if (result.affected === 0) {
        throw new NotFoundException({
          statusCode: 404,
          message: `User with ID ${id} not found`,
        });
      }
      return ApiResponse.create(null, 200, 'Vendor Deleted');
    } catch (error) {
      console.log(error);
      throw new BadRequestException({
        statusCode: 400,
        message: `Can Not Delete this vendor`,
      });
    }
  }
}
