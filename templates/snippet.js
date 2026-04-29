// TRAQ API Snippet Templates
// Copy-paste these into your AI tool's code execution environment.
// Requires: TRAQ_API_URL and TRAQ_API_KEY set in environment.

const BASE = process.env.TRAQ_API_URL;
const KEY  = process.env.TRAQ_API_KEY;
const auth = { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' };
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// ── TASKS ──────────────────────────────────────────────────────────────────

// List all tasks
const tasks = await fetch(`${BASE}/api/tasks`, { headers: auth }).then(r => r.json());

// Create a static task (daily)
await fetch(`${BASE}/api/tasks`, {
  method: 'POST', headers: auth,
  body: JSON.stringify({
    name: 'Morning Workout',
    type: 'static',
    days: 'all',
    staticPoints: 30,
    estimatedHours: 0.5,
  }),
}).then(r => r.json());

// Create a dynamic task (weekdays only)
await fetch(`${BASE}/api/tasks`, {
  method: 'POST', headers: auth,
  body: JSON.stringify({
    name: 'Deep Work',
    type: 'dynamic',
    days: 'monday,tuesday,wednesday,thursday,friday',
    pointsPerHour: 40,
  }),
}).then(r => r.json());

// Create a one-time task
await fetch(`${BASE}/api/tasks`, {
  method: 'POST', headers: auth,
  body: JSON.stringify({
    name: 'Doctor Appointment',
    type: 'static',
    days: '2024-12-25',
    staticPoints: 10,
    estimatedHours: 1,
  }),
}).then(r => r.json());

// Delete a task
await fetch(`${BASE}/api/tasks/3`, { method: 'DELETE', headers: auth });


// ── DASHBOARD ──────────────────────────────────────────────────────────────

// Get today's dashboard
const dashboard = await fetch(`${BASE}/api/dashboard/${today}`, { headers: auth }).then(r => r.json());

// Mark a task complete
await fetch(`${BASE}/api/dashboard/complete`, {
  method: 'POST', headers: auth,
  body: JSON.stringify({ taskId: 3, date: today, completed: true }),
}).then(r => r.json());

// Log time for a dynamic task
await fetch(`${BASE}/api/dashboard/log-time`, {
  method: 'POST', headers: auth,
  body: JSON.stringify({ taskId: 5, date: today, hours: 2.5 }),
}).then(r => r.json());


// ── ANALYTICS ──────────────────────────────────────────────────────────────

// Productivity trend (7 days)
const trend = await fetch(`${BASE}/api/analytics/productivity-trend?period=7`, { headers: auth }).then(r => r.json());

// Task contribution (30 days)
const contribution = await fetch(`${BASE}/api/analytics/task-contribution?period=30`, { headers: auth }).then(r => r.json());

// Completion rate (7 days)
const rate = await fetch(`${BASE}/api/analytics/task-completion-rate?period=7`, { headers: auth }).then(r => r.json());

// Most productive day (all time)
const bestDay = await fetch(`${BASE}/api/analytics/most-productive-day?period=all`, { headers: auth }).then(r => r.json());

// Today's daily stats
const dailyStats = await fetch(`${BASE}/api/analytics/daily/${today}`, { headers: auth }).then(r => r.json());


// ── REMINDERS ─────────────────────────────────────────────────────────────

// List all reminders
const reminders = await fetch(`${BASE}/api/reminders`, { headers: auth }).then(r => r.json());

// Create a daily reminder
await fetch(`${BASE}/api/reminders`, {
  method: 'POST', headers: auth,
  body: JSON.stringify({
    title: 'Morning Check-in 🌅',
    description: 'Review your tasks for the day.',
    time: '08:00',
    day_pattern: 'all',
    task_id: null,
  }),
}).then(r => r.json());

// Create a task-linked reminder (inherits task schedule)
await fetch(`${BASE}/api/reminders`, {
  method: 'POST', headers: auth,
  body: JSON.stringify({
    title: 'Time to workout! 💪',
    time: '07:00',
    day_pattern: 'monday,tuesday,wednesday,thursday,friday',
    task_id: 3,
  }),
}).then(r => r.json());

// Delete a reminder
await fetch(`${BASE}/api/reminders/2`, { method: 'DELETE', headers: auth });


// ── API KEYS ───────────────────────────────────────────────────────────────

// Generate a new API key (requires cookie auth from UI)
// Use this only within the TRAQ web interface context, not from AI scripts.

// List keys (requires cookie auth)
const keys = await fetch(`${BASE}/api/keys`, { headers: auth, credentials: 'include' }).then(r => r.json());
