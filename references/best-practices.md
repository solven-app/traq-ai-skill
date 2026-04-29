# TRAQ AI Agent — Best Practices

## General Principles

### 1. Always Check the Date
TRAQ is date-sensitive. Before logging time or marking tasks complete, confirm which date the user means. Default to today's date in the user's timezone, but always verify.

```
✅ "I'll log 2 hours for your Deep Work task for today (2024-12-01). Confirm?"
❌ Silently using the wrong date.
```

### 2. Prefer Listing Before Writing
Before creating or deleting anything, fetch the current state first. This prevents duplicate tasks and gives the user a chance to confirm.

```javascript
// Good practice:
GET /api/tasks        // See what exists
// Then ask: "I see you already have a 'Morning Run' task. 
//             Do you want to update it or create a new one?"
```

### 3. Never Delete Without Explicit Confirmation
Deletion is irreversible. Always state exactly what will be deleted and wait for user approval.

```
✅ "This will permanently delete the task 'Morning Run' and all its completion history. 
    Should I proceed?"
❌ Deleting immediately when the user says "remove my running task"
```

### 4. Respect Granular Permissions
Your API key may not have all permissions enabled. If you receive a `403 Forbidden`, do not retry — instead inform the user:

```
"I don't have permission to [action]. Please go to TRAQ Settings → API Management 
and enable '[permission_name]' for this key."
```

Permission map:
| Action | Required Permission |
|--------|-------------------|
| View tasks | `can_read_tasks` |
| Create/edit/delete tasks | `can_write_tasks` |
| View analytics | `can_read_analytics` |
| Create/edit reminders | `can_manage_reminders` |
| Log time entries | `can_manage_time` |
| View/complete dashboard | `can_read_dashboard` |
| View logs | `can_read_logs` |

---

## Task Management Best Practices

### Choosing Task Type
- Use **Static** when the task is binary (workout, read 30 mins, take medication).
- Use **Dynamic** when duration varies (coding, writing, studying). Set a realistic `pointsPerHour`.

### Setting Day Patterns
- Use `"all"` for daily habits (hydration, journaling).
- Use `"monday,tuesday,wednesday,thursday,friday"` for work tasks.
- Use a specific date `"2024-12-25"` for one-off events.

### Reasonable Points Values
Calibrate points so they feel meaningful. Suggested ranges:
| Task effort | Static points | Dynamic pts/hr |
|------------|--------------|----------------|
| Quick habit (5 min) | 5–10 | — |
| Medium task (30–60 min) | 20–50 | 15–25 |
| Deep work (1–3 hrs) | — | 25–50 |
| Major milestone | 100+ | — |

---

## Analytics Interpretation

When the user asks "how am I doing?", pull multiple analytics endpoints for a holistic view:

```
1. GET /api/analytics/productivity-trend?period=7     → recent trend
2. GET /api/analytics/task-completion-rate?period=7   → consistency
3. GET /api/analytics/task-contribution?period=30     → what's driving points
4. GET /api/analytics/most-productive-day?period=30   → patterns
```

Then summarize: "Your most productive days are Tuesdays and Thursdays. Your completion rate this week is 78%, up from 65% last week. Deep Work is your highest-scoring task."

---

## Reminder Best Practices

- Link reminders to tasks when the reminder is specifically about completing that task.
- Use standalone reminders for non-task notifications (meetings, medication).
- Time should be in `HH:MM` 24-hour format when sending to the API.
- Avoid creating duplicate reminders — check existing ones first with `GET /api/reminders`.

---

## Error Handling

| Error | Recommended response |
|-------|---------------------|
| `401 Unauthorized` | "My API key seems to be invalid or expired. Please check the key in TRAQ Settings." |
| `403 Forbidden` | "I need the `[permission]` permission enabled for this action." |
| `404 Not Found` | "I couldn't find that [task/reminder]. It may have been deleted." |
| `400 Bad Request` | Parse the `error` field in the response and surface it to the user. |
| `500 Server Error` | "TRAQ's server encountered an error. The user should check the Logs page." |

---

## Rate Limiting & Etiquette

- Avoid polling analytics more than once per minute.
- Batch related operations: if creating multiple tasks, create them sequentially and confirm once.
- When the user is in a time-logging flow, complete it fully before switching topics.
