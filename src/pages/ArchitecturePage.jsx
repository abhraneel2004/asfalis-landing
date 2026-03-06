import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Smartphone, AlertTriangle, Bluetooth,
  Play, Pause, Zap, MapPin, ShieldCheck, Cpu, Bell,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Brand palette
// ─────────────────────────────────────────────
const C = {
  crimson:  '#C0392B',
  ivory:    '#FAF9F6',
  charcoal: '#2C2C2C',
  teal:     '#1A6B6B',
  dark:     '#0f0f1a',
  card:     '#1c1c2e',
};

const PATH_A = ['setup','monitor_ble','triggers','actions','backend','alerting','feedback'];
const PATH_B = ['setup','monitor_sensor','triggers','actions','backend','alerting','feedback'];

// ─────────────────────────────────────────────
// Phone screens  (always dark — they're device UI)
// ─────────────────────────────────────────────
const ScreenIdle = () => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:14, padding:'0 16px' }}>
    <img src="/asfalis-icon.png" alt="Asfalis" style={{ width:52, height:52, borderRadius:13 }} />
    <div style={{ color:C.crimson, fontWeight:900, fontSize:12, letterSpacing:'0.2em' }}>ASFALIS</div>
    <div style={{ color:'#334155', fontSize:10, textAlign:'center', lineHeight:1.7 }}>
      Press a trigger button<br/>or Start Auto Loop<br/>to run the simulation
    </div>
  </div>
);

const ScreenSetup = () => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'0 12px', width:'100%' }}>
    <div style={{ color:C.crimson, fontWeight:800, fontSize:9, letterSpacing:'0.18em' }}>DEVICE SETUP</div>
    <img src="/asfalis-icon.png" alt="Asfalis" style={{ width:40, height:40, borderRadius:11 }} />
    <div style={{ color:'white', fontWeight:700, fontSize:10 }}>Asfalis Safety App</div>
    <div style={{ width:'100%', borderRadius:9, background:'rgba(26,107,107,0.15)', border:'1px solid rgba(26,107,107,0.35)', padding:'7px 9px' }}>
      <div style={{ color:'#64748b', fontSize:7, marginBottom:3 }}>SCANNING FOR DEVICE</div>
      <div style={{ display:'flex', alignItems:'center', gap:5 }}>
        <div style={{ width:7, height:7, borderRadius:'50%', background:C.teal }} />
        <span style={{ color:C.teal, fontSize:8, fontWeight:700 }}>ASFALIS-BLE-001 · -45dBm</span>
      </div>
    </div>
    <div style={{ width:'100%', borderRadius:7, background:C.crimson, color:'white', fontWeight:800, fontSize:8, padding:'5px 0', letterSpacing:'0.1em', textAlign:'center' }}>
      PAIR BRACELET
    </div>
    <div style={{ color:'#334155', fontSize:7 }}>UUID: 0xAF3B9C12</div>
  </div>
);

const ScreenBLE = () => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'0 12px', width:'100%' }}>
    <div style={{ color:C.teal, fontWeight:800, fontSize:9, letterSpacing:'0.18em' }}>BLE MONITOR</div>
    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
      <div style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e' }} />
      <span style={{ color:'#22c55e', fontWeight:700, fontSize:8 }}>BRACELET CONNECTED</span>
    </div>
    <div style={{ width:'100%', borderRadius:9, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', padding:'7px 9px' }}>
      <div style={{ color:'#64748b', fontSize:7, marginBottom:5 }}>SIGNAL STRENGTH (RSSI)</div>
      <div style={{ display:'flex', alignItems:'flex-end', gap:3, height:28 }}>
        {[70,85,60,90,75,95,80].map((h,i) => (
          <div key={i} style={{ flex:1, height:`${h}%`, borderRadius:2, background: h > 80 ? C.teal : 'rgba(26,107,107,0.4)' }} />
        ))}
      </div>
      <div style={{ color:C.teal, fontSize:8, fontWeight:700, marginTop:3 }}>-45 dBm · Excellent</div>
    </div>
    {['LONG PRESS (SOS)', 'DOUBLE PRESS (Cancel)', 'RSSI POLL 1000ms'].map(s => (
      <div key={s} style={{ width:'100%', display:'flex', alignItems:'center', gap:5 }}>
        <div style={{ width:4, height:4, borderRadius:'50%', background:C.teal, flexShrink:0 }} />
        <span style={{ color:'#94a3b8', fontSize:7 }}>{s}</span>
      </div>
    ))}
  </div>
);

const ScreenSensor = () => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'0 12px', width:'100%' }}>
    <div style={{ color:'#60a5fa', fontWeight:800, fontSize:9, letterSpacing:'0.18em' }}>SENSOR MONITOR</div>
    <div style={{ color:'#94a3b8', fontSize:8, fontWeight:600 }}>ACCEL + GYRO · 50 Hz</div>
    <div style={{ width:'100%', borderRadius:9, background:'rgba(0,0,0,0.3)', border:'1px solid rgba(96,165,250,0.2)', padding:'7px 9px' }}>
      <div style={{ color:'#475569', fontSize:7, marginBottom:3 }}>ACCELEROMETER (m/s²)</div>
      <div style={{ display:'flex', alignItems:'flex-end', gap:1, height:26 }}>
        {[3,6,4,9,5,12,7,4,8,6,3,7,5,10,4,6,9,3].map((h,i) => (
          <div key={i} style={{ flex:1, height:`${h*7}%`, borderRadius:1, background:'#3b82f6', opacity:0.7 }} />
        ))}
      </div>
    </div>
    <div style={{ width:'100%', borderRadius:9, background:'rgba(0,0,0,0.3)', border:'1px solid rgba(168,85,247,0.2)', padding:'7px 9px' }}>
      <div style={{ color:'#475569', fontSize:7, marginBottom:3 }}>GYROSCOPE (deg/s)</div>
      <div style={{ display:'flex', alignItems:'flex-end', gap:1, height:20 }}>
        {[5,3,7,2,9,4,6,8,3,5,7,2,6,4,8,3,5,7].map((h,i) => (
          <div key={i} style={{ flex:1, height:`${h*10}%`, borderRadius:1, background:'#a855f7', opacity:0.7 }} />
        ))}
      </div>
    </div>
    <div style={{ color:'#334155', fontSize:7 }}>Buffering for ML inference...</div>
  </div>
);

