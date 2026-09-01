# claude-project-status

Track project status across multiple repos. Never lose context when switching projects.

## What it does

When you work on multiple projects with Claude Code, context gets lost between sessions. This plugin solves that with:

- **STATUS blocks** in each project's `CLAUDE.md` — machine-readable state
- **SUMMARY.md** per project — append-only session log
- **Central dashboard** (`~/PROJECTS.md`) — bird's-eye view of all projects
- **Priority analysis** — suggests what to work on next
- **Auto-detection** — hook marks projects as needing update when you edit files

## Installation

### Plugin (recommended)

```bash
claude plugin add kursku/claude-project-status
```

### Manual

```bash
git clone https://github.com/kursku/claude-project-status.git ~/.claude/plugins/claude-project-status

# Copy skills to your skills directory
cp -r ~/.claude/plugins/claude-project-status/skills/* ~/.claude/skills/
```

## Commands

| Command | What it does |
|---------|-------------|
| `/update-status` | Updates STATUS block + appends SUMMARY.md + regenerates dashboard |
| `/dashboard` | Generates and shows the project dashboard with commentary |
| `/prioritize` | Analyzes all projects and suggests top priorities |

## How it works

### STATUS block format

Each project's `CLAUDE.md` gets a machine-readable block at the top:

```html
<!-- STATUS
projeto: my-project
fase: MVP - Authentication
proximas_tarefas:
  - implement OAuth flow
  - add session management
ultima_decisao: chose JWT over sessions for stateless scaling
ultima_sessao: 2026-05-26
prioridade: alta
-->
```

### Configuration

Create `~/.project-status.json` to customize behavior:

```json
{
  "scanDirs": [
    "~/projects",
    "~/work",
    "~/personal"
  ],
  "hooks": {
    "post-update": [
      "node ~/my-scripts/sync-something.js"
    ]
  }
}
```

**`scanDirs`** — directories to scan for projects with STATUS blocks (default: home directory). A leading `~` is expanded to your home directory.

**`scanDepth`** — how many directory levels to recurse into each `scanDirs` entry looking for `CLAUDE.md` (default: `1`, i.e. only direct subdirectories). Useful for hub-style layouts, e.g.:

```json
{
  "scanDirs": ["~/Voyager"],
  "scanDepth": 2
}
```

**`hooks.post-update`** — commands to run after `/update-status` completes (e.g., sync to a database, notify a webhook)

### Dashboard output

The dashboard is generated at `~/PROJECTS.md` and looks like:

```markdown
# Projects Dashboard
_Updated: 2026-05-26 14:30_

---

## my-saas — 🔴 alta
**Phase:** MVP - Auth
**Last session:** 2026-05-26
**Last decision:** chose JWT for stateless scaling
**Next tasks:**
- implement OAuth flow
- add session management

## blog — 🟢 baixa
**Phase:** Content - SEO
**Last session:** 2026-05-20
...
```

## Requirements

- Claude Code CLI
- Node.js 18+

## License

MIT
