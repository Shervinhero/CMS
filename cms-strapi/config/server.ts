module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  // --- ADD THIS CORS CONFIGURATION ---
  cors: {
    enabled: true,
    origin: ['http://localhost:3000', 'http://localhost:1337'], // Your frontend URL and Strapi's own URL
    headers: ['Content-Type', 'Authorization', 'Accept', 'Origin'], // Explicitly list headers
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    // You might need to add credentials if you're using cookies/sessions, but for JWT, usually not.
    // credentials: true,
  },
  // --- END CORS CONFIGURATION ---
});