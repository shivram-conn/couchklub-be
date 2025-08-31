import { HealthCheckUsecases } from '../../usecases/health-check';

export const $GET = async (req: Request, corsHeaders: Record<string, string>) => {
  const result = await HealthCheckUsecases.getHealthStatus();
  
  return new Response(JSON.stringify(result.data), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};