#!/usr/bin/env sh
set -eu
if ! command -v 'antigravity' >/dev/null 2>&1; then
  echo "Command 'antigravity' not found in PATH." >&2
  exit 1
fi

# 1. Start Antigravity on port 9000
nohup 'antigravity' --remote-debugging-port=9000 "$@" >/dev/null 2>&1 &

# 2. Start a multi-port Node.js TCP proxy for all Remoat CDP ports
node -e "
const net = require('net');
const ports = [9222];
ports.forEach(port => {
  net.createServer((c) => {
    const client = net.createConnection({ port: 9000, host: '127.0.0.1' }, () => { c.pipe(client).pipe(c); });
    client.on('error', () => c.destroy());
    c.on('error', () => client.destroy());
  }).listen(port, '0.0.0.0');
});
" >/dev/null 2>&1 &
# 3. Start VGP Sentinel (Vanguard Governance Protocol) if config exists
if [ -f "./vgp.config.json" ]; then
    echo "VGP.CONFIG.JSON DETECTED. STARTING SENTINEL..."
    nohup node "/home/abd/Import/GitHub/Vanguard-Governance-Protocol/vgp_sentinel.js" "$(pwd)" >/dev/null 2>&1 &
    echo "VGP SENTINEL INITIALIZED FOR $(basename "$(pwd)")."
else
    echo "NO VGP.CONFIG.JSON FOUND. SKIPPING GOVERNANCE MONITOR."
fi

echo "ANTIGRAVITY ECOSYSTEM READY."
