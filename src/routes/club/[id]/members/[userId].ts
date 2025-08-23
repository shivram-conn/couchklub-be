import { clubService } from '../../../../services/clubService';

// POST /clubs/:id/members/:userId - Add member to club
export const POST = async (req: Request, corsHeaders: Record<string, string>, params: { id: string, userId: string }) => {
  const club = clubService.addMember(params.id, params.userId);
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

// DELETE /clubs/:id/members/:userId - Remove member from club
export const DELETE = async (req: Request, corsHeaders: Record<string, string>, params: { id: string, userId: string }) => {
  const club = clubService.removeMember(params.id, params.userId);
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
