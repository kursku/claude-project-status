---
name: dashboard
description: Generates and displays the status of all tracked projects with commentary
---

# Dashboard

1. **Generate** the dashboard by running:
```bash
node ~/.claude/plugins/*/scripts/generate-dashboard.js
```

2. **Read** the generated file at `~/PROJECTS.md`

3. **Present** a commented summary covering:
   - How many projects are active (have a STATUS block configured)
   - Which have high priority but no recent activity (stalled)
   - Which project has the most pending tasks
   - Suggestion of which project deserves attention now, with a 1-line justification
