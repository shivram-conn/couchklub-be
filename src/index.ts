import { join } from 'path';
import { FileSystemRouter } from "bun";
import { initializeDatabase } from "./utils/initDatabase";
    const router = new FileSystemRouter({
        dir: import.meta.dir + "/routes", // Path to your pages directory
        style: "nextjs",
    });
export const db = await initializeDatabase();
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

      // Try file-system based routing
      let match = router.match(req);
      if (match) {
        console.log(match);
        const module = await import(match.filePath);
        if (Object.keys(module).includes(method)) {
          const handler = module[method];
          return handler(req, corsHeaders, match.query);
        }
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
