import { clubService } from '../services/clubService';
import { userService } from '../services/userService';
import { CreateClubRequest, UpdateClubRequest } from '../models/Club';

export const handleClubRoutes = async (req: Request, pathname: string, method: string, corsHeaders: Record<string, string>) => {
  // GET /clubs - Get all clubs
  if (pathname === '/clubs' && method === 'GET') {
    const clubs = clubService.getAll();
    return new Response(JSON.stringify(clubs), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // POST /clubs - Create new club
  if (pathname === '/clubs' && method === 'POST') {
    const body = await req.json() as CreateClubRequest;
    if (!body.name || !body.description || !body.ownerId) {
      return new Response(JSON.stringify({ error: 'Name, description, and ownerId are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    // Check if owner exists
    const owner = userService.getById(body.ownerId);
    if (!owner) {
      return new Response(JSON.stringify({ error: 'Owner user not found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    const club = clubService.create(body);
    return new Response(JSON.stringify(club), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // GET /clubs/:id - Get club by ID
  if (pathname.startsWith('/clubs/') && method === 'GET' && !pathname.includes('/members/')) {
    const id = pathname.split('/')[2];
    const club = clubService.getById(id);
    if (!club) {
      return new Response(JSON.stringify({ error: 'Club not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    return new Response(JSON.stringify(club), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // PUT /clubs/:id - Update club
  if (pathname.startsWith('/clubs/') && method === 'PUT' && !pathname.includes('/members/')) {
    const id = pathname.split('/')[2];
    const body = await req.json() as UpdateClubRequest;
    const club = clubService.update(id, body);
    if (!club) {
      return new Response(JSON.stringify({ error: 'Club not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    return new Response(JSON.stringify(club), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // DELETE /clubs/:id - Delete club
  if (pathname.startsWith('/clubs/') && method === 'DELETE' && !pathname.includes('/members/')) {
    const id = pathname.split('/')[2];
    const deleted = clubService.delete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: 'Club not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    return new Response(JSON.stringify({ message: 'Club deleted successfully' }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // POST /clubs/:id/members/:userId - Add member to club
  if (pathname.match(/^\/clubs\/[^\/]+\/members\/[^\/]+$/) && method === 'POST') {
    const [, , clubId, , userId] = pathname.split('/');
    const club = clubService.addMember(clubId, userId);
    if (!club) {
      return new Response(JSON.stringify({ error: 'Club not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    return new Response(JSON.stringify(club), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // DELETE /clubs/:id/members/:userId - Remove member from club
  if (pathname.match(/^\/clubs\/[^\/]+\/members\/[^\/]+$/) && method === 'DELETE') {
    const [, , clubId, , userId] = pathname.split('/');
    const club = clubService.removeMember(clubId, userId);
    if (!club) {
      return new Response(JSON.stringify({ error: 'Club not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    return new Response(JSON.stringify(club), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return null; // Route not handled by this module
};
