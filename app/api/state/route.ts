import { getChatGPTUser } from '@/app/chatgpt-auth';
import { database } from '@/lib/database';
import { apply, empty, forecast, today, type State, type Command } from '@/lib/runway';
export const dynamic = 'force-dynamic';
type Row = {owner:string;version:number;state:string;updated_at:string};
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
async function owner() {const u=await getChatGPTUser();if(!u)return null;return u.userId;}
async function read(id:string):Promise<Row|null>{return database().prepare('SELECT owner,version,state,updated_at FROM runway_accounts WHERE owner = ?').bind(id).first<Row>();}
function payload(row:Row|null){const state:State=row?JSON.parse(row.state):empty();const date=today();return {state:{...state,requests:[]},version:row?.version??0,date,forecast:forecast(state,date)};}
export async function GET(){try{const id=await owner();if(!id)return json({error:'Masuk terlebih dahulu untuk membuka catatanmu.',signIn:'/signin-with-chatgpt?return_to=%2F'},401);return json(payload(await read(id)));}catch{return json({error:'Catatan belum dapat dimuat. Saldo tidak diubah menjadi nol.'},503);}}
export async function POST(req:Request){
  try {
    const origin=req.headers.get('origin');const target=new URL(req.url).origin;
    if(!origin || origin!==target || req.headers.get('x-runway-request')!=='1')return json({error:'Permintaan tidak berasal dari halaman aplikasi.'},403);
    const id=await owner();if(!id)return json({error:'Sesi berakhir. Masuk kembali.',signIn:'/signin-with-chatgpt?return_to=%2F'},401);
    if(!req.headers.get('content-type')?.startsWith('application/json'))return json({error:'Format permintaan tidak sesuai.'},415);
    const raw=await req.text();if(raw.length>12000)return json({error:'Catatan terlalu panjang.'},413);
    let body:{command:Command;version:number;requestId:string};try{body=JSON.parse(raw);}catch{return json({error:'Format catatan tidak valid.'},400);}
    if(!body||typeof body.command!=='object'||!body.command||typeof body.command.type!=='string'||!Number.isSafeInteger(body.version)||body.version<0||typeof body.requestId!=='string'||!/^[-a-zA-Z0-9]{16,80}$/.test(body.requestId))return json({error:'Permintaan belum lengkap.'},400);
    const db=database();
    await db.prepare('INSERT OR IGNORE INTO runway_accounts(owner,version,state,updated_at) VALUES(?,0,?,?)').bind(id,JSON.stringify(empty()),new Date().toISOString()).run();
    const row=(await read(id))!;const state:State=JSON.parse(row.state);
    const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(body.command))))).map(x=>x.toString(16).padStart(2,'0')).join('');
    const key=body.requestId+':'+digest;
    if(state.requests.includes(key))return json(payload(row));
    if(state.requests.some(k=>k.startsWith(body.requestId+':')))return json({error:'Identitas permintaan sudah digunakan untuk catatan berbeda.'},409);
    if(row.version!==body.version)return json({error:'Ada perubahan dari tab lain. Muat ulang, lalu periksa catatan sebelum menyimpan lagi.'},409);
    let next:State;try{next=apply(state,body.command);}catch(e){return json({error:e instanceof Error?e.message:'Catatan tidak valid.'},422);}
    next.requests=[...next.requests,key].slice(-1000);
    const result=await db.prepare('UPDATE runway_accounts SET state=?,version=version+1,updated_at=? WHERE owner=? AND version=?').bind(JSON.stringify(next),new Date().toISOString(),id,row.version).run();
    if(result.meta.changes!==1)return json({error:'Catatan berubah bersamaan. Muat ulang sebelum mencoba lagi.'},409);
    return json(payload({ ...row,state:JSON.stringify(next),version:row.version+1 }));
  }catch{return json({error:'Penyimpanan belum dapat dikonfirmasi. Muat ulang untuk memeriksa sebelum mencatat lagi.'},503);}
}