const ScreenTriggers = () => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:9, padding:'0 12px', width:'100%' }}>
    <div style={{ color:'#f59e0b', fontWeight:800, fontSize:9, letterSpacing:'0.18em' }}>TRIGGER ENGINE</div>
    <div style={{ width:'100%', borderRadius:9, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.4)', padding:'7px 9px' }}>
      <div style={{ color:'#ef4444', fontSize:8, fontWeight:800, marginBottom:3 }}>EVENT DETECTED</div>
      <div style={{ color:'#fca5a5', fontSize:7 }}>BUTTON_LONG_PRESS · 3120ms</div>
    </div>
    {[
      { label:'Manual SOS',        icon:'SOS', active:true  },
      { label:'ML Anomaly > 0.85', icon:'ML',  active:false },
      { label:'RSSI below -90dBm', icon:'BLE', active:false },
      { label:'Shake Detect',      icon:'ACL', active:false },
    ].map(t => (
      <div key={t.label} style={{ width:'100%', display:'flex', alignItems:'center', gap:5, borderRadius:6, padding:'4px 7px', background: t.active ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.03)', border:`1px solid ${t.active ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
        <span style={{ fontSize:7, background:'rgba(255,255,255,0.08)', borderRadius:3, padding:'1px 4px', color:'#94a3b8' }}>{t.icon}</span>
        <span style={{ color: t.active ? '#fca5a5' : '#475569', fontSize:7, fontWeight: t.active ? 700 : 400 }}>{t.label}</span>
        {t.active && <div style={{ marginLeft:'auto', width:4, height:4, borderRadius:'50%', background:'#ef4444' }} />}
      </div>
    ))}
  </div>
);

const ScreenActions = () => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'0 12px', width:'100%' }}>
    <div style={{ color:C.crimson, fontWeight:800, fontSize:9, letterSpacing:'0.18em' }}>APP ACTIONS</div>
    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
      <div style={{ width:5, height:5, borderRadius:'50%', background:'#22c55e' }} />
      <span style={{ color:'#22c55e', fontSize:8, fontWeight:700 }}>GPS LOCK · Accuracy 3m</span>
    </div>
    <div style={{ width:'100%', borderRadius:9, background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.08)', padding:'7px 9px', fontFamily:'monospace' }}>
      <div style={{ color:'#64748b', fontSize:6, marginBottom:3 }}>PAYLOAD JSON</div>
      <div style={{ color:'#86efac', fontSize:7, lineHeight:1.9 }}>
        {'{'}<br/>
        &nbsp;&nbsp;"user": "u_9k3m",<br/>
        &nbsp;&nbsp;"gps": "22.57,88.36",<br/>
        &nbsp;&nbsp;"trigger": "LONG_PRESS",<br/>
        &nbsp;&nbsp;"ts": "2026-03-06T22:14"<br/>
        {'}'}
      </div>
    </div>
    <div style={{ color:C.crimson, fontSize:8, fontWeight:700 }}>POST /api/alert to Flask</div>
  </div>
);

const ScreenBackend = () => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'0 12px', width:'100%' }}>
    <div style={{ color:'#a78bfa', fontWeight:800, fontSize:9, letterSpacing:'0.18em' }}>ML ENGINE</div>
    <div style={{ color:'#94a3b8', fontSize:8 }}>Random Forest · model.pkl</div>
    <div style={{ width:'100%', borderRadius:9, background:'rgba(0,0,0,0.3)', border:'1px solid rgba(167,139,250,0.2)', padding:'7px 9px' }}>
      <div style={{ color:'#475569', fontSize:7, marginBottom:3 }}>FEATURE EXTRACTION</div>
      {['mean_accel: 2.847', 'std_accel:  1.203', 'var_gyro:  0.761'].map(f => (
        <div key={f} style={{ color:'#94a3b8', fontSize:7, fontFamily:'monospace', lineHeight:1.8 }}>{f}</div>
      ))}
    </div>
    <div style={{ width:'100%', borderRadius:9, background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.4)', padding:'7px 9px' }}>
      <div style={{ color:'#ef4444', fontSize:8, fontWeight:800, marginBottom:2 }}>CLASS: DANGER</div>
      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
        <div style={{ flex:1, height:4, borderRadius:2, background:'rgba(255,255,255,0.1)', overflow:'hidden' }}>
          <div style={{ width:'96%', height:'100%', background:'#ef4444', borderRadius:2 }} />
        </div>
        <span style={{ color:'#fca5a5', fontSize:8, fontWeight:700 }}>0.96</span>
      </div>
    </div>
  </div>
);

