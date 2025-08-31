import { SigninUsecases } from '../../usecases/signin';

export const $POST = async (req: Request, corsHeaders: Record<string, string>) => {
  const body = await req.json();
  const result = await SigninUsecases.signin(body);
  
  if (result.success) {
    return new Response(JSON.stringify(result.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  
  const statusCode = result.statusCode || 500;
  return new Response(JSON.stringify(result.error), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};
