const fs = require('fs');
const path = require('path');
const http = require('http');

// VGP SENTINEL - UNIVERSAL CORE v1.3.1 (Auto-Purge & Pulse Enabled)
// Node v12 Compatible
// Usage: node vgp_sentinel.js [PROJECT_ROOT_PATH]

const ROOT_DIR = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const CONFIG_PATH = path.join(ROOT_DIR, 'vgp.config.json');

if (!fs.existsSync(CONFIG_PATH)) {
    console.error(`FATAL: vgp.config.json NOT FOUND AT ${ROOT_DIR}. TERMINATING SENTINEL.`);
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

// DYNAMIC CONFIGURATION
const SPEC_FILE = path.join(ROOT_DIR, config.governance.spec_file);
const PORT = config.network.port || 3000;
const DESKTOP_DIR = '/home/abd/Desktop/recovery prompts';
const SAFE_PROJECT_NAME = config.project_name.toLowerCase().replace(/\s+/g, '_');
const AUTOMATIC_DESKTOP_PROMPT = path.join(DESKTOP_DIR, `${SAFE_PROJECT_NAME}_automatic_recovery_prompt.txt`);

let lastReportUpdate = new Date();
let currentPrompt = "INIT: Awaiting first audit cycle...";
let signalPulse = []; // Inbound signal buffer for VGP Pulse

function logSignal(type, details) {
    const signal = {
        timestamp: new Date().toISOString(),
        type: type,
        details: details
    };
    signalPulse.unshift(signal);
    if (signalPulse.length > 50) signalPulse.pop();
    console.log(`[VGP PULSE] ${type}: ${details}`);
}

// 1. FS-Signals Broadcaster (Pulse Layer)
let purgeDebounceTimer = null;
const { exec } = require('child_process');

try {
    fs.watch(ROOT_DIR, { recursive: true }, (eventType, filename) => {
        if (filename && !filename.includes('.git') && !filename.includes('node_modules')) {
            logSignal('FS_EVENT', `${eventType.toUpperCase()} detected on ${filename}`);

            // AUTOMATED CACHE PURGE RULE
            const coreFiles = ['index.html', 'index.css', 'app.js', 'catalog.json', 'hubs.json'];
            if (coreFiles.some(f => filename.endsWith(f))) {
                if (purgeDebounceTimer) clearTimeout(purgeDebounceTimer);
                purgeDebounceTimer = setTimeout(() => {
                    logSignal('GOVERNANCE_ACTION', `Triggering Cloudflare Purge for ${filename}...`);
                    exec('sh purge_cache.sh', { cwd: ROOT_DIR }, (err, stdout, stderr) => {
                        if (err) logSignal('ACTION_ERROR', `Purge failed: ${err.message}`);
                        else logSignal('ACTION_SUCCESS', `Cloudflare Purge Complete.`);
                    });
                }, 2000); // 2-second debounce
            }
        }
    });
    console.log(`[VGP PULSE] FS_WATCH ACTIVE ON ${ROOT_DIR}`);
} catch (e) {
    console.warn(`[VGP PULSE] FS_WATCH WARNING: Recursive watch might not be supported on this OS. ${e.message}`);
}

function performGovernanceAudit() {
    console.log(`[${new Date().toISOString()}] VGP AUDIT STARTING FOR ${config.project_name}...`);
    const contents = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
    const unjustified = [];

    // LOAD .vgpignore if exists
    const ignorePath = path.join(ROOT_DIR, '.vgpignore');
    let ignored = [];
    if (fs.existsSync(ignorePath)) {
        ignored = fs.readFileSync(ignorePath, 'utf8')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'));
    }

    contents.forEach(item => {
        if (item.isDirectory()) {
            const isAllowed = config.governance.allowed_subdirs.includes(item.name);
            const isIgnored = ignored.includes(item.name);
            
            if (!isAllowed && !isIgnored) {
                unjustified.push(item.name);
            }
        }
    });

    if (unjustified.length > 0) {
        logSignal('GOVERNANCE_ALARM', `Unjustified directories: ${unjustified.join(', ')}`);
        return `WARNING: Unjustified directories identified in ${config.project_name}: ${unjustified.join(', ')}. Immediate purge required per VGP Policy (or add to .vgpignore).`;
    }
    return "GOVERNANCE STATUS: ARCHITECTURAL INTEGRITY VERIFIED.";
}

function updateRecoveryPrompt() {
    console.log(`[${new Date().toISOString()}] SYNCHRONIZING VGP RECOVERY PROMPT...`);
    const auditStatus = performGovernanceAudit();
    
    let spec = "";
    try {
        spec = fs.readFileSync(SPEC_FILE, 'utf8');
    } catch (e) {
        spec = "ERROR: SPEC FILE MISSING.";
    }
    
    const version = config.version || 'v0.0.0';
    let progress = "See spec for details.";
    const progressSplit = spec.split('### Progress');
    if (progressSplit.length > 1) {
        progress = progressSplit[1].split('---')[0].trim();
    }

    currentPrompt = `
# VGP RECOVERY PROMPT - ${config.project_name} (${version})
# TIMESTAMP: ${new Date().toISOString()}

## OBJECTIVE: 
Maintain the ${version} stable core. 

## CURRENT AUDIT:
${auditStatus}

## RECENT PROGRESS:
${progress}

## CORE CONSTRAINTS (VGP ENFORCED):
1. Root-First Architecture.
2. Thematic Series Sorting (Human Research Logic).
3. Automated Handover via Sentinel.
    `.trim();

    // 1. Write to Project-Local Recovery Prompt
    try {
        fs.writeFileSync(path.join(ROOT_DIR, 'recovery_prompt.txt'), currentPrompt);
    } catch (e) {
        console.error(`[VGP LOCAL SYNC FAILED] ${e.message}`);
    }

    // 2. Write to Project-Specific Desktop Prompt
    try {
        if (!fs.existsSync(DESKTOP_DIR)) fs.mkdirSync(DESKTOP_DIR, { recursive: true });
        fs.writeFileSync(AUTOMATIC_DESKTOP_PROMPT, currentPrompt);
    } catch (e) {
        console.error(`[VGP DESKTOP SYNC FAILED] ${e.message}`);
    }

    lastReportUpdate = new Date();
}

// Initial update
updateRecoveryPrompt();

// Schedule updates
setInterval(updateRecoveryPrompt, config.automation.prompt_sync_interval_ms || 600000);

// Sentinel Dashboard Server
const server = http.createServer((req, res) => {
    if (req.url === '/pulse') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(signalPulse));
    } else if (req.url === '/prompt') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(currentPrompt);
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
                <head>
                    <title>VGP SENTINEL | ${config.project_name}</title>
                    <style>
                        body { background: #050508; color: #c5a059; font-family: 'Inter', sans-serif; padding: 2rem; margin: 0; }
                        .container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 350px; gap: 2rem; }
                        pre { background: rgba(255,255,255,0.03); padding: 1.5rem; border: 1px solid #c5a059; border-radius: 12px; white-space: pre-wrap; color: #fff; font-size: 0.9rem; }
                        h1 { color: #fff; border-bottom: 2px solid #c5a059; padding-bottom: 0.5rem; letter-spacing: 1px; }
                        .status-box { background: rgba(46, 204, 113, 0.1); border-left: 4px solid #2ecc71; padding: 1rem; margin-bottom: 2rem; }
                        .pulse-sidebar { background: rgba(255,255,255,0.02); border: 1px solid rgba(197, 160, 89, 0.3); border-radius: 12px; padding: 1rem; height: 80vh; overflow-y: auto; }
                        .signal { font-size: 0.8rem; padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
                        .signal-type { font-weight: bold; color: #fff; display: block; }
                        .signal-time { color: rgba(255,255,255,0.4); font-size: 0.7rem; }
                        .signal-details { color: #3498db; }
                    </style>
                    <meta http-equiv="refresh" content="30">
                </head>
                <body>
                    <h1>VGP SENTINEL DASHBOARD v1.3.0</h1>
                    <div class="container">
                        <div class="main-content">
                            <div class="status-box">
                                <strong>PROJECT:</strong> ${config.project_name} [${config.version}]<br>
                                <strong>ROOT:</strong> ${ROOT_DIR}<br>
                                <strong>STATUS:</strong> OPERATIONAL (VGP Pulse Active)<br>
                                <strong>LAST SYNC:</strong> ${lastReportUpdate.toISOString()}
                            </div>
                            <h2>ACTIVE RECOVERY PROMPT</h2>
                            <pre>${currentPrompt}</pre>
                            <p><a href="/prompt" style="color:#3498db">Download Plaintext</a> | <a href="/pulse" style="color:#3498db">JSON Signal Feed</a></p>
                        </div>
                        <div class="pulse-sidebar">
                            <h2>VGP PULSE</h2>
                            ${signalPulse.map(s => `
                                <div class="signal">
                                    <span class="signal-time">${s.timestamp}</span>
                                    <span class="signal-type">${s.type}</span>
                                    <span class="signal-details">${s.details}</span>
                                </div>
                            `).join('')}
                            ${signalPulse.length === 0 ? '<p style="color:rgba(255,255,255,0.2)">Waiting for system signals...</p>' : ''}
                        </div>
                    </div>
                </body>
            </html>
        `);
    }
});

server.listen(PORT, () => {
    console.log(`VGP SENTINEL v1.3.0 STANDING BY ON PORT ${PORT} FOR ${config.project_name}`);
});
