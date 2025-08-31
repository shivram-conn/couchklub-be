import { UserUsecases } from '../../../usecases/user';

// GET /users/:id - Get user by ID
export const GET = async (req: Request, corsHeaders: Record<string, string>, params: { id: string }) => {
  const { id } = params;
  const result = await UserUsecases.getUserById(id);
  
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

// PUT /users/:id - Update user
export const PUT = async (req: Request, corsHeaders: Record<string, string>, params: { id: string }) => {
  const body = await req.json();
  const result = await UserUsecases.updateUser(params.id, body);
  
  if (result.success) {
    return new Response(JSON.stringify(result.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  
  const statusCode = result.statusCode || 400;
  return new Response(JSON.stringify(result.error), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};

// DELETE /users/:id - Delete user
export const DELETE = async (req: Request, corsHeaders: Record<string, string>, params: { id: string }) => {
  const result = await UserUsecases.deleteUser(params.id);
  
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
