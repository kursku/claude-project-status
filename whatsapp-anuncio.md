# Texto para WhatsApp — Anúncio do Plugin

Copie abaixo e cole no WhatsApp. A formatação já está pronta (negrito com asteriscos, monospace com crases).

---

*🧠 Nunca mais perder contexto entre sessões com o Claude*

Sabe quando você tá trabalhando num projeto com o Claude, para por uns dias, e quando volta ele não lembra de nada do que vocês fizeram juntos?

Criei uma ferramenta que resolve isso. Ela faz o Claude salvar automaticamente:
- Em que fase o projeto tá
- O que foi decidido e por quê
- Quais são os próximos passos

Aí quando você volta, ele já sabe exatamente onde parou.

---

*Como usar no Cowork (claude.ai)*

No final de cada sessão produtiva, cola isso no chat:

```
Analise nossa sessão e atualize o STATUS do projeto no formato abaixo. Cole no topo do CLAUDE.md do projeto:

<!-- STATUS
projeto: [nome]
fase: [fase atual]
proximas_tarefas:
  - [tarefa 1]
  - [tarefa 2]
ultima_decisao: [o que decidimos e por quê]
ultima_sessao: [data de hoje]
prioridade: [alta/média/baixa]
-->

Depois appende um resumo em SUMMARY.md com: o que foi feito, decisão tomada, próximo passo.
```

Pronto. Na próxima sessão, quando abrir o projeto, o Claude lê o CLAUDE.md e já tem todo o contexto.

---

*Como usar no VS Code (Claude Code)*

Pra quem já usa o Claude Code no VS Code, é ainda mais fácil. Instala o plugin com:

```
claude plugin add kursku/claude-project-status
```

Depois é só digitar:
- `/update-status` → salva o estado do projeto
- `/dashboard` → mostra todos os projetos de uma vez
- `/prioritize` → sugere qual projeto trabalhar agora

Ele ainda detecta sozinho quando você editou arquivos e marca o projeto pra atualizar.

---

*Resumindo*

| Onde usa | Como faz |
| Cowork (claude.ai) | Cola o prompt acima no final da sessão |
| VS Code (Claude Code) | Instala o plugin e usa /update-status |

O resultado é o mesmo: nunca mais começar do zero quando voltar num projeto.

Quem quiser ajuda pra configurar, me chama aqui 👇
