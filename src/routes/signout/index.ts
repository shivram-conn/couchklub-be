import { db } from "@/index";

export const DELETE = async (req: Request, corsHeaders: Record<string, string>) => {
    const token = req.headers.get('Authorization');
    
    const result = await db.query('DELETE FROM live_users WHERE token = $1', [token]);
    if (result.rowCount === 0) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }

    return new Response(JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
};