const ScreenAlerting = () => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:9, padding:'0 12px', width:'100%' }}>
    <div style={{ color:C.crimson, fontWeight:800, fontSize:9, letterSpacing:'0.18em' }}>ALERT DISPATCH</div>
    {[
      { name:'Mom',          phone:'+91 98765xxxxx', status:'DELIVERED', color:'#22c55e' },
      { name:'Sister Priya', phone:'+91 98123xxxxx', status:'DELIVERED', color:'#22c55e' },
      { name:'Neha',         phone:'+91 99871xxxxx', status:'SENDING',   color:'#f59e0b' },
    ].map(c => (
      <div key={c.name} style={{ width:'100%', borderRadius:7, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', padding:'5px 7px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ color:'white', fontSize:8, fontWeight:700 }}>{c.name}</div>
            <div style={{ color:'#475569', fontSize:7 }}>{c.phone}</div>
          </div>
          <div style={{ color:c.color, fontSize:7, fontWeight:800 }}>{c.status}</div>
        </div>
      </div>
    ))}
    <div style={{ width:'100%', borderRadius:7, background:'rgba(192,57,43,0.1)', border:'1px solid rgba(192,57,43,0.3)', padding:'5px 9px', textAlign:'center' }}>
      <div style={{ color:C.crimson, fontSize:8, fontWeight:700 }}>Maps link included</div>
      <div style={{ color:'#64748b', fontSize:7 }}>via Twilio SMS + WhatsApp</div>
    </div>
  </div>
);

const ScreenFeedback = () => {
  const circ = 2 * Math.PI * 42;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'0 12px', width:'100%' }}>
      <div style={{ color:C.crimson, fontWeight:800, fontSize:9, letterSpacing:'0.18em' }}>ASFALIS</div>
      <div style={{ color:'#475569', fontSize:8, letterSpacing:'0.1em' }}>ALERT ACTIVE</div>
      <div style={{ position:'relative', width:86, height:86 }}>
        <svg style={{ width:'100%', height:'100%', transform:'rotate(-90deg)' }} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="7" />
          <circle cx="50" cy="50" r="42" fill="none" stroke={C.crimson} strokeWidth="7"
            strokeLinecap="round" strokeDasharray={circ} className="sos-ring-animated" />
        </svg>
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <span style={{ color:'white', fontWeight:900, fontSize:28, lineHeight:1 }}>10</span>
          <span style={{ color:'#475569', fontSize:7 }}>SECONDS</span>
        </div>
      </div>
      <div style={{ color:C.crimson, fontWeight:700, fontSize:9, letterSpacing:'0.12em' }}>SOS SENDING</div>
      <div style={{ color:'#64748b', fontSize:7 }}>Help is on the way</div>
      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
        <div style={{ width:4, height:4, borderRadius:'50%', background:'#22c55e' }} />
        <span style={{ color:'#475569', fontSize:7 }}>GPS Active · Location shared</span>
      </div>
    </div>
  );
};

const SCREENS = {
  setup: ScreenSetup, monitor_ble: ScreenBLE, monitor_sensor: ScreenSensor,
  triggers: ScreenTriggers, actions: ScreenActions, backend: ScreenBackend,
  alerting: ScreenAlerting, feedback: ScreenFeedback,
};

