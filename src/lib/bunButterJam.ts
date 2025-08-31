import { FileSystemRouter } from "bun";
import { verifyToken } from "./verifyToken";
import { TokenPayload } from "./verifyToken";

// Type definition for FileSystemRouter match result
interface RouterMatch {
  filePath: string;
  kind: "exact" | "catch-all" | "optional-catch-all" | "dynamic";
  name: string;
  pathname: string;
  src: string;
  params?: Record<string, string>;
  query?: Record<string, string>;
}

/**
 * Handle routing logic with authentication and method validation
 */
export let currentUserInfo: TokenPayload | undefined = undefined;
export async function addButterJam(req: Request, router: FileSystemRouter, corsHeaders: Record<string, string>): Promise<Response> {
  let match = router.match(req) as RouterMatch | null;
  if (match) {
    console.log(match);
    const module = await import(match.filePath);
    console.log(module);
  
    //check if auth is required
    //unless we set authRequired to false in the route, everything is expected to be authenticated

    const token = req.headers.get('Authorization');
    if (token) {
        currentUserInfo = verifyToken(token);
        
        if (!currentUserInfo) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
        req.headers.set('currentUserInfo', JSON.stringify(currentUserInfo));
    }

    // let isAuthRequired = true;
    // console.log('checking mods' + Object.keys(module));
    // Object.keys(module).forEach(key => {
    //     console.log('checking req ' + req.method + ' for ' + key);
    //     if (key == req.method) {
    //         if(isAuthRequired){
    //             if(token){
    //                 console.log('token found');
    //                 return module[key](req, corsHeaders, match.query);
    //             }
    //             else{
    //                 console.log('token not found');
    //                 return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    //                     status: 401,
    //                     headers: { 'Content-Type': 'application/json', ...corsHeaders },
    //                 });
    //             }
    //         }
    //         else{
    //             console.log('Auth not required for ' + key, module[key]);
    //             return module[key](req, corsHeaders, match.query);
    //         }
    //     }
    //     else if (key == 'authRequired' && module[key] == false) {
    //         console.log('updating authRequired ' + key, module[key]);
    //         isAuthRequired = false;
    //     }
    // });

    if (Object.keys(module).includes(req.method)) {
        if (module.authRequired == false) {
            
                return module[req.method](req, corsHeaders, match.query);
        }
        else {
            if (token) {
                return module[req.method](req, corsHeaders, match.query);
            }
            else {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                    status: 401,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            }
        }
    }
    //we can prefix $ to any function to make it unauthenticated
    else if (Object.keys(module).includes('$'+req.method)) {
        return module['$'+req.method](req, corsHeaders, match.query);
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // 404 for unmatched routes
  return new Response(JSON.stringify({ error: 'Route not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

export function getCurrentUserInfo(req: Request): TokenPayload | undefined {
  const userInfo = req.headers.get('currentUserInfo');
  if (!userInfo) {
    return undefined;
  }
  return JSON.parse(userInfo);
}
