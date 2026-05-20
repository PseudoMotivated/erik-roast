# Erik OS Roast Engine Deployment Summary

## Access Details
- **URL:** https://erik.tamiz.dev
- **Environment:** Production (LXC Container)
- **CI/CD:** GitHub Actions (self-hosted runner)

## System Configuration
- **Container Name:** `erik-container`
- **Domain:** `erik.tamiz.dev`
- **Port:** `5173` (Nginx Reverse Proxy)
- **Process Manager:** `systemd` (`erik-roast.service`)

## Technology Stack
- **Frontend:** React (TypeScript), Vite
- **Styling:** Vanilla CSS (Brutalist Terminal Aesthetic)
- **Logic:** Custom roasting engine with visitor scan simulation

## Commands
- `roast`: Generate a fresh insult.
- `scan`: Simulate a visitor analysis.
- `status`: Check Erik's current mood (always disappointed).
- `help`: List available commands.
- `clear`: Reset the terminal.

## Repository
- **GitHub:** https://github.com/PseudoMotivated/erik-roast
