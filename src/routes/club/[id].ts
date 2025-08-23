import { clubService } from '../../services/clubService';
import { UpdateClubRequest } from '../../models/Club';

// GET /clubs/:id - Get club by ID
export const GET = async (req: Request, corsHeaders: Record<string, string>, params: { id: string }) => {
  const club = clubService.getById(params.id);
  if (!club) {
    return new Response(JSON.stringify({ error: 'Club not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  return new Response(JSON.stringify(club), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};

// PUT /clubs/:id - Update club
export const PUT = async (req: Request, corsHeaders: Record<string, string>, params: { id: string }) => {
  const body = await req.json() as UpdateClubRequest;
  const club = clubService.update(params.id, body);
  if (!club) {
    return new Response(JSON.stringify({ error: 'Club not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  return new Response(JSON.stringify(club), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};

// DELETE /clubs/:id - Delete club
export const DELETE = async (req: Request, corsHeaders: Record<string, string>, params: { id: string }) => {
  const deleted = clubService.delete(params.id);
  if (!deleted) {
    return new Response(JSON.stringify({ error: 'Club not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  return new Response(JSON.stringify({ message: 'Club deleted successfully' }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};
