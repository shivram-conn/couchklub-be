import { gameService } from '../../services/gameService';
import { clubService } from '../../services/clubService';
import { userService } from '../../services/userService';
import { CreateGameRequest } from '../../models/Game';

// GET /games - Get all games (with optional clubId filter)
export const GET = async (req: Request, corsHeaders: Record<string, string>) => {
  const url = new URL(req.url);
  const clubId = url.searchParams.get('clubId');
  const games = clubId ? gameService.getByClub(clubId) : gameService.getAll();
  return new Response(JSON.stringify(games), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};

// POST /games - Create new game
export const POST = async (req: Request, corsHeaders: Record<string, string>) => {
  const body = await req.json() as CreateGameRequest;
  if (!body.name || !body.description || !body.clubId || !body.createdBy) {
    return new Response(JSON.stringify({ error: 'Name, description, clubId, and createdBy are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  // Check if club and creator exist
  const club = clubService.getById(body.clubId);
  const creator = userService.getById(body.createdBy);
  if (!club) {
    return new Response(JSON.stringify({ error: 'Club not found' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  if (!creator) {
    return new Response(JSON.stringify({ error: 'Creator user not found' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  const game = gameService.create(body);
  return new Response(JSON.stringify(game), {
    status: 201,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};
