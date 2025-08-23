import { join } from 'path';

interface RouteHandler {
  GET?: (req: Request, corsHeaders: Record<string, string>, params?: any) => Promise<Response>;
  POST?: (req: Request, corsHeaders: Record<string, string>, params?: any) => Promise<Response>;
  PUT?: (req: Request, corsHeaders: Record<string, string>, params?: any) => Promise<Response>;
  DELETE?: (req: Request, corsHeaders: Record<string, string>, params?: any) => Promise<Response>;
}

interface RouteMatch {
  handler: RouteHandler;
  params: Record<string, string>;
}

export class FileSystemRouter {
  private routesPath: string;

  constructor(routesPath: string) {
    this.routesPath = routesPath;
  }

  async handleRequest(req: Request, pathname: string, method: string, corsHeaders: Record<string, string>): Promise<Response | null> {
    const routeMatch = await this.matchRoute(pathname);
    
    if (!routeMatch) {
      return null;
    }

    const { handler, params } = routeMatch;
    const methodHandler = handler[method as keyof RouteHandler];

    if (!methodHandler) {
      return new Response(JSON.stringify({ error: `Method ${method} not allowed` }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    try {
      return await methodHandler(req, corsHeaders, params);
    } catch (error) {
      console.error('Route handler error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }

  private async matchRoute(pathname: string): Promise<RouteMatch | null> {
    // Remove leading slash and split path
    const segments = pathname.slice(1).split('/').filter(Boolean);
    
    if (segments.length === 0) {
      return null;
    }

    // Try to match routes
    const routeMatch = await this.findRouteHandler(segments);
    return routeMatch;
  }

  private async findRouteHandler(segments: string[]): Promise<RouteMatch | null> {
    const params: Record<string, string> = {};
    
    // Build possible file paths to check
    const possiblePaths = this.generatePossiblePaths(segments, params);
    
    for (const { filePath, extractedParams } of possiblePaths) {
      try {
        const handler = await this.loadRouteHandler(filePath);
        if (handler) {
          return { handler, params: extractedParams };
        }
      } catch (error) {
        // Continue to next possible path
        continue;
      }
    }
    
    return null;
  }

  private generatePossiblePaths(segments: string[], params: Record<string, string>) {
    const paths: Array<{ filePath: string; extractedParams: Record<string, string> }> = [];
    
    // Try exact match first (e.g., /users -> user/index.ts)
    if (segments.length === 1) {
      paths.push({
        filePath: `${segments[0]}/index.ts`,
        extractedParams: { ...params }
      });
    }
    
    // Try dynamic routes (e.g., /users/123 -> user/[id].ts)
    if (segments.length === 2) {
      const newParams = { ...params, id: segments[1] };
      paths.push({
        filePath: `${segments[0]}/[id].ts`,
        extractedParams: newParams
      });
    }
    
    // Try nested dynamic routes (e.g., /clubs/123/members/456 -> club/[id]/members/[userId].ts)
    if (segments.length === 4 && segments[2] === 'members') {
      const newParams = { ...params, id: segments[1], userId: segments[3] };
      paths.push({
        filePath: `${segments[0]}/[id]/members/[userId].ts`,
        extractedParams: newParams
      });
    }
    
    if (segments.length === 4 && segments[2] === 'players') {
      const newParams = { ...params, id: segments[1], userId: segments[3] };
      paths.push({
        filePath: `${segments[0]}/[id]/players/[userId].ts`,
        extractedParams: newParams
      });
    }
    
    return paths;
  }

  private async loadRouteHandler(filePath: string): Promise<RouteHandler | null> {
    try {
      const fullPath = join(this.routesPath, filePath);
      const module = await import(fullPath);
      return module;
    } catch (error) {
      return null;
    }
  }
}
