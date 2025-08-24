import { userService } from "@/services/userService";
import { generateToken } from "@/utils/generateToken";



const POST = async (req: Request, corsHeaders: Record<string, string>) => {
  const body = await req.json();
  const { email, password } = body;

  const user = await userService.getByEmail(email);
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  if (user.password !== password) {
    return new Response(JSON.stringify({ error: 'Invalid password' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  const token = generateToken(user);

  
  return new Response(JSON.stringify({ status: 'OK', timestamp: new Date().toISOString(), token }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
    status: 200,
  });
};
const authRequired = false;

export  {  POST, authRequired };