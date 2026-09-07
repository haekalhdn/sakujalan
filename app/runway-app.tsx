'use client';
/* oxlint-disable next/no-html-link-for-pages, react/react-compiler -- SIWC and file downloads require top-level/plain anchors. */
import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import {
  Wallet, ArrowRight, ShieldCheck, Plus,
  Check, Info, RefreshCw, Leaf, Clock3,
  LayoutDashboard, ListChecks, Sliders,
  Compass, Radio, Sparkles, BookOpen, Coffee, Bus, ChevronRight,
  AlertCircle, Award, Smile
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { plus, type State, type Command, type forecast } from '@/lib/runway';
import {
  ChameleonBadge,
  BirdBadge,
  StudentBadge,
  FoodChipIcon,
  TransitChipIcon,
  CoffeeChipIcon,
  TipIcon,
  SavingsIcon,
  ProtectionIcon,
  GrowthIcon,
} from '@/components/mascot-badges';

type Data = { state: State; version: number; date: string; forecast: ReturnType<typeof forecast> };
type Modal = { type: string; id?: string } | null;

const rp = (v: number) => 'Rp ' + Math.round(v).toLocaleString('en-US');
const dt = (v: string) => new Date(v + 'T00:00:00Z').toLocaleDateString('en-US', { day: 'numeric', month: 'short', timeZone: 'UTC' });

const labels: Record<string, string> = {
  budget: 'Set Pocket Money & Daily Target',
  setup_custom: 'Setup My Personal Campus Runway',
  plan: 'Add Fixed Bill or Need',
  pay: 'Mark Bill as Paid',
  save: 'Pick Cheaper Alternative',
  defer: 'Postpone Optional Expense',
  daily: 'Log Daily Expense',
  expense: 'Log Extra Expense',
  income: 'Log Fresh Cash In',
  pending: 'Log Expected Money (Tutoring / Gig)',
  receive: 'Confirm Money Received',
  refund: 'Log Refund',
  transfer: 'Move Balance',
  check: 'Daily Quick Health Check',
  formula: 'How Safe-to-Spend Works',
};

function Field({
  name, label, value, type = 'number', min = 0, max = 100000000, hint
}: {
  name: string; label: string; value?: string | number; type?: string; min?: string | number; max?: string | number; hint?: string
}) {
  return (
    <div className="field">
      <label htmlFor={`field-${name}`}>
        <span>{label}</span>
      </label>
      <Input
        id={`field-${name}`}
        name={name}
        type={type}
        defaultValue={value}
        min={type === 'text' ? undefined : min}
        max={type === 'text' ? undefined : max}
        maxLength={type === 'text' ? 100 : undefined}
        step={type === 'number' ? 1 : undefined}
        required
        inputMode={type === 'number' ? 'numeric' : undefined}
        className="field-input"
      />
      {hint && <small>{hint}</small>}
    </div>
  );
}

function Choice({ name, children, checked = false }: { name: string; children: React.ReactNode; checked?: boolean }) {
  return (
    <label className="choice">
      <Checkbox name={name} defaultChecked={checked} />
      <span>{children}</span>
    </label>
  );
}


interface RunwayAppProps {
  onBackToLanding?: () => void;
}

export default function RunwayApp({ onBackToLanding }: RunwayAppProps = {}) {
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState('summary');
  const [modal, setModal] = useState<Modal>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loaded, setLoaded] = useState(false);

  // Profile & interactive simulation states
  const [activeProfile, setActiveProfile] = useState<'benchmark' | 'custom'>('benchmark');
  const [whatIfSpend, setWhatIfSpend] = useState<number>(0);
  const [radarCategory, setRadarCategory] = useState<'all' | 'mobility' | 'meals' | 'study'>('all');
  const [webhookSimulated, setWebhookSimulated] = useState(false);

  const pending = useRef<{ serialized: string; requestId: string } | null>(null);

  const load = async () => {
    setError('');
    try {
      const r = await fetch('/api/state', { cache: 'no-store' });
      const d = (await r.json()) as Data & { error?: string };
      if (!r.ok) {
        throw Error(d.error || 'Unable to open student records.');
      }
      setData(d);
      pending.current = null;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Connection interrupted.');
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  // Card magic mouse spotlight effect
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('.lever-card,.radar-card,.ecosystem-card,.hero-card');
    const handlers: Array<{ el: HTMLElement; fn: (e: MouseEvent) => void }> = [];
    cards.forEach(card => {
      const fn = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      };
      card.addEventListener('mousemove', fn);
      handlers.push({ el: card, fn });
    });
    return () => handlers.forEach(({ el, fn }) => el.removeEventListener('mousemove', fn));
  });

  const show = (type: string, id?: string) => {
    setError('');
    setMessage('');
    setModal({ type, id });
  };

  const mutate = async (command: Command) => {
    if (!data || busy) return;
    setBusy(true);
    setError('');
    setMessage('');
    const serialized = JSON.stringify(command);
    if (!pending.current || pending.current.serialized !== serialized) {
      pending.current = { serialized, requestId: crypto.randomUUID() };
    }
    try {
      const r = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Runway-Request': '1' },
        body: JSON.stringify({ command, version: data.version, requestId: pending.current.requestId }),
      });
      const d = (await r.json()) as Data & { error?: string };
      if (!r.ok) {
        throw Error(d.error || 'Action could not be executed.');
      }
      setData(d);
      setModal(null);
      pending.current = null;
      setMessage('Updated! Your safe daily runway recalculated automatically.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Record update interrupted.');
    } finally {
      setBusy(false);
    }
  };

  // Quick Action Levers
  const handleActivateLever1 = async () => {
    if (!data) return;
    const foodPlan = data.state.plans.find((p) => p.title.toLowerCase().includes('lunch') || p.title.toLowerCase().includes('food'));
    if (foodPlan && !foodPlan.paid && foodPlan.amount > 20000) {
      await mutate({ type: 'save', id: foodPlan.id, amount: foodPlan.amount - 20000 });
      setMessage('Lever 1 Applied: Saved Rp 20,000 on meals!');
    } else {
      await mutate({ type: 'daily', title: 'GoFood Campus Partner Discount', amount: 15000 });
      setMessage('Lever 1 Applied: Logged lunch at Rp 15,000 student deal!');
    }
  };

  const handleActivateLever2 = async () => {
    if (!data) return;
    const optionalPlan = data.state.plans.find((p) => !p.essential && !p.paid && !p.deferredFrom);
    if (optionalPlan && b) {
      const newDue = plus(b.next, 2);
      await mutate({ type: 'defer', id: optionalPlan.id, due: newDue });
      setMessage(`Lever 2 Applied: Postponed "${optionalPlan.title}" until after next allowance!`);
    } else {
      show('defer', data.state.plans.find((p) => !p.essential && !p.paid)?.id);
    }
  };

  const handleActivateLever3 = async () => {
    if (!data) return;
    const pendingIncome = data.state.incomes.find((i) => i.status === 'waiting');
    if (pendingIncome) {
      await mutate({ type: 'receive', id: pendingIncome.id, amount: pendingIncome.amount });
      setMessage(`Lever 3 Applied: Cash received for "${pendingIncome.title}" (${rp(pendingIncome.amount)})!`);
    } else {
      await mutate({ type: 'pending', title: 'GoMissions Campus Research Survey', amount: 45000, due: plus(data.date, 2) });
      setMessage('Lever 3 Applied: Enrolled in campus gig (+Rp 45,000 incoming)!');
    }
  };

  // Quick Log Helpers
  const handleQuickLog = async (title: string, amount: number) => {
    await mutate({ type: 'daily', title, amount });
    setMessage(`Logged ${title} (${rp(amount)}). Safe daily limit updated!`);
  };

  // Webhook Simulation
  const handleSimulateWebhook = async () => {
    setWebhookSimulated(true);
    await mutate({ type: 'daily', title: 'GoPay QRIS: Kantin Dallas UI (Auto-Synced)', amount: 16000 });
    setMessage("GoPay QRIS payment detected: Auto-deducted Rp 16,000 from today's allowance.");
  };

  const b = data?.state.budget;
  const s = data?.state;
  const f = data?.forecast;
  const date = data?.date;

  // What-If calculations
  const effectiveCash = Math.max(0, (f?.cash ?? 0) - whatIfSpend);
  const effectiveMandatory = f?.mandatory ?? 0;
  const effectiveOptional = f?.optional ?? 0;
  const effectiveBuffer = b?.buffer ?? 0;
  const horizon = f?.horizon || 1;
  const simulatedSafe = Math.max(0, Math.floor((effectiveCash - effectiveMandatory - effectiveOptional - effectiveBuffer) / horizon));
  const simulatedSurplus = effectiveCash - effectiveMandatory - effectiveOptional - (b?.daily ?? 0) * (horizon - 1);

  const onSubmitForm = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modal) return;
    const fd = new FormData(e.currentTarget);
    const getNum = (key: string) => Number(fd.get(key));
    const getStr = (key: string) => {
      const v = fd.get(key);
      return typeof v === 'string' ? v.trim() : '';
    };
    const getBool = (key: string) => fd.get(key) === 'on';

    switch (modal.type) {
      case 'budget':
      case 'setup_custom':
        void mutate({
          type: 'budget',
          balance: getNum('balance'),
          next: getStr('next'),
          daily: getNum('daily'),
          essentialDaily: getNum('essentialDaily'),
          buffer: getNum('buffer'),
          complete: getBool('complete'),
          consent: getBool('consent'),
        });
        setActiveProfile('custom');
        break;
      case 'plan':
        void mutate({
          type: 'plan',
          title: getStr('title'),
          amount: getNum('amount'),
          due: getStr('due'),
          essential: getBool('essential'),
        });
        break;
      case 'pay':
        void mutate({ type: 'pay', id: modal.id, amount: getNum('amount') });
        break;
      case 'save':
        void mutate({ type: 'save', id: modal.id, amount: getNum('amount') });
        break;
      case 'defer':
        void mutate({ type: 'defer', id: modal.id, due: getStr('due') });
        break;
      case 'daily':
        void mutate({ type: 'daily', title: getStr('title'), amount: getNum('amount') });
        break;
      case 'expense':
        void mutate({ type: 'expense', title: getStr('title'), amount: getNum('amount') });
        break;
      case 'income':
        void mutate({ type: 'income', title: getStr('title'), amount: getNum('amount') });
        break;
      case 'pending':
        void mutate({ type: 'pending', title: getStr('title'), amount: getNum('amount'), due: getStr('due') });
        break;
      case 'receive':
        void mutate({ type: 'receive', id: modal.id, amount: getNum('amount') });
        break;
      case 'refund':
        void mutate({ type: 'refund', title: getStr('title'), amount: getNum('amount') });
        break;
      case 'transfer':
        void mutate({ type: 'transfer', title: getStr('title'), amount: getNum('amount') });
        break;
      case 'check':
        void mutate({
          type: 'check',
          date: date ?? '2026-09-07',
          food: getBool('food'),
          transport: getBool('transport'),
          academic: getBool('academic'),
          note: getStr('note'),
        });
        break;
    }
  };

  const plan = modal?.id ? s?.plans.find((p) => p.id === modal.id) : undefined;

  const actions = (kind: string, label: string, Icon = Plus) => (
    <Button variant="outline" className="action-button" onClick={() => show(kind)}>
      <Icon size={16} />
      {label}
    </Button>
  );

  return (
    <main className="shell">
      <a className="skip" href="#content">Skip navigation</a>

      {/* SAKUJALAN TOP APP HEADER */}
      <header className="targo-app-header">
        <button
          type="button"
          className="targo-app-brand"
          onClick={onBackToLanding}
          style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: onBackToLanding ? 'pointer' : 'default' }}
          aria-label="Back to SakuJalan Home"
        >
          <div className="targo-brand-mark" />
          <div className="targo-brand-text-wrap">
            <span className="targo-brand-name">sakujalan</span>
            <span className="targo-brand-sub">Campus Budget Navigator</span>
          </div>
        </button>

        <div className="targo-app-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ChameleonBadge size={38} />
            <span className="targo-telemetry-badge">
              <ShieldCheck size={14} /> UI STUDENT COCKPIT
            </span>
          </div>

          <button
            type="button"
            className="targo-btn-chamfer"
            onClick={() => show('setup_custom')}
            style={{ fontSize: '12px', padding: '9px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Sliders size={14} /> EDIT BUDGET
          </button>
          {data && (
            <Button variant="ghost" aria-label="Reload records" onClick={() => void load()}>
              <RefreshCw size={16} />
            </Button>
          )}
          {onBackToLanding && (
            <button
              type="button"
              className="targo-btn-chamfer"
              onClick={onBackToLanding}
              style={{ fontSize: '12px', padding: '9px 16px' }}
            >
              ← HOME
            </button>
          )}
        </div>
      </header>

      {/* QUICK STATUS & PROFILE SELECTOR */}
      <div className="profile-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <StudentBadge size={44} />
          <div className="profile-info">
            <span className="profile-tag">
              {activeProfile === 'benchmark' ? 'STUDENT PROFILE: NARA (UI)' : 'MY REAL FINANCES'}
            </span>
            <span>
              {activeProfile === 'benchmark'
                ? 'Rp 850k monthly allowance · 30-day term'
                : 'Custom student budget · Live user inputs'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`radar-filter-btn ${activeProfile === 'benchmark' ? 'active' : ''}`}
            onClick={() => {
              setActiveProfile('benchmark');
              void mutate({
                type: 'budget',
                balance: 850000,
                next: date ? plus(date, 30) : '2026-10-07',
                daily: 25000,
                essentialDaily: 15000,
                buffer: 100000,
                complete: true,
                consent: true,
              });
              setMessage('Reset to Nara benchmark case.');
            }}
          >
            Nara Case
          </button>
          <button
            type="button"
            className={`radar-filter-btn ${activeProfile === 'custom' ? 'active' : ''}`}
            onClick={() => show('setup_custom')}
          >
            + Set My Budget
          </button>
        </div>
      </div>

      {message && <output className="notice success"><Check size={18} />{message}</output>}
      {error && !modal && (
        <div className="notice error" role="alert">
          <Info size={18} />
          <span>{error}</span>
          <Button variant="outline" onClick={() => void load()}>Reload</Button>
        </div>
      )}

      {!b ? (
        <section id="content" className="welcome">
          <div>
            <span className="eyebrow">CAMPUS BUDGET NAVIGATOR</span>
            <h1>Spend Today Without Stress.</h1>
            <p>Know your real safe daily cash, keep rent safe, and reach the next allowance easily.</p>
            {!loaded ? (
              <output>Opening student records…</output>
            ) : data ? (
              <Button className="primary" onClick={() => show('setup_custom')}>
                Setup Your Campus Runway <ArrowRight />
              </Button>
            ) : (
              <Button onClick={() => void load()}>Try Again</Button>
            )}
          </div>

          <aside className="hero-card welcome-preview">
            <div className="card-top">
              <span><Wallet size={18} /> SAKUJALAN PREVIEW</span>
              <span className="small-tag">LIVE</span>
            </div>
            <div style={{ margin: '24px 0' }}>
              <small style={{ color: '#00DF82', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '11px', display: 'block' }}>
                SAFE TO SPEND TODAY
              </small>
              <div className="big-money">Rp 14,000</div>
              <span style={{ color: '#B4C6BC', fontSize: '13px' }}>Guaranteed safe daily limit</span>
            </div>
          </aside>
        </section>
      ) : (
        <>
          {/* USER JOURNEY STEPS HERO */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(0, 170, 19, 0.2)',
            borderRadius: '14px',
            padding: '18px 24px',
            marginBottom: '24px',
            boxShadow: '0 6px 20px rgba(0, 170, 19, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <BirdBadge size={46} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#00AA13', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    DAILY STUDENT FLOW
                  </div>
                  <h3 style={{ margin: 0, fontSize: '17px', color: '#16261E' }}>
                    1. Check Safe Limit → 2. Tap 1-Click Log → 3. Use Lever if Tight
                  </h3>
                </div>
              </div>

              {/* 1-Click Quick Expense Chips */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#54665C' }}>Quick Log:</span>
                <button
                  type="button"
                  className="radar-filter-btn active"
                  onClick={() => handleQuickLog('Kantin Lunch', 15000)}
                  style={{ background: '#E8F8EC', color: '#007A0E', borderColor: '#00AA13' }}
                >
                  <FoodChipIcon /> Lunch (Rp 15k)
                </button>
                <button
                  type="button"
                  className="radar-filter-btn"
                  onClick={() => handleQuickLog('Bikun/KRL Transit', 8000)}
                >
                  <TransitChipIcon /> Transit (Rp 8k)
                </button>
                <button
                  type="button"
                  className="radar-filter-btn"
                  onClick={() => handleQuickLog('Campus Coffee', 10000)}
                >
                  <CoffeeChipIcon /> Coffee (Rp 10k)
                </button>
                <Button size="sm" className="primary" onClick={() => show('daily')} style={{ height: '36px' }}>
                  <Plus size={14} /> Custom
                </Button>
              </div>
            </div>
          </div>

          {/* MAIN 5 CLEAN TABS */}
          <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
            <TabsList className="main-tabs" aria-label="Application Sections">
              <TabsTrigger value="summary"><LayoutDashboard size={16} />1. Daily Safe-to-Spend</TabsTrigger>
              <TabsTrigger value="levers"><Sliders size={16} />2. Save Money (3 Levers)</TabsTrigger>
              <TabsTrigger value="radar"><Compass size={16} />3. Cheap Campus Map</TabsTrigger>
              <TabsTrigger value="plans"><ListChecks size={16} />4. Fixed Bills ({s?.plans.filter(p => !p.paid).length ?? 0})</TabsTrigger>
              <TabsTrigger value="ecosystem"><Radio size={16} />5. GoPay Sync & History</TabsTrigger>
            </TabsList>

            <div id="content">
              {/* TAB 1: SUMMARY & WHAT-IF SIMULATOR */}
              <TabsContent value="summary">
                {f && (
                  <>
                    {/* TOP 3 BIG INTUITIVE CARDS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                      {/* Card 1: Safe To Spend (Main Focus) */}
                      <div className="hero-card" style={{ background: 'linear-gradient(145deg, #0A1C12 0%, #102B1B 100%)', padding: '28px', margin: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#00DF82', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em' }}>
                            TODAY&apos;S SAFE LIMIT
                          </span>
                          <span className="small-tag" style={{ background: '#00AA13', color: '#fff' }}>B - C - R</span>
                        </div>
                        <div className="big-money" style={{ fontSize: '48px', margin: '12px 0' }}>{rp(f.safe)}</div>
                        <p style={{ margin: 0, fontSize: '14px', color: '#B4C6BC', lineHeight: 1.5 }}>
                          Safe to spend today without running short on rent or next transfer ({f.horizon} days to go).
                        </p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
                          <button
                            type="button"
                            onClick={() => show('formula')}
                            style={{ background: 'none', border: 'none', color: '#00DF82', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                          >
                            How this is calculated <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Card 2: Cash vs Fixed Bills Breakdown */}
                      <div className="radar-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#54665C', textTransform: 'uppercase' }}>
                              YOUR WALLET OVERVIEW
                            </span>
                            <span style={{ fontSize: '12px', color: '#00AA13', fontWeight: 700 }}>● ON TRACK</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #EEF2EE', paddingBottom: '8px' }}>
                              <span style={{ fontSize: '14px', color: '#54665C' }}>Total Cash (GoPay + Cash)</span>
                              <strong style={{ fontSize: '15px', color: '#16261E' }}>{rp(f.cash)}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #EEF2EE', paddingBottom: '8px' }}>
                              <span style={{ fontSize: '14px', color: '#54665C' }}>Protected for Bills (Rent/UKT)</span>
                              <strong style={{ fontSize: '15px', color: '#E06D53' }}>- {rp(f.mandatory)}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #EEF2EE', paddingBottom: '8px' }}>
                              <span style={{ fontSize: '14px', color: '#54665C' }}>Untouchable Emergency Reserve</span>
                              <strong style={{ fontSize: '15px', color: '#00AA13' }}>- {rp(b.buffer)}</strong>
                            </div>
                          </div>
                        </div>
                        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F4FAF4', padding: '10px 14px', borderRadius: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#007A0E' }}>Available Free Cash:</span>
                          <strong style={{ fontSize: '16px', color: '#00AA13' }}>
                            {rp(Math.max(0, f.cash - f.mandatory - b.buffer))}
                          </strong>
                        </div>
                      </div>

                      {/* Card 3: Semester Outlook Banner */}
                      <div className="radar-card" style={{ padding: '28px', background: f.gap ? '#FFF6F4' : '#F0FAF2', borderLeft: f.gap ? '4px solid #E06D53' : '4px solid #00AA13' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {f.gap ? <AlertCircle size={20} color="#E06D53" /> : <Smile size={20} color="#00AA13" />}
                          <span style={{ fontSize: '12px', fontWeight: 700, color: f.gap ? '#E06D53' : '#00AA13', textTransform: 'uppercase' }}>
                            {f.gap ? 'DEFICIT RISK AHEAD' : 'HEALTHY BUFFER'}
                          </span>
                        </div>
                        <h3 style={{ margin: '10px 0', fontSize: '20px', color: '#16261E' }}>
                          {f.gap ? `Short by ${rp(f.gap)}` : `Surplus of ${rp(f.remainder)}`}
                        </h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#54665C', lineHeight: 1.5 }}>
                          {f.gap
                            ? 'You will run out before next allowance if spending continues as-is. Use Lever 1 & 2 to balance it!'
                            : 'All scheduled rent and daily food needs are protected until next allowance!'}
                        </p>
                        <div style={{ marginTop: '16px' }}>
                          <Button size="sm" variant="outline" onClick={() => setTab('levers')}>
                            {f.gap ? 'Fix Gap with Levers →' : 'Explore Savings →'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* INTERACTIVE WHAT-IF SIMULATOR */}
                    <section className="what-if-box" style={{ borderRadius: '14px' }}>
                      <div className="what-if-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <ChameleonBadge size={44} />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00DF82', fontSize: '12px', fontWeight: 700 }}>
                              <Sparkles size={15} /> WHAT-IF SPEND TESTER
                            </div>
                            <h3 style={{ margin: 0, fontSize: '18px' }}>Want to Hang Out or Treat Yourself Today?</h3>
                            <p style={{ margin: 0, fontSize: '13px', color: '#B4C6BC' }}>
                              Drag the slider to see how today&apos;s extra spending alters your daily allowance.
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '12px', color: '#88998F', textTransform: 'uppercase' }}>Planned Expense</span>
                          <div style={{ fontSize: '26px', fontWeight: 700, color: whatIfSpend > 0 ? '#00DF82' : '#FFFFFF' }}>
                            {rp(whatIfSpend)}
                          </div>
                        </div>
                      </div>

                      <div className="what-if-slider-wrap">
                        <input
                          type="range"
                          min="0"
                          max="150000"
                          step="5000"
                          value={whatIfSpend}
                          onChange={(e) => setWhatIfSpend(Number(e.target.value))}
                          className="what-if-slider"
                          aria-label="Simulate discretionary expense"
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#88998F', marginTop: '6px' }}>
                          <span>Rp 0 (None)</span>
                          <span>Rp 30k (Boba / Snack)</span>
                          <span>Rp 70k (Hangout)</span>
                          <span>Rp 150k (Big Dinner)</span>
                        </div>
                      </div>

                      <div className="what-if-metrics">
                        <div className="what-if-metric">
                          <span>New Daily Limit</span>
                          <strong style={{ color: simulatedSafe < 10000 ? '#FFAA00' : '#00DF82' }}>
                            {rp(simulatedSafe)} / day
                          </strong>
                          <small>{whatIfSpend > 0 ? `Decreases by ${rp(Math.max(0, f.safe - simulatedSafe))}/day` : 'Safe daily limit'}</small>
                        </div>

                        <div className="what-if-metric">
                          <span>Remaining Balance</span>
                          <strong>{rp(effectiveCash)}</strong>
                          <small>After spending</small>
                        </div>

                        <div className="what-if-metric">
                          <span>Surplus at Month-End</span>
                          <strong style={{ color: simulatedSurplus < 0 ? '#FF5555' : '#FFFFFF' }}>
                            {simulatedSurplus < 0 ? `Deficit ${rp(-simulatedSurplus)}` : rp(simulatedSurplus)}
                          </strong>
                          <small>Buffer remaining</small>
                        </div>

                        <div className="what-if-metric" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          {whatIfSpend > 0 ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Button
                                className="primary"
                                style={{ flex: 1, padding: '10px', fontSize: '12px' }}
                                onClick={() => {
                                  void handleQuickLog('Extra Discretionary Spend', whatIfSpend);
                                  setWhatIfSpend(0);
                                }}
                              >
                                Log Expense
                              </Button>
                              <Button
                                variant="outline"
                                style={{ padding: '10px', fontSize: '12px', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
                                onClick={() => setWhatIfSpend(0)}
                              >
                                Reset
                              </Button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '13px', color: '#88998F' }}>Slide to test before you spend</span>
                          )}
                        </div>
                      </div>
                    </section>
                  </>
                )}
              </TabsContent>

              {/* TAB 2: 3 NON-DEBT ACTION LEVERS */}
              <TabsContent value="levers">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
                  <ChameleonBadge size={44} />
                  <div>
                    <h2 style={{ margin: 0, fontSize: '22px' }}>3 Action Levers (Zero Debt, Zero Interest)</h2>
                    <p style={{ margin: 0, fontSize: '14px', color: '#54665C' }}>
                      When your wallet is tight, use these 3 proven moves instead of taking online loans or paylater.
                    </p>
                  </div>
                </div>

                <div className="levers-grid">
                  {/* Lever 1 */}
                  <div className="lever-card">
                    <div>
                      <div className="lever-card-top">
                        <span className="lever-number">LEVER 1 · SPEND SMARTER</span>
                        <Leaf size={20} color="#00DF82" />
                      </div>
                      <h3>GoFood Campus Partner Deals</h3>
                      <p>
                        Switch from regular food delivery to student-rate canteens (Dallas UI, Kantin Kansas, or GoFood Hemat).
                      </p>
                      <div className="lever-impact">
                        <SavingsIcon /> Saves ~Rp 20,000 per meal order.
                      </div>
                    </div>
                    <Button className="primary" onClick={() => void handleActivateLever1()}>
                      <Check size={16} /> Apply Meal Savings (Rp 15k)
                    </Button>
                  </div>

                  {/* Lever 2 */}
                  <div className="lever-card">
                    <div>
                      <div className="lever-card-top">
                        <span className="lever-number">LEVER 2 · POSTPONE WANTS</span>
                        <Clock3 size={20} color="#00DF82" />
                      </div>
                      <h3>The Deferral Vault</h3>
                      <p>
                        Delay optional hangouts or shopping past your next pocket money transfer without guilt.
                      </p>
                      <div className="lever-impact">
                        <ProtectionIcon /> Instantly frees ~Rp 55,000 back into daily cash.
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => void handleActivateLever2()}>
                      <Clock3 size={16} /> Postpone Optional Spend
                    </Button>
                  </div>

                  {/* Lever 3 */}
                  <div className="lever-card">
                    <div>
                      <div className="lever-card-top">
                        <span className="lever-number">LEVER 3 · EARN EXTRA CASH</span>
                        <Award size={20} color="#FFB800" />
                      </div>
                      <h3>Campus Gigs & Tutoring</h3>
                      <p>
                        Join university micro-tasks (lab assistant, survey respondent, or CDC student freelance).
                      </p>
                      <div className="lever-impact">
                        <GrowthIcon /> Injects +Rp 45,000 to +Rp 200,000 upon completion.
                      </div>
                    </div>
                    <Button className="primary" onClick={() => void handleActivateLever3()} style={{ background: '#00AA13' }}>
                      <Plus size={16} /> Claim Campus Gig (+Rp 45k)
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: CAMPUS RADAR (UI ALTERNATIVES) */}
              <TabsContent value="radar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
                  <BirdBadge size={44} />
                  <div>
                    <h2 style={{ margin: 0, fontSize: '22px' }}>UI Campus Alternatives Radar</h2>
                    <p style={{ margin: 0, fontSize: '14px', color: '#54665C' }}>
                      Verified cheap spots around campus so you never overpay for food, transit, or study space.
                    </p>
                  </div>
                </div>

                <div className="radar-filter-bar">
                  <button
                    type="button"
                    className={`radar-filter-btn ${radarCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setRadarCategory('all')}
                  >
                    All Options
                  </button>
                  <button
                    type="button"
                    className={`radar-filter-btn ${radarCategory === 'mobility' ? 'active' : ''}`}
                    onClick={() => setRadarCategory('mobility')}
                  >
                    <Bus size={15} style={{ display: 'inline', marginRight: '5px' }} /> Transit & Commute
                  </button>
                  <button
                    type="button"
                    className={`radar-filter-btn ${radarCategory === 'meals' ? 'active' : ''}`}
                    onClick={() => setRadarCategory('meals')}
                  >
                    <Coffee size={15} style={{ display: 'inline', marginRight: '5px' }} /> Food & Canteens
                  </button>
                  <button
                    type="button"
                    className={`radar-filter-btn ${radarCategory === 'study' ? 'active' : ''}`}
                    onClick={() => setRadarCategory('study')}
                  >
                    <BookOpen size={15} style={{ display: 'inline', marginRight: '5px' }} /> Free Study Pods
                  </button>
                </div>

                <div className="radar-cards-grid">
                  {(radarCategory === 'all' || radarCategory === 'mobility') && (
                    <div className="radar-card">
                      <span className="profile-tag" style={{ alignSelf: 'flex-start', marginBottom: '14px' }}>COMMUTE CHEAT SHEET</span>
                      <h3>UI Bikun vs GoTransit vs GoRide</h3>
                      <table className="radar-compare-table">
                        <tbody>
                          <tr><td>UI Bikun (Bus Kuning)</td><td><strong>Rp 0 (Free)</strong> · Every 8 mins</td></tr>
                          <tr><td>GoTransit KRL (UI - Tebet)</td><td><strong>Rp 3,000</strong> · 22 mins</td></tr>
                          <tr><td>Direct Motorbike Ride</td><td><strong>Rp 18,000</strong> · 15 mins</td></tr>
                        </tbody>
                      </table>
                      <div className="lever-impact"><TipIcon /> Recommendation: Bikun + GoTransit saves Rp 15,000 every single trip.</div>
                      <Button variant="outline" onClick={() => handleQuickLog('GoTransit KRL Fare', 3000)}>
                        Log Transit (Rp 3k)
                      </Button>
                    </div>
                  )}

                  {(radarCategory === 'all' || radarCategory === 'meals') && (
                    <div className="radar-card">
                      <span className="profile-tag" style={{ alignSelf: 'flex-start', marginBottom: '14px' }}>MEAL CHOICES</span>
                      <h3>Kantin Kansas / Dallas UI vs Food Delivery</h3>
                      <table className="radar-compare-table">
                        <tbody>
                          <tr><td>Kantin Kansas (Nasi Ayam/Telur)</td><td><strong>Rp 12,000</strong></td></tr>
                          <tr><td>GoFood Hemat Student Partner</td><td><strong>Rp 18,000</strong></td></tr>
                          <tr><td>Regular Delivery + Delivery Fee</td><td><strong>Rp 38,000</strong></td></tr>
                        </tbody>
                      </table>
                      <div className="lever-impact"><TipIcon /> Recommendation: Eating at campus canteens cuts food costs in half.</div>
                      <Button variant="outline" onClick={() => handleQuickLog('Kantin Meal', 12000)}>
                        Log Canteen Meal (Rp 12k)
                      </Button>
                    </div>
                  )}

                  {(radarCategory === 'all' || radarCategory === 'study') && (
                    <div className="radar-card">
                      <span className="profile-tag" style={{ alignSelf: 'flex-start', marginBottom: '14px' }}>STUDY SPACES</span>
                      <h3>Crystal of Knowledge Library vs Commercial Café</h3>
                      <table className="radar-compare-table">
                        <tbody>
                          <tr><td>UI Central Library (WiFi + AC)</td><td><strong>Rp 0 (Free)</strong></td></tr>
                          <tr><td>Faculty Co-Working Corners</td><td><strong>Rp 0 (Free)</strong></td></tr>
                          <tr><td>Commercial Coffee Shop (Margonda)</td><td><strong>Rp 45,000 min</strong></td></tr>
                        </tbody>
                      </table>
                      <div className="lever-impact"><TipIcon /> Recommendation: Studying at UI library saves Rp 45,000 minimum cafe overhead.</div>
                      <Button variant="outline" onClick={() => setMessage('Study session logged: Saved Rp 45,000 in cafe costs!')}>
                        Check-in at Library
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* TAB 4: COMMITMENTS (FIXED BILLS) */}
              <TabsContent value="plans">
                <div className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <ChameleonBadge size={44} />
                    <div>
                      <h2 style={{ margin: 0, fontSize: '22px' }}>Your Fixed Bills & Commitments</h2>
                      <p style={{ margin: 0, fontSize: '14px', color: '#54665C' }}>
                        These costs are ring-fenced so you never accidentally spend rent money on hangouts.
                      </p>
                    </div>
                  </div>
                  {actions('plan', 'Add Fixed Bill')}
                </div>

                <div className="plan-grid">
                  {s?.plans.map((p) => (
                    <div key={p.id} className={'plan-card ' + (p.paid ? 'paid' : p.essential ? 'essential' : 'optional')}>
                      <div className="plan-card-top">
                        <span className="small-tag">{p.paid ? 'PAID' : p.essential ? 'ESSENTIAL (RENT/UKT)' : 'OPTIONAL'}</span>
                        <span>{dt(p.due)}</span>
                      </div>
                      <h3>{p.title}</h3>
                      <div className="plan-amount">{rp(p.amount)}</div>
                      {p.deferredFrom && <small className="fine">Delayed from {dt(p.deferredFrom)}</small>}
                      {!p.paid && (
                        <div className="plan-actions">
                          <Button size="sm" className="primary" onClick={() => show('pay', p.id)}>Mark Paid</Button>
                          {!p.essential && <Button size="sm" variant="outline" onClick={() => show('defer', p.id)}>Postpone</Button>}
                          <Button size="sm" variant="ghost" onClick={() => show('save', p.id)}>Cheaper Alt</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* TAB 5: ECOSYSTEM SYNC & HISTORY */}
              <TabsContent value="ecosystem">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
                  <ChameleonBadge size={44} />
                  <div>
                    <h2 style={{ margin: 0, fontSize: '22px' }}>GoPay Sync & Activity History</h2>
                    <p style={{ margin: 0, fontSize: '14px', color: '#54665C' }}>
                      Live simulated sync with GoPay QRIS and your latest expense logs.
                    </p>
                  </div>
                </div>

                <div className="ecosystem-grid">
                  <div className="ecosystem-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="profile-tag">GOPAY QRIS INTEGRATION</span>
                      <span style={{ color: '#00AA13', fontSize: '12px', fontWeight: 700 }}>● CONNECTED</span>
                    </div>
                    <h3 style={{ marginTop: '12px' }}>Live Webhook Listener</h3>
                    <p style={{ fontSize: '13px', color: '#54665C' }}>
                      QRIS payments at campus canteens deduct automatically from today&apos;s safe allowance.
                    </p>
                    <div className="webhook-log">
                      {webhookSimulated ? (
                        <>
                          [QRIS SETTLED] Kantin Dallas UI: Rp 16,000<br />
                          Daily runway adjusted automatically in real time.
                        </>
                      ) : (
                        'Awaiting simulated QRIS payment...'
                      )}
                    </div>
                    <Button className="primary" style={{ width: '100%' }} onClick={() => void handleSimulateWebhook()}>
                      <Radio size={14} /> Simulate QRIS Payment (Rp 16k)
                    </Button>
                  </div>

                  <div className="ecosystem-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="profile-tag">RECENT EXPENSES</span>
                      <span style={{ fontSize: '12px', color: '#54665C' }}>{s?.ledger.length ?? 0} entries</span>
                    </div>
                    <h3 style={{ marginTop: '12px' }}>Activity Log</h3>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {s?.ledger.slice(-5).reverse().map((e) => (
                        <div key={e.id} className="ledger-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAF8', borderRadius: '6px', fontSize: '13px' }}>
                          <span>{e.note}</span>
                          <strong style={{ color: e.kind === 'income' ? '#00AA13' : '#16261E' }}>
                            {e.kind === 'income' ? '+' : '-'}{rp(e.amount)}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </>
      )}

      {/* DIALOGS AND MODALS */}
      <Dialog open={modal?.type === 'setup_custom' || modal?.type === 'budget'} onOpenChange={(open) => !open && setModal(null)}>
        <DialogContent className="dialog-box">
          <DialogTitle>{labels[modal?.type ?? '']}</DialogTitle>
          <DialogDescription>Input your monthly pocket money, next allowance date, and bills.</DialogDescription>
          <form onSubmit={onSubmitForm} className="form-grid">
            <Field name="balance" label="Current Total Cash (GoPay + Cash in Wallet)" value={s?.budget?.initial ?? 850000} hint="Amount currently in your hands" />
            <Field name="next" label="Next Allowance Date" type="date" value={s?.budget?.next ?? '2026-10-07'} hint="When will your parents or stipend send more cash?" />
            <Field name="daily" label="Target Daily Spending Limit (Rp)" value={s?.budget?.daily ?? 25000} hint="Standard goal per day" />
            <Field name="essentialDaily" label="Bare Minimum Daily Food & Commute (Rp)" value={s?.budget?.essentialDaily ?? 15000} hint="Absolute survival baseline" />
            <Field name="buffer" label="Untouchable Emergency Cushion (Rp)" value={s?.budget?.buffer ?? 100000} hint="Do not touch for everyday hangouts" />
            <Choice name="complete" checked={s?.budget?.complete ?? true}>Mark budget setup as complete</Choice>
            <Choice name="consent" checked={Boolean(s?.consent ?? true)}>I agree to track cashflow with zero credit risk</Choice>
            <Button type="submit" className="primary" disabled={busy}>Save My Runway</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={modal?.type === 'daily'} onOpenChange={(open) => !open && setModal(null)}>
        <DialogContent className="dialog-box">
          <DialogTitle>Log Daily Expense</DialogTitle>
          <DialogDescription>Quickly record an expense to update your daily safe limit.</DialogDescription>
          <form onSubmit={onSubmitForm} className="form-grid">
            <Field name="title" label="Description" type="text" value="Lunch at Canteen" />
            <Field name="amount" label="Amount (Rp)" value={15000} />
            <Button type="submit" className="primary" disabled={busy}>Log Expense</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={modal?.type === 'plan'} onOpenChange={(open) => !open && setModal(null)}>
        <DialogContent className="dialog-box">
          <DialogTitle>Add Fixed Bill or Scheduled Need</DialogTitle>
          <DialogDescription>Lock away money so you don&apos;t accidentally spend it.</DialogDescription>
          <form onSubmit={onSubmitForm} className="form-grid">
            <Field name="title" label="Bill Name (e.g. Kos Rent, WiFi, UKT)" type="text" value="Kos Rent" />
            <Field name="amount" label="Amount (Rp)" value={600000} />
            <Field name="due" label="Due Date" type="date" value={date ? plus(date, 14) : '2026-09-21'} />
            <Choice name="essential" checked={true}>Essential bill (Must pay, cannot postpone)</Choice>
            <Button type="submit" className="primary" disabled={busy}>Add Fixed Bill</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={modal?.type === 'pay'} onOpenChange={(open) => !open && setModal(null)}>
        <DialogContent className="dialog-box">
          <DialogTitle>Mark Bill as Paid</DialogTitle>
          <DialogDescription>Confirm payment for {plan?.title ?? 'this commitment'}.</DialogDescription>
          <form onSubmit={onSubmitForm} className="form-grid">
            <Field name="amount" label="Amount Paid (Rp)" value={plan?.amount ?? 0} />
            <Button type="submit" className="primary" disabled={busy}>Confirm Paid</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={modal?.type === 'defer'} onOpenChange={(open) => !open && setModal(null)}>
        <DialogContent className="dialog-box">
          <DialogTitle>Postpone Optional Expense</DialogTitle>
          <DialogDescription>Move &quot;{plan?.title}&quot; past your next allowance to protect today&apos;s runway.</DialogDescription>
          <form onSubmit={onSubmitForm} className="form-grid">
            <Field name="due" label="New Scheduled Date" type="date" value={b ? plus(b.next, 2) : '2026-10-09'} />
            <Button type="submit" className="primary" disabled={busy}>Postpone Expense</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={modal?.type === 'save'} onOpenChange={(open) => !open && setModal(null)}>
        <DialogContent className="dialog-box">
          <DialogTitle>Choose Cheaper Alternative</DialogTitle>
          <DialogDescription>Reduce cost for &quot;{plan?.title}&quot;.</DialogDescription>
          <form onSubmit={onSubmitForm} className="form-grid">
            <Field name="amount" label="Reduced Target Amount (Rp)" value={Math.max(5000, (plan?.amount ?? 20000) - 15000)} />
            <Button type="submit" className="primary" disabled={busy}>Apply Savings</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={modal?.type === 'formula'} onOpenChange={(open) => !open && setModal(null)}>
        <DialogContent className="dialog-box">
          <DialogTitle>How Safe-to-Spend is Calculated</DialogTitle>
          <DialogDescription>The honest, deterministic equation protecting students from debt.</DialogDescription>
          <div style={{ background: '#F4FAF4', border: '1px solid #00AA13', padding: '18px', borderRadius: '10px', margin: '18px 0' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#00AA13', textAlign: 'center' }}>
              Safe Today = (B − C − R) ÷ Days Left
            </div>
            <div style={{ marginTop: '14px', fontSize: '14px', color: '#16261E', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>• <strong>B (Balance):</strong> Cash currently in GoPay + Wallet</div>
              <div>• <strong>C (Commitments):</strong> Locked money for upcoming rent & UKT</div>
              <div>• <strong>R (Reserve):</strong> Untouchable safety emergency cushion</div>
              <div>• <strong>Days:</strong> Days remaining until next monthly pocket money</div>
            </div>
          </div>
          <Button type="button" className="primary" onClick={() => setModal(null)}>Got It!</Button>
        </DialogContent>
      </Dialog>

      {/* FOOTER */}
      <footer style={{ marginTop: '54px', paddingTop: '24px', borderTop: '1px solid rgba(0, 170, 19, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', fontSize: '13px', color: '#54665C' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ChameleonBadge size={28} />
          <span>SakuJalan · Universitas Indonesia Pilot · Gojek Champointship 2026</span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button type="button" onClick={() => show('formula')} style={{ background: 'none', border: 'none', color: '#00AA13', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
            Formula Guide
          </button>
          <button type="button" onClick={() => show('setup_custom')} style={{ background: 'none', border: 'none', color: '#00AA13', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
            Reconfigure Budget
          </button>
        </div>
      </footer>
    </main>
  );
}
