import { FileSystemRouter } from "bun";
import { initializeDatabase } from "@/lib/initDatabase";
import { addButterJam } from "@/lib/bunButterJam";
import { initApp } from "@/lib/initApp";

initApp();

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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Pragma',
      'Access-Control-Allow-Credentials': 'true',
    };

    // Handle preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {

      // Try file-system based routing along with authentication
      return await addButterJam(req, router, corsHeaders);

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
