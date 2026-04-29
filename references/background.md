# TRAQ Background & Architecture

## What is TRAQ?

TRAQ is a personal productivity tracking web application. It helps users manage recurring and one-time tasks, log time spent on work, earn points for completing tasks, and review their productivity trends through rich analytics.

## Core Concepts

### Tasks
Tasks are the fundamental unit of work. Every task belongs to exactly one user and is one of two types:

| Type | Description | Points |
|------|-------------|--------|
| **Static** | Binary — either done or not done for the day | Fixed `static_points` per completion |
| **Dynamic** | Time-based — logged in hours, points scale with effort | `points_per_hour × hours_logged` |

Tasks can be scheduled to:
- Appear **every day** (`day_of_week = 'all'`)
- Appear on **specific weekdays** (`day_of_week = 'monday,wednesday,friday'`)
- Appear on a **single date** (`scheduled_date = '2024-12-25'`)

### Dashboard
The Dashboard is the day-by-day view. A user navigates to a specific date and sees which tasks are scheduled for that day, their completion status, and any time logged. For **static tasks**, the user checks a checkbox. For **dynamic tasks**, the user enters hours worked.

### Analytics
Analytics aggregate task completion data over a chosen period (`7`, `30`, `90` days, or `all` time). The main metrics are:
- **Points over time** (productivity trend)
- **Points per task** (task contribution / leaderboard)
- **Completion rate** (% of scheduled tasks completed)
- **Time allocation** (hours spent per task)
- **Most productive day of the week**

### Reminders
Reminders are Telegram push notifications. They fire at a user-specified time on a recurring or one-time schedule. A reminder can be linked to a task (inheriting its day pattern) or be completely standalone.

### Logs
The Logs page is a server-side audit trail of important events: reminder sends, Telegram bot actions, errors. Useful for debugging AI agent actions.

## Data Model Summary

```
users
  └── tasks (user_id FK)
        └── task_completions (task_id FK)   ← static completion records
        └── time_entries    (task_id FK)    ← dynamic time logs
  └── reminders (user_id FK, optional task_id FK)
  └── sessions  (user_id FK)               ← UI auth tokens
  └── api_keys  (user_id FK)               ← AI/external auth tokens
```

## Auth Architecture

| Channel | Method |
|---------|--------|
| Web UI  | HttpOnly cookie `traq_session` → 60s cached in server memory → DB lookup |
| AI/API  | `Authorization: Bearer traq_xxxxx` → argon2i hash check → `api_keys` table |

API keys have a **pending → active** lifecycle. A key generated via the API starts as `pending`. The human user must log in to TRAQ Settings and explicitly activate it and toggle which permissions it has.

## Points System

Points are the core gamification mechanism. They are not a currency — they're a personal productivity score. The user accumulates points over time and can view trends to see if their productivity is improving.

```
Daily Points = Σ(completed static tasks × static_points)
             + Σ(dynamic tasks × hours_logged × points_per_hour)
```
