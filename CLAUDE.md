
# Commit messages
After finishing a prompt, add the prompt and response notes and the context size and tokens used to the end git commit description

# child session
Do not spawn child sessions.  Ask first to do that


# Memory
Make a judgement call and retain in a very consise manner info from each prompt and response for future use.
Write one line in the response that you added notes to the memmory.

## Self-correction logging

Whenever I tell you that you misunderstood something, made a mistake, or got
something wrong, do the following before continuing:
1. Write a short note describing what was misunderstood and the correct
   version, to `~/.claude/projects/<project>/memory/feedback.md` (create the
   file if it doesn't exist, append if it does).
2. Keep entries terse: one line for what went wrong, one line for the
   correct approach, dated.
3. Don't ask for permission to do this — just do it silently and continue
   with the task but write one line in the response that you did this.



