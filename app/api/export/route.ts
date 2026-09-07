import { GET as getState } from '../state/route';
export const dynamic='force-dynamic';
export async function GET(){const response=await getState();if(!response.ok)return response;const data=await response.json() as Record<string,unknown>;return new Response(JSON.stringify({format:'campus-runway-v1',exportedAt:new Date().toISOString(),...data},null,2),{headers:{'Content-Type':'application/json; charset=utf-8','Content-Disposition':'attachment; filename="campus-runway-data.json"','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
