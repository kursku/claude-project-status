---
name: update-status
description: Updates the STATUS block in the current project's CLAUDE.md and appends a session entry to SUMMARY.md
---

# Update Status

Save the current project state so future sessions can resume with full context.

## Steps

1. **Read** the `CLAUDE.md` in the current directory (if it exists)

2. **Analyze** the current session and identify:
   - Current project phase (e.g., "MVP - Auth", "Refactor - Data layer")
   - The next 2-3 most concrete, actionable tasks
   - The most relevant decision made this session and why
   - Current priority level: `alta`, `média`, or `baixa`

3. **Update** the `<!-- STATUS ... -->` block at the TOP of `CLAUDE.md` with this exact format:

```
<!-- STATUS
projeto: <project name>
fase: <current phase>
proximas_tarefas:
  - <task 1>
  - <task 2>
ultima_decisao: <decision + reason in one line>
ultima_sessao: <today's date YYYY-MM-DD>
prioridade: <alta|média|baixa>
-->
```

If the block doesn't exist, create it before any other content.
If `CLAUDE.md` doesn't exist, create it with the block.

4. **Append** to `SUMMARY.md` in the project directory (create if it doesn't exist):

```markdown
## <YYYY-MM-DD>
- <what was implemented/modified>
- <decision made and why>
- <agreed next step>
```

5. **Run post-update hooks** (if configured in `.project-status.json`):
```bash
node ~/.claude/plugins/*/scripts/run-hooks.js post-update
```
Ignore errors silently if no hooks are configured.

6. **Regenerate dashboard**:
```bash
node ~/.claude/plugins/*/scripts/generate-dashboard.js 2>/dev/null || true
```

7. **Confirm** to the user: project updated, SUMMARY.md appended, dashboard regenerated.
