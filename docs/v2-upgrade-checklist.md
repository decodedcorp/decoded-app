# 🔧 Decoded v2 Upgrade Setup Checklist

**Date: 2024-06-13**

## ✅ Project Initialization

- [x] Create and set up the `feature/decoded-v2` branch as the base branch
- [x] Backup existing directories → move to `__backup/` folder
- [x] Initialize new project directory (`npx create-next-app`)
- [x] Configure to use Webpack (do not use Turbopack)

## ✅ Tech Stack Versions

- [x] Next.js `15.4.1`
- [x] React `19.1.0`
- [x] TypeScript `5.x`
- [x] Tailwind CSS `4.x`
- [x] ESLint `9.x`

## ✅ Configuration Files

- [x] Create `tailwind.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `.eslintrc.json`, `.prettierrc`, `.editorconfig`, etc.
- [x] Integrate Tailwind with PostCSS

## ✅ Directory Structure (Reference: Toss Structure)

```
src/
 ┣ app/             ← Next.js App Router
 ┣ domains/         ← Domain modules by feature
 ┣ shared/
 ┃ ┣ components/
 ┃ ┣ hooks/
 ┃ ┗ utils/
 ┣ constants/
 ┣ styles/
 ┣ lib/
 ┗ types/
```

## ✅ Cursor Rules & Documentation

- [x] Refer to `@frontend-fundamentals` ([https://frontend-fundamentals.com](https://frontend-fundamentals.com))
  - code-quality
  - bundling

## 📚 Documentation (docs/)

- [x] Started writing `docs/v2-upgrade-checklist.md`
- [ ] Record detailed reasons for technology adoption and configuration decisions
- [ ] Summarize best practices based on Toss documentation

---

> Next steps: Start developing base UI components, set up layout, and create basic pages
