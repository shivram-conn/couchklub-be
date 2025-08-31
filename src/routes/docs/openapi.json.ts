import { openApiSpec } from '@/lib/documentation';

export const $GET = async (req: Request, corsHeaders: Record<string, string>) => {
  return new Response(JSON.stringify(openApiSpec, null, 2), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      ...corsHeaders 
    },
  });
};
