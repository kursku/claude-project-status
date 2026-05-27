# Texto para WhatsApp — Guia de Instalação e Uso

---

*🧠 Plugin: Project Status — nunca mais perder contexto entre sessões*

Esse plugin faz o Claude salvar onde você parou em cada projeto. Quando voltar, ele já sabe o contexto completo: fase, decisões, próximos passos.

---

*📦 Como instalar (VS Code com Claude Code)*

1. Abre o terminal no VS Code
2. Digita:

```
claude plugin add kursku/claude-project-status
```

3. Pronto. Agora você tem 3 comandos novos:
- `/update-status` → salva o estado do projeto
- `/dashboard` → mostra todos os projetos
- `/prioritize` → sugere o que trabalhar agora

4. (Opcional) Cria um arquivo chamado `.project-status.json` na sua pasta de usuário pra dizer onde ficam seus projetos.

*Onde fica a pasta de usuário?*
- Windows: `C:\Users\SEU-NOME\` (ex: `C:\Users\maria\`)
- Mac: `/Users/SEU-NOME/`

Então o arquivo fica em:
- Windows: `C:\Users\maria\.project-status.json`
- Mac: `/Users/maria/.project-status.json`

Conteúdo do arquivo:

```
{
  "scanDirs": ["C:/Users/maria/meus-projetos"]
}
```

Troca `maria` pelo seu nome de usuário e `meus-projetos` pela pasta onde ficam seus projetos.

---

*💬 Como instalar no Cowork (claude.ai/code)*

1. Abre o Cowork
2. Digita no chat:

```
/plugin install claude-project-status@kursku
```

Se pedir pra adicionar o marketplace, aceita. Ele vai buscar direto do GitHub.

*Se não funcionar automaticamente*, adiciona manualmente:
- Abre Settings (engrenagem)
- Vai em *Plugins* ou *Plugin Marketplaces*
- Adiciona como marketplace extra:
  - Nome: `kursku`
  - Repo: `kursku/claude-project-status`
- Depois instala: `/plugin install claude-project-status@kursku`

Pronto. Agora você tem os mesmos 3 comandos:
- `/update-status` → salva o estado do projeto
- `/dashboard` → mostra todos os projetos
- `/prioritize` → sugere o que trabalhar agora

---

*💡 Alternativa: usar sem instalar plugin (funciona em qualquer lugar)*

Se não quiser instalar o plugin, pode usar o método manual. No final de cada sessão produtiva, manda isso pro Claude:

```
Analise nossa sessão e atualize o STATUS do projeto. Cole no topo do CLAUDE.md:

<!-- STATUS
projeto: [nome do projeto]
fase: [fase atual]
proximas_tarefas:
  - [tarefa 1]
  - [tarefa 2]
ultima_decisao: [o que decidimos e por quê]
ultima_sessao: [data de hoje]
prioridade: [alta/média/baixa]
-->

Depois appende um resumo da sessão no SUMMARY.md com: o que foi feito, decisão tomada, próximo passo.
```

Na próxima vez que abrir o projeto, o Claude lê o CLAUDE.md e já tem todo o contexto.

---

*Dica:* quanto mais você usar, melhor fica. Depois de algumas sessões você tem um histórico completo do projeto no SUMMARY.md — tipo um diário de bordo automático.

Dúvidas? Manda aqui 👇
