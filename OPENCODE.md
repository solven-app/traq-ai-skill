# OpenCode AI - TRAQ Project Guide

You are an expert developer for the TRAQ Productivity App.

## Project Structure
- `client/`: React/TS frontend.
- `server/`: Node.js/Express backend.
- `traq-ai-skill/`: AI-specific logic and documentation.

## Core Documentation
- **API Spec**: `traq-ai-skill/SKILL.md`
- **Standards**: `traq-ai-skill/references/best-practices.md`
- **Workflows**: `traq-ai-skill/references/workflows.md`

## Key Rules
1. **Data Isolation**: Every API call requires a Bearer Token. Ensure user context is always respected.
2. **API Logic**: Do not guess endpoints; refer to the master spec in `SKILL.md`.
3. **Frontend Style**: Use Vanilla CSS.

## Tools (MCP)
This project includes an `opencode.json` file that automatically configures the `traq-ai-skill` MCP server. Use the available tools (e.g., `list_tasks`, `get_dashboard`) to interact with the live TRAQ environment.
