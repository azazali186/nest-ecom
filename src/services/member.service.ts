/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangePasswordDto } from 'src/dto/change-password.dto';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { CreateMemberDto } from 'src/dto/member/create-member.dto';
import { SearchMemberDto } from 'src/dto/member/search-member.dto';
import { UpdateMemberDto } from 'src/dto/member/update-member.dto';
import { SearchUserDto } from 'src/dto/search-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { MemberRepository } from 'src/repositories/member.repository';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberRepository)
    public memberRepository: MemberRepository,
  ) {}
  create(createDto: CreateMemberDto, userId: number) {
    return this.memberRepository.createMember(createDto, userId);
  }
  async findAll(filterDto: SearchMemberDto) {
    return this.memberRepository.getMembers(filterDto);
  }
  async remove(id: number) {
    return this.memberRepository.removeUser(id);
  }

  findById(userId: number) {
    return this.memberRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });
  }
  findByUsername(username: string) {
    return this.memberRepository.findOne({
      where: { username: username },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async findOne(id: number) {
    const user = await this.memberRepository.findOne({
      where: { id: id },
      relations: ['roles'],
    });
    if (!user) {
      return new NotFoundException({
        statusCode: 404,
        message: `Member with ID ${id} not found`,
      });
    }
    const { password, ...others } = user;
    return others;
  }

  findSessionToken(toke: string) {
    return this.memberRepository.findSessionToken(toke);
  }

  updateUser(userId: any, updateDto: UpdateMemberDto, user: any) {
    return this.memberRepository.updateUser(userId, updateDto, user);
  }

  changePassword(dtoReq: ChangePasswordDto) {
    return this.memberRepository.changePassword(dtoReq);
  }
}
