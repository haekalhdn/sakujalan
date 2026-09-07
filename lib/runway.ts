export type Plan = { id: string; title: string; amount: number; original: number; due: string; essential: boolean; paid: boolean; deferredFrom?: string };
export type Income = { id: string; title: string; amount: number; due: string; status: 'waiting' | 'received' };
export type Entry = { id: string; kind: string; amount: number; date: string; note: string; planId?: string; incomeId?: string; refundOf?: string };
export type Budget = { start: string; next: string; initial: number; daily: number; essentialDaily: number; buffer: number; complete: boolean };
export type State = { budget: Budget | null; plans: Plan[]; incomes: Income[]; ledger: Entry[]; history: { at: string; action: string }[]; checks: { date: string; met: boolean; emergency: boolean }[]; requests: string[]; consent: string | null };
export type Command = { type: string; [key: string]: unknown };
export function empty(): State { return { budget: null, plans: [], incomes: [], ledger: [], history: [], checks: [], requests: [], consent: null }; }
export function today(): string { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
export function day(s: unknown): number {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) throw Error('Date must be formatted as YYYY-MM-DD.');
  const n = Date.parse(s + 'T00:00:00Z');
  if (!Number.isFinite(n) || new Date(n).toISOString().slice(0,10) !== s) throw Error('Invalid date provided.');
  return n / 86400000;
}
export const plus = (d: string, n: number) => new Date((day(d)+n)*86400000).toISOString().slice(0,10);
function amount(v: unknown, zero = true): number { if (!Number.isSafeInteger(v) || (v as number) < (zero ? 0 : 1) || (v as number) > 100000000) throw Error('Amount must be an integer between 0 and Rp 100,000,000.'); return v as number; }
function title(v: unknown): string { if (typeof v !== 'string' || !v.trim() || v.trim().length > 100) throw Error('Description must be between 1 and 100 characters.'); return v.trim(); }
function bool(v: unknown): boolean { if (typeof v !== 'boolean') throw Error('Invalid boolean selection.'); return v; }
function find<T extends {id:string}>(items:T[], id:unknown):T { const x=items.find(i=>i.id===id); if (!x) throw Error('Record not found. Please refresh the page.'); return x; }
export function balance(s: State): number { return (s.budget?.initial ?? 0) + s.ledger.reduce((n,e)=>n+(['income','refund'].includes(e.kind)?e.amount:['expense','daily','payment'].includes(e.kind)?-e.amount:0),0); }
export function forecast(s: State, date = today()) {
  const b=s.budget; if (!b) return null;
  const cash=balance(s), expired=day(b.next)<=day(date), horizon=Math.max(1,day(b.next)-day(date));
  const active=s.plans.filter(p=>!p.paid && p.due<b.next);
  const mandatory=active.filter(p=>p.essential).reduce((n,p)=>n+p.amount,0);
  const optional=active.filter(p=>!p.essential).reduce((n,p)=>n+p.amount,0);
  const spentToday=s.ledger.filter(e=>e.kind==='daily'&&e.date===date).reduce((n,e)=>n+e.amount,0);
  const dailyLeft=Math.max(0,b.daily-spentToday);
  const essentialFuture=b.essentialDaily*(horizon-1);
  const allowance=Math.max(0,Math.floor((cash+spentToday-mandatory-optional-b.buffer)/horizon)-spentToday);
  const safe=expired?0:Math.max(0,Math.min(allowance,cash-mandatory-optional-b.buffer-essentialFuture));
  const remainder=cash-mandatory-optional-dailyLeft-b.daily*(horizon-1);
  let running=cash; let firstRisk:string|null=null;
  const points=Array.from({length:expired?1:horizon},(_,i)=>{const d=plus(date,i); const plans=active.filter(p=>i===0?p.due<=d:p.due===d).reduce((n,p)=>n+p.amount,0); running-=plans+(i===0?dailyLeft:b.daily); if(running<0&&!firstRisk)firstRisk=d; return {date:d,balance:running};});
  const lastCheck=s.checks.map(c=>c.date).sort().at(-1);
  return {cash,horizon,expired,mandatory,optional,spentToday,safe,remainder,gap:Math.max(0,-remainder),reserveGap:Math.max(0,b.buffer-Math.max(0,remainder)),pending:s.incomes.filter(i=>i.status==='waiting').reduce((n,i)=>n+i.amount,0),firstRisk,points,unconfirmed:date>b.start&&lastCheck!==date,critical:mandatory+b.essentialDaily*horizon>cash,complete:b.complete};
}
export function apply(input:State,c:Command,date=today(),id=crypto.randomUUID()):State {
  const s=structuredClone(input);
  const add=(kind:string,value:number,note:string,extra:Partial<Entry>={})=>s.ledger.push({id,kind,amount:value,date,note,...extra});
  if(c.type==='delete') return empty();
  if(c.type==='budget') {
    if(c.consent!==true) throw Error('Please accept data consent before saving.');
    const next=String(c.next); const h=day(next)-day(date); if(h<1||h>90)throw Error('Select next allowance/inflow date 1–90 days from today.');
    const daily=amount(c.daily), essentialDaily=amount(c.essentialDaily); if(essentialDaily>daily)throw Error('Minimum essential daily budget cannot exceed total daily budget.');
    if(!s.budget) s.budget={start:date,next,initial:amount(c.balance),daily,essentialDaily,buffer:amount(c.buffer),complete:bool(c.complete)};
    else s.budget={...s.budget,next,daily,essentialDaily,buffer:amount(c.buffer),complete:bool(c.complete)};
    s.consent=s.consent||date;
  } else {
    if(!s.budget)throw Error('Please initialize your budget runway first.');
    const b=s.budget;
    switch(c.type) {
      case 'plan': {
        const due=String(c.due); if(day(due)<day(date)||day(due)>day(date)+180)throw Error('Commitment due date must be between today and 180 days ahead.');
        const value=amount(c.amount,false); s.plans.push({id,title:title(c.title),amount:value,original:value,due,essential:bool(c.essential),paid:false}); break;
      }
      case 'save': {
        const p=find(s.plans,c.id); if(p.paid)throw Error('This commitment is already paid.');
        const v=amount(c.amount,false); if(v>=p.amount)throw Error('Alternative cost must be strictly less than current planned amount.'); p.amount=v; break;
      }
      case 'undoSave': { const p=find(s.plans,c.id); if(p.paid)throw Error('This commitment is already paid.'); p.amount=p.original; break; }
      case 'defer': {
        const p=find(s.plans,c.id); if(p.essential||p.paid)throw Error('Only unpaid optional commitments can be deferred.');
        const due=String(c.due); if(day(due)<day(b.next)||day(due)>day(date)+180||due<=p.due)throw Error('Select a date after original due date and in the next period (up to 180 days).');
        p.deferredFrom=p.deferredFrom||p.due; p.due=due; break;
      }
      case 'undoDefer': {const p=find(s.plans,c.id); if(p.paid||!p.deferredFrom)throw Error('No deferral found to undo.');p.due=p.deferredFrom;delete p.deferredFrom;break;}
      case 'pay': { const p=find(s.plans,c.id); if(p.paid)throw Error('This commitment is already paid.'); const value=amount(c.amount,false); add('payment',value,p.title,{planId:p.id});p.paid=true;break; }
      case 'expense': case 'daily': case 'income': case 'transfer': {add(c.type,amount(c.amount,false),title(c.title));break;}
      case 'pending': {
        const due=String(c.due); if(day(due)<day(date)||day(due)>day(date)+180)throw Error('Estimated receipt date must be between today and 180 days.');
        s.incomes.push({id,title:title(c.title),amount:amount(c.amount,false),due,status:'waiting'});break;
      }
      case 'receive': {const i=find(s.incomes,c.id); if(i.status==='received')throw Error('This income has already been confirmed as received.'); add('income',amount(c.amount,false),i.title,{incomeId:i.id});i.status='received';break;}
      case 'refund': {
        const e=find(s.ledger,c.id); if(!['daily','expense','payment'].includes(e.kind))throw Error('Refunds can only be applied to outgoing expenses.');
        const refunded=s.ledger.filter(x=>x.refundOf===e.id).reduce((n,x)=>n+x.amount,0);const v=amount(c.amount,false);
        if(refunded+v>e.amount)throw Error('Refund amount exceeds the unreimbursed expense amount.');add('refund',v,'Refund: '+e.note,{refundOf:e.id});break;
      }
      case 'check': {s.checks=s.checks.filter(x=>x.date!==date);s.checks.push({date,met:bool(c.met),emergency:bool(c.emergency)});break;}
      default:throw Error('Unrecognized command action.');
    }
  }
  const cash=balance(s);if(cash<0||cash>100000000)throw Error('Resulting balance must be between Rp 0 and Rp 100,000,000.');
  if(s.ledger.length>5000||s.plans.length>500||s.incomes.length>500)throw Error('Record capacity limit reached. Please export your data.');
  s.history.push({at:new Date().toISOString(),action:c.type});return s;
}
