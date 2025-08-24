import { FileSystemRouter } from "bun";
import { verifyToken } from "./verifyToken";

/**
 * Handle routing logic with authentication and method validation
 */
export async function addButterJam(req: Request, router: FileSystemRouter, corsHeaders: Record<string, string>): Promise<Response> {
  let match = router.match(req);
  if (match) {
    console.log(match);
    const module = await import(match.filePath);
  
    //check if auth is required
    //unless we set authRequired to false in the route, everything is expected to be authenticated
    if (module.authRequired || module.authRequired === undefined) {
      const token = req.headers.get('Authorization');
      if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
      const userId = await verifyToken(token);
      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }
    else if (module.authRequired == false) {
      Object.keys(module).forEach(key => {
        if (key == req.method) {
          return module[key](req, corsHeaders, match.query);
        }
        else if (key == 'authRequired') {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
      });
    }

    if (Object.keys(module).includes(req.method)) {
       return module[req.method](req, corsHeaders, match.query);
    }
    else {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }

  // 404 for unmatched routes
  return new Response(JSON.stringify({ error: 'Route not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}
