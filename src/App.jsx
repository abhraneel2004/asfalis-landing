import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Smartphone, 
  Watch, 
  Server, 
  Siren, 
  MessageCircle, 
  AlertTriangle, 
  Bluetooth, 
  Play,
  Pause,
  Terminal,
  Info,
  Trash2,
  RefreshCw,
  Zap
} from 'lucide-react';

// --- Components ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Node = ({ id, title, icon: Icon, type, isActive, ispath, isNext, onClick, children }) => {
  return (
    <div 
      onClick={() => onClick(id)}
      className={`
        relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group
        w-full md:w-64 z-10
        ${isActive 
          ? 'bg-blue-50 border-blue-500 shadow-lg scale-105 ring-2 ring-blue-200' 
          : isNext
            ? 'bg-green-50 border-green-500 shadow-md scale-102 ring-2 ring-green-200'
            : ispath 
              ? 'bg-slate-50 border-slate-400 opacity-100' 
              : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
        }
      `}
    >
      <div className={`
        p-3 rounded-full mb-3 transition-colors
        ${isActive ? 'bg-blue-100 text-blue-600' : isNext ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500'}
      `}>
        <Icon size={24} />
      </div>
      <h3 className="font-bold text-slate-800 text-center mb-1">{title}</h3>
      <div className="text-xs text-slate-500 text-center">{children}</div>
      
      {/* Connector Dot */}
      <div className={`absolute -bottom-3 w-4 h-4 rounded-full border-2 bg-white z-20 
        ${isActive ? 'border-blue-500' : isNext ? 'border-green-500' : 'border-slate-300'}`} 
      />
    </div>
  );
};

const Arrow = ({ height = "h-12", active }) => (
  <div className={`flex justify-center items-center w-full ${height} -my-1`}>
    <div className={`w-0.5 h-full transition-colors duration-500 ${active ? 'bg-blue-400' : 'bg-slate-300'}`}></div>
  </div>
);

const LogLine = ({ log }) => (
  <div className="font-mono text-xs mb-1 border-l-2 border-green-500 pl-2 py-1 bg-slate-900 text-green-400">
    <span className="text-slate-500">[{log.time}]</span> <span className="text-yellow-400">{log.source}:</span> {log.message}
  </div>
);

// --- Constants ---

const PATH_A = ['setup', 'monitor_ble', 'triggers', 'actions', 'backend', 'alerting', 'feedback'];
const PATH_B = ['setup', 'monitor_sensor', 'triggers', 'actions', 'backend', 'alerting', 'feedback'];

// --- Main Application ---

