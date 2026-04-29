# TRAQ AI Skill — Master Specification

> **Productivity tracking app for humans. Controlled by AI agents.**

## Architecture
TRAQ follows a strict **Multi-User Data Isolation** model. All API requests are scoped to the authenticated user via a Bearer Token.

---

## 1. Connection & Onboarding

### Initiate Connection (Public)
`POST /api/connect`
- **Inputs**: `{ "email": "string", "domain": "string", "label": "string" }`
- **Response (202)**: Returns inactive API key.
- **Onboarding**: AI must ask for email (and domain if remote). User must **Approve** on Dashboard.

### Primary Entry Point (Protected)
`GET /api/v1/user/context`
- **Returns**: Profile, timezone, current user date, today's summary stats, and Telegram status.
- **Requirement**: Run this first in every session.

---

## 2. Core API (v1)

> **Note**: Once your connection is approved, your API key grants full access to all endpoints listed below. There are no granular permission restrictions.

### Tasks
- `GET /api/v1/tasks`: List all.
- `POST /api/v1/tasks`: Create. Supports `days: "all"`, `days: "YYYY-MM-DD"`, or `days: ["monday", ...]`.
- `PUT /api/v1/tasks/{id}`: Update specific fields.

### Dashboard
- `GET /api/v1/dashboard/{YYYY-MM-DD}`: Tasks for a date.
- `POST /api/v1/dashboard/complete`: Toggle completion. Auto-logs time for static tasks.
- `POST /api/v1/dashboard/log-time`: Add hours for dynamic tasks.

### Analytics
- `/api/v1/analytics/productivity-trend`: Points earned over time.
- `/api/v1/analytics/task-contribution`: Distribution by task.
- `/api/v1/analytics/time-allocation`: Hours distribution by task.
- `/api/v1/analytics/most-productive-day`: Average points per weekday.
- `/api/v1/analytics/task-completion-rate`: Success percentage.
- `/api/v1/analytics/efficiency-trend-compare`: Efficiency (pts/hr) vs previous period.
- `/api/v1/analytics/daily/{YYYY-MM-DD}`: Snapshot of one specific day.
- *Also available: `.../previous` suffixes for all trend/allocation endpoints.*

### Reminders
- `GET /api/v1/reminders`: List all.
- `GET /api/v1/reminders/due`: List reminders waiting to be sent today.
- `POST /api/v1/reminders/{id}/sent`: Mark as delivered today.

---

## 3. Power User Actions (Protected)

### User Settings
`PATCH /api/v1/user/settings`
- **Body**: `{ "timezone": "string", "time_format": "24h|12h" }`

### Telegram Configuration
`POST /api/v1/telegram/token`
- **Body**: `{ "token": "string" }`
- **Action**: Configures and starts the Telegram bot.

### Data Reset
`POST /api/v1/reset`
- **Body**: `{ "confirm": "PERMANENTLY DELETE ALL DATA" }`
- **Action**: Wipes all user-specific data (tasks, time, reminders).

---

## 4. Error Reference

| Code | Reason | Action for Agent |
|------|--------|------------------|
| 401 | Pending Key | Tell user to Approve on Dashboard. |
| 403 | Forbidden | Tell user to enable the specific Permission Flag in Settings. |
| 404 | Missing | Not found / Account does not exist. |

---

*See `GUIDE.md` for logical onboarding steps.*
