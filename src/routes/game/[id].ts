import { gameService } from '../../services/gameService';
import { UpdateGameRequest } from '../../models/Game';

// GET /games/:id - Get game by ID
export const GET = async (req: Request, corsHeaders: Record<string, string>, params: { id: string }) => {
  const game = gameService.getById(params.id);
  if (!game) {
    return new Response(JSON.stringify({ error: 'Game not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  return new Response(JSON.stringify(game), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};

// PUT /games/:id - Update game
export const PUT = async (req: Request, corsHeaders: Record<string, string>, params: { id: string }) => {
  const body = await req.json() as UpdateGameRequest;
  const game = gameService.update(params.id, body);
  if (!game) {
    return new Response(JSON.stringify({ error: 'Game not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  return new Response(JSON.stringify(game), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};

// DELETE /games/:id - Delete game
export const DELETE = async (req: Request, corsHeaders: Record<string, string>, params: { id: string }) => {
  const deleted = gameService.delete(params.id);
  if (!deleted) {
    return new Response(JSON.stringify({ error: 'Game not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  return new Response(JSON.stringify({ message: 'Game deleted successfully' }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};
