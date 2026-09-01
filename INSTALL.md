# Instalação Manual

Se preferir não usar o marketplace, siga estes passos:

## 1. Clone o repositório

```bash
git clone https://github.com/kursku/claude-project-status.git
```

## 2. Copie os skills

```bash
# Crie o diretório de skills se não existir
mkdir -p ~/.claude/skills

# Copie os 3 skills
cp -r claude-project-status/skills/update-status ~/.claude/skills/
cp -r claude-project-status/skills/dashboard ~/.claude/skills/
cp -r claude-project-status/skills/prioritize ~/.claude/skills/
```

## 3. Copie os scripts

```bash
mkdir -p ~/.claude/scripts
cp claude-project-status/scripts/*.js ~/.claude/scripts/
```

## 4. Configure os diretórios a escanear

Crie `~/.project-status.json`:

```json
{
  "scanDirs": [
    "/caminho/para/seus/projetos",
    "/outro/diretorio"
  ]
}
```

`~` em `scanDirs` é expandido para o home. Use `scanDepth` (default `1`) para
escanear níveis mais profundos, ex.: `"scanDirs": ["~/Voyager"], "scanDepth": 2`
em layouts com hubs (`hub/projeto/CLAUDE.md`).

## 5. (Opcional) Configure o hook Stop

No seu `~/.claude/settings.json`, adicione:

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "node ~/.claude/scripts/session-summary.js"
      }
    ]
  }
}
```

## 6. (Opcional) Configure hooks pós-update

Em `~/.project-status.json`, adicione scripts que rodam após cada `/update-status`:

```json
{
  "scanDirs": ["~/projects"],
  "hooks": {
    "post-update": [
      "node ~/meu-script/sync.js",
      "curl -X POST https://meu-webhook.com/updated"
    ]
  }
}
```

## Uso

Abra qualquer projeto e rode:

- `/update-status` — salva o estado atual
- `/dashboard` — visão geral de todos os projetos
- `/prioritize` — sugere o que trabalhar agora

Na primeira vez, o `/update-status` cria o STATUS block automaticamente no CLAUDE.md do projeto.
