const fs = require('fs');
const path = require('path');
const http = require('http');

// VGP SENTINEL - UNIVERSAL CORE v1.5.2 (Evolutionary Governance Edition)
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
const LOGIC_FILE = path.join(ROOT_DIR, 'vgp_logic.json');

let lastReportUpdate = new Date();
let currentPrompt = `# VGP RECOVERY PROMPT - War Lego AI Merch Shop (v2.4.2)
# TIMESTAMP: 02/05/2026, 12:01:00

## OBJECTIVE: 
Stabilize the recovered high-fidelity codebase.

## CURRENT AUDIT:
GOVERNANCE STATUS: ARCHITECTURAL INTEGRITY RESTORED.
RULE OF ELEVEN: ACTIVE & ENFORCED.

## RECENT PROGRESS:
- **Discarded Code Audit (Code-to-Text)**: Measured and restored the 'Signal Subscription' layer (JOIN THE SIGNAL) and associated narrative inputs.
- **Total Codebase Restoration**: Re-integrated Neural Archives, Viral Intelligence, and the Orange Pirate (Little Orange Man) narrative signals.
- **Drift Reversal & Measurement**: Corrected the Logical Order and documented the previous minimalist shift as an unintended drift.
- **High-Fidelity Lockdown**: Confirmed Towel (2%/96%) and Cap (side-profile) coordinates as immutable.
- **Sync Synchronization**: Updated global tab notification to 12:01 cycle.

## CORE CONSTRAINTS (VGP ENFORCED):
1. Root-First Architecture.
2. Thematic Series Sorting (Human Research Logic).
3. Automated Handover via Sentinel.
4. Drift Measurement: All discarded code must be written back into the Logic Stream.`;
let signalPulse = []; // Inbound signal buffer for VGP Pulse

function logSignal(type, details) {
    const signal = {
        timestamp: new Date().toLocaleString(),
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
    console.log(`[${new Date().toLocaleString()}] VGP AUDIT STARTING FOR ${config.project_name}...`);
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

    // NEW: ARCHITECTURAL CONTENT AUDIT (v1.4.0)
    try {
        const indexCss = fs.readFileSync(path.join(ROOT_DIR, 'index.css'), 'utf8');
        const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

        // 1. Contrast Check: Forbidden white background on grid cards (Targeted)
        const productCardBlock = indexCss.match(/\.product-card\s*\{([^}]*)\}/);
        if (productCardBlock && productCardBlock[1].includes('background: #ffffff')) {
            logSignal('GOVERNANCE_ALARM', "VISUAL REGRESSION: Forbidden white background on cards.");
            return "ALARM: VISUAL REGRESSION DETECTED. PRODUCT CARDS MUST NOT HAVE WHITE BACKGROUNDS (Neural Archive violation).";
        }

        // 2. Sync Freshness Check
        const titleMatch = indexHtml.match(/\[SYNC: (\d{2}):(\d{2})\]/);
        if (titleMatch) {
            const [_, hours, minutes] = titleMatch;
            const now = new Date();
            const syncTime = new Date();
            syncTime.setHours(parseInt(hours), parseInt(minutes), 0);
            
            // Adjust for possible date rollover if sync was late night and now is morning
            if (now.getHours() < parseInt(hours)) syncTime.setDate(syncTime.getDate() - 1);

            const diffMinutes = Math.floor(Math.abs(now - syncTime) / 60000);
            if (diffMinutes > 20) {
                logSignal('GOVERNANCE_ALARM', `STALE SYNC: Title is ${diffMinutes}m behind.`);
                return `ALARM: STALE SYNCHRONIZATION. Title is ${diffMinutes}m behind. VGP protocol requires real-time transparency.`;
            }
        }
    } catch (e) {
        console.warn(`[SENTINEL AUDIT WARNING] Content check skipped: ${e.message}`);
    }

    return "GOVERNANCE STATUS: ARCHITECTURAL INTEGRITY VERIFIED.";
}

function updateRecoveryPrompt() {
    // RE-READ CONFIG ON EVERY CYCLE
    let config;
    try {
        config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch (e) {
        console.error(`ERROR: FAILED TO RE-READ CONFIG: ${e.message}`);
        return; // Skip this cycle
    }

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
        // TAKE THE LATEST (LAST) PROGRESS SECTION
        progress = progressSplit[progressSplit.length - 1].split('---')[0].trim();
    }

    currentPrompt = `
# VGP RECOVERY PROMPT - ${config.project_name} (${version})
# TIMESTAMP: ${new Date().toLocaleString()}

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
    } else if (req.url === '/logic') {
        let logic = [];
        if (fs.existsSync(LOGIC_FILE)) {
            try { logic = JSON.parse(fs.readFileSync(LOGIC_FILE, 'utf8')); } catch(e){}
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(logic));
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
                    <h1>VGP SENTINEL DASHBOARD v1.5.2</h1>
                    <div class="container">
                        <div class="main-content">
                            <div class="status-box">
                                <strong>PROJECT:</strong> ${config.project_name} [${config.version}]<br>
                                <strong>ROOT:</strong> ${ROOT_DIR}<br>
                                <strong>STATUS:</strong> OPERATIONAL (VGP Pulse Active)<br>
                                <strong>LAST SYNC:</strong> ${lastReportUpdate.toLocaleString()}
                            </div>

                            ${fs.existsSync(LOGIC_FILE) ? (() => {
                                const logic = JSON.parse(fs.readFileSync(LOGIC_FILE, 'utf8'));
                                if (logic.mandate_synthesis) {
                                    return `
                                        <div class="status-box" style="background: rgba(197, 160, 89, 0.05); border-left: 4px solid #c5a059;">
                                            <h3 style="margin: 0 0 10px 0; color: #c5a059;">VGP MANDATE SYNTHESIS</h3>
                                            <p style="font-size: 0.9rem; color: #fff; margin-bottom: 10px;"><strong>Core Intent:</strong> ${logic.mandate_synthesis.core_intent}</p>
                                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.75rem;">
                                                ${logic.mandate_synthesis.directives.map(d => `
                                                    <div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 4px;">
                                                        <strong style="color: #c5a059;">${d.id}</strong><br>
                                                        <span style="color: rgba(255,255,255,0.7);">${d.description}</span>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `;
                                }
                                return '';
                            })() : ''}

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
                            
                            <h2 style="margin-top:2rem;">AGENT LOGIC STREAM</h2>
                            <div id="logic-stream">
                                ${fs.existsSync(LOGIC_FILE) ? (() => {
                                    const logic = JSON.parse(fs.readFileSync(LOGIC_FILE, 'utf8'));
                                    const history = logic.history || logic;
                                    return history.slice(-10).reverse().map(l => `
                                        <div class="signal" style="border-left: 2px solid #3498db; margin-bottom: 10px; padding-left: 10px;">
                                            <span class="signal-time">${l.timestamp}</span>
                                            <span class="signal-type" style="color:#3498db">USER PROMPT</span>
                                            <div style="font-size:0.75rem; color:#fff; margin-bottom:5px;">${l.prompt.substring(0, 100)}...</div>
                                            <span class="signal-type" style="color:#2ecc71">AGENT THOUGHT</span>
                                            <div style="font-size:0.75rem; color:rgba(255,255,255,0.7)">${l.thought.substring(0, 100)}...</div>
                                        </div>
                                    `).join('');
                                })() : '<p style="color:rgba(255,255,255,0.2)">No logic logged yet.</p>'}
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `);
    }
});

server.listen(PORT, () => {
    console.log(`VGP SENTINEL v1.5.2 STANDING BY ON PORT ${PORT} FOR ${config.project_name}`);
});
