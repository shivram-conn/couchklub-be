import { handleUserRoutes } from './routes/userRoutes';
import { handleClubRoutes } from './routes/clubRoutes';
import { handleGameRoutes } from './routes/gameRoutes';

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const method = req.method;
    const pathname = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
      // Health check
      if (pathname === '/health' && method === 'GET') {
        return new Response(JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Try user routes
      if (pathname.startsWith('/users')) {
        const response = await handleUserRoutes(req, pathname, method, corsHeaders);
        if (response) return response;
      }

      // Try club routes
      if (pathname.startsWith('/clubs')) {
        const response = await handleClubRoutes(req, pathname, method, corsHeaders);
        if (response) return response;
      }

      // Try game routes
      if (pathname.startsWith('/games')) {
        const response = await handleGameRoutes(req, pathname, method, corsHeaders);
        if (response) return response;
      }

      // 404 for unmatched routes
      return new Response(JSON.stringify({ error: 'Route not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });

    } catch (error) {
      console.error('Server error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },
});

console.log(`🚀 Server running at http://localhost:${server.port}`);
console.log('Available endpoints:');
console.log('  GET    /health');
console.log('  GET    /users');
console.log('  POST   /users');
console.log('  GET    /users/:id');
console.log('  PUT    /users/:id');
console.log('  DELETE /users/:id');
console.log('  GET    /clubs');
console.log('  POST   /clubs');
console.log('  GET    /clubs/:id');
console.log('  PUT    /clubs/:id');
console.log('  DELETE /clubs/:id');
console.log('  POST   /clubs/:id/members/:userId');
console.log('  DELETE /clubs/:id/members/:userId');
console.log('  GET    /games');
console.log('  GET    /games?clubId=:clubId');
console.log('  POST   /games');
console.log('  GET    /games/:id');
console.log('  PUT    /games/:id');
console.log('  DELETE /games/:id');
console.log('  POST   /games/:id/players/:userId');
console.log('  DELETE /games/:id/players/:userId');
