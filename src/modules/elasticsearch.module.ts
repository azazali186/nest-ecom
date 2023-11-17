import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticsearchConfig } from 'src/config/elasticsearch.config';

@Module({
  imports: [ElasticsearchModule.register(ElasticsearchConfig)],
  exports: [ElasticsearchModule],
})
export class ElasticsearchConfigModule {}
