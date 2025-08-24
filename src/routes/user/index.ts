import { userService } from '../../services/userService';
import { CreateUserRequest } from '../../models/User';

// GET /users - Get all users
export const GET = async (req: Request, corsHeaders: Record<string, string>) => {
  const users = await userService.getAll();
  return new Response(JSON.stringify(users), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};

// POST /users - Create new user
export const POST = async (req: Request, corsHeaders: Record<string, string>) => {
  const body = await req.json() as CreateUserRequest;
  if (!body.name || !body.email || !body.password) {
    return new Response(JSON.stringify({ error: 'Name, email and password are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  const user = await userService.create(body);
  return new Response(JSON.stringify(user), {
    status: 201,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};
