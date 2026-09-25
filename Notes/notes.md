

# how are any other md files read

Good specific questions — here's how it actually works.

**Other .md files do get pulled in, via an import syntax.** CLAUDE.md supports `@path/to/file.md` references anywhere in the file (outside of code blocks/backticks, which are treated as literal text rather than an import). So you can write something like:

```markdown
See @docs/architecture.md for the system design.
@docs/git-conventions.md
```

and both files get expanded inline into context at session start. Imports can be relative or absolute paths, they can chain recursively (an imported file can itself import others), up to a max depth of 4 hops, and an import pointing outside the project directory triggers a one-time approval prompt (except your own `~/.claude/CLAUDE.md`, which is always trusted). Note this doesn't save tokens — it's purely organizational, since the content still gets loaded, just split across files instead of one giant CLAUDE.md.

**So to answer directly: yes, a random .md file needs to be referenced somewhere** to be automatically included — either imported from CLAUDE.md (or from a file CLAUDE.md imports, etc.), or it needs to live in one of the special recognized locations below. Otherwise it only gets read if the model decides to open it itself during normal exploration (e.g., it greps the repo, notices `ARCHITECTURE.md`, and reads it because it seems relevant) — that's a judgment call by the model each session, not something guaranteed.

**Files/locations Claude Code auto-discovers by convention, no reference needed:**

| Location | What it is | When it loads |
|---|---|---|
| `CLAUDE.md` (project root + nested dirs) | Project instructions | Session start (nested ones lazily as Claude works in that subdirectory) |
| `CLAUDE.local.md` | Personal project instructions | Session start |
| `~/.claude/CLAUDE.md` | Global instructions across all projects | Session start |
| `.claude/rules/*.md` | Rule files, optionally scoped to matching file paths via frontmatter | Session start, or on-demand if path-scoped |
| `.claude/skills/*/SKILL.md`, `~/.claude/skills/`, plugin skills | Skill definitions | Descriptions loaded at startup; full body only when a skill is actually invoked |
| `.claude/commands/*.md` | Slash command definitions | Descriptions loaded at startup; full body when the command is invoked |
| `.claude/agents/*.md` | Subagent definitions | Loaded when that subagent is invoked |
| `.claude/settings.json`, `settings.local.json`, `~/.claude/settings.json` | Config/permissions | Session start |
| `.mcp.json` | MCP server definitions | Session start |

Everything else — a loose `NOTES.md`, a `README.md` you never mentioned, a design doc sitting in a subfolder — is invisible to Claude Code unless it's imported from CLAUDE.md or the model happens to open it while exploring the repo.

Sources: [Claude Code memory docs](https://code.claude.com/docs/en/memory), [context window docs](https://code.claude.com/docs/en/context-window), [skills docs](https://code.claude.com/docs/en/skills)


