# Vanguard Governance Protocol (VGP)

The Vanguard Governance Protocol (VGP) is a standardized framework for maintaining architectural integrity and session continuity in AI-driven development projects. It enforces a "Root-First" directory policy and automates the generation of high-fidelity recovery prompts to bridge AI context across sessions.

## 📦 Core Components

1. **`vgp_sentinel.js`**: The universal monitoring engine. It performs real-time architectural audits and synchronizes recovery prompts every 10 minutes.
2. **`vgp.config.json`**: The per-project configuration file that defines sovereign boundaries, allowed subdirectories, and prompt delivery paths.
3. **`start-antigravity-cdp-9000.sh`**: A hardened launch script for Antigravity that dynamically initializes the VGP Sentinel for the current project context.

## 🚀 Usage with Antigravity

### 1. Project Initialization

Add a `vgp.config.json` to your project root. Use the `vgp.config.template.json` as a starting point.

```json
{
  "project_name": "My Project",
  "version": "v1.0.0",
  "governance": {
    "root_first": true,
    "allowed_subdirs": [".git", "node_modules", "assets"],
    "spec_file": "specification.md"
  },
  "automation": {
    "prompt_sync_interval_ms": 600000,
    "recovery_paths": ["./recovery_prompt.txt"]
  }
}
```

### 2. Launching the Ecosystem

Place `vgp_sentinel.js` and `start-antigravity-cdp-9000.sh` in a central location (e.g., your Desktop). Navigate to your project directory in the terminal and run:

```bash
sh ~/Desktop/start-antigravity-cdp-9000.sh
```

The script will:

1. Start the Antigravity server on port 9000.
2. Setup the CDP TCP proxy.
3. Detect the `vgp.config.json` and launch the Sentinel.
4. Deliver a project-specific recovery prompt to the Desktop every 10 minutes.

## 🛡️ Governance Policy

The VGP Sentinel enforces the following:

- **Root-First Deployment**: Prevents version drift by ensuring core production artifacts remain at the repository root.
- **Thematic Integrity**: Ensures that artifact sorting follows "Human Research Logic" (Thematic grouping before alphabetical title fallback).
- **Audit Logging**: Intercepts and logs "unjustified" subdirectories created during AI development.
- **Exclusion Protocol (.vgpignore)**: Justified research or development paths must be recorded here. **IMPORTANT: This file is restricted from AI Agent usage. Only the human USER may authorize exclusions to maintain true architectural oversight.**

## Protocol Credits

**Protocol by Antigravity AI | Gaza Resiliency Field**
