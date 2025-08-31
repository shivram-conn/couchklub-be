import { ClubUsecases } from '../../usecases/club';
import { TokenPayload } from '@/lib/verifyToken';

// GET /clubs - Get all clubs
export const GET = async (req: Request, corsHeaders: Record<string, string>) => {
  const currentUser = JSON.parse(req.headers.get('currentUserInfo') as string) as TokenPayload;
  const result = await ClubUsecases.getAllClubs(currentUser);
  
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

// POST /clubs - Create new club
export const POST = async (req: Request, corsHeaders: Record<string, string>) => {
  const body = await req.json();
  const currentUser = JSON.parse(req.headers.get('currentUserInfo') as string) as TokenPayload;
  
  const result = await ClubUsecases.createClub(body, currentUser);
  
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
