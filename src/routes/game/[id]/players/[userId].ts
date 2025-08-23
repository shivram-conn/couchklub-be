import { gameService } from '../../../../services/gameService';

// POST /games/:id/players/:userId - Add player to game
export const POST = async (req: Request, corsHeaders: Record<string, string>, params: { id: string, userId: string }) => {
  const game = gameService.addPlayer(params.id, params.userId);
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

// DELETE /games/:id/players/:userId - Remove player from game
export const DELETE = async (req: Request, corsHeaders: Record<string, string>, params: { id: string, userId: string }) => {
  const game = gameService.removePlayer(params.id, params.userId);
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
