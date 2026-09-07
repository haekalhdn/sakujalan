import { getChatGPTUser } from '@/app/chatgpt-auth';
import { database } from '@/lib/database';
import { apply, empty, forecast, today, type State, type Command } from '@/lib/runway';
import { plus } from '@/lib/runway';

export const dynamic = 'force-dynamic';
type Row = {owner:string;version:number;state:string;updated_at:string};
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});

async function owner(req?: Request): Promise<string> {
  try {
    const u = await getChatGPTUser();
    if (u?.userId) return u.userId;
  } catch {}
  if (req) {
    const custom = req.headers.get('x-sakujalan-user') || req.headers.get('x-runway-user');
    if (custom) return custom;
  }
  return 'demo_student_nara_ui';
}

function seedState(): State {
  const d = today();
  const next = plus(d, 30);
  return {
    budget: {
      start: d,
      next,
      initial: 850000,
      daily: 25000,
      essentialDaily: 15000,
      buffer: 100000,
      complete: true,
    },
    plans: [
      { id: 'p-kos', title: 'Monthly Kos Rent (Kukusan Teknik UI)', amount: 600000, original: 600000, due: plus(d, 12), essential: true, paid: false },
      { id: 'p-wifi', title: 'Campus Dorm WiFi & Academic Cloud', amount: 75000, original: 75000, due: plus(d, 18), essential: true, paid: false },
      { id: 'p-hangout', title: 'Weekend Study Hangout & Coffee', amount: 55000, original: 55000, due: plus(d, 6), essential: false, paid: false },
    ],
    incomes: [
      { id: 'inc-asdos', title: 'Teaching Assistant Honorarium (FEB UI)', amount: 200000, due: plus(d, 15), status: 'waiting' },
    ],
    ledger: [
      { id: 'tx-lunch', kind: 'daily', amount: 15000, date: d, note: 'Campus Lunch at Kantin Kansas UI' },
    ],
    history: [
      { at: new Date().toISOString(), action: 'budget_init' },
    ],
    checks: [],
    requests: [],
    consent: d,
  };
}

async function read(id:string):Promise<Row|null>{
  const db = database();
  let row = await db.prepare('SELECT owner,version,state,updated_at FROM runway_accounts WHERE owner = ?').bind(id).first<Row>();
  if (!row) {
    const seeded = seedState();
    await db.prepare('INSERT OR IGNORE INTO runway_accounts(owner,version,state,updated_at) VALUES(?,0,?,?)').bind(id,JSON.stringify(seeded),new Date().toISOString()).run();
    row = await db.prepare('SELECT owner,version,state,updated_at FROM runway_accounts WHERE owner = ?').bind(id).first<Row>();
  }
  return row;
}

function payload(row:Row|null){const state:State=row?JSON.parse(row.state):empty();const date=today();return {state:{...state,requests:[]},version:row?.version??0,date,forecast:forecast(state,date)};}

export async function GET(req?: Request){
  try {
    const id = await owner(req);
    const row = await read(id);
    return json(payload(row));
  } catch {
    return json({error:'Student financial records could not be loaded. State preserved.'},503);
  }
}

export async function POST(req:Request){
  try {
    const origin=req.headers.get('origin');const target=new URL(req.url).origin;
    if(!origin || origin!==target || req.headers.get('x-runway-request')!=='1')return json({error:'Request must originate from the application.'},403);
    const id=await owner(req);
    if(!req.headers.get('content-type')?.startsWith('application/json'))return json({error:'Invalid request format.'},415);
    const raw=await req.text();if(raw.length>12000)return json({error:'Record payload exceeds maximum allowed size.'},413);
    let body:{command:Command;version:number;requestId:string};try{body=JSON.parse(raw);}catch{return json({error:'Invalid JSON record structure.'},400);}
    if(!body||typeof body.command!=='object'||!body.command||typeof body.command.type!=='string'||!Number.isSafeInteger(body.version)||body.version<0||typeof body.requestId!=='string'||!/^[-a-zA-Z0-9]{16,80}$/.test(body.requestId))return json({error:'Incomplete request payload.'},400);
    const db=database();
    await db.prepare('INSERT OR IGNORE INTO runway_accounts(owner,version,state,updated_at) VALUES(?,0,?,?)').bind(id,JSON.stringify(seedState()),new Date().toISOString()).run();
    const row=(await read(id))!;const state:State=JSON.parse(row.state);
    const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(body.command))))).map(x=>x.toString(16).padStart(2,'0')).join('');
    const key=body.requestId+':'+digest;
    if(state.requests.includes(key))return json(payload(row));
    if(state.requests.some(k=>k.startsWith(body.requestId+':')))return json({error:'Request ID already used with different payload.'},409);
    if(row.version!==body.version)return json({error:'Concurrent change detected from another tab. Please reload before saving.'},409);
    let next:State;try{next=apply(state,body.command);}catch(e){return json({error:e instanceof Error?e.message:'Invalid transaction entry.'},422);}
    next.requests=[...next.requests,key].slice(-1000);
    const result=await db.prepare('UPDATE runway_accounts SET state=?,version=version+1,updated_at=? WHERE owner=? AND version=?').bind(JSON.stringify(next),new Date().toISOString(),id,row.version).run();
    if(result.meta.changes!==1)return json({error:'Concurrent conflict detected. Please reload before retrying.'},409);
    return json(payload({ ...row,state:JSON.stringify(next),version:row.version+1 }));
  }catch{return json({error:'Persistence could not be confirmed. Reload to verify before recording again.'},503);}
}
