


# Global Instruction

## Commit messages
After finishing a prompt, add the prompt and response notes and the context size and tokens used to the end git commit description

## child session
Do not spawn child sessions.  Ask first before doing that and describe why and if it can be done without it.


# Memory

## Project memory

Whenever you learn something durable about this project or how I like to
work — a preference, a convention, a decision, a piece of context that
would otherwise have to be re-explained next session — save it without
being asked:

1. Find the current project's root directory (the top of the git repo, or
   the working directory if it's not a repo).
2. Create `.claude/memory.md` there if it doesn't already exist.
3. Append a new entry:

   ## YYYY-MM-DD
   - **Note:** <one line — the fact, preference, or decision>
   - **Context:** <optional one line — why this came up>

4. Keep entries short and durable — things worth knowing next week, not
   blow-by-blow narration of the current task. Don't log things already
   captured in `.claude/corrections.md`.
5. Do this silently, without asking permission or announcing it.
6. At the start of any session in a project, if `.claude/memory.md` exists,
   read it and treat its contents as standing context for how to work here.


## Self-correction logging

Whenever I tell you that you misunderstood something, got something wrong,
or made a mistake, do this before continuing with anything else:

1. Find the current project's root directory (the top of the git repo, or
   the working directory if it's not a repo).
2. Create `.claude/corrections.md` there if it doesn't already exist.
3. Append a new entry in this format:

   ## YYYY-MM-DD
   - **Misunderstood:** <one line — what you got wrong or assumed incorrectly>
   - **Correct:** <one line — the actual fact, preference, or approach>
   - **Context:** <optional one line — what task/file this came up in>

4. Do this silently — don't ask permission, don't announce it, just log it
   and move on with the task.
5. At the start of any session in a project, if `.claude/corrections.md`
   exists, read it and treat its contents as standing instructions — don't
   repeat the same mistake twice.

