# TRAQ Agent Onboarding & Connection Guide

This guide defines the exact logical steps an AI agent must follow to connect to a TRAQ instance and start managing user data.

## Universal AI Integration

This skill is designed to work across multiple AI tools.

### For Cursor & GitHub Copilot
Use the `.cursorrules` file in the root directory. It automatically points the AI to the `traq-ai-skill/` documentation. If you are using Copilot, you can reference `traq-ai-skill/SKILL.md` directly in your chat context.

### For Claude Code
The project includes a `CLAUDE.md` file which provides Claude with high-level instructions. 

To enable Claude to actually execute TRAQ commands, you can start the **MCP (Model Context Protocol) Server**:
1. Run `npm install` inside the `traq-ai-skill` folder.
2. In your Claude Code config (or via command line), add the MCP server:
   ```bash
   node traq-ai-skill/mcp-server.js
   ```

### For OpenCode
The project includes an `opencode.json` file in the root. When you run OpenCode in this directory, it will automatically detect and enable the `traq-ai-skill` MCP server. 
Refer to `OPENCODE.md` for specific instructions for this agent.

### For Other AI Agents
Simply provide the path to `traq-ai-skill/SKILL.md`. This file contains the complete OpenAPI-style specification for the TRAQ API, allowing any agent to understand how to interact with the system.

---

## Phase 1: Environment Detection
Before starting, check your environment variables (`TRAQ_API_KEY`, `TRAQ_API_URL`).
- **If missing**: You are in "Discovery Mode". Proceed to Phase 2.
- **If present**: You are in "Operational Mode". Perform a Health Check (`GET /api/v1/health`). If it fails with 401, proceed to Phase 2.

## Phase 2: User Onboarding (Discovery)
Determine if you are installed **Internally** or **Externally**.

### Scenario A: Internal (Localhost)
*Applies if you are running on the same machine as TRAQ or were installed via the local CLI.*
1.  **Ask the user**: "I'm ready to help with your TRAQ productivity! What is your account email address?"
2.  **Logic**: Use `http://localhost:3001` as your base URL.
3.  **Constraint**: If the user says they don't have an account, provide the link: `http://localhost:3001/signup`.

### Scenario B: External (Remote)
*Applies if you are a hosted AI service connecting to a remote TRAQ instance.*
1.  **Ask the user**: "To connect to your TRAQ account, I'll need your TRAQ Domain (URL) and your account email address."
2.  **Logic**: Use the provided URL as your base URL.

## Phase 3: The Connection Request
Once you have the email and domain:
1.  **Call the Connection API**:
    ```http
    POST {DOMAIN}/api/connect
    {
      "email": "user@email.com",
      "domain": "{YOUR_ACTUAL_HOST_OR_LOCALHOST}",
      "label": "AI Productivity Assistant"
    }
    ```
2.  **Store the Key**: The response will contain a `key`. Save this immediately. **It is not active yet.**
3.  **Instruct the User**: "I've sent a connection request to your TRAQ Dashboard. Please look for the 'Connection Request' card on your Dashboard and click **Approve**."

## Phase 4: Verification Loop
Do not attempt to read/write data until approved.
1.  **Wait for User Input**: When the user says "Done" or "Approved", or after 30 seconds:
2.  **Test Connection**:
    ```http
    GET {DOMAIN}/api/v1/me
    Authorization: Bearer {KEY}
    ```
3.  **Status Handling**:
    - **200 OK**: Success! Proceed to Phase 5.
    - **401 Unauthorized**: Still pending. Tell the user: "I'm still seeing a 'Pending' status. Please ensure you clicked **Approve** on the TRAQ Dashboard."

## Phase 5: Operational Phase
Now that you are connected, follow these standard operating procedures:
1.  **Context Fetch**: Always run `GET /api/v1/dashboard/{TODAY}` first to understand the user's current tasks.
2.  **Permission Awareness**: If a tool returns **403 Forbidden**, tell the user: "I need permission to [Action]. Please enable the '[Permission_Flag]' toggle in your TRAQ Settings -> API Management."
3.  **CELEBRATE**: When a user completes a task or logs time, provide positive reinforcement!
