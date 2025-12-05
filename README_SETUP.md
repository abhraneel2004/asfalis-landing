# Safety IoT Architecture - Interactive Workflow

An interactive React visualization of a Safety IoT system architecture, featuring:

- **Interactive Workflow Diagram**: Visual representation of a 7-step IoT safety workflow
- **Branching Paths**: Two monitoring paths (BLE Connected or Phone Sensors)
- **Auto-Loop**: Automatic animation cycling through the workflow
- **Live Simulations**: Trigger SOS events and Anomaly detection with step-by-step visualization
- **System Logs**: Real-time logging terminal showing system events
- **Responsive Design**: Optimized for desktop and mobile viewing

## Features

### Workflow Steps

1. **Device Setup** - App installation and pairing
2. **Monitoring** (Branching):
   - 2a. Connected Monitor (BLE)
   - 2b. Sensor Monitor (Phone Accelerometer/Gyroscope)
3. **Triggers/Detection** - Multiple trigger types
4. **App Actions** - Payload construction and API calls
5. **Backend Processing** - ML model and policy engine
6. **Alerting & Logging** - Twilio SMS and data logging
7. **Feedback Loop** - User UI and contact notifications

### Interactive Elements

- **Start Auto Loop**: Automatically cycles through both paths
- **Trigger SOS**: Manual trigger with BLE connected scenario
- **Trigger Anomaly**: ML anomaly detection with phone sensors
- **Node Click**: Select individual nodes to view step details
- **Clear Logs**: Reset system logs
- **Live Terminal**: Color-coded system output

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Build

```bash
npm run build
```

## Technologies

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Project Structure

```
safety_simulation/
├── src/
│   ├── App.jsx           # Main component
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles
├── index.html            # HTML entry point
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
└── postcss.config.js     # PostCSS configuration
```
