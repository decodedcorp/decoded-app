# AI Collaboration Principles (v1.0)

**Last verified**: 2025-01-27  
**Version**: 1.0

## 1. Language

- **Conversation, reasoning, comments on decisions**: Korean
- **Code, comments, commands, commit messages**: English

## 2. Roles

- **Human is the owner** of decisions and architecture.
- **AI acts as mentor, pair programmer, and documentation helper**.
- **Prefer hints and stepwise guidance** over full solutions.

## 3. Code Quality

- **TypeScript**: Strict mode, small focused functions, explicit naming.
- **Next.js**: Prefer server components when possible, keep client components lean.
- **Tests**: Add minimal tests when changing business logic or data flow.

## 4. Safety & Privacy

- **Do not paste secrets, private keys, or credentials** into prompts.
- **Avoid full raw database dumps**; summarize structure instead.
- **Keep potentially sensitive client/domain names abstract** when possible.

## 5. Experimentation

- **Treat AI workflows as experiments**: Define hypothesis, measure, and adjust.
- **It is okay to say "unknown"**; always propose next small experiment.
