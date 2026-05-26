---
name: prioritize
description: Analyzes all projects and suggests which to work on now based on priority, recent activity, and pending tasks
---

# Prioritize

1. **Generate** the dashboard:
```bash
node ~/.claude/plugins/*/scripts/generate-dashboard.js
```

2. **Read** `~/PROJECTS.md`

3. For each project with a STATUS block, evaluate:
   - **Declared priority** (`alta` > `média` > `baixa`)
   - **Urgency by inactivity**: high-priority projects with last session >7 days ago rise in the list
   - **Momentum**: projects with recent sessions (≤3 days) and concrete tasks have an advantage — easy to resume
   - **Pending task volume**: more tasks = more blocked, needs attention

4. **Generate top 3-5 projects to work on now**, in this format:
   ```
   1. **<project>** — <reason in one line>
   2. **<project>** — <reason in one line>
   ...
   ```

5. **Update** the `## Priorities` section in `~/PROJECTS.md`:
   ```markdown
   ## Priorities
   _Analysis from <date>_

   1. **<project>** — <reason>
   2. **<project>** — <reason>
   ...
   ```

6. Show the result.
