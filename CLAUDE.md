# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo structure

This repo is a monorepo of independent projects, each with its own `CLAUDE.md`:

- **`caroline-maxwell-website/`** — the active, modern artist portfolio site (React Router + Tailwind). See its `CLAUDE.md` for commands/architecture.
- **`dna_office/`** — the active, modern "Department of Nocturnal Affairs" site (React + Tailwind, query-string routing). See its `CLAUDE.md` for commands/architecture.
- **`all_dna/`** — legacy ASP.NET/static site that `dna_office` replaced. Kept for reference/migration source only, not actively developed. **Ignore this folder** unless explicitly asked to look at it — do not read, edit, or include it when exploring or reasoning about the codebase.

When working on `caroline-maxwell-website` or `dna_office`, treat them as separate projects: read/follow the CLAUDE.md inside that project's own directory rather than assuming shared conventions across the two.
