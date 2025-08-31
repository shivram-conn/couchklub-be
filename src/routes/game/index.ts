import { GameUsecases } from '../../usecases/game';

// GET /games - Get all games (with optional clubId filter)
export const GET = async (req: Request, corsHeaders: Record<string, string>) => {
  const url = new URL(req.url);
  const clubId = url.searchParams.get('clubId') || undefined;
  const result = await GameUsecases.getAllGames(clubId);
  
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

// POST /games - Create new game
export const POST = async (req: Request, corsHeaders: Record<string, string>) => {
  const body = await req.json();
  const result = await GameUsecases.createGame(body);
  
  if (result.success) {
    return new Response(JSON.stringify(result.data), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  
  const statusCode = result.statusCode || 400;
  return new Response(JSON.stringify(result.error), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};
