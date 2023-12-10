<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).




Password for the elastic user (reset with `bin/elasticsearch-reset-password -u elastic`):
2023-12-10 15:38:44   Wg=8BIsqIXnkE+z*1T5O
2023-12-10 15:38:44 
2023-12-10 15:38:44 ℹ️  HTTP CA certificate SHA-256 fingerprint:
2023-12-10 15:38:44   ab74c529450899b133576b73f3ebea8e792871bcbbf253d1e5719f4e1e191bb4
2023-12-10 15:38:44 
2023-12-10 15:38:44 ℹ️  Configure Kibana to use this cluster:
2023-12-10 15:38:44 • Run Kibana and click the configuration link in the terminal when Kibana starts.
2023-12-10 15:38:44 • Copy the following enrollment token and paste it into Kibana in your browser (valid for the next 30 minutes):
2023-12-10 15:38:44   eyJ2ZXIiOiI4LjExLjIiLCJhZHIiOlsiMTcyLjE5LjAuMjo5MjAwIl0sImZnciI6ImFiNzRjNTI5NDUwODk5YjEzMzU3NmI3M2YzZWJlYThlNzkyODcxYmNiYmYyNTNkMWU1NzE5ZjRlMWUxOTFiYjQiLCJrZXkiOiJjSlRnVW93QlR4bDRYVUk4OXJ5cDpiOGJGTUc4N1FPZWx0WElvbEJyNjV3In0=
2023-12-10 15:38:44 
2023-12-10 15:38:44 ℹ️ Configure other nodes to join this cluster:
2023-12-10 15:38:44 • Copy the following enrollment token and start new Elasticsearch nodes with `bin/elasticsearch --enrollment-token <token>` (valid for the next 30 minutes):
2023-12-10 15:38:44   eyJ2ZXIiOiI4LjExLjIiLCJhZHIiOlsiMTcyLjE5LjAuMjo5MjAwIl0sImZnciI6ImFiNzRjNTI5NDUwODk5YjEzMzU3NmI3M2YzZWJlYThlNzkyODcxYmNiYmYyNTNkMWU1NzE5ZjRlMWUxOTFiYjQiLCJrZXkiOiJicFRnVW93QlR4bDRYVUk4OXJ5ZzpQOWM3LVdpTVIyLXRpelM0QThqVTNnIn0=
2023-12-10 15:38:44 
2023-12-10 15:38:44   If you're running in Docker, copy the enrollment token and run:
2023-12-10 15:38:44   `docker run -e "ENROLLMENT_TOKEN=<token>" docker.elastic.co/elasticsearch/elasticsearch:8.11.2`