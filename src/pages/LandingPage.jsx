import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Wifi, CheckCircle2, AlertCircle, Smartphone, Zap, Cpu, Clock, MapPin, Users, FileText, Lock, ShieldCheck, BellOff } from 'lucide-react';

// ─────────────────────────────────────────────
// Custom Hooks
// ─────────────────────────────────────────────

function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);
  return scrolled;
}

function useFadeIn(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const p = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * end));
      if (p < 1) requestAnimationFrame(animate);
      else setCount(end);
    };
    requestAnimationFrame(animate);
  }, [started, end, duration]);

  return [count, ref];
}

const LAUNCH_DATE = '2026-05-01T00:00:00';

function getTimeLeft() {
  const diff = Math.max(0, new Date(LAUNCH_DATE) - new Date());
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);
  return timeLeft;
}

// ─────────────────────────────────────────────
// Reusable Sub-Components
// ─────────────────────────────────────────────

const SOSPhoneMockup = () => {
  const circumference = 2 * Math.PI * 42; // ≈ 263.9
  return (
    <div className="relative mx-auto drop-shadow-2xl" style={{ width: '230px', height: '460px' }}>
      {/* Phone body */}
      <div
        className="absolute inset-0 rounded-[2.5rem]"
        style={{ background: '#1c1c2e', border: '4px solid #2C2C2C', boxShadow: '0 32px 64px rgba(0,0,0,0.4)' }}
      >
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20" />

        {/* Screen */}
        <div className="absolute inset-[3px] rounded-[2.3rem] overflow-hidden" style={{ background: '#0f0f1a' }}>
          {/* Status bar */}
          <div className="h-10 flex items-end justify-between px-5 pb-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <span className="text-white" style={{ fontSize: '9px' }}>9:41</span>
            <div className="flex items-center gap-1">
              <div style={{ width: '14px', height: '7px', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.6)', padding: '1px' }}>
                <div style={{ width: '60%', height: '100%', background: 'rgba(255,255,255,0.7)', borderRadius: '1px' }} />
              </div>
            </div>
          </div>

          {/* App Content */}
          <div className="flex flex-col items-center justify-center gap-4 px-5" style={{ height: 'calc(100% - 40px)' }}>
            {/* Brand */}
            <div className="text-center">
              <div className="font-black tracking-[0.25em]" style={{ color: '#C0392B', fontSize: '14px' }}>ASFALIS</div>
              <div className="tracking-widest" style={{ color: '#475569', fontSize: '8px', marginTop: '2px' }}>ALERT ACTIVE</div>
            </div>

            {/* SOS Ring */}
            <div className="relative" style={{ width: '108px', height: '108px' }}>
              <svg className="w-full h-full sos-ring-svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="7" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="#C0392B" strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  className="sos-ring-animated"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-black text-white leading-none" style={{ fontSize: '36px', fontFamily: 'Inter, sans-serif' }}>10</span>
                <span style={{ color: '#475569', fontSize: '8px', marginTop: '2px' }}>SECONDS</span>
              </div>
            </div>

            {/* Status text */}
            <div className="text-center">
              <div className="font-bold tracking-widest" style={{ color: '#C0392B', fontSize: '11px' }}>SOS SENDING</div>
              <div style={{ color: '#64748b', fontSize: '9px', marginTop: '3px' }}>3 contacts being notified</div>
            </div>

            {/* Action buttons */}
            <div className="w-full flex flex-col gap-2">
              <button
                className="w-full rounded-xl font-bold tracking-wider"
                style={{
                  padding: '9px 0', fontSize: '10px',
                  border: '1px solid #22c55e', color: '#22c55e',
                  background: 'rgba(34,197,94,0.08)'
                }}
              >
                ✓ &nbsp;I AM SAFE
              </button>
              <button
                className="w-full rounded-xl font-bold text-white tracking-wider"
                style={{ padding: '9px 0', fontSize: '10px', background: '#C0392B' }}
              >
                SEND NOW
              </button>
            </div>

            {/* GPS indicator */}
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span style={{ color: '#475569', fontSize: '8px' }}>GPS Active · Location shared</span>
            </div>
          </div>
        </div>
      </div>
      {/* Home bar */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full" style={{ background: '#374151' }} />
    </div>
  );
};

const MiniPhone = ({ children, screenBg = '#0f0f1a' }) => (
  <div className="relative mx-auto" style={{ width: '150px', height: '290px' }}>
    <div
      className="absolute inset-0 rounded-[2rem]"
      style={{ background: '#1c1c2e', border: '3px solid #2C2C2C', boxShadow: '0 16px 40px rgba(0,0,0,0.3)' }}
    >
      <div className="absolute inset-[2px] rounded-[1.9rem] overflow-hidden" style={{ background: screenBg }}>
        <div className="h-7 flex items-end justify-between px-4 pb-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <span className="text-white" style={{ fontSize: '7px' }}>9:41</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px' }}>●●●</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center" style={{ height: 'calc(100% - 28px)', padding: '8px' }}>
          {children}
        </div>
      </div>
    </div>
  </div>
);

const FeatureBlock = ({ icon, headline, body, reverse = false, visual }) => {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="flex-1 max-w-lg">
        <div className="mb-5">{icon}</div>
        <h3 className="font-sans font-bold mb-4 text-charcoal" style={{ fontSize: '22px' }}>{headline}</h3>
        <p className="text-charcoal leading-relaxed" style={{ opacity: 0.7, fontSize: '15px' }}>{body}</p>
      </div>
      <div className="flex-1 flex justify-center">
        {visual}
      </div>
    </div>
  );
};

const TestimonialCard = ({ quote, name, role }) => {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      className={`rounded-2xl p-7 border-2 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ background: '#FAF9F6', borderColor: '#F1948A' }}
    >
      <div className="font-serif mb-3" style={{ color: '#F1948A', fontSize: '48px', lineHeight: 1 }}>"</div>
      <p className="font-serif italic mb-6 leading-relaxed text-charcoal" style={{ fontSize: '15px' }}>{quote}</p>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: '#F1948A' }}
        >
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-charcoal text-sm">— {name}</div>
          <div className="text-charcoal text-xs" style={{ opacity: 0.55 }}>{role}</div>
        </div>
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="10" fill="#C0392B" fillOpacity="0.12" />
    <path d="M5.5 10l3 3 6-6" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CrossIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="10" fill="#2C2C2C" fillOpacity="0.06" />
    <path d="M7 7l6 6M13 7l-6 6" stroke="#2C2C2C" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ─────────────────────────────────────────────
// Section: Launch Countdown (full-width)
// ─────────────────────────────────────────────

const LaunchCountdownSection = () => {
  const { days, hours, minutes, seconds } = useCountdown();
  const pad = (n) => String(n).padStart(2, '0');
  const units = [
    { value: pad(days),    label: 'DAYS' },
    { value: pad(hours),   label: 'HOURS' },
    { value: pad(minutes), label: 'MINUTES' },
    { value: pad(seconds), label: 'SECONDS' },
  ];

  return (
    <section
      id="countdown"
      style={{
        background: 'linear-gradient(160deg, #130406 0%, #1a1a1a 45%, #061313 100%)',
        padding: '80px 0',
        borderTop: '1px solid rgba(192,57,43,0.25)',
        borderBottom: '1px solid rgba(192,57,43,0.25)',
      }}
    >
      <div className="max-w-5xl mx-auto px-6 text-center">

        {/* Eyebrow label */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div style={{ flex: 1, maxWidth: '80px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(192,57,43,0.6))' }} />
          <div className="flex items-center gap-2.5">
            <span
              className="inline-block rounded-full animate-pulse"
              style={{ width: '7px', height: '7px', background: '#C0392B' }}
            />
            <span
              className="font-black tracking-[0.4em] text-xs"
              style={{ color: '#C0392B' }}
            >
              LAUNCHING IN
            </span>
          </div>
          <div style={{ flex: 1, maxWidth: '80px', height: '1px', background: 'linear-gradient(to left, transparent, rgba(192,57,43,0.6))' }} />
        </div>

        {/* Countdown tiles */}
        <div className="grid grid-cols-4 gap-3 md:gap-6 mb-10 max-w-2xl mx-auto">
          {units.map(({ value, label }, i) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <div
                className="w-full rounded-2xl flex items-center justify-center font-black text-white tabular-nums"
                style={{
                  background: 'rgba(255,255,255,0.035)',
                  border: '1px solid rgba(192,57,43,0.28)',
                  boxShadow: '0 0 40px rgba(192,57,43,0.07), inset 0 1px 0 rgba(255,255,255,0.05)',
                  fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                  lineHeight: 1,
                  padding: 'clamp(18px, 3.5vw, 32px) 0',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.02em',
                }}
              >
                {value}
              </div>
              <span
                className="font-black tracking-[0.18em]"
                style={{ color: '#475569', fontSize: '9px' }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Separators between tiles — colons on desktop */}
        {/* Date line */}
        <p
          className="font-sans font-semibold text-white mb-2"
          style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', letterSpacing: '0.06em' }}
        >
          May 2026 &nbsp;&middot;&nbsp; Android
        </p>
        <p style={{ color: '#475569', fontSize: '13px', marginBottom: '32px' }}>
          Free to download &nbsp;&middot;&nbsp; No subscriptions &nbsp;&middot;&nbsp; Your data never sold
        </p>

        {/* CTA */}
        <a
          href="#notify"
          className="inline-flex items-center gap-2.5 text-white font-bold rounded-full transition-opacity hover:opacity-90"
          style={{
            background: '#C0392B',
            boxShadow: '0 4px 24px rgba(192,57,43,0.45)',
            padding: '14px 32px',
            fontSize: '15px',
          }}
        >
          <Bell size={16} className="shrink-0" />&nbsp; Get notified at launch
        </a>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// Section: Navbar
// ─────────────────────────────────────────────

const Navbar = () => {
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
      style={{
        background: scrolled ? '#FAF9F6' : 'transparent',
        boxShadow: scrolled ? '0 1px 16px rgba(0,0,0,0.07)' : 'none'
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2.5">
          <img src="/asfalis-icon.png" alt="Asfalis" className="w-8 h-8 rounded-xl" />
          <span className="font-black tracking-[0.2em]" style={{ color: '#C0392B', fontSize: '20px' }}>ASFALIS</span>
        </a>
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-charcoal text-sm font-medium hover:text-crimson transition-colors" style={{ transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#C0392B'}
            onMouseLeave={e => e.target.style.color = '#2C2C2C'}
          >Features</a>
          <a href="#comparison" className="text-charcoal text-sm font-medium"
            onMouseEnter={e => e.target.style.color = '#C0392B'}
            onMouseLeave={e => e.target.style.color = '#2C2C2C'}
          >Why Asfalis</a>
          <a href="#how-it-works" className="text-charcoal text-sm font-medium"
            onMouseEnter={e => e.target.style.color = '#C0392B'}
            onMouseLeave={e => e.target.style.color = '#2C2C2C'}
          >How it Works</a>
          <Link
            to="/architecture"
            className="text-sm font-medium"
            style={{ color: '#1A6B6B', borderBottom: '1px solid #1A6B6B' }}
          >
            Architecture ↗
          </Link>
          <a
            href="#notify"
            className="inline-flex items-center gap-1.5 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-opacity hover:opacity-90"
            style={{ background: '#C0392B' }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white opacity-80 animate-pulse" />
            Notify Me
          </a>
        </div>
        {/* Mobile menu button */}
        <button className="md:hidden text-charcoal" onClick={() => setMobileOpen(o => !o)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen
              ? <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              : <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />}
          </svg>
        </button>
      </div>
      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4" style={{ background: '#FAF9F6' }}>
          <a href="#features" className="text-charcoal font-medium" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#comparison" className="text-charcoal font-medium" onClick={() => setMobileOpen(false)}>Why Asfalis</a>
          <a href="#how-it-works" className="text-charcoal font-medium" onClick={() => setMobileOpen(false)}>How it Works</a>
          <Link to="/architecture" className="font-medium" style={{ color: '#1A6B6B' }}>Architecture ↗</Link>
          <a href="#notify" className="text-white font-bold px-5 py-3 rounded-full text-center inline-flex items-center justify-center gap-2" style={{ background: '#C0392B' }}>
            <Bell size={14} /> Notify Me
          </a>
        </div>
      )}
    </nav>
  );
};

// ─────────────────────────────────────────────
// Section: Hero
// ─────────────────────────────────────────────

const Hero = () => {
  const [ref, visible] = useFadeIn(0.01);
  return (
    <section id="hero" className="min-h-screen flex items-center pt-20" style={{ background: '#FAF9F6' }}>
      {/* Subtle rose gradient at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(241,148,138,0.08), transparent)' }}
      />
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
        >
          <div className="flex items-center gap-4 mb-6">
            <img src="/asfalis-icon.png" alt="Asfalis icon" className="w-16 h-16 rounded-2xl shadow-lg" />
            <div className="flex flex-col gap-2">
              <div
                className="inline-block font-bold text-xs tracking-widest rounded-full px-4 py-1.5"
                style={{ background: 'rgba(192,57,43,0.1)', color: '#C0392B' }}
              >
                WOMEN'S PERSONAL SAFETY APP · ANDROID
              </div>
              <div
                className="inline-flex items-center gap-1.5 font-bold text-xs tracking-widest rounded-full px-4 py-1.5"
                style={{ background: 'rgba(26,107,107,0.1)', color: '#1A6B6B' }}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#1A6B6B' }} />
                LAUNCHING MAY 2026
              </div>
            </div>
          </div>
          <h1
            className="font-serif font-bold leading-tight text-charcoal mb-6"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}
          >
            Your safety.<br />
            In your hands.<br />
            Always.
          </h1>
          <p className="leading-relaxed mb-10 max-w-md" style={{ color: '#2C2C2C', opacity: 0.7, fontSize: '17px' }}>
            Asfalis is the personal safety companion every woman deserves — silent, smart, and always ready when you need it most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <a
              href="#notify"
              className="cta-primary flex items-center justify-center gap-2 text-white font-bold px-8 py-4 rounded-full text-base hover:opacity-90 transition-opacity"
              style={{ background: '#C0392B', boxShadow: '0 4px 24px rgba(192,57,43,0.3)' }}
            >
              <Bell size={18} className="shrink-0" /> Notify Me at Launch
            </a>
            <a
              href="#how-it-works"
              className="flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-full text-base transition-all"
              style={{
                border: '2px solid #1A6B6B', color: '#1A6B6B',
                background: 'transparent'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1A6B6B'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1A6B6B'; }}
            >
              See how it works ↓
            </a>
          </div>
          <p className="text-sm tracking-wide" style={{ color: '#2C2C2C', opacity: 0.45 }}>
            Launching May 2026 · Free · No ads · Your data never sold
          </p>
        </div>

        <div className="flex justify-center items-center">
          <SOSPhoneMockup />
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// Section: Problem
// ─────────────────────────────────────────────

const ProblemSection = () => {
  const [ref, visible] = useFadeIn();
  return (
    <section style={{ background: '#2C2C2C', padding: '96px 0' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="font-sans font-semibold text-white mb-4" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)' }}>
            Every 20 minutes, a woman in India faces violence.
          </h2>
          <p className="font-light" style={{ color: '#94a3b8', fontSize: '18px' }}>
            You deserve better than hoping someone notices.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16 text-center">
          <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: 1.9 }}>
            Walking home late. Travelling solo. A situation that just feels <em>wrong.</em>
            <br /><br />
            In those moments, fumbling with your phone to call someone — or hoping someone
            will see you're in trouble — isn't good enough.
            <br /><br />
            Asfalis was built because women shouldn't have to choose between looking calm
            and staying safe. You deserve a guardian that works <strong className="text-white">before you even have to ask.</strong>
          </p>
        </div>

        {/* Three panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <User size={40} color="#94a3b8" />, step: '01', title: 'Alone & Uneasy', desc: 'Walking home late with that uneasy feeling in your stomach — no one around to help.' },
            { icon: <Wifi size={40} color="#94a3b8" />, step: '02', title: 'Asfalis Watches', desc: 'Your phone quietly monitors motion, proximity, and context — you don\'t have to do a thing.' },
            { icon: <CheckCircle2 size={40} color="#22c55e" />, step: '03', title: 'Help Already Coming', desc: 'Alert sent. Contacts notified. Live location shared. Safety confirmed — before you ask.' },
          ].map((panel) => (
            <div
              key={panel.step}
              className="rounded-2xl p-8 text-center transition-all hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(192,57,43,0.4)'; e.currentTarget.style.background = 'rgba(192,57,43,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            >
              <div className="mb-4 flex justify-center">{panel.icon}</div>
              <div className="font-black mb-2" style={{ color: '#C0392B', fontSize: '11px', letterSpacing: '0.15em' }}>STEP {panel.step}</div>
              <h3 className="font-bold text-white text-lg mb-3">{panel.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.7 }}>{panel.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// Section: Features (8 blocks)
// ─────────────────────────────────────────────

const FeaturesSection = () => {
  const [titleRef, titleVisible] = useFadeIn();

  const features = [
    {
      icon: <AlertCircle size={44} color="#C0392B" />,
      headline: 'Send an SOS before anyone realises you did.',
      body: 'One tap on the SOS button starts a 10-second countdown. If you\'re safe, cancel it. If you\'re not — do nothing. Asfalis automatically sends your live location via SMS and push notification to every trusted contact you\'ve set up. They\'ll know exactly where you are and that you need help.',
      visual: (
        <MiniPhone>
          <div className="w-full text-center flex flex-col items-center gap-3">
            <div style={{ color: '#C0392B', fontWeight: 900, fontSize: '9px', letterSpacing: '0.2em' }}>ASFALIS SOS</div>
            <div className="relative" style={{ width: '70px', height: '70px' }}>
              <svg className="w-full h-full sos-ring-svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#C0392B" strokeWidth="8"
                  strokeLinecap="round" strokeDasharray="263.9" className="sos-ring-animated" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-black text-white" style={{ fontSize: '24px' }}>10</span>
              </div>
            </div>
            <button className="w-full rounded-lg font-bold text-white" style={{ background: '#C0392B', padding: '5px 0', fontSize: '8px' }}>SEND NOW</button>
            <button className="w-full rounded-lg font-bold" style={{ border: '1px solid #22c55e', color: '#22c55e', padding: '5px 0', fontSize: '8px', background: 'rgba(34,197,94,0.08)' }}>✓ I AM SAFE</button>
          </div>
        </MiniPhone>
      )
    },
    {
      icon: <Zap size={44} color="#C0392B" />,
      headline: "Can't reach your screen? Just shake.",
      body: "When your hands are full, your phone is in your bag, or you simply can't risk being seen — shake your phone. Asfalis detects the motion and triggers an SOS automatically. You control the sensitivity. You stay in control.",
      visual: (
        <MiniPhone>
          <div className="w-full flex flex-col items-center gap-3">
            <div style={{ filter: 'blur(0.5px)', animation: 'wiggle 0.3s ease-in-out infinite alternate' }}><Smartphone size={30} color="#F1948A" /></div>
            <div style={{ color: '#F1948A', fontWeight: 700, fontSize: '8px', letterSpacing: '0.15em', textAlign: 'center' }}>SHAKE DETECTED</div>
            <div className="w-full rounded-lg p-2" style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)' }}>
              <div style={{ color: '#C0392B', fontSize: '7px', fontWeight: 700, textAlign: 'center' }}>SOS TRIGGERED</div>
            </div>
            <div style={{ color: '#475569', fontSize: '7px', textAlign: 'center' }}>Sensitivity: Medium</div>
          </div>
        </MiniPhone>
      )
    },
    {
      icon: <Cpu size={44} color="#C0392B" />,
      headline: "It knows something's wrong — even before you do.",
      body: "Asfalis uses a machine learning model trained on real movement patterns to detect danger from your phone's accelerometer and gyroscope. Sudden impact. Unusual struggling motion. An erratic fall. The moment the AI detects danger, it starts an automatic SOS countdown — giving you 10 seconds to cancel if it was a false alarm, and sending help if you don't. No button press needed. No words spoken.",
      visual: (
        <MiniPhone screenBg="#060d1a">
          <div className="w-full flex flex-col items-center gap-2">
            <div style={{ color: '#60a5fa', fontWeight: 700, fontSize: '8px', letterSpacing: '0.1em' }}>ML ENGINE</div>
            {/* Waveform bars */}
            <div className="flex items-end gap-0.5 h-10">
              {[3,6,4,9,5,12,7,4,11,6,3,8,5,10,4].map((h, i) => (
                <div key={i} className="rounded-t" style={{
                  width: '5px', height: `${h * 3}px`,
                  background: h > 9 ? '#ef4444' : '#3b82f6',
                  opacity: 0.8
                }} />
              ))}
            </div>
            <div className="w-full rounded-lg p-1.5" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)' }}>
              <div style={{ color: '#ef4444', fontSize: '7px', fontWeight: 800, textAlign: 'center', letterSpacing: '0.1em' }}>⚠ DANGER DETECTED</div>
            </div>
            <div style={{ color: '#475569', fontSize: '6px', textAlign: 'center' }}>Confidence: 0.94 · Auto SOS in 10s</div>
          </div>
        </MiniPhone>
      )
    },
    {
      icon: <Clock size={44} color="#C0392B" />,
      headline: 'A discreet button. Hidden in plain sight.',
      body: 'Pair Asfalis with our ESP32-powered wearable — a tiny Bluetooth button you can wear as a pendant, clip to a bag, or keep in your pocket. Single press → triggers SOS. Double press → cancels it. No screen needed. No one watching will know what you just did.',
      visual: (
        <div className="relative flex flex-col items-center gap-4">
          {/* Wearable device illustration */}
          <div className="relative flex items-center justify-center" style={{ width: '80px', height: '80px' }}>
            <div className="absolute inset-0 rounded-full ripple-ring" style={{ border: '2px solid rgba(192,57,43,0.4)' }} />
            <div className="absolute inset-0 rounded-full ripple-ring-delay" style={{ border: '2px solid rgba(192,57,43,0.25)' }} />
            <div className="rounded-full flex items-center justify-center" style={{
              width: '56px', height: '56px',
              background: 'linear-gradient(135deg, #2C2C2C, #1c1c2e)',
              border: '3px solid #C0392B',
              boxShadow: '0 4px 20px rgba(192,57,43,0.4)'
            }}>
              <div className="rounded-full" style={{ width: '20px', height: '20px', background: '#C0392B' }} />
            </div>
          </div>
          <div className="text-center">
            <div className="font-bold text-charcoal text-sm">ESP32 Wearable</div>
            <div className="text-xs mt-1" style={{ color: '#2C2C2C', opacity: 0.55 }}>1× press → SOS · 2× → Cancel</div>
            <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(26,107,107,0.1)', color: '#1A6B6B' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" style={{ background: '#1A6B6B' }} />
              Bluetooth Connected
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <MapPin size={44} color="#C0392B" />,
      headline: 'Let the people who matter know exactly where you are.',
      body: 'Share your real-time GPS location with trusted contacts via a live WebSocket stream — no SMS delays, no guessing. Your map, your route, your safety — visible to the people you trust for as long as you need.',
      visual: (
        <MiniPhone screenBg="#0d1b2a">
          <div className="w-full flex flex-col items-center gap-2">
            <div style={{ color: '#60a5fa', fontWeight: 700, fontSize: '7px', letterSpacing: '0.1em' }}>LIVE LOCATION</div>
            {/* Simplified map */}
            <div className="w-full rounded-lg overflow-hidden" style={{ height: '80px', background: 'rgba(26,107,107,0.2)', border: '1px solid rgba(26,107,107,0.4)', position: 'relative' }}>
              {/* Grid lines */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(26,107,107,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(26,107,107,0.2) 1px,transparent 1px)', backgroundSize: '15px 15px' }} />
              {/* Location pin */}
              <div style={{ position: 'absolute', top: '40%', left: '55%', transform: 'translate(-50%,-50%)' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#C0392B', border: '2px solid white', boxShadow: '0 0 0 4px rgba(192,57,43,0.3)' }} />
              </div>
            </div>
            <div className="w-full rounded-lg px-2 py-1.5 flex items-center gap-1.5" style={{ background: 'rgba(26,107,107,0.15)', border: '1px solid rgba(26,107,107,0.3)' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#1A6B6B' }} />
              <span style={{ color: '#1A6B6B', fontSize: '7px', fontWeight: 600 }}>Sharing with 3 contacts</span>
            </div>
          </div>
        </MiniPhone>
      )
    },
    {
      icon: <Users size={44} color="#C0392B" />,
      headline: 'Your safety circle — built on trust, not guesswork.',
      body: 'Every contact you add goes through OTP verification. An SMS is sent to their phone, confirming they\'re real, reachable, and ready to receive your alerts. Add family. Add friends. Mark one as Primary — they\'re the first to know.',
      visual: (
        <MiniPhone>
          <div className="w-full flex flex-col gap-2">
            <div style={{ color: '#C0392B', fontWeight: 700, fontSize: '7px', letterSpacing: '0.1em', textAlign: 'center' }}>SAFETY CIRCLE</div>
            {[{ name: 'Mom', tag: 'PRIMARY', color: '#C0392B' }, { name: 'Sister Priya', tag: 'VERIFIED ✓', color: '#1A6B6B' }, { name: 'Neha', tag: 'VERIFIED ✓', color: '#1A6B6B' }].map((c) => (
              <div key={c.name} className="flex items-center justify-between rounded-lg px-2 py-1.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-1.5">
                  <div className="rounded-full flex items-center justify-center text-white" style={{ width: '18px', height: '18px', background: c.color, fontSize: '8px', fontWeight: 700 }}>{c.name.charAt(0)}</div>
                  <span className="text-white" style={{ fontSize: '8px' }}>{c.name}</span>
                </div>
                <span className="font-bold" style={{ fontSize: '6px', color: c.color }}>{c.tag}</span>
              </div>
            ))}
            <button className="w-full rounded-lg font-bold" style={{ background: 'rgba(192,57,43,0.2)', color: '#C0392B', border: '1px dashed rgba(192,57,43,0.5)', padding: '4px 0', fontSize: '7px' }}>+ Add Contact</button>
          </div>
        </MiniPhone>
      )
    },
    {
      icon: <FileText size={44} color="#C0392B" />,
      headline: 'A record of every moment Asfalis had your back.',
      body: 'Every SOS event — triggered, cancelled, or confirmed — is logged with time, location, and status. Keep it for yourself. Share it with authorities if needed. Your history, your evidence.',
      visual: (
        <MiniPhone>
          <div className="w-full flex flex-col gap-1.5">
            <div style={{ color: '#C0392B', fontWeight: 700, fontSize: '7px', letterSpacing: '0.1em', textAlign: 'center', marginBottom: '4px' }}>SOS HISTORY</div>
            {[
              { time: 'Today 22:14', status: 'SENT', color: '#C0392B', bg: 'rgba(192,57,43,0.1)' },
              { time: 'Today 18:02', status: 'CANCELLED', color: '#1A6B6B', bg: 'rgba(26,107,107,0.1)' },
              { time: 'Mar 4 09:31', status: 'SENT', color: '#C0392B', bg: 'rgba(192,57,43,0.1)' },
              { time: 'Mar 2 20:45', status: 'CANCELLED', color: '#1A6B6B', bg: 'rgba(26,107,107,0.1)' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg px-2 py-1.5" style={{ background: item.bg }}>
                <span className="text-white" style={{ fontSize: '7px' }}>{item.time}</span>
                <span className="font-bold" style={{ color: item.color, fontSize: '6px' }}>{item.status}</span>
              </div>
            ))}
          </div>
        </MiniPhone>
      )
    },
    {
      icon: <Lock size={44} color="#C0392B" />,
      headline: 'Your data is yours. Full stop.',
      body: 'One device at a time. Your account is locked to your phone — switching devices requires a 12-hour verified handset transfer. Screenshots of sensitive screens like your contacts and SOS history are blocked inside the app. OTP login. JWT-secured sessions. No password to steal.',
      visual: (
        <div className="flex flex-col items-center gap-5">
          {/* Shield */}
          <div className="relative flex items-center justify-center">
            <div style={{ width: '90px', height: '100px' }}>
              <svg viewBox="0 0 90 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M45 4L8 18v28c0 22 16 42 37 50 21-8 37-28 37-50V18L45 4z" fill="rgba(192,57,43,0.12)" stroke="#C0392B" strokeWidth="2" />
                <path d="M30 50l10 10 20-20" stroke="#C0392B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            {['OTP Login', 'JWT Sessions', 'Single Device Lock', 'Screenshot Protection'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(192,57,43,0.12)' }}>
                  <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5 4-4" stroke="#C0392B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <span className="text-charcoal" style={{ fontSize: '13px', opacity: 0.75 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
  ];

  return (
    <section id="features" style={{ background: '#FAF9F6', padding: '96px 0' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={titleRef}
          className={`text-center mb-20 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="font-sans font-semibold text-charcoal mb-4" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            One app. Every layer of protection.
          </h2>
          <p style={{ color: '#2C2C2C', opacity: 0.6, fontSize: '17px' }}>
            Asfalis doesn't wait for you to ask for help. It's already watching.
          </p>
          <div className="mx-auto mt-6" style={{ width: '48px', height: '3px', background: '#C0392B', borderRadius: '2px' }} />
        </div>

        <div className="flex flex-col gap-24">
          {features.map((f, i) => (
            <FeatureBlock
              key={i}
              icon={f.icon}
              headline={f.headline}
              body={f.body}
              reverse={i % 2 !== 0}
              visual={f.visual}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// Section: Comparison Table
// ─────────────────────────────────────────────

const ComparisonSection = () => {
  const [ref, visible] = useFadeIn();
  const rows = [
    'One-tap SOS',
    'Shake to SOS',
    'AI motion detection',
    'IoT wearable support',
    'Live GPS streaming',
    'OTP-verified contacts',
    'Screenshot protection',
    'Single-device security',
    'No ads, no data selling',
  ];
  const basicHas = [true, false, false, false, false, false, false, false, false];

  return (
    <section id="comparison" style={{ background: '#EFEFEF', padding: '96px 0' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="font-sans font-semibold text-charcoal mb-4" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            Not just an emergency dialler. A complete safety layer.
          </h2>
          <div className="mx-auto mt-6" style={{ width: '48px', height: '3px', background: '#C0392B', borderRadius: '2px' }} />
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 48px rgba(0,0,0,0.1)' }}>
          {/* Table header */}
          <div className="grid grid-cols-3" style={{ background: '#2C2C2C' }}>
            <div className="p-5 font-bold text-sm" style={{ color: '#94a3b8' }}>Feature</div>
            <div className="p-5 font-bold text-sm text-center" style={{ color: '#94a3b8' }}>Basic safety apps</div>
            <div className="p-5 text-center" style={{ background: 'rgba(192,57,43,0.15)', borderLeft: '2px solid #C0392B' }}>
              <span className="font-black tracking-widest text-sm" style={{ color: '#C0392B' }}>ASFALIS</span>
            </div>
          </div>
          {rows.map((row, i) => (
            <div
              key={row}
              className="grid grid-cols-3 items-center"
              style={{ background: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #EFEFEF' }}
            >
              <div className="p-4 font-medium text-sm text-charcoal">{row}</div>
              <div className="p-4 flex justify-center">
                {basicHas[i] ? <CheckIcon /> : <CrossIcon />}
              </div>
              <div className="p-4 flex justify-center" style={{ background: i % 2 === 0 ? 'rgba(192,57,43,0.04)' : 'rgba(192,57,43,0.06)', borderLeft: '2px solid rgba(192,57,43,0.15)' }}>
                <CheckIcon />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// Section: How It Works
// ─────────────────────────────────────────────

const HowItWorksSection = () => {
  const [ref, visible] = useFadeIn();
  const steps = [
    {
      icon: <Smartphone size={36} color="#C0392B" />,
      title: 'Download & Register',
      body: 'Sign up with your phone number. A one-time OTP confirms it\'s really you on your real device.',
      screen: (
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="font-black tracking-widest" style={{ color: '#C0392B', fontSize: '11px' }}>ASFALIS</div>
          <div className="font-bold text-white" style={{ fontSize: '9px' }}>Enter your number</div>
          <div className="w-full rounded-lg px-2 py-2 text-center font-mono" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', fontSize: '9px' }}>+91 98765 •••••</div>
          <div className="font-bold text-white" style={{ fontSize: '8px', marginTop: '4px' }}>OTP: 4 8 2 9</div>
          <button className="w-full rounded-lg text-white font-bold" style={{ background: '#C0392B', padding: '5px 0', fontSize: '8px' }}>VERIFY →</button>
        </div>
      )
    },
    {
      icon: <Users size={36} color="#C0392B" />,
      title: 'Add Your Safety Circle',
      body: 'Add trusted contacts — family, friends, a neighbour. Each one is OTP-verified so your alerts reach real people.',
      screen: (
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="font-bold" style={{ color: '#C0392B', fontSize: '8px', letterSpacing: '0.1em' }}>ADD CONTACT</div>
          <div className="w-full rounded-lg px-2 py-1.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ color: '#64748b', fontSize: '7px' }}>Name</div>
            <div style={{ color: 'white', fontSize: '8px' }}>Mom</div>
          </div>
          <div className="w-full rounded-lg px-2 py-1.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ color: '#64748b', fontSize: '7px' }}>Phone</div>
            <div style={{ color: 'white', fontSize: '8px' }}>+91 9876•••••</div>
          </div>
          <div className="w-full rounded-lg p-1.5 text-center" style={{ background: 'rgba(26,107,107,0.2)', border: '1px solid rgba(26,107,107,0.4)' }}>
            <div style={{ color: '#1A6B6B', fontSize: '7px', fontWeight: 700 }}>OTP SENT ✓</div>
          </div>
        </div>
      )
    },
    {
      icon: <ShieldCheck size={36} color="#C0392B" />,
      title: 'Live Your Life. We\'re Watching.',
      body: 'Enable Auto SOS, adjust your shake sensitivity, pair your wearable — and simply go. Asfalis runs silently in the background.',
      screen: (
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="font-bold" style={{ color: '#C0392B', fontSize: '8px', letterSpacing: '0.1em' }}>ASFALIS ACTIVE</div>
          <div className="w-full rounded-full" style={{ height: '4px', background: '#1e293b' }}>
            <div className="rounded-full" style={{ width: '100%', height: '100%', background: '#22c55e' }} />
          </div>
          {[
            { label: 'Auto SOS (AI)', on: true },
            { label: 'Shake Detection', on: true },
            { label: 'Live Location', on: false },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between w-full" style={{ fontSize: '7px' }}>
              <span style={{ color: '#94a3b8' }}>{item.label}</span>
              <div className="rounded-full" style={{ width: '22px', height: '12px', background: item.on ? '#22c55e' : '#334155', position: 'relative' }}>
                <div className="rounded-full absolute top-0.5" style={{ width: '9px', height: '9px', background: 'white', left: item.on ? '11px' : '1.5px', transition: 'left 0.2s' }} />
              </div>
            </div>
          ))}
          <div className="w-full rounded-lg p-1.5 text-center mt-1" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <div style={{ color: '#22c55e', fontSize: '7px', fontWeight: 700 }}>● MONITORING ACTIVE</div>
          </div>
        </div>
      )
    },
  ];

  return (
    <section id="how-it-works" style={{ background: '#FAF9F6', padding: '96px 0' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-20 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="font-sans font-semibold text-charcoal mb-4" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            Set up in under 3 minutes.
          </h2>
          <div className="mx-auto mt-6" style={{ width: '48px', height: '3px', background: '#C0392B', borderRadius: '2px' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative">
          {/* Connecting dotted line (desktop) */}
          <div className="hidden md:block absolute top-20 left-[calc(33.3%+20px)] right-[calc(33.3%+20px)] border-t-2 border-dashed" style={{ borderColor: 'rgba(192,57,43,0.25)' }} />
          {steps.map((step, i) => {
            const [sRef, sVisible] = useFadeIn();
            return (
              <div
                key={i}
                ref={sRef}
                className={`flex flex-col items-center text-center transition-all duration-700 ${sVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Step number badge */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-lg mb-6 relative z-10"
                  style={{ background: '#C0392B', boxShadow: '0 4px 16px rgba(192,57,43,0.35)' }}
                >
                  {i + 1}
                </div>
                <MiniPhone screenBg="#0f0f1a">
                  {step.screen}
                </MiniPhone>
                <div className="mt-6 mb-3 flex justify-center">{step.icon}</div>
                <h3 className="font-bold text-charcoal mb-3" style={{ fontSize: '17px' }}>{step.title}</h3>
                <p style={{ color: '#2C2C2C', opacity: 0.65, fontSize: '14px', lineHeight: 1.7 }}>{step.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// Section: Testimonials
// ─────────────────────────────────────────────

const TestimonialsSection = () => {
  const [ref, visible] = useFadeIn();
  return (
    <section style={{ background: '#EFEFEF', padding: '96px 0' }}>
      {/* <div className="max-w-6xl mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="font-sans font-semibold text-charcoal mb-4" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            Women who chose to stop worrying.
          </h2>
          <div className="mx-auto mt-6" style={{ width: '48px', height: '3px', background: '#C0392B', borderRadius: '2px' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard
            quote="I travel for work every week. Before Asfalis, I'd text my sister my location manually every hour. Now I just turn on live sharing and she can see me the whole time."
            name="Priya, 29"
            role="Marketing Manager"
          />
          <TestimonialCard
            quote="The shake feature saved me in a situation where I couldn't even look at my phone. My mom called me within 90 seconds."
            name="Rhea, 22"
            role="College Student"
          />
          <TestimonialCard
            quote="I love that my contacts had to verify via OTP. I know my alerts go to real people who are ready to help — not a number I added by mistake."
            name="Sanjana, 35"
            role="Working Mother"
          />
        </div>
      </div> */}
    </section>
  );
};

// ─────────────────────────────────────────────
// Section: Statistics
// ─────────────────────────────────────────────

const StatItem = ({ prefix = '', numEnd, suffix = '', label, source }) => {
  const [count, ref] = useCountUp(numEnd);
  return (
    <div ref={ref} className="text-center px-8">
      <div className="font-sans font-extrabold leading-none mb-4" style={{ color: '#C0392B', fontSize: 'clamp(3rem, 7vw, 5rem)' }}>
        {prefix}{count}{suffix}
      </div>
      <p className="font-medium text-white mb-2" style={{ fontSize: '16px' }}>{label}</p>
      <p style={{ color: '#64748b', fontSize: '12px' }}>{source}</p>
    </div>
  );
};

const StatisticsSection = () => {
  const [ref, visible] = useFadeIn();
  return (
    <section style={{ background: '#2C2C2C', padding: '96px 0' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-20 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="font-sans font-semibold text-white mb-4" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            The numbers that make Asfalis necessary.
          </h2>
          <div className="mx-auto mt-6" style={{ width: '48px', height: '3px', background: '#C0392B', borderRadius: '2px' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: '#1A6B6B', border: '0' }}>
          {/* Dividers in teal */}
          <div className="py-4 md:py-0 md:px-4 flex justify-center">
            <StatItem
              prefix="1 in "
              numEnd={3}
              label="women worldwide experience physical or sexual violence in their lifetime."
              source="— WHO, 2021"
            />
          </div>
          <div className="py-8 md:py-0 md:px-4 flex justify-center" style={{ borderColor: '#1A6B6B', borderLeftWidth: '1px', borderLeftStyle: 'solid' }}>
            <StatItem
              numEnd={86}
              suffix="%"
              label="of women in India report feeling unsafe in public spaces."
              source="— IANS Survey, 2023"
            />
          </div>
          <div className="py-8 md:py-0 md:px-4 flex justify-center" style={{ borderColor: '#1A6B6B', borderLeftWidth: '1px', borderLeftStyle: 'solid' }}>
            <div className="text-center px-8">
              <div className="font-sans font-extrabold leading-none mb-4" style={{ color: '#C0392B', fontSize: 'clamp(3rem, 7vw, 5rem)' }}>
                &lt; 10
              </div>
              <p className="font-medium text-white mb-2" style={{ fontSize: '16px' }}>
                seconds is all Asfalis needs to alert your entire safety circle.
              </p>
              <p style={{ color: '#64748b', fontSize: '12px' }}>— Asfalis auto-SOS trigger</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// Section: Final CTA
// ─────────────────────────────────────────────

const FinalCTASection = () => {
  const [ref, visible] = useFadeIn();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section id="notify" style={{ background: '#FAF9F6', padding: '96px 0' }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div
          ref={ref}
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Launch badge */}
          <div
            className="inline-flex items-center gap-2 font-black text-xs tracking-[0.3em] rounded-full px-5 py-2 mb-8"
            style={{ background: 'rgba(26,107,107,0.09)', color: '#1A6B6B', border: '1px solid rgba(26,107,107,0.2)' }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#1A6B6B' }} />
            LAUNCHING MAY 2026
          </div>

          <h2 className="font-serif font-bold text-charcoal mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            You deserve to walk through the world without fear.
          </h2>
          <p className="mb-10" style={{ color: '#2C2C2C', opacity: 0.65, fontSize: '17px', lineHeight: 1.7 }}>
            Asfalis launches in <strong style={{ color: '#C0392B' }}>May 2026</strong>. Be first in line —
            drop your email and we'll notify you the moment it goes live. Free. Always.
          </p>

          {/* Email capture */}
          {submitted ? (
            <div
              className="rounded-2xl p-10 mb-10 mx-auto max-w-md"
              style={{
                background: 'rgba(26,107,107,0.06)',
                border: '1px solid rgba(26,107,107,0.25)',
              }}
            >
              <div className="mb-4 flex justify-center"><CheckCircle2 size={40} color="#1A6B6B" /></div>
              <div className="font-bold text-charcoal text-xl mb-2">You're on the list.</div>
              <div style={{ color: '#2C2C2C', opacity: 0.55, fontSize: '14px' }}>
                We'll notify you the moment Asfalis goes live — no spam, ever.
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 mb-10 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 px-5 py-4 rounded-full font-medium outline-none"
                style={{
                  border: '2px solid #EFEFEF',
                  background: '#fff',
                  fontSize: '15px',
                  color: '#2C2C2C',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#C0392B'}
                onBlur={e => e.target.style.borderColor = '#EFEFEF'}
              />
              <button
                type="submit"
                className="cta-primary inline-flex items-center gap-2 text-white font-bold px-7 py-4 rounded-full whitespace-nowrap hover:opacity-90 transition-opacity"
                style={{
                  background: '#C0392B',
                  boxShadow: '0 4px 24px rgba(192,57,43,0.32)',
                  fontSize: '15px',
                }}
              >
                <Bell size={16} /> Notify Me
              </button>
            </form>
          )}

          <div className="flex justify-center mb-12">
            <Link
              to="/architecture"
              className="flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-full text-base transition-all"
              style={{ border: '2px solid #1A6B6B', color: '#1A6B6B' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1A6B6B'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1A6B6B'; }}
            >
              Learn about our technology ↗
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: <Lock size={15} />, text: 'End-to-end secure sessions' },
              { icon: <BellOff size={15} />, text: 'No ads. Ever.' },
              { icon: <ShieldCheck size={15} />, text: 'Your data stays yours' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-medium" style={{ color: '#1A6B6B' }}>
                {badge.icon}
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// Section: Footer
// ─────────────────────────────────────────────

const Footer = () => (
  <footer style={{ background: '#2C2C2C', padding: '56px 0 32px' }}>
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <img src="/asfalis-icon.png" alt="Asfalis" className="w-7 h-7 rounded-lg" />
            <span className="font-black tracking-[0.2em]" style={{ color: '#C0392B', fontSize: '18px' }}>ASFALIS</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.7 }}>
            The personal safety companion every woman deserves — silent, smart, and always ready.
          </p>
        </div>
        <div>
          <div className="font-bold text-white mb-4 text-sm tracking-wider">LINKS</div>
          <div className="flex flex-col gap-2">
            {['Privacy Policy', 'Terms of Service', 'Contact Us'].map(link => (
              <a key={link} href="#" style={{ color: '#94a3b8', fontSize: '13px' }}
                onMouseEnter={e => e.target.style.color = '#C0392B'}
                onMouseLeave={e => e.target.style.color = '#94a3b8'}
              >{link}</a>
            ))}
            <Link to="/architecture" style={{ color: '#94a3b8', fontSize: '13px' }}
              onMouseEnter={e => e.target.style.color = '#1A6B6B'}
              onMouseLeave={e => e.target.style.color = '#94a3b8'}
            >Architecture ↗</Link>
          </div>
        </div>
        <div>
          <div className="font-bold text-white mb-4 text-sm tracking-wider">FOLLOW</div>
          <div className="flex gap-4">
            {['Instagram', 'Twitter / X', 'LinkedIn'].map(soc => (
              <a key={soc} href="#" className="text-xs font-medium px-3 py-1.5 rounded-full transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(192,57,43,0.5)'; e.currentTarget.style.color = '#C0392B'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8'; }}
              >{soc}</a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <p style={{ color: '#475569', fontSize: '12px' }}>© 2026 Asfalis. All rights reserved.</p>
        <p className="font-serif italic" style={{ color: '#C0392B', fontSize: '13px' }}>
          "Safety isn't a privilege. It's a right."
        </p>
      </div>
    </div>
  </footer>
);

// ─────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div style={{ background: '#FAF9F6', color: '#2C2C2C' }}>
      <Navbar />
      <Hero />
      <LaunchCountdownSection />
      <ProblemSection />
      <FeaturesSection />
      <ComparisonSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <StatisticsSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
