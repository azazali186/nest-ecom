// src/elasticsearch/index.service.ts

import { Client } from '@elastic/elasticsearch';
import { Injectable } from '@nestjs/common';
import { ElasticsearchConfig } from 'src/config/elasticsearch.config';

@Injectable()
export class ElasticService {
  private readonly client: Client;

  constructor() {
    this.client = new Client(ElasticsearchConfig);
  }

  async createIndex(index: string, body: any): Promise<any> {
    const indexSettings = {
      id: body.id,
      data: body,
    };

    try {
      const data = this.client.index({
        index,
        body: indexSettings,
      });
      return data;
    } catch (error) {
      // console.log('Error while createindex');
    }

    return true;
  }

  async registerIndex(index: string): Promise<any> {
    return this.client.indices.putAlias({ index, name: index });
  }

  async updateIndex(id: any, index: string, data: any): Promise<any> {
    const searchResult = await this.client.search({
      index,
      body: {
        query: {
          match: { id: id },
        },
      },
    });

    // Check if a matching document is found
    if ((searchResult.hits.total as number) > 0) {
      // Update the document with the provided changes
      const updatedData = await this.client.update({
        index,
        id: searchResult.hits.hits[0]._id, // Use the _id from the search result
        body: {
          doc: data,
        },
      });

      return updatedData;
    } else {
      // console.log(`No product found with ID '${id}'.`);
      return { error: `No product found with ID '${id}'.` };
    }
  }
}
