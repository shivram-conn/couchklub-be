import { clubService } from '../../services/clubService';
import { userService } from '../../services/userService';
import { CreateClubRequest } from '../../models/Club';
import { TokenPayload } from '../../utils/verifyToken';
// GET /clubs - Get all clubs
export const GET = async (req: Request, corsHeaders: Record<string, string>) => {
  const clubs = await clubService.getClubs((JSON.parse(req.headers.get('currentUserInfo') as string) as TokenPayload).id);
  return new Response(JSON.stringify(clubs), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};

// POST /clubs - Create new club
export const POST = async (req: Request, corsHeaders: Record<string, string>) => {
  const body = await req.json() as CreateClubRequest;
  body.ownerId = (JSON.parse(req.headers.get('currentUserInfo') as string) as TokenPayload).id;
  if (!body.name || !body.description || !body.memberIds) {
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
  const club = await clubService.create(body);
  return new Response(JSON.stringify(club), {
    status: 201,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};
