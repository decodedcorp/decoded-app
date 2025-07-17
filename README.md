# Decoded Frontend App

> A curation-driven platform to empower everyone to become the master of their own taste.

## ✨ Vision

**"Unravel stories through taste — so that everyone can own and express their unique preferences."**

Decoded is a taste-sharing platform designed to spotlight the stories behind individual preferences. Whether it’s fashion, design, music, or subcultures, we help communities showcase and explore what resonates with them most.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (with App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Bundler**: Webpack (Turbopack intentionally excluded)
- **Linting**: ESLint, Prettier
- **Documentation**: VitePress
- **Package Manager**: Yarn 4 (Berry, PnP)

## 🗂 Project Structure (Toss-style)

```
src/
├── app/                # Next.js routing entry
├── domains/            # Domain-driven features
├── shared/
│   ├── components/     # Shared UI components
│   ├── hooks/          # Reusable hooks
│   ├── utils/          # Utility functions
├── lib/                # External libraries or wrappers
├── styles/             # Global and shared styles
├── types/              # Global types
├── constants/          # Constants across the app
├── tests/              # Unit and integration tests
```

## 📦 Getting Started

```bash
yarn install
yarn dev
```

## ✅ Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format:

```
feat: Add new feature
fix: Fix a bug
chore: Update config or tools
refactor: Refactor code without feature change
docs: Update documentation
style: Fix linting issues or code formatting
```

## 📚 Docs

Development practices are documented in:

```
/docs/v2-upgrade.md         # v2 refactor steps & checklist
/cursor/rules/*             # Cursor lint rules and shared standards
```

---

Built with purpose by the Decoded Team.
