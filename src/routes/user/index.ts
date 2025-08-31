import { UserUsecases } from '../../usecases/user';

// GET /users - Get all users
export const GET = async (req: Request, corsHeaders: Record<string, string>) => {
  const result = await UserUsecases.getAllUsers();
  
  if (result.success) {
    return new Response(JSON.stringify(result.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  
  return new Response(JSON.stringify(result.error), {
    status: 500,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};

// POST /users - Create new user
export const POST = async (req: Request, corsHeaders: Record<string, string>) => {
  const body = await req.json();
  const result = await UserUsecases.createUser(body);
  
  if (result.success) {
    return new Response(JSON.stringify(result.data), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  
  return new Response(JSON.stringify(result.error), {
    status: 400,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};
