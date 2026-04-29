# TRAQ API — Common Workflows

A quick reference for multi-step workflows that AI agents commonly need to execute.

---

## Workflow 1: Daily Check-in

**Trigger:** User asks "What do I have today?" or "What's on my list?"

```
Step 1: GET /api/dashboard/{TODAY}
        → Returns tasks scheduled for today + completion status

Step 2: Summarize for user:
        "You have 5 tasks today:
          ✅ Morning Workout (done)
          ⬜ Deep Work (0 / 2h logged)
          ⬜ Read (not done)
          ..."
```

---

## Workflow 2: Log Time for Dynamic Task

**Trigger:** "I just spent 2 hours on deep work"

```
Step 1: GET /api/tasks
        → Find the task by name, get its ID

Step 2: Confirm with user:
        "Should I log 2 hours for 'Deep Work' on today (2024-12-01)?"

Step 3: POST /api/dashboard/log-time
        Body: { "taskId": 3, "date": "2024-12-01", "hours": 2 }
        → Auto-marks task complete

Step 4: Confirm: "Done! You've earned 60 points."
```

---

## Workflow 3: Create a New Habit Task

**Trigger:** "Add a daily meditation task"

```
Step 1: GET /api/tasks
        → Check for duplicates

Step 2: Ask:
        - "How many points for completing it?" (static_points)
        - "How long does it usually take?" (estimatedHours)
        - "Every day or specific days?"

Step 3: POST /api/tasks
        Body:
        {
          "name": "Meditation",
          "type": "static",
          "days": "all",
          "staticPoints": 20,
          "estimatedHours": 0.25
        }

Step 4: Confirm: "Created 'Meditation' — a daily 15-minute habit worth 20 points."
```

---

## Workflow 4: Weekly Productivity Review

**Trigger:** "How was my week?" or "Give me a productivity report"

```
Step 1: GET /api/analytics/productivity-trend?period=7
Step 2: GET /api/analytics/task-completion-rate?period=7
Step 3: GET /api/analytics/task-contribution?period=7
Step 4: GET /api/analytics/most-productive-day?period=30

Then synthesize:
"This week you earned 420 points (↑12% vs last week).
 Your completion rate was 74%.
 Top task: Deep Work (180pts).
 Your most productive day is Tuesday."
```

---

## Workflow 5: Set a Reminder for a Task

**Trigger:** "Remind me to workout every morning at 7am"

```
Step 1: GET /api/tasks
        → Find the workout task, get its ID and day_pattern

Step 2: GET /api/reminders
        → Check for existing workout reminders (avoid duplicates)

Step 3: POST /api/reminders
        Body:
        {
          "title": "Time to workout! 💪",
          "description": "Don't skip — consistency is everything.",
          "time": "07:00",
          "day_pattern": "monday,tuesday,wednesday,thursday,friday,saturday,sunday",
          "task_id": 5
        }

Step 4: Confirm: "Set! You'll get a Telegram notification at 7:00 AM every day."
```

---

## Workflow 6: End-of-Day Wrap-up

**Trigger:** "I'm done for today" or "wrap up my day"

```
Step 1: GET /api/dashboard/{TODAY}
        → Find incomplete tasks

Step 2: For each incomplete task, ask:
        "You didn't mark 'Read 30 mins' as done — did you complete it?"

Step 3: For any dynamic tasks with no hours:
        "How long did you spend on 'Writing'?"

Step 4: POST /api/dashboard/complete or /api/dashboard/log-time
        → Update each task

Step 5: GET /api/analytics/daily/{TODAY}
        → Get today's final score

Step 6: "Great work today! You earned 230 points across 4 tasks. 
         Your best day this week so far. 🎯"
```
