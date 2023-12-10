import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const certificatePath = resolve(__dirname, '../../http_ca.crt');

export const ElasticsearchConfig = {
  node: process.env.ELASTICSEARCH_URL || 'https://127.0.0.1:9200',
  auth: {
    username: 'elastic', // Replace with your Elasticsearch username (if applicable)
    // password: 'uW0jF1K9Evlwn*SKgCqW', // Replace with your Elasticsearch password (if applicable)
    password: 'Wg=8BIsqIXnkE+z*1T5O', // Replace with your Elasticsearch password (if applicable)
  },
  tls: {
    ca: readFileSync(certificatePath),
    rejectUnauthorized: false,
  },
  log: 'info',
  maxRetries: 5,
  requestTimeout: 60000,
};
