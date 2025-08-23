import { userService } from '../services/userService';
import { CreateUserRequest, UpdateUserRequest } from '../models/User';

export const handleUserRoutes = async (req: Request, pathname: string, method: string, corsHeaders: Record<string, string>) => {
  // GET /users - Get all users
  if (pathname === '/users' && method === 'GET') {
    const users = userService.getAll();
    return new Response(JSON.stringify(users), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // POST /users - Create new user
  if (pathname === '/users' && method === 'POST') {
    const body = await req.json() as CreateUserRequest;
    if (!body.name || !body.email) {
      return new Response(JSON.stringify({ error: 'Name and email are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    const user = userService.create(body);
    return new Response(JSON.stringify(user), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // GET /users/:id - Get user by ID
  if (pathname.startsWith('/users/') && method === 'GET') {
    const id = pathname.split('/')[2];
    const user = userService.getById(id);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    return new Response(JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // PUT /users/:id - Update user
  if (pathname.startsWith('/users/') && method === 'PUT') {
    const id = pathname.split('/')[2];
    const body = await req.json() as UpdateUserRequest;
    const user = userService.update(id, body);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    return new Response(JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // DELETE /users/:id - Delete user
  if (pathname.startsWith('/users/') && method === 'DELETE') {
    const id = pathname.split('/')[2];
    const deleted = userService.delete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return null; // Route not handled by this module
};