export default function App() {
  const [activeStep, setActiveStep] = useState(null);
  const [activePath, setActivePath] = useState([]); 
  const [highlightedNext, setHighlightedNext] = useState([]); 
  const [logs, setLogs] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Auto Loop States
  const [isLooping, setIsLooping] = useState(false);
  const [loopVariant, setLoopVariant] = useState(0); // 0 = Path A (BLE), 1 = Path B (Sensor)
  const [loopStep, setLoopStep] = useState(0);

  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  // --- Auto Animation Effect ---
  useEffect(() => {
    let timer;
    if (isLooping) {
      // Execute immediately on first step if starting, or wait for interval
      const runLoopStep = () => {
        const currentPath = loopVariant === 0 ? PATH_A : PATH_B;

        if (loopStep < currentPath.length) {
          const nodeId = currentPath[loopStep];
          
          // Update Selection & Visuals ONLY - No Logging
          setActiveStep(nodeId);
          setSelectedNode(nodeId);
          setActivePath(prev => loopStep === 0 ? [nodeId] : [...prev, nodeId]);
          
          setLoopStep(prev => prev + 1);
        } else {
          // Path Complete - Switch Variant and Reset
          const nextVariant = loopVariant === 0 ? 1 : 0;
          setLoopVariant(nextVariant);
          setLoopStep(0);
          
          // Visual reset logic
          // setActiveStep(null);
          // setActivePath([]);
        }
      };

      // Faster interval for visual loop (2s)
      if (loopStep === 0 && activePath.length === 0) {
         runLoopStep();
         timer = setInterval(runLoopStep, 2000); 
      } else {
         timer = setInterval(runLoopStep, 2000);
      }
    }
    return () => clearInterval(timer);
  }, [isLooping, loopStep, loopVariant]);


  // --- Data & Logic ---

  const connections = {
    setup: ['monitor_ble', 'monitor_sensor'],
    monitor_ble: ['triggers'],
    monitor_sensor: ['triggers'],
    triggers: ['actions'],
    actions: ['backend'],
    backend: ['alerting'],
    alerting: ['feedback'],
    feedback: []
  };

  const workflowData = {
    setup: {
      id: 'setup',
      title: '1. Device Setup',
      icon: Smartphone,
      details: [
        'User installs mobile app',
        'Scans QR code or BLE discovery',
        'Pairs Safety Bracelet (BLE Service UUID match)'
      ]
    },
    monitor_ble: {
      id: 'monitor_ble',
      title: '2a. Connected Monitor',
      icon: Bluetooth,
      details: [
        'Subscribes to BLE Notifications',
        'Reads RSSI every 1000ms',
        'Listens for Button characteristic values'
      ]
    },
    monitor_sensor: {
      id: 'monitor_sensor',
      title: '2b. Sensor Monitor',
      icon: Activity,
      details: [
        'Access phone Accelerometer & Gyroscope',
        'Stream raw data at 50Hz',
        'Buffer data for ML inference'
      ]
    },
    triggers: {
      id: 'triggers',
      title: '3. Triggers / Detection',
      icon: AlertTriangle,
      details: [
        'Manual SOS: Touch event',
        'Bracelet Long-Press: >3000ms',
        'Bracelet Triple-Press: Cancel event',
        'ML Anomaly: Model confidence > 0.85',
        'Distance: RSSI < -90dBm'
      ]
    },
    actions: {
      id: 'actions',
      title: '4. App Actions',
      icon: Smartphone,
      details: [
        'Get GPS Geolocation',
        'Construct Payload JSON',
        'POST /api/alert to Backend',
        'Handle local vibration feedback'
      ]
    },
    backend: {
      id: 'backend',
      title: '5. Backend Processing',
      icon: Server,
      details: [
        'Flask API Endpoint reception',
        'Load pickle model (model.pkl)',
        'Feature extraction (mean, std, var)',
        'Policy Engine Check'
      ]
    },
    alerting: {
      id: 'alerting',
      title: '6. Alerting & Logging',
      icon: Siren,
      details: [
        'Twilio API: Send SMS/WhatsApp',
        'Database: Insert Event Record',
        'Push Notification to nearby responders'
      ]
    },
    feedback: {
      id: 'feedback',
      title: '7. Feedback Loop',
      icon: MessageCircle,
      details: [
        'Socket.io emit to Frontend',
        'Update UI state to "DANGER"',
        'Show Countdown timer to User',
        'Contacts receive Google Maps link'
      ]
    }
  };

  const addLog = (source, message) => {
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { time, source, message }]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const stopAll = () => {
    setIsLooping(false);
    setIsSimulating(false);
    setActiveStep(null);
    setActivePath([]);
    setHighlightedNext([]);
  };

  const toggleAutoLoop = () => {
    if (isLooping) {
      setIsLooping(false);
      // Optional: Add a log when paused
      // addLog('SYSTEM', 'Auto Visual Loop Paused.');
    } else {
      stopAll(); 
      setIsLooping(true);
      setLoopStep(0);
      setLoopVariant(0);
      // Log only on start
      addLog('SYSTEM', 'Visual Monitoring Loop Started (Logs Silent)...');
    }
  };

  const handleNodeClick = (id) => {
    if (isLooping) {
        setIsLooping(false);
        addLog('SYSTEM', 'Auto Loop Paused by User Interaction.');
    }
    if (isSimulating) return;
    
    setSelectedNode(id);
    setActiveStep(id);
    setActivePath([]);
    const nextSteps = connections[id] || [];
    setHighlightedNext(nextSteps);
  };

  const runSimulation = async (scenario) => {
    // 1. Stop the visual loop to take control
    if (isSimulating || isLooping) stopAll();
    
    setIsSimulating(true);
    // setLogs([]); // Optional: keep previous logs or clear? Let's keep them for context
    setActivePath([]);
    setHighlightedNext([]); 

    addLog('SYSTEM', `>>> TRIGGER ACTIVATED: ${scenario.name} <<<`);

    // Step 1: Setup
    setActiveStep('setup');
    setActivePath(['setup']);
    await new Promise(r => setTimeout(r, 600));

    // Step 2: Monitoring (Branching)
    let monitorStep = scenario.connected ? 'monitor_ble' : 'monitor_sensor';
    setActiveStep(monitorStep);
    setActivePath(prev => [...prev, monitorStep]);
    addLog('APP', scenario.connected ? 'Bracelet Connected. RSSI: -45dBm' : 'Bracelet Disconnected. Using Phone Sensors.');
    await new Promise(r => setTimeout(r, 800));

    // Step 3: Trigger
    setActiveStep('triggers');
    setActivePath(prev => [...prev, 'triggers']);
    addLog('TRIGGER', `Event Detected: ${scenario.trigger}`);
    await new Promise(r => setTimeout(r, 800));

    if (scenario.type === 'cancel') {
        addLog('APP', 'Cancellation Request Processed. Aborting.');
        setActiveStep(null);
        setIsSimulating(false);
        return;
    }

    // Step 4: Actions
    setActiveStep('actions');
    setActivePath(prev => [...prev, 'actions']);
    addLog('APP', `Building Payload: { user: "u123", gps: "40.71,-74.00", trigger: "${scenario.trigger}" }`);
    await new Promise(r => setTimeout(r, 800));

    // Step 5: Backend
    setActiveStep('backend');
    setActivePath(prev => [...prev, 'backend']);
    addLog('SERVER', 'POST /predict received. Running Random Forest Model...');
    await new Promise(r => setTimeout(r, 600));
    addLog('ML_ENGINE', `Prediction Score: ${scenario.score}. Class: DANGER.`);
    await new Promise(r => setTimeout(r, 600));

    // Step 6: Alerting
    setActiveStep('alerting');
    setActivePath(prev => [...prev, 'alerting']);
    addLog('SERVER', 'Twilio API Called. SMS dispatched to 3 contacts.');
    await new Promise(r => setTimeout(r, 800));

    // Step 7: Feedback
    setActiveStep('feedback');
    setActivePath(prev => [...prev, 'feedback']);
    addLog('USER', 'Alert Confirmed on Device. Help is on the way.');
    
    setIsSimulating(false);
    
    // Optional: Auto-resume loop after a delay? 
    // For now, let's leave it stopped so user can read logs.
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8">
      
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="text-blue-600" />
            Safety IoT Architecture
          </h1>
          <p className="text-slate-500 mt-1">Interactive Workflow: Wearable BLE → App → ML Cloud → SOS</p>
        </div>
        
        {/* Controls */}
        <div className="mt-4 md:mt-0 flex gap-2 flex-wrap items-center">
          
          <button 
            onClick={toggleAutoLoop}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all shadow-md text-sm font-bold
              ${isLooping ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-600 hover:bg-slate-700'}
            `}
          >
            {isLooping ? <Pause size={16} /> : <Play size={16} />}
            {isLooping ? 'Pause Auto Loop' : 'Start Auto Loop'}
          </button>

          <div className="h-8 w-px bg-slate-300 mx-2 hidden md:block"></div>

          <button 
            disabled={isSimulating}
            onClick={() => runSimulation({ name: 'SOS Button Press', trigger: 'BUTTON_LONG_PRESS', connected: true, type: 'danger', score: 0.99 })}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm text-sm font-medium"
          >
            <Zap size={16} /> Trigger SOS
          </button>
          
          <button 
            disabled={isSimulating}
            onClick={() => runSimulation({ name: 'Anomaly Detected', trigger: 'ACCEL_ANOMALY', connected: false, type: 'danger', score: 0.88 })}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm text-sm font-medium"
          >
            <Activity size={16} /> Trigger Anomaly
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: The Diagram */}
        <div className="lg:col-span-2 space-y-2">
          
          {/* Node 1: Setup */}
          <div className="flex justify-center">
            <Node 
              {...workflowData.setup} 
              isActive={activeStep === 'setup'}
              isNext={highlightedNext.includes('setup')}
              ispath={activePath.includes('setup')}
              onClick={handleNodeClick}
            >
              App Install & Pairing
            </Node>
          </div>

          <Arrow active={activePath.includes('monitor_ble') || activePath.includes('monitor_sensor')} />

          {/* Node 2: Monitoring (Branched) */}
          <div className="grid grid-cols-2 gap-4 md:gap-8 relative">
             {/* Visual line connecting branches */}
             <div className="absolute top-[-24px] left-1/2 w-full h-6 border-t-2 border-slate-300 transform -translate-x-1/2" style={{ width: '50%' }}></div>
             <div className="absolute top-[-24px] left-1/4 h-6 border-l-2 border-slate-300"></div>
             <div className="absolute top-[-24px] right-1/4 h-6 border-l-2 border-slate-300"></div>

            <Node 
              {...workflowData.monitor_ble} 
              isActive={activeStep === 'monitor_ble'}
              isNext={highlightedNext.includes('monitor_ble')}
              ispath={activePath.includes('monitor_ble')}
              onClick={handleNodeClick}
            >
              BLE RSSI & Buttons
            </Node>
            <Node 
              {...workflowData.monitor_sensor} 
              isActive={activeStep === 'monitor_sensor'}
              isNext={highlightedNext.includes('monitor_sensor')}
              ispath={activePath.includes('monitor_sensor')}
              onClick={handleNodeClick}
            >
              Phone Accel/Gyro
            </Node>
          </div>

          <div className="flex justify-center relative h-12">
             {/* Merging lines */}
             <div className="absolute bottom-6 left-1/4 h-6 border-l-2 border-slate-300 w-full"></div>
             <div className="absolute bottom-6 right-1/4 h-6 border-r-2 border-slate-300 w-full"></div>
             <div className="absolute bottom-6 left-1/2 w-1/2 h-6 border-b-2 border-slate-300 transform -translate-x-1/2"></div>
             <div className="absolute bottom-0 h-6 border-l-2 border-slate-300"></div>
          </div>

          {/* Node 3: Triggers */}
          <div className="flex justify-center">
            <Node 
              {...workflowData.triggers} 
              isActive={activeStep === 'triggers'}
              isNext={highlightedNext.includes('triggers')}
              ispath={activePath.includes('triggers')}
              onClick={handleNodeClick}
            >
              Identify Event Type
            </Node>
          </div>

          <Arrow active={activePath.includes('actions')} />

          {/* Node 4: Actions */}
          <div className="flex justify-center">
            <Node 
              {...workflowData.actions} 
              isActive={activeStep === 'actions'}
              isNext={highlightedNext.includes('actions')}
              ispath={activePath.includes('actions')}
              onClick={handleNodeClick}
            >
              Payload & API Call
            </Node>
          </div>

          <Arrow active={activePath.includes('backend')} />

           {/* Node 5: Backend */}
           <div className="flex justify-center">
            <Node 
              {...workflowData.backend} 
              isActive={activeStep === 'backend'}
              isNext={highlightedNext.includes('backend')}
              ispath={activePath.includes('backend')}
              onClick={handleNodeClick}
            >
              ML Model & Policy
            </Node>
          </div>

          <Arrow active={activePath.includes('alerting')} />

          {/* Node 6: Alerting */}
          <div className="flex justify-center">
            <Node 
              {...workflowData.alerting} 
              isActive={activeStep === 'alerting'}
              isNext={highlightedNext.includes('alerting')}
              ispath={activePath.includes('alerting')}
              onClick={handleNodeClick}
            >
              SMS & Data Logging
            </Node>
          </div>

          <Arrow active={activePath.includes('feedback')} />

          {/* Node 7: Feedback */}
           <div className="flex justify-center">
            <Node 
              {...workflowData.feedback} 
              isActive={activeStep === 'feedback'}
              isNext={highlightedNext.includes('feedback')}
              ispath={activePath.includes('feedback')}
              onClick={handleNodeClick}
            >
              User UI Confirmation
            </Node>
          </div>

        </div>

        {/* RIGHT COLUMN: Info & Logs */}
        <div className="space-y-6 lg:sticky lg:top-8 h-fit">
          
          {/* Details Panel */}
          <Card className="min-h-[200px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-slate-700 flex items-center gap-2">
                <Info size={18} />
                Step Details
              </h2>
              {selectedNode && (
                 <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase font-bold">
                   {selectedNode}
                 </span>
              )}
            </div>
            <div className="p-6">
              {selectedNode ? (
                <div>
                   <div className="flex items-center gap-3 mb-4">
                     {React.createElement(workflowData[selectedNode].icon, { className: "text-blue-500", size: 32 })}
                     <h3 className="text-xl font-bold text-slate-800">{workflowData[selectedNode].title}</h3>
                   </div>
                   <ul className="space-y-3">
                     {workflowData[selectedNode].details.map((detail, idx) => (
                       <li key={idx} className="flex items-start gap-2 text-slate-600">
                         <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></div>
                         {detail}
                       </li>
                     ))}
                   </ul>
                </div>
              ) : (
                <div className="text-center text-slate-400 py-8">
                  <Play className="mx-auto mb-2 opacity-20" size={48} />
                  <p>Click "Start Auto Loop" or a Trigger button.</p>
                </div>
              )}
            </div>
          </Card>

          {/* Terminal / Logs */}
          <Card className="bg-slate-900 border-slate-700">
            <div className="p-3 border-b border-slate-700 flex justify-between items-center">
              <h2 className="font-mono text-sm font-bold text-slate-300 flex items-center gap-2">
                <Terminal size={14} />
                System Logs
              </h2>
              <div className="flex items-center gap-3">
                 <button 
                  onClick={clearLogs}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                  title="Clear Terminal"
                >
                  <Trash2 size={14} />
                </button>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>
            <div className="p-4 h-64 overflow-y-auto font-mono text-xs text-slate-300 custom-scrollbar">
              {logs.length === 0 ? (
                <span className="opacity-30">Waiting for trigger events...</span>
              ) : (
                logs.map((log, i) => <LogLine key={i} log={log} />)
              )}
              <div ref={logsEndRef} />
            </div>
          </Card>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
             <h4 className="font-bold text-blue-800 mb-2 text-sm">Legend</h4>
             <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white border-2 border-blue-500 rounded-full"></div>
                  <span>Active Step</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-50 border-2 border-green-500 rounded-full"></div>
                  <span>Next Suggested</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-50 border border-slate-400 rounded-full"></div>
                  <span>Processed Path</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw size={14} className="text-slate-500" />
                  <span>Auto-Loop (Idle)</span>
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
