export const authRequired = false;
export const GET = async (req: Request, corsHeaders: Record<string, string>) => {
  return new Response(JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};