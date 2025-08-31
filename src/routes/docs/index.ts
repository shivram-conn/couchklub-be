import { openApiSpec } from '@/lib/documentation';

export const $GET = async (req: Request, corsHeaders: Record<string, string>) => {
  const url = new URL(req.url);
  
  // Serve the OpenAPI spec as JSON
  if (url.pathname === '/docs/openapi.json') {
    return new Response(JSON.stringify(openApiSpec, null, 2), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      },
    });
  }
  
  // Serve Scalar documentation UI
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>CouchKlub API Documentation</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
  <script
    id="api-reference"
    data-content='${JSON.stringify(openApiSpec)}'
    data-configuration='{"theme":"purple"}'></script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 
      'Content-Type': 'text/html',
      ...corsHeaders 
    },
  });
};
