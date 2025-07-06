module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  // REMOVE OR COMMENT OUT THIS ENTIRE BLOCK:
  // {
  //   name: 'strapi::cors',
  //   config: {
  //     enabled: true,
  //     origin: ['http://localhost:3000', 'http://localhost:1337'],
  //     headers: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  //     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  //     keepHeadersOnError: true,
  //   },
  // },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];