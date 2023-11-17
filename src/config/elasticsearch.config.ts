export const ElasticsearchConfig = {
  node: process.env.ELASTICSEARCH_URL,
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true,
};
