import { gameService } from '../services/gameService';
import { clubService } from '../services/clubService';
import { userService } from '../services/userService';
import { CreateGameRequest, UpdateGameRequest } from '../models/Game';

export const handleGameRoutes = async (req: Request, pathname: string, method: string, corsHeaders: Record<string, string>) => {
  // GET /games - Get all games (with optional clubId filter)
  if (pathname === '/games' && method === 'GET') {
    const url = new URL(req.url);
    const clubId = url.searchParams.get('clubId');
    const games = clubId ? gameService.getByClub(clubId) : gameService.getAll();
    return new Response(JSON.stringify(games), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // POST /games - Create new game
  if (pathname === '/games' && method === 'POST') {
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
  }

  // GET /games/:id - Get game by ID
  if (pathname.startsWith('/games/') && method === 'GET' && !pathname.includes('/players/')) {
    const id = pathname.split('/')[2];
    const game = gameService.getById(id);
    if (!game) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    return new Response(JSON.stringify(game), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // PUT /games/:id - Update game
  if (pathname.startsWith('/games/') && method === 'PUT' && !pathname.includes('/players/')) {
    const id = pathname.split('/')[2];
    const body = await req.json() as UpdateGameRequest;
    const game = gameService.update(id, body);
    if (!game) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    return new Response(JSON.stringify(game), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // DELETE /games/:id - Delete game
  if (pathname.startsWith('/games/') && method === 'DELETE' && !pathname.includes('/players/')) {
    const id = pathname.split('/')[2];
    const deleted = gameService.delete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    return new Response(JSON.stringify({ message: 'Game deleted successfully' }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // POST /games/:id/players/:userId - Add player to game
  if (pathname.match(/^\/games\/[^\/]+\/players\/[^\/]+$/) && method === 'POST') {
    const [, , gameId, , userId] = pathname.split('/');
    const game = gameService.addPlayer(gameId, userId);
    if (!game) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    return new Response(JSON.stringify(game), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // DELETE /games/:id/players/:userId - Remove player from game
  if (pathname.match(/^\/games\/[^\/]+\/players\/[^\/]+$/) && method === 'DELETE') {
    const [, , gameId, , userId] = pathname.split('/');
    const game = gameService.removePlayer(gameId, userId);
    if (!game) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    return new Response(JSON.stringify(game), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return null; // Route not handled by this module
};