// ─────────────────────────────────────────────
// Device Phone Mockup
// ─────────────────────────────────────────────
const DevicePhone = ({ activeStep }) => {
  const Screen = SCREENS[activeStep] || ScreenIdle;
  return (
    <div style={{ position:'relative', width:196, height:390, flexShrink:0 }}>
      <div style={{ position:'absolute', inset:0, borderRadius:'2.1rem', background:C.card, border:'3px solid #374151', boxShadow:'0 24px 56px rgba(0,0,0,0.6), 0 0 0 1px rgba(192,57,43,0.15)' }}>
        <div style={{ position:'absolute', top:9, left:'50%', transform:'translateX(-50%)', width:60, height:15, background:'#000', borderRadius:9, zIndex:20 }} />
        <div style={{ position:'absolute', inset:2, borderRadius:'2rem', overflow:'hidden', background:C.dark }}>
          <div style={{ height:34, display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:'0 14px 4px', background:'rgba(0,0,0,0.4)' }}>
            <span style={{ color:'white', fontSize:8 }}>9:41</span>
            <span style={{ color:'rgba(255,255,255,0.5)', fontSize:8 }}>···</span>
          </div>
          <div style={{ height:'calc(100% - 34px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'8px 0', overflowY:'auto' }}>
            <Screen />
          </div>
        </div>
      </div>
      <div style={{ position:'absolute', bottom:7, left:'50%', transform:'translateX(-50%)', width:56, height:3, borderRadius:2, background:'#374151' }} />
    </div>
  );
};

// ─────────────────────────────────────────────
// Wearable (ESP32 button)
// ─────────────────────────────────────────────
const WearableDevice = ({ active }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
    <div style={{ position:'relative', width:60, height:60, display:'flex', alignItems:'center', justifyContent:'center' }}>
      {active && (
        <>
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'2px solid rgba(192,57,43,0.5)', animation:'ripple-out 1.4s ease-out infinite' }} />
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'2px solid rgba(192,57,43,0.25)', animation:'ripple-out 1.4s ease-out 0.6s infinite' }} />
        </>
      )}
      <div style={{ width:46, height:46, borderRadius:'50%', background:'linear-gradient(135deg,#2C2C2C,#1c1c2e)', border:`2px solid ${active ? C.crimson : '#374151'}`, boxShadow: active ? '0 0 20px rgba(192,57,43,0.4)' : 'none', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.4s' }}>
        <div style={{ width:14, height:14, borderRadius:'50%', background: active ? C.crimson : '#374151', transition:'all 0.4s' }} />
      </div>
    </div>
    <div style={{ color: active ? C.teal : '#64748b', fontSize:8, fontWeight:700, letterSpacing:'0.1em', transition:'color 0.4s' }}>
      {active ? 'CONNECTED' : 'IDLE'}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Flow node metadata
// ─────────────────────────────────────────────
const NODE_ICONS = {
  setup: Smartphone, monitor_ble: Bluetooth, monitor_sensor: Activity,
  triggers: AlertTriangle, actions: MapPin, backend: Cpu, alerting: Bell, feedback: ShieldCheck,
};
const NODE_META = {
  setup:          { label:'Device Setup',    sub:'App install & BLE pairing',           layer:'CLIENT' },
  monitor_ble:    { label:'BLE Monitor',     sub:'RSSI polling · button events',        layer:'CLIENT' },
  monitor_sensor: { label:'Sensor Monitor',  sub:'Accel + Gyro · 50 Hz buffer',         layer:'CLIENT' },
  triggers:       { label:'Trigger Engine',  sub:'SOS · shake · ML anomaly · RSSI',     layer:'APP'    },
  actions:        { label:'App Actions',     sub:'GPS lock · JSON payload · API call',  layer:'APP'    },
  backend:        { label:'Backend / ML',    sub:'Flask · Random Forest inference',     layer:'CLOUD'  },
  alerting:       { label:'Alerting & Log',  sub:'Twilio SMS · DB write · Push notify', layer:'CLOUD'  },
  feedback:       { label:'Feedback Loop',   sub:'Socket.io → SOS UI · Maps link',      layer:'CLIENT' },
};
const NODE_DETAILS = {
  setup:          ['User installs the Android app','Scans QR or BLE discovery to find bracelet','Pairs via BLE Service UUID handshake','OTP-verified phone number registration'],
  monitor_ble:    ['Subscribes to GATT BLE Notifications','Polls RSSI signal strength every 1000ms','Listens for LONG_PRESS & DOUBLE_PRESS characteristics','Triggers distance alert if RSSI drops below -90 dBm'],
  monitor_sensor: ['Reads phone Accelerometer + Gyroscope at 50 Hz','Buffers 2-second rolling window of raw data','Passes buffer to on-device ML pre-filter','Streams clean data to backend on anomaly flag'],
  triggers:       ['Manual SOS: capacitive touch event','Bracelet Long-Press: >3000ms duration','Bracelet Triple-Press: cancel in-flight SOS','ML Anomaly: model confidence score above 0.85','Distance loss: RSSI drops below -90 dBm'],
  actions:        ['Acquires GPS coordinates (accuracy 3m)','Constructs signed JSON payload with timestamp','POST to /api/alert on Flask backend via HTTPS','Triggers local haptic and screen alert'],
  backend:        ['Flask endpoint receives and validates JWT','Loads Random Forest model (model.pkl)','Extracts mean, std, variance from sensor buffer','Policy engine maps score to DANGER or SAFE class'],
  alerting:       ['Twilio API dispatches SMS to all verified contacts','WhatsApp message with Google Maps deep link','PostgreSQL event record with full context','Push notification to nearby registered responders'],
  feedback:       ['Socket.io emits DANGER event to open app sessions','App UI transitions to full-screen SOS countdown','10-second cancellation window shown to user','Contacts receive live WebSocket location stream'],
};
const LAYER_COLORS = { CLIENT:C.teal, APP:'#f59e0b', CLOUD:'#a78bfa' };

// ─────────────────────────────────────────────
// FlowNode  — dark section theme
// ─────────────────────────────────────────────
const FlowNode = ({ id, isActive, isInPath, isNext, onClick }) => {
  const Icon = NODE_ICONS[id];
  const meta = NODE_META[id];
  const layerColor = LAYER_COLORS[meta.layer];
  return (
    <button
      onClick={() => onClick(id)}
      style={{
        display:'flex', alignItems:'center', gap:13,
        width:'100%', padding:'12px 16px', borderRadius:13,
        background: isActive ? 'rgba(192,57,43,0.12)' : isInPath ? 'rgba(26,107,107,0.08)' : isNext ? 'rgba(245,158,11,0.07)' : 'rgba(255,255,255,0.04)',
        border:`1.5px solid ${isActive ? C.crimson : isInPath ? C.teal : isNext ? '#f59e0b' : 'rgba(255,255,255,0.09)'}`,
        boxShadow: isActive ? '0 0 24px rgba(192,57,43,0.18)' : 'none',
        cursor:'pointer', transition:'all 0.3s', textAlign:'left', position:'relative',
      }}
    >
      <div style={{ width:38, height:38, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background: isActive ? 'rgba(192,57,43,0.2)' : isInPath ? 'rgba(26,107,107,0.2)' : 'rgba(255,255,255,0.05)', color: isActive ? C.crimson : isInPath ? C.teal : '#475569', transition:'all 0.3s' }}>
        <Icon size={17} />
      </div>
      <div style={{ flex:1 }}>
        <div style={{ color: isActive ? 'white' : '#cbd5e1', fontWeight:700, fontSize:13 }}>{meta.label}</div>
        <div style={{ color:'#475569', fontSize:10, marginTop:2 }}>{meta.sub}</div>
      </div>
      <div style={{ fontSize:8, fontWeight:800, letterSpacing:'0.12em', color:layerColor, background:`${layerColor}18`, borderRadius:6, padding:'3px 7px', flexShrink:0 }}>
        {meta.layer}
      </div>
      {isActive && (
        <div style={{ position:'absolute', right:-5, top:'50%', transform:'translateY(-50%)', width:10, height:10, borderRadius:'50%', background:C.crimson, border:`2px solid ${C.charcoal}` }} />
      )}
    </button>
  );
};

// dark-section arrow
const FlowArrow = ({ active }) => (
  <div style={{ display:'flex', justifyContent:'center', padding:'2px 0' }}>
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
      <div style={{ width:2, height:16, borderRadius:1, background: active ? C.crimson : 'rgba(255,255,255,0.09)', transition:'background 0.4s' }} />
      <div style={{ width:0, height:0, borderLeft:'5px solid transparent', borderRight:'5px solid transparent', borderTop:`7px solid ${active ? C.crimson : 'rgba(255,255,255,0.09)'}`, transition:'border-top-color 0.4s' }} />
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Tech stack pills
// ─────────────────────────────────────────────
const STACK = [
  { name:'Android (Kotlin)', color:'#a4c639' },
  { name:'Flask / Python',   color:'#f59e0b' },
  { name:'Random Forest',    color:'#a78bfa' },
  { name:'Twilio',           color:'#ef4444' },
  { name:'WebSocket',        color:'#22c55e' },
  { name:'BLE (ESP32)',      color:C.teal    },
  { name:'JWT Auth',         color:'#60a5fa' },
  { name:'Google Maps',      color:C.crimson },
];

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────
export default function ArchitecturePage() {
  const [activeStep,      setActiveStep]      = useState(null);
  const [activePath,      setActivePath]      = useState([]);
  const [highlightedNext, setHighlightedNext] = useState([]);
  const [isSimulating,    setIsSimulating]    = useState(false);
  const [isLooping,       setIsLooping]       = useState(false);
  const [loopVariant,     setLoopVariant]     = useState(0);
  const [loopStep,        setLoopStep]        = useState(0);
  const [simLabel,        setSimLabel]        = useState('');

  const connections = {
    setup: ['monitor_ble','monitor_sensor'],
    monitor_ble: ['triggers'], monitor_sensor: ['triggers'],
    triggers: ['actions'], actions: ['backend'],
    backend: ['alerting'], alerting: ['feedback'], feedback: [],
  };

  useEffect(() => {
    if (!isLooping) return;
    const path = loopVariant === 0 ? PATH_A : PATH_B;
    const run = () => {
      if (loopStep < path.length) {
        const id = path[loopStep];
        setActiveStep(id);
        setActivePath(prev => loopStep === 0 ? [id] : [...prev, id]);
        setLoopStep(s => s + 1);
      } else {
        setLoopVariant(v => v === 0 ? 1 : 0);
        setLoopStep(0);
        setActivePath([]);
      }
    };
    const timer = setTimeout(run, loopStep === 0 ? 0 : 1800);
    return () => clearTimeout(timer);
  }, [isLooping, loopStep, loopVariant]);

  const stopAll = () => {
    setIsLooping(false); setIsSimulating(false);
    setActiveStep(null); setActivePath([]);
    setHighlightedNext([]); setSimLabel('');
  };

  const toggleLoop = () => {
    if (isLooping) { stopAll(); }
    else { stopAll(); setIsLooping(true); setLoopStep(0); setLoopVariant(0); setSimLabel('Auto monitoring loop'); }
  };

  const handleNodeClick = (id) => {
    if (isSimulating) return;
    if (isLooping) setIsLooping(false);
    setActiveStep(id);
    setActivePath([]);
    setHighlightedNext(connections[id] || []);
    setSimLabel(NODE_META[id].label);
  };

  const runSimulation = async (scenario) => {
    stopAll();
    await new Promise(r => setTimeout(r, 60));
    setIsSimulating(true);
    setSimLabel(scenario.name);
    const steps = ['setup', scenario.connected ? 'monitor_ble' : 'monitor_sensor', 'triggers', 'actions', 'backend', 'alerting', 'feedback'];
    const path = [];
    for (let i = 0; i < steps.length; i++) {
      const nodeId = steps[i];
      setActiveStep(nodeId);
      path.push(nodeId);
      setActivePath([...path]);
      if (i < steps.length - 1) await new Promise(r => setTimeout(r, i === 0 ? 600 : 950));
    }
    setIsSimulating(false);
  };

  const bleActive = activePath.includes('monitor_ble') || activeStep === 'setup' || activeStep === 'monitor_ble';

  return (
    <div style={{ minHeight:'100vh', background:C.ivory, color:C.charcoal, fontFamily:'Inter, sans-serif' }}>

      {/* ── NAV  ·  LIGHT ivory — matches landing page ───────── */}
      <nav style={{ position:'sticky', top:0, zIndex:50, background:'rgba(250,249,246,0.95)', backdropFilter:'blur(18px)', borderBottom:'1px solid rgba(0,0,0,0.07)', padding:'0 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:22 }}>
            <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
              <img src="/asfalis-icon.png" alt="Asfalis" style={{ width:33, height:33, borderRadius:9 }} />
              <span style={{ color:C.crimson, fontWeight:900, fontSize:17, letterSpacing:'0.2em' }}>ASFALIS</span>
            </Link>
            <div style={{ width:1, height:22, background:'rgba(0,0,0,0.1)' }} />
            <span style={{ color:'#94a3b8', fontSize:13, fontWeight:600 }}>IoT Architecture</span>
          </div>
          <Link
            to="/"
            style={{ display:'flex', alignItems:'center', gap:6, color:'#64748b', fontSize:13, fontWeight:600, textDecoration:'none', padding:'7px 16px', borderRadius:8, border:'1px solid rgba(0,0,0,0.08)', background:'rgba(0,0,0,0.03)', transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = C.charcoal; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; }}
          >
            ← Home
          </Link>
        </div>
      </nav>

      {/* ── HERO  ·  DARK — like landing's ProblemSection ─────── */}
      <div style={{ background:C.charcoal, padding:'48px 24px 40px', borderBottom:`3px solid ${C.crimson}` }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:C.crimson, animation:'pulse 1.5s infinite' }} />
            <span style={{ color:C.crimson, fontSize:11, fontWeight:800, letterSpacing:'0.25em' }}>LIVE SIMULATION</span>
          </div>
          <h1 style={{ color:'white', fontWeight:800, fontSize:'clamp(1.4rem,3vw,2.1rem)', marginBottom:10, lineHeight:1.25 }}>
            Wearable BLE → Android App → ML Cloud → SOS
          </h1>
          <p style={{ color:'#94a3b8', fontSize:14, maxWidth:560, lineHeight:1.75 }}>
            Interactive end-to-end flow of how Asfalis detects danger and dispatches alerts in under 10 seconds. Click any node or trigger a scenario.
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginTop:22 }}>
            {STACK.map(s => (
              <div key={s.name} style={{ padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:700, background:`${s.color}18`, border:`1px solid ${s.color}40`, color:s.color }}>
                {s.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTROLS  ·  LIGHT ivory ──────────────────────────── */}
      <div style={{ background:C.ivory, borderBottom:'1px solid rgba(0,0,0,0.07)', padding:'20px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', gap:9, flexWrap:'wrap', alignItems:'center' }}>
            <button
              onClick={toggleLoop}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:10, fontSize:13, fontWeight:700, background: isLooping ? 'rgba(245,158,11,0.1)' : '#fff', border:`1.5px solid ${isLooping ? '#f59e0b' : 'rgba(0,0,0,0.1)'}`, color: isLooping ? '#d97706' : '#64748b', cursor:'pointer', boxShadow:'0 1px 4px rgba(0,0,0,0.05)', transition:'all 0.2s' }}
            >
              {isLooping ? <Pause size={14}/> : <Play size={14}/>}
              {isLooping ? 'Pause Loop' : 'Auto Loop'}
            </button>
            <button
              disabled={isSimulating}
              onClick={() => runSimulation({ name:'SOS Button Press', connected:true })}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:10, fontSize:13, fontWeight:700, background:'rgba(192,57,43,0.07)', border:'1.5px solid rgba(192,57,43,0.25)', color:C.crimson, cursor: isSimulating ? 'not-allowed' : 'pointer', opacity: isSimulating ? 0.5 : 1, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}
            >
              <Zap size={14}/> Trigger SOS
            </button>
            <button
              disabled={isSimulating}
              onClick={() => runSimulation({ name:'ML Anomaly Detected', connected:false })}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:10, fontSize:13, fontWeight:700, background:'rgba(167,139,250,0.08)', border:'1.5px solid rgba(167,139,250,0.3)', color:'#7c3aed', cursor: isSimulating ? 'not-allowed' : 'pointer', opacity: isSimulating ? 0.5 : 1, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}
            >
              <Activity size={14}/> ML Anomaly
            </button>
            {(activeStep || isSimulating) && (
              <button
                onClick={stopAll}
                style={{ padding:'9px 18px', borderRadius:10, fontSize:13, fontWeight:700, background:'#fff', border:'1.5px solid rgba(0,0,0,0.1)', color:'#94a3b8', cursor:'pointer', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}
              >
                Reset
              </button>
            )}

            {simLabel && (
              <div style={{ display:'flex', alignItems:'center', gap:7, marginLeft:8 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:C.crimson, animation:(isSimulating||isLooping)?'pulse 1s infinite':'none' }} />
                <span style={{ color:'#64748b', fontSize:13, fontWeight:500 }}>{simLabel}</span>
              </div>
            )}

            {isLooping && (
              <div style={{ display:'flex', gap:7, marginLeft:4 }}>
                <div style={{ padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:700, background: loopVariant===0 ? 'rgba(26,107,107,0.1)' : 'rgba(0,0,0,0.04)', border:`1px solid ${loopVariant===0 ? C.teal : 'rgba(0,0,0,0.08)'}`, color: loopVariant===0 ? C.teal : '#94a3b8' }}>Path A · BLE</div>
                <div style={{ padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:700, background: loopVariant===1 ? 'rgba(96,165,250,0.1)' : 'rgba(0,0,0,0.04)', border:`1px solid ${loopVariant===1 ? '#60a5fa' : 'rgba(0,0,0,0.08)'}`, color: loopVariant===1 ? '#2563eb' : '#94a3b8' }}>Path B · Sensor</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SIMULATION GRID  ·  DARK — like landing's StatisticsSection ── */}
      <div style={{ background:C.charcoal, padding:'36px 24px 52px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'start' }}>

          {/* LEFT — Flow diagram */}
          <div>
            {/* Node flow */}
            <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
              <FlowNode id="setup"          isActive={activeStep==='setup'}          isInPath={activePath.includes('setup')}          isNext={highlightedNext.includes('setup')}          onClick={handleNodeClick} />
              <FlowArrow active={activePath.includes('monitor_ble')||activePath.includes('monitor_sensor')} />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:9 }}>
                <FlowNode id="monitor_ble"    isActive={activeStep==='monitor_ble'}    isInPath={activePath.includes('monitor_ble')}    isNext={highlightedNext.includes('monitor_ble')}    onClick={handleNodeClick} />
                <FlowNode id="monitor_sensor" isActive={activeStep==='monitor_sensor'} isInPath={activePath.includes('monitor_sensor')} isNext={highlightedNext.includes('monitor_sensor')} onClick={handleNodeClick} />
              </div>
              <FlowArrow active={activePath.includes('triggers')} />
              <FlowNode id="triggers"       isActive={activeStep==='triggers'}       isInPath={activePath.includes('triggers')}       isNext={highlightedNext.includes('triggers')}       onClick={handleNodeClick} />
              <FlowArrow active={activePath.includes('actions')} />
              <FlowNode id="actions"        isActive={activeStep==='actions'}        isInPath={activePath.includes('actions')}        isNext={highlightedNext.includes('actions')}        onClick={handleNodeClick} />
              <FlowArrow active={activePath.includes('backend')} />
              <FlowNode id="backend"        isActive={activeStep==='backend'}        isInPath={activePath.includes('backend')}        isNext={highlightedNext.includes('backend')}        onClick={handleNodeClick} />
              <FlowArrow active={activePath.includes('alerting')} />
              <FlowNode id="alerting"       isActive={activeStep==='alerting'}       isInPath={activePath.includes('alerting')}       isNext={highlightedNext.includes('alerting')}       onClick={handleNodeClick} />
              <FlowArrow active={activePath.includes('feedback')} />
              <FlowNode id="feedback"       isActive={activeStep==='feedback'}       isInPath={activePath.includes('feedback')}       isNext={highlightedNext.includes('feedback')}       onClick={handleNodeClick} />
            </div>

            {/* Legend */}
            <div style={{ marginTop:20, display:'flex', gap:20, flexWrap:'wrap' }}>
              {[
                { color:C.crimson, label:'Active step' },
                { color:C.teal,    label:'Completed path' },
                { color:'#f59e0b', label:'Next suggested' },
              ].map(l => (
                <div key={l.label} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:7, height:7, borderRadius:'50%', background:l.color }} />
                  <span style={{ color:'#64748b', fontSize:11 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Device simulation */}
          <div style={{ display:'flex', flexDirection:'column', gap:20, position:'sticky', top:80 }}>

            {/* Wearable + Phone */}
            <div style={{ borderRadius:20, background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.07)', padding:'28px 20px', display:'flex', alignItems:'center', justifyContent:'center', gap:28 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                <WearableDevice active={bleActive} />
                <div style={{ textAlign:'center' }}>
                  <div style={{ color:'#cbd5e1', fontSize:11, fontWeight:700 }}>ESP32 Wearable</div>
                  <div style={{ color:'#475569', fontSize:10 }}>Bluetooth SOS button</div>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div style={{ width:36, height:1, background: bleActive ? `linear-gradient(to right,${C.teal},${C.crimson})` : 'rgba(255,255,255,0.08)', transition:'background 0.5s' }} />
                <div style={{ fontSize:8, color: bleActive ? C.teal : '#334155', fontWeight:700, letterSpacing:'0.1em', transition:'color 0.5s' }}>BLE</div>
              </div>
              <DevicePhone activeStep={activeStep} />
            </div>

            {/* Step details */}
            <div style={{ borderRadius:20, background:'rgba(0,0,0,0.28)', border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden' }}>
              <div style={{ padding:'13px 18px', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(0,0,0,0.15)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ color:'#94a3b8', fontSize:12, fontWeight:700 }}>Step Details</span>
                {activeStep && (
                  <span style={{ color:C.crimson, fontSize:10, fontWeight:800, letterSpacing:'0.12em', background:'rgba(192,57,43,0.12)', borderRadius:6, padding:'3px 9px', border:'1px solid rgba(192,57,43,0.25)' }}>
                    {NODE_META[activeStep].layer}
                  </span>
                )}
              </div>
              <div style={{ padding:'18px' }}>
                {activeStep ? (
                  <>
                    <div style={{ display:'flex', alignItems:'center', gap:11, marginBottom:14 }}>
                      <div style={{ width:42, height:42, borderRadius:11, background:'rgba(192,57,43,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:C.crimson }}>
                        {React.createElement(NODE_ICONS[activeStep], { size:20 })}
                      </div>
                      <div>
                        <div style={{ color:'white', fontWeight:700, fontSize:14 }}>{NODE_META[activeStep].label}</div>
                        <div style={{ color:'#475569', fontSize:11, marginTop:2 }}>{NODE_META[activeStep].sub}</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {(NODE_DETAILS[activeStep] || []).map((d, i) => (
                        <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                          <div style={{ width:4, height:4, borderRadius:'50%', background:C.crimson, marginTop:5, flexShrink:0 }} />
                          <span style={{ color:'#94a3b8', fontSize:12, lineHeight:1.6 }}>{d}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign:'center', padding:'22px 0' }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.04)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                      <Smartphone size={18} color="#475569" />
                    </div>
                    <div style={{ color:'#334155', fontSize:13, lineHeight:1.6 }}>
                      Click a step or trigger a scenario<br/>to see the device simulation
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cloud services */}
            <div style={{ borderRadius:16, background:'rgba(0,0,0,0.2)', border:'1px solid rgba(255,255,255,0.06)', padding:'15px 18px' }}>
              <div style={{ color:'#475569', fontSize:10, fontWeight:800, letterSpacing:'0.15em', marginBottom:11 }}>CLOUD SERVICES</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:9 }}>
                {[
                  { name:'Twilio',     desc:'SMS · WhatsApp',  icon:'MSG', active: activeStep==='alerting' },
                  { name:'Flask API',  desc:'REST endpoint',   icon:'PY',  active: activeStep==='backend'  },
                  { name:'PostgreSQL', desc:'Event logging',   icon:'DB',  active: activeStep==='alerting' },
                  { name:'Socket.io',  desc:'Real-time sync',  icon:'WS',  active: activeStep==='feedback' },
                ].map(s => (
                  <div key={s.name} style={{ borderRadius:10, padding:'9px 11px', background: s.active ? 'rgba(192,57,43,0.1)' : 'rgba(255,255,255,0.03)', border:`1px solid ${s.active ? 'rgba(192,57,43,0.3)' : 'rgba(255,255,255,0.06)'}`, transition:'all 0.4s' }}>
                    <div style={{ fontSize:10, fontWeight:800, color: s.active ? C.crimson : '#475569', background:'rgba(255,255,255,0.06)', borderRadius:4, padding:'2px 6px', display:'inline-block', marginBottom:5, letterSpacing:'0.05em' }}>{s.icon}</div>
                    <div style={{ color: s.active ? 'white' : '#94a3b8', fontSize:11, fontWeight:700, transition:'color 0.4s' }}>{s.name}</div>
                    <div style={{ color:'#334155', fontSize:10 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── FOOTER  ·  DARK — matches landing page footer ─────── */}
      <footer style={{ background:C.charcoal, borderTop:'1px solid rgba(192,57,43,0.18)', padding:'28px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            <img src="/asfalis-icon.png" alt="Asfalis" style={{ width:26, height:26, borderRadius:7 }} />
            <span style={{ color:C.crimson, fontWeight:900, fontSize:13, letterSpacing:'0.2em' }}>ASFALIS</span>
            <span style={{ color:'#475569', fontSize:12 }}>· IoT Architecture Simulation</span>
          </div>
          <Link
            to="/"
            style={{ color:'#64748b', fontSize:12, textDecoration:'none', fontWeight:500 }}
            onMouseEnter={e => { e.currentTarget.style.color = C.crimson; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; }}
          >
            Back to Landing Page
          </Link>
        </div>
      </footer>

    </div>
  );
}
