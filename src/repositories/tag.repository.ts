import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from 'src/dto/tag/create-tag.dto';
import { SearchTagDto } from 'src/dto/tag/search-tag.dto';
import { UpdateTagDto } from 'src/dto/tag/update-tag.dto';
import { Tag } from 'src/entities/tag.entity';
import { LangService } from 'src/services/lang.service';
import { ApiResponse } from 'src/utils/response.util';
import { Like, Repository } from 'typeorm';

export class TagRepository extends Repository<Tag> {
  constructor(
    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,
    private langService: LangService,
  ) {
    super(tagRepo.target, tagRepo.manager, tagRepo.queryRunner);
  }

  async createTag(req: CreateTagDto) {
    const { name } = req;
    const tag = new Tag();
    tag.name = name;
    return ApiResponse.create(
      this.tagRepo.save(tag),
      201,
      this.langService.getTranslation('CREATED_SUCCESSFULLY', 'Tag'),
      null,
    );
  }

  getTagId(id: number) {
    const data = this.findOne({ where: { id: id } });
    return ApiResponse.create(
      data,
      200,
      this.langService.getTranslation('GET_DATA_SUCCESS', 'Tag'),
      null,
    );
  }

  async findTags(req: SearchTagDto) {
    const { name } = req;
    const options = {
      where: {},
    };
    if (name) {
      options.where['name'] = Like('%' + name + '%');
    }

    const [list, count] = await this.findAndCount({ where: options.where });

    return ApiResponse.paginate({ list, count });
  }

  async updateTag(id: any, req: UpdateTagDto) {
    const curUpdate = await this.tagRepo.findOne({
      where: {
        id: id,
      },
    });
    // console.log('Req', req);
    // console.log('id', id);
    if (!curUpdate) {
      throw new NotFoundException({
        statusCode: 404,
        message: `INVALID_ID`,
        param: `${id}`,
      });
    }
    const { name } = req;
    if (name) {
      curUpdate.name = name;
    }
    // console.log('Req', req);
    return ApiResponse.create(this.tagRepo.save(curUpdate));
  }
}
