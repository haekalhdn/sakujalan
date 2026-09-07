'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ThreeRunwayHero from './three-runway-hero';

interface TargoLandingProps {
  onOpenCockpit?: () => void;
}

export default function TargoLanding({ onOpenCockpit }: TargoLandingProps) {
  const aboutVideoRef = useRef<HTMLVideoElement>(null);
  const [safeVal, setSafeVal] = useState('Rp 28k');
  const [dayVal, setDayVal] = useState('23d');
  const [savedVal, setSavedVal] = useState('+Rp 45k');
  const [particles, setParticles] = useState<Array<{ id: number; kind: string; x: number; dur: number; delay: number; size: number }>>([]);

  // Live metric cycling
  useEffect(() => {
    const safes  = ['Rp 28k','Rp 31k','Rp 26k','Rp 34k','Rp 29k'];
    const days   = ['23d','22d','24d','21d','23d'];
    const saveds = ['+Rp 45k','+Rp 38k','+Rp 52k','+Rp 41k','+Rp 47k'];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % safes.length;
      setSafeVal(safes[i]);
      setDayVal(days[i]);
      setSavedVal(saveds[i]);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  // Particle system
  useEffect(() => {
    const kinds = ['coin', 'gem', 'sparkle', 'token'];
    let id = 0;
    const spawn = () => {
      setParticles(prev => [
        ...prev.slice(-12),
        {
          id: id++,
          kind: kinds[Math.floor(Math.random() * kinds.length)],
          x: 12 + Math.random() * 76,
          dur: 2.8 + Math.random() * 2.2,
          delay: 0,
          size: 14 + Math.random() * 12,
        }
      ]);
    };
    const t = setInterval(spawn, 700);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const vid = aboutVideoRef.current;
    if (!vid) return;
    vid.muted = true;
    const play = () => { vid.muted = true; vid.play().catch(() => {}); };
    play();
    const iv = setInterval(() => { if (!vid.paused) clearInterval(iv); else play(); }, 1000);
    const onInteract = () => { play(); document.removeEventListener('click', onInteract); document.removeEventListener('touchstart', onInteract); };
    document.addEventListener('click', onInteract, { passive: true });
    document.addEventListener('touchstart', onInteract, { passive: true });
    return () => { clearInterval(iv); document.removeEventListener('click', onInteract); document.removeEventListener('touchstart', onInteract); };
  }, []);

  return (
    <div className="targo-root">
      <style>{`
        .targo-root {
          --tg: #F0F5F1;
          --ta: #00AA13;
          --tah: #00DF82;
          --tab: #007A0E;
          --th: #16261E;
          --tn: #2C3E33;
          --tb: #4A5E53;
          --tf: 'Quantico', 'Arial Narrow', sans-serif;
          background-color: var(--tg);
          background-image:
            radial-gradient(ellipse 65% 50% at 15% 15%, rgba(0, 223, 130, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 85% 75%, rgba(0, 170, 19, 0.14) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(0, 223, 130, 0.06) 0%, transparent 70%);
          background-attachment: fixed;
          color: var(--tb);
          font-family: var(--tf);
          line-height: 1.5;
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
          -webkit-font-smoothing: antialiased;
        }

        /* Subtle ambient tech grid & grain across entire landing */
        .targo-root::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            linear-gradient(to right, rgba(0, 170, 19, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 170, 19, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 95%);
          -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 95%);
        }
        .targo-root h1,.targo-root h2,.targo-root h3 {
          font-family:var(--tf);color:var(--th);text-transform:uppercase;
          letter-spacing:0.01em;line-height:0.98;margin:0;
        }

        /* ── HEADER ── */
        .targo-header {
          position:fixed;top:0;left:0;right:0;z-index:100;height:78px;
          display:flex;align-items:center;justify-content:space-between;
          padding:0 clamp(16px,3vw,40px);
          background:rgba(243,246,243,0.9);backdrop-filter:blur(14px);
          -webkit-backdrop-filter:blur(14px);
          border-bottom:1px solid rgba(22,38,30,0.08);
          transition:background 0.3s;
        }
        .targo-header.scrolled {
          background:rgba(243,246,243,0.97);
          box-shadow:0 2px 18px rgba(0,170,19,0.1);
        }
        .targo-brand{display:flex;align-items:center;gap:12px;text-decoration:none;cursor:pointer;}
        .targo-brand-mark{
          width:38px;height:38px;background:var(--ta);border-radius:50%;
          display:grid;place-items:center;flex-shrink:0;
          box-shadow:0 0 18px rgba(0,170,19,0.5);
          animation:bmPulse 2.5s ease-in-out infinite;
        }
        .targo-brand-mark::after{content:'';width:14px;height:14px;background:#fff;border-radius:50%;}
        @keyframes bmPulse{0%,100%{box-shadow:0 0 18px rgba(0,170,19,0.5)}50%{box-shadow:0 0 30px rgba(0,223,130,0.85)}}
        .targo-brand-text-wrap{display:flex;flex-direction:column;}
        .targo-brand-name{font-size:22px;font-weight:700;color:var(--th);letter-spacing:-0.02em;text-transform:lowercase;line-height:1;}
        .targo-brand-sub{font-size:10px;font-weight:700;color:var(--ta);letter-spacing:0.12em;text-transform:uppercase;margin-top:3px;}
        .targo-header-nav{display:flex;align-items:center;gap:clamp(16px,2.5vw,36px);}
        .targo-nav-link{
          font-size:13px;font-weight:700;color:var(--tn);letter-spacing:0.06em;text-transform:uppercase;
          text-decoration:none;transition:color 0.18s;background:none;border:none;cursor:pointer;font-family:var(--tf);
        }
        .targo-nav-link:hover{color:var(--ta);}
        .targo-btn-chamfer{
          display:inline-flex;align-items:center;justify-content:center;gap:8px;
          height:42px;padding:0 24px;background:var(--ta);color:#fff;
          font-family:var(--tf);font-weight:700;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;
          clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);
          border:none;cursor:pointer;
          transition:background 0.2s,transform 0.18s,box-shadow 0.2s;
          white-space:nowrap;text-decoration:none;box-shadow:0 4px 18px rgba(0,170,19,0.35);
        }
        .targo-btn-chamfer:hover{background:var(--tah);color:#091A10;transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,223,130,0.55);}
        .targo-btn-chamfer-lg{height:52px;padding:0 32px;font-size:14px;margin-top:36px;}

        /* ── HERO ── */
        .targo-hero{
          min-height:100svh;background:var(--tg);position:relative;overflow:hidden;
          display:grid;grid-template-columns:55% 45%;
          padding:100px clamp(16px,3vw,40px) 40px;align-items:center;
        }
        /* Animated dot grid */
        .targo-hero::before{
          content:'';position:absolute;inset:0;pointer-events:none;
          background-image:radial-gradient(circle,rgba(0,170,19,0.18) 1px,transparent 1px);
          background-size:30px 30px;
          mask-image:radial-gradient(ellipse 60% 70% at 75% 50%,black 30%,transparent 90%);
          -webkit-mask-image:radial-gradient(ellipse 60% 70% at 75% 50%,black 30%,transparent 90%);
          animation:dotPulse 6s ease-in-out infinite;z-index:0;
        }
        @keyframes dotPulse{0%,100%{opacity:0.5}50%{opacity:0.9}}
        /* Gradient mesh blob */
        .targo-hero::after{
          content:'';position:absolute;pointer-events:none;
          width:60vw;height:60vw;max-width:800px;max-height:800px;
          border-radius:50%;right:-8%;top:50%;transform:translateY(-50%);
          background:radial-gradient(circle,rgba(0,170,19,0.2) 0%,rgba(0,223,130,0.07) 40%,transparent 70%);
          filter:blur(60px);animation:meshGlow 5s ease-in-out infinite;z-index:0;
        }
        @keyframes meshGlow{0%,100%{opacity:0.8;transform:translateY(-50%) scale(1)}50%{opacity:1;transform:translateY(-50%) scale(1.07)}}
        .targo-hero-scrim{
          position:absolute;inset:0;pointer-events:none;z-index:2;
          background:linear-gradient(to right,#F3F6F3 0%,#F3F6F3 38%,rgba(243,246,243,0.6) 55%,transparent 70%);
        }
        .targo-hero-col-left{position:relative;z-index:5;display:flex;flex-direction:column;justify-content:center;}
        .targo-hero-tagline{
          font-size:11px;font-weight:700;color:var(--ta);letter-spacing:0.13em;text-transform:uppercase;
          margin-bottom:18px;display:flex;align-items:center;gap:10px;
        }
        .targo-hero-tagline::before{content:'';display:inline-block;width:18px;height:2px;background:var(--ta);}
        .targo-live-dot{width:7px;height:7px;border-radius:50%;background:#00DF82;box-shadow:0 0 8px #00DF82;animation:blink 1.3s ease-in-out infinite;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.25}}
        .targo-hero-headline{
          font-size:clamp(44px,6.2vw,88px);font-weight:700;color:var(--th);
          display:flex;flex-direction:column;user-select:none;
        }
        .targo-staircase-row{display:block;white-space:nowrap;line-height:1.0;}
        .targo-staircase-indent{margin-left:min(238px,28vw);}
        .targo-accent-green{
          background:linear-gradient(90deg,#00AA13,#00DF82,#00AA13);background-size:200% auto;
          -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
          animation:textScan 3s linear infinite;
        }
        @keyframes textScan{0%{background-position:0% center}100%{background-position:200% center}}
        .targo-hero-col-right{position:relative;z-index:3;min-height:200px;}

        /* ── ABOUT ── */
        .targo-about{
          min-height:100svh;
          background: linear-gradient(180deg, rgba(240, 245, 241, 0.6) 0%, rgba(230, 242, 233, 0.8) 50%, rgba(240, 245, 241, 0.9) 100%);
          position:relative;
          padding:clamp(60px,8vw,120px) clamp(16px,3vw,40px);
          display:grid;grid-template-columns:58% 42%;
          gap:clamp(24px,4vw,56px);align-items:center;
          border-top:1px solid rgba(0, 170, 19, 0.12);
          overflow: hidden;
        }
        /* Floating ambient glow blobs in About section */
        .targo-about::before {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 223, 130, 0.18) 0%, rgba(0, 170, 19, 0.05) 50%, transparent 70%);
          top: 10%; left: -100px;
          filter: blur(60px);
          pointer-events: none;
          z-index: 1;
        }
        .targo-about::after {
          content: '';
          position: absolute;
          width: 450px; height: 450px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 170, 19, 0.15) 0%, transparent 70%);
          bottom: -50px; right: 10%;
          filter: blur(70px);
          pointer-events: none;
          z-index: 1;
        }
        .targo-about-col-left{display:flex;flex-direction:column;position:relative;z-index:2;}
        .targo-section-label{
          font-size:12px;font-weight:700;color:var(--ta);letter-spacing:0.1em;
          margin-bottom:20px;text-transform:uppercase;display:flex;align-items:center;gap:8px;
        }
        .targo-section-label::before{content:'';display:inline-block;width:14px;height:2px;background:var(--ta);}
        .targo-about-headline{font-size:clamp(36px,4.5vw,64px);font-weight:700;color:var(--th);display:flex;flex-direction:column;}
        .targo-about-indent{margin-left:min(160px,18vw);color:var(--ta);}
        .targo-about-body{margin-top:32px;max-width:560px;font-size:clamp(15px,1.2vw,18px);line-height:1.6;color:var(--tb);display:flex;flex-direction:column;gap:16px;}
        .targo-pillars-list{margin-top:36px;display:flex;flex-direction:column;gap:14px;max-width:560px;}
        .targo-pillar-item{
          display:flex;align-items:flex-start;gap:16px;
          padding:14px 18px;
          background:rgba(255,255,255,0.7);
          border:1px solid rgba(0,170,19,0.15);
          border-left:3px solid var(--ta);
          clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
          backdrop-filter:blur(8px);
          transition:transform 0.25s,box-shadow 0.25s;
          animation:slideIn 0.5s ease both;
        }
        .targo-pillar-item:nth-child(1){animation-delay:0.1s;}
        .targo-pillar-item:nth-child(2){animation-delay:0.2s;}
        .targo-pillar-item:nth-child(3){animation-delay:0.3s;}
        @keyframes slideIn{from{opacity:0;transform:translateX(-16px);}to{opacity:1;transform:translateX(0);}}
        .targo-pillar-item:hover{transform:translateX(5px);box-shadow:0 6px 20px rgba(0,170,19,0.12);}
        .targo-pillar-num{font-size:28px;font-weight:700;color:rgba(0,170,19,0.2);line-height:1;flex-shrink:0;min-width:32px;}
        .targo-pillar-title{font-size:13px;font-weight:700;color:var(--th);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;}
        .targo-pillar-desc{font-size:12px;color:var(--tb);line-height:1.5;}
        .targo-pillar-desc code{background:rgba(0,170,19,0.1);padding:1px 5px;border-radius:3px;font-size:11px;color:var(--ta);}

        /* ── ABOUT RIGHT: CHARACTER SCENE ── */
        .targo-about-col-right{
          display:flex;justify-content:center;align-items:center;
          position:relative;z-index:2;
        }
        .targo-char-scene{
          position:relative;width:100%;max-width:440px;aspect-ratio:4/5;
        }

        /* Main avatar card */
        .targo-avatar-card{
          width:100%;height:100%;
          background:linear-gradient(160deg,#091A10 0%,#0D2A18 60%,#122D1C 100%);
          clip-path:polygon(16px 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 16px);
          border:1px solid rgba(0,170,19,0.4);
          box-shadow:0 24px 60px rgba(0,170,19,0.3),0 0 80px rgba(0,170,19,0.1);
          overflow:hidden;position:relative;
        }
        /* Border beam */
        .targo-avatar-card::before{
          content:'';position:absolute;inset:-1px;z-index:0;
          background:conic-gradient(from var(--cba,0deg),transparent 20%,#00DF82 42%,#00AA13 52%,transparent 72%);
          animation:cardBeam 5s linear infinite;
          clip-path:polygon(16px 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 16px);
        }
        @property --cba{syntax:'<angle>';inherits:false;initial-value:0deg;}
        @keyframes cardBeam{to{--cba:360deg;}}

        /* Scan line */
        .targo-scanline{
          position:absolute;top:0;left:0;right:0;height:2px;
          background:linear-gradient(to right,transparent,#00DF82,transparent);
          animation:scanDown 3.5s ease-in-out infinite;pointer-events:none;z-index:10;
        }
        @keyframes scanDown{0%{top:0%;opacity:1}100%{top:100%;opacity:0}}

        /* Corner brackets */
        .targo-corner{position:absolute;width:20px;height:20px;z-index:10;}
        .targo-corner-tl{top:12px;left:12px;border-top:2px solid var(--ta);border-left:2px solid var(--ta);}
        .targo-corner-tr{top:12px;right:12px;border-top:2px solid var(--ta);border-right:2px solid var(--ta);}
        .targo-corner-bl{bottom:12px;left:12px;border-bottom:2px solid var(--ta);border-left:2px solid var(--ta);}
        .targo-corner-br{bottom:12px;right:12px;border-bottom:2px solid var(--ta);border-right:2px solid var(--ta);}

        /* Particle */
        .targo-particle{
          position:absolute;pointer-events:none;z-index:8;
          animation:partFloat linear both;
        }
        @keyframes partFloat{
          0%{transform:translateY(0) rotate(0deg);opacity:0;}
          10%{opacity:1;}90%{opacity:0.7;}
          100%{transform:translateY(-110%) rotate(380deg);opacity:0;}
        }

        /* Badge */
        .targo-card-badge{
          position:absolute;bottom:16px;left:16px;z-index:10;
          background:rgba(10,26,15,0.9);backdrop-filter:blur(8px);
          padding:6px 14px;border-left:2px solid var(--ta);
          font-size:10px;font-weight:700;color:#fff;letter-spacing:0.09em;text-transform:uppercase;
        }

        /* Floating stat chips */
        .targo-float-chip{
          position:absolute;z-index:20;
          background:rgba(255,255,255,0.97);
          border:1px solid rgba(0,170,19,0.3);border-left:3px solid var(--ta);
          padding:10px 14px;
          clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px);
          box-shadow:0 8px 24px rgba(0,170,19,0.2);
          animation:chipFloat ease-in-out infinite;
          transition:opacity 0.3s;
        }
        @keyframes chipFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .targo-float-chip-label{font-size:9px;font-weight:700;color:var(--tb);letter-spacing:0.07em;text-transform:uppercase;}
        .targo-float-chip-value{font-size:20px;font-weight:700;color:var(--ta);line-height:1.1;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);}
        .targo-chip-tl{top:-20px;left:-28px;animation-duration:3.2s;}
        .targo-chip-tr{top:80px;right:-32px;animation-duration:4.2s;animation-delay:-0.8s;}
        .targo-chip-br{bottom:30px;right:-28px;animation-duration:3.8s;animation-delay:-1.5s;}

        /* ── CHAMELEON MASCOT ── */
        .targo-chameleon{
          position:absolute;bottom:-20px;right:-40px;z-index:25;
          width:120px;height:120px;
          animation:chameleonBob 3s ease-in-out infinite;
          filter:drop-shadow(0 8px 16px rgba(0,170,19,0.4));
        }
        @keyframes chameleonBob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-12px) rotate(3deg)}}

        /* ── BIRD MASCOT in hero ── */
        .targo-bird{
          position:absolute;z-index:20;
          animation:birdFly ease-in-out infinite;
          filter:drop-shadow(0 4px 8px rgba(0,170,19,0.3));
        }
        @keyframes birdFly{0%,100%{transform:translateY(0) rotate(-5deg) scaleX(1)}50%{transform:translateY(-18px) rotate(5deg) scaleX(1)}}

        /* ── MOBILE ── */
        @media (max-width:700px){
          .targo-header{height:68px;}
          .targo-header-nav{display:none;}
          .targo-mobile-launch-btn{display:inline-flex !important;}
          .targo-hero{grid-template-columns:1fr;padding-top:90px;padding-bottom:40px;min-height:100svh;}
          .targo-hero-scrim{display:none;}
          .targo-staircase-indent{margin-left:0;}
          .targo-hero-headline{font-size:clamp(36px,10.5vw,56px);}
          .targo-hero-col-right{display:none;}
          .targo-about{grid-template-columns:1fr;padding:clamp(50px,8vw,80px) 20px 40px;gap:36px;}
          .targo-about-indent{margin-left:0;}
          .targo-about-col-right{width:100%;}
          .targo-chip-tl,.targo-chip-tr{display:none;}
          .targo-chip-br{right:-10px;}
          .targo-chameleon{right:-10px;width:90px;height:90px;}
        }
      `}</style>

      {/* FIXED HEADER */}
      <header className="targo-header">
        <a href="#hero" className="targo-brand" aria-label="SakuJalan Home">
          <div className="targo-brand-mark" />
          <div className="targo-brand-text-wrap">
            <span className="targo-brand-name">sakujalan</span>
            <span className="targo-brand-sub">Campus Budget Navigator</span>
          </div>
        </a>

        <div className="targo-header-nav">
          <a href="#about" className="targo-nav-link">ABOUT</a>
          <button type="button" className="targo-nav-link" onClick={onOpenCockpit}>NAVIGATOR COCKPIT</button>
          <button type="button" className="targo-btn-chamfer" onClick={onOpenCockpit}>LAUNCH APP</button>
        </div>

        <button type="button" className="targo-btn-chamfer targo-mobile-launch-btn" style={{ display: 'none' }} onClick={onOpenCockpit}>
          LAUNCH APP
        </button>
      </header>

      {/* SECTION 1: HERO */}
      <section className="targo-hero" id="hero">
        <ThreeRunwayHero />
        <div className="targo-hero-scrim" />

        {/* Floating bird mascot in hero */}
        <svg
          className="targo-bird"
          style={{ top: '18%', right: '12%', width: 72, height: 72 }}
          viewBox="0 0 80 80" fill="none"
        >
          {/* Body */}
          <ellipse cx="40" cy="48" rx="22" ry="16" fill="#00AA13"/>
          {/* Wing left */}
          <ellipse cx="22" cy="46" rx="16" ry="8" fill="#00DF82" transform="rotate(-18 22 46)"/>
          {/* Wing right */}
          <ellipse cx="58" cy="46" rx="16" ry="8" fill="#007A0E" transform="rotate(18 58 46)"/>
          {/* Head */}
          <circle cx="40" cy="30" r="14" fill="#00AA13"/>
          {/* Eye */}
          <circle cx="44" cy="28" r="5" fill="white"/>
          <circle cx="45" cy="28" r="3" fill="#16261E"/>
          <circle cx="46" cy="27" r="1" fill="white"/>
          {/* Beak */}
          <polygon points="40,34 47,32 40,38" fill="#FFB800"/>
          {/* Tuft / crest */}
          <path d="M35 18 Q38 8 40 16 Q42 8 45 18" stroke="#007A0E" strokeWidth="3" strokeLinecap="round" fill="none"/>
          {/* Feet */}
          <path d="M32 62 L28 70 M36 63 L34 71 M40 62 L40 70" stroke="#007A0E" strokeWidth="2.5" strokeLinecap="round"/>
          {/* GoPay badge */}
          <rect x="30" y="44" width="20" height="10" rx="3" fill="#007A0E" opacity="0.8"/>
          <text x="40" y="52" textAnchor="middle" fill="#00DF82" fontSize="7" fontWeight="bold" fontFamily="Arial">GP</text>
        </svg>

        <div className="targo-hero-col-left">
          <div className="targo-hero-tagline">
            <span className="targo-live-dot" />
            GOJEK CHAMPOINTSHIP 2026 · CASE SOLUTION
          </div>
          <h1 className="targo-hero-headline">
            <span className="targo-staircase-row">KNOW</span>
            <span className="targo-staircase-row">WHAT</span>
            <span className="targo-staircase-row">IS</span>
            <span className="targo-staircase-row targo-staircase-indent">LEFT</span>
            <span className="targo-staircase-row targo-staircase-indent">FOR</span>
            <span className="targo-staircase-row targo-staircase-indent targo-accent-green">COLLEGE</span>
          </h1>
          <div>
            <button
              type="button"
              className="targo-btn-chamfer targo-btn-chamfer-lg"
              onClick={onOpenCockpit}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              LAUNCH NAVIGATOR <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="targo-hero-col-right" />
      </section>

      {/* SECTION 2: ABOUT */}
      <section className="targo-about" id="about">
        <div className="targo-about-col-left">
          <div className="targo-section-label">01 / ABOUT SAKUJALAN</div>
          <h2 className="targo-about-headline">
            <span className="targo-staircase-row">ABOUT</span>
            <span className="targo-staircase-row targo-about-indent">SAKUJALAN</span>
          </h2>

          <div className="targo-about-body">
            <p>
              <strong>SakuJalan</strong> is a campus budget navigator designed to help university students make their next financial decision with confidence. It connects your real available cash and upcoming commitments to affordable, verified ways to meet daily student life.
            </p>
            <p>
              Starting with a focused <strong>Universitas Indonesia</strong> pilot, SakuJalan eliminates the month-end funding shortfall through three connected workflows: transparent cash-flow planning, verified everyday alternatives, and official student support.
            </p>
          </div>

          <div className="targo-pillars-list">
            <div className="targo-pillar-item">
              <div className="targo-pillar-num">01</div>
              <div>
                <div className="targo-pillar-title">PLAN: SEE WHAT REMAINS</div>
                <div className="targo-pillar-desc">Deterministic calculation: <code>A = B − C − R</code>. Spendable balance minus unpaid commitments and reserve. Divided by remaining days → your daily guide.</div>
              </div>
            </div>
            <div className="targo-pillar-item">
              <div className="targo-pillar-num">02</div>
              <div>
                <div className="targo-pillar-title">CHOOSE: FIND WHAT FITS</div>
                <div className="targo-pillar-desc">Compare meals, campus mobility (UI Bus Kuning vs GoTransit), and study spaces by cost, schedule, and accessibility — within your safe-to-spend.</div>
              </div>
            </div>
            <div className="targo-pillar-item">
              <div className="targo-pillar-num">03</div>
              <div>
                <div className="targo-pillar-title">ACCESS: OPPORTUNITIES & SUPPORT</div>
                <div className="targo-pillar-desc">Official UI scholarships, student aid programs, and CDC freelance work. Income credited strictly upon actual receipt — no speculation.</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '36px' }}>
            <button type="button" className="targo-btn-chamfer targo-btn-chamfer-lg" onClick={onOpenCockpit}>
              EXPLORE COCKPIT
            </button>
          </div>
        </div>

        {/* RIGHT: Character scene with Nara + Chameleon mascot */}
        <div className="targo-about-col-right">
          <div className="targo-char-scene">

            {/* Floating stat chips */}
            <div className="targo-float-chip targo-chip-tl">
              <div className="targo-float-chip-label">SAFE TODAY</div>
              <div className="targo-float-chip-value">{safeVal}</div>
            </div>
            <div className="targo-float-chip targo-chip-tr">
              <div className="targo-float-chip-label">RUNWAY</div>
              <div className="targo-float-chip-value">{dayVal}</div>
            </div>
            <div className="targo-float-chip targo-chip-br">
              <div className="targo-float-chip-label">SAVED</div>
              <div className="targo-float-chip-value">{savedVal}</div>
            </div>

            {/* Main card */}
            <div className="targo-avatar-card">
              {/* Scanline */}
              <div className="targo-scanline" />
              {/* Corners */}
              <div className="targo-corner targo-corner-tl" />
              <div className="targo-corner targo-corner-tr" />
              <div className="targo-corner targo-corner-bl" />
              <div className="targo-corner targo-corner-br" />

              {/* Floating vector cashflow particles */}
              {particles.map(p => (
                <div
                  key={p.id}
                  className="targo-particle"
                  style={{
                    left: p.x + '%',
                    bottom: '0%',
                    width: p.size + 'px',
                    height: p.size + 'px',
                    animationDuration: p.dur + 's',
                    animationDelay: '0s',
                  }}
                >
                  {p.kind === 'coin' && (
                    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
                      <circle cx="12" cy="12" r="10" fill="#FFB800" stroke="#D49000" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="7" stroke="#FFD700" strokeWidth="1" />
                      <text x="12" y="15" textAnchor="middle" fill="#5C3B00" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Rp</text>
                    </svg>
                  )}
                  {p.kind === 'gem' && (
                    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
                      <polygon points="6,9 12,3 18,9 12,21" fill="#00DF82" stroke="#00AA13" strokeWidth="1.5" />
                      <polygon points="9,9 12,5 15,9 12,18" fill="#FFFFFF" opacity="0.4" />
                    </svg>
                  )}
                  {p.kind === 'sparkle' && (
                    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
                      <path d="M12 2 Q12 12 22 12 Q12 12 12 22 Q12 12 2 12 Q12 12 12 2 Z" fill="#00DF82" />
                    </svg>
                  )}
                  {p.kind === 'token' && (
                    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
                      <circle cx="12" cy="12" r="9" fill="#00AA13" stroke="#00DF82" strokeWidth="1.5" />
                      <rect x="7" y="10" width="10" height="4" rx="1" fill="#FFFFFF" />
                    </svg>
                  )}
                </div>
              ))}

              {/* Nara SVG Avatar */}
              <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'flex-end',justifyContent:'center',overflow:'hidden',zIndex:2 }}>
                <svg viewBox="0 0 300 430" fill="none" xmlns="http://www.w3.org/2000/svg"
                  style={{ width:'80%', maxWidth:'320px', height:'auto', position:'relative', zIndex:2 }}>
                  {/* Shadow */}
                  <ellipse cx="150" cy="425" rx="85" ry="12" fill="rgba(0,170,19,0.18)"/>
                  {/* Legs */}
                  <rect x="97" y="340" width="44" height="80" rx="14" fill="#24332B"/>
                  <rect x="159" y="340" width="44" height="80" rx="14" fill="#24332B"/>
                  {/* Shoes */}
                  <ellipse cx="119" cy="420" rx="28" ry="10" fill="#112018"/>
                  <ellipse cx="181" cy="420" rx="28" ry="10" fill="#112018"/>
                  {/* Shoe highlight */}
                  <ellipse cx="110" cy="417" rx="10" ry="4" fill="rgba(255,255,255,0.12)"/>
                  <ellipse cx="172" cy="417" rx="10" ry="4" fill="rgba(255,255,255,0.12)"/>
                  {/* Body */}
                  <rect x="88" y="208" width="124" height="140" rx="20" fill="#00AA13"/>
                  {/* Shirt collar V */}
                  <polygon points="138,208 150,238 162,208" fill="#009910"/>
                  <rect x="133" y="208" width="34" height="16" rx="7" fill="#007A0E"/>
                  {/* GoPay badge */}
                  <rect x="108" y="238" width="44" height="26" rx="6" fill="#007A0E" opacity="0.75"/>
                  <text x="130" y="256" textAnchor="middle" fill="#00DF82" fontSize="12" fontWeight="bold" fontFamily="Arial">GP</text>
                  {/* Left arm */}
                  <rect x="52" y="213" width="40" height="95" rx="15" fill="#00AA13"/>
                  {/* Phone in left hand */}
                  <rect x="40" y="295" width="52" height="34" rx="9" fill="#1A3020"/>
                  <rect x="43" y="298" width="46" height="28" rx="7" fill="#00DF82" opacity="0.92"/>
                  <text x="66" y="316" textAnchor="middle" fill="#0A1A0F" fontSize="9" fontWeight="bold" fontFamily="Arial">Rp28k</text>
                  {/* Right arm */}
                  <rect x="208" y="213" width="40" height="95" rx="15" fill="#00AA13"/>
                  {/* Gold coin in right hand */}
                  <circle cx="234" cy="316" r="22" fill="#FFB800"/>
                  <circle cx="234" cy="316" r="17" fill="#FFD700"/>
                  <circle cx="234" cy="316" r="14" fill="#FFB800" opacity="0.5"/>
                  <text x="234" y="321" textAnchor="middle" fill="#7A3E00" fontSize="11" fontWeight="bold" fontFamily="Arial">Rp</text>
                  {/* Neck */}
                  <rect x="133" y="193" width="34" height="22" rx="10" fill="#FDBCB4"/>
                  {/* Head */}
                  <ellipse cx="150" cy="163" rx="54" ry="57" fill="#FDBCB4"/>
                  {/* Hair */}
                  <ellipse cx="150" cy="118" rx="54" ry="30" fill="#2C1A0E"/>
                  <rect x="96" y="118" width="14" height="32" rx="7" fill="#2C1A0E"/>
                  <rect x="190" y="118" width="14" height="32" rx="7" fill="#2C1A0E"/>
                  {/* Ears */}
                  <ellipse cx="96" cy="165" rx="9" ry="12" fill="#FDBCB4"/>
                  <ellipse cx="204" cy="165" rx="9" ry="12" fill="#FDBCB4"/>
                  {/* Eyes */}
                  <ellipse cx="130" cy="164" rx="8" ry="9" fill="#fff"/>
                  <ellipse cx="170" cy="164" rx="8" ry="9" fill="#fff"/>
                  <ellipse cx="131" cy="165" rx="5" ry="6" fill="#1A0A00"/>
                  <ellipse cx="171" cy="165" rx="5" ry="6" fill="#1A0A00"/>
                  <circle cx="133" cy="162" r="2" fill="#fff"/>
                  <circle cx="173" cy="162" r="2" fill="#fff"/>
                  {/* Eyebrows */}
                  <path d="M119 152 Q130 147 141 152" stroke="#2C1A0E" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                  <path d="M159 152 Q170 147 181 152" stroke="#2C1A0E" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                  {/* Smile */}
                  <path d="M134 183 Q150 198 166 183" stroke="#C47A5C" strokeWidth="3" strokeLinecap="round" fill="none"/>
                  {/* Cheek blush */}
                  <ellipse cx="116" cy="178" rx="12" ry="7" fill="rgba(255,140,90,0.28)"/>
                  <ellipse cx="184" cy="178" rx="12" ry="7" fill="rgba(255,140,90,0.28)"/>
                  {/* Cap */}
                  <ellipse cx="150" cy="108" rx="58" ry="14" fill="#00AA13"/>
                  <rect x="108" y="78" width="84" height="34" rx="10" fill="#00AA13"/>
                  <rect x="138" y="74" width="24" height="10" rx="5" fill="#007A0E"/>
                  {/* Cap badge */}
                  <rect x="138" y="85" width="24" height="16" rx="4" fill="#FFB800"/>
                  <text x="150" y="97" textAnchor="middle" fill="#0A1A0F" fontSize="9" fontWeight="bold" fontFamily="Arial">SJ</text>
                </svg>
              </div>

              {/* Card badge */}
              <div className="targo-card-badge">NARA — UI BENCHMARK STUDENT</div>
            </div>

            {/* CHAMELEON MASCOT */}
            <svg
              className="targo-chameleon"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Body */}
              <ellipse cx="60" cy="75" rx="38" ry="26" fill="#00AA13"/>
              {/* Belly */}
              <ellipse cx="60" cy="78" rx="26" ry="16" fill="#00DF82" opacity="0.6"/>
              {/* Tail */}
              <path d="M20 78 Q5 90 8 105 Q12 115 18 108 Q14 98 20 90 Q28 85 22 78Z" fill="#007A0E"/>
              {/* Hump / back ridge */}
              <path d="M28 62 Q40 45 60 48 Q80 45 92 62" stroke="#007A0E" strokeWidth="3" fill="none" strokeLinecap="round"/>
              {/* Head */}
              <ellipse cx="96" cy="65" rx="22" ry="18" fill="#00AA13"/>
              {/* Snout */}
              <ellipse cx="116" cy="68" rx="8" ry="5" fill="#007A0E"/>
              {/* Nostril */}
              <circle cx="118" cy="67" r="1.5" fill="#005A0A"/>
              {/* Eye (big chameleon eye) */}
              <circle cx="92" cy="56" r="10" fill="#16261E"/>
              <circle cx="92" cy="56" r="7" fill="white"/>
              <circle cx="93" cy="56" r="4" fill="#00AA13"/>
              <circle cx="94" cy="54" r="2" fill="#16261E"/>
              <circle cx="95" cy="53" r="1" fill="white"/>
              {/* Crest on head */}
              <path d="M84 48 Q88 38 92 46 Q96 36 100 46" stroke="#007A0E" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              {/* Front legs */}
              <path d="M40 88 Q38 100 32 106" stroke="#007A0E" strokeWidth="4" strokeLinecap="round"/>
              <path d="M32 106 L28 110 M32 106 L34 111 M32 106 L36 109" stroke="#007A0E" strokeWidth="2" strokeLinecap="round"/>
              <path d="M70 90 Q72 102 78 108" stroke="#007A0E" strokeWidth="4" strokeLinecap="round"/>
              <path d="M78 108 L74 113 M78 108 L79 114 M78 108 L83 112" stroke="#007A0E" strokeWidth="2" strokeLinecap="round"/>
              {/* Money bag it is holding */}
              <circle cx="108" cy="88" r="12" fill="#FFB800"/>
              <text x="108" y="93" textAnchor="middle" fill="#7A3E00" fontSize="10" fontWeight="bold" fontFamily="Arial">$</text>
              <path d="M100 80 Q104 74 108 76" stroke="#FFB800" strokeWidth="2" strokeLinecap="round"/>
              {/* Spots pattern */}
              <circle cx="50" cy="70" r="5" fill="#007A0E" opacity="0.5"/>
              <circle cx="62" cy="80" r="4" fill="#007A0E" opacity="0.4"/>
              <circle cx="74" cy="68" r="5" fill="#007A0E" opacity="0.5"/>
            </svg>

          </div>
        </div>
      </section>
    </div>
  );
}
