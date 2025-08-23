import { userService } from '../../../services/userService';
import { UpdateUserRequest } from '../../../models/User';

// GET /users/:id - Get user by ID
export const GET = async (req: Request, corsHeaders: Record<string, string>, params: { id: string }) => {
  const user = userService.getById(params.id);
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  return new Response(JSON.stringify(user), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};

// PUT /users/:id - Update user
export const PUT = async (req: Request, corsHeaders: Record<string, string>, params: { id: string }) => {
  const body = await req.json() as UpdateUserRequest;
  const user = userService.update(params.id, body);
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  return new Response(JSON.stringify(user), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};

// DELETE /users/:id - Delete user
export const DELETE = async (req: Request, corsHeaders: Record<string, string>, params: { id: string }) => {
  const deleted = userService.delete(params.id);
  if (!deleted) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};
