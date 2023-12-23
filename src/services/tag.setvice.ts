import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from 'src/dto/tag/create-tag.dto';
import { SearchTagDto } from 'src/dto/tag/search-tag.dto';
import { UpdateTagDto } from 'src/dto/tag/update-tag.dto';
import { TagRepository } from 'src/repositories/tag.repository';
import { ApiResponse } from 'src/utils/response.util';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagRepository)
    public langRepo: TagRepository,
  ) {}

  create(req: CreateTagDto) {
    return this.langRepo.createTag(req);
  }
  async findAll(name: SearchTagDto) {
    return this.langRepo.findTags(name);
  }
  findOne(id: number) {
    return this.langRepo.getTagId(id);
  }
  update(id: any, req: UpdateTagDto) {
    return this.langRepo.updateTag(id, req);
  }
  async remove(id: number) {
    const res = await this.langRepo.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return ApiResponse.success(null, 200, 'Tag Deleted');
  }
}
