export const GET = async (req: Request, corsHeaders: Record<string, string>, params: Record<string, string>) => {
  return new Response(JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() , params}), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};