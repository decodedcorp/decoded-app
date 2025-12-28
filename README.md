# Decoded App

A modern web application built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Local Development

This project uses **Yarn** for package management.

```bash
# Clone the repository
git clone <repository-url>
cd decoded-app

# Install dependencies
yarn install

# Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Remote Development Server

For running the server persistently on Mac Mini (survives SSH disconnection):

**Quick Reference**: `tmux new -s frontend → HOST=0.0.0.0 PORT=3000 yarn dev → Ctrl+b, d`

See **[Server Setup Guide](docs/server-setup.md)** for detailed instructions including:

- tmux session management
- Development vs production server modes
- Team access configuration
- Convenience automation script

### Production Build

```bash
# Build the application
yarn build

# Start production server
yarn start
```

## 🤖 AI Dev Boilerplate

This project includes a comprehensive AI development boilerplate for multi-AI workflow (Cursor + Codex CLI + SpecKit + Claude/GPT).

### Quick Start for Spec-Driven Development

1. **Install SpecKit/Specify CLI** (separate installation required):

   ```bash
   # Via uvx (recommended)
   uvx specify

   # Or via specify init
   specify init
   ```

   Note: This boilerplate provides directory structure and templates only. SpecKit CLI installation is separate.

2. **Create a spec**:

   ```bash
   # Using SpecKit CLI (if installed)
   specify new feature FEATURE-my-feature

   # Or manually copy from template
   cp specs/feature/FEATURE-sample-feature.yml specs/feature/FEATURE-my-feature.yml
   ```

3. **Use Cursor** for implementation:
   - Cursor automatically reads specs via `.cursor/rules/spec-workflow.mdc`
   - Reference spec IDs in code: `// spec: FEATURE-xxx - description`

4. **Use Codex CLI** for terminal-based work:

   ```bash
   # Copy config to global location first
   cp .codex/config.toml ~/.codex/config.toml

   # Run workflow script
   scripts/run-spec-workflow.sh FEATURE-my-feature
   ```

5. **Document decisions** in ADR:
   ```bash
   cp docs/adr/ADR-0000-template.md docs/adr/ADR-YYYYMMDD-decision-name.md
   ```

### Phase 1 vs Phase 2 Setup

#### Phase 1: Core Skeleton (Essential)

- ✅ Specs directory structure (`specs/`)
- ✅ ADR templates (`docs/adr/`)
- ✅ Cursor spec-workflow rule (`.cursor/rules/spec-workflow.mdc`)
- ✅ Codex config template (`.codex/config.toml`)
- ✅ Workflow script (`scripts/run-spec-workflow.sh`)

#### Phase 2: Advanced AI Integration (Optional)

- Claude configuration (`CLAUDE.md`, `.claude/settings.json`)
- Cursor MCP configuration (`.cursor/mcp.json`, `.cursor/cli-config.json`)
- MCP reference template (`.mcp.json`)
- Comprehensive AI usage guide (`docs/ai-playbook/ai-usage-guide.md`)

**Recommendation**: Start with Phase 1, test with one small feature, then proceed to Phase 2 if needed.

### Codex CLI Setup

1. **Copy config to global location**:

   ```bash
   mkdir -p ~/.codex
   cp .codex/config.toml ~/.codex/config.toml
   ```

2. **Customize global config** as needed (model, paths, etc.)

3. **Use workflow script**:
   ```bash
   scripts/run-spec-workflow.sh FEATURE-xxx
   ```

### Claude Setup

1. **Project settings**: `.claude/settings.json` (already configured)
2. **Local settings**: Copy `.claude/settings.local.json.example` to `.claude/settings.local.json` and customize
3. **MCP reference**: See `.mcp.json` for Claude Desktop/CLI MCP configuration template

### Cursor Setup

- **Rules**: Auto-loaded from `.cursor/rules/*.mdc` (no manual configuration needed)
- **CLI Config**: `.cursor/cli-config.json` (Phase 2)
- **MCP Config**: `.cursor/mcp.json` (Phase 2)

### Documentation

- **AI Usage Guide**: `docs/ai-playbook/ai-usage-guide.md` - Comprehensive guide for all AI tools
- **ADR Template**: `docs/adr/ADR-0000-template.md` - Architecture Decision Record template
- **Spec Template**: `specs/feature/FEATURE-sample-feature.yml` - Feature specification template

## 📚 Documentation

- **[Access Guide](docs/access-guide.md)** - How to access the development server
- **[Server Setup Guide](docs/server-setup.md)** - Persistent server setup on Mac Mini using tmux
- **[Deployment Guide](docs/deployment.md)** - Complete deployment instructions
- **[API Documentation](docs/api/)** - API integration guides
- **[AI Playbook](docs/ai-playbook/ai-usage-guide.md)** - AI tool usage guide

## 🔧 Development

### API Type Generation

This project uses OpenAPI TypeScript codegen to generate API types from the backend OpenAPI specification.

#### Generate API Types

```bash
# Generate types from development API
yarn typegen:dev

# Before committing (automatically updates types)
yarn pre-commit
```

### Testing

```bash
# Run tests
yarn test

# Run tests in UI mode
yarn test:ui

# Run tests in headed mode
yarn test:headed
```

### Linting and Type Checking

```bash
# Run linter
yarn lint

# Type check
yarn type-check
```

## 📦 Project Structure

```
src/
├── app/           # Next.js app router pages
├── domains/       # Feature-based modules (auth, channels, profile, etc.)
├── shared/        # Shared components and utilities
├── styles/        # Global styles and design tokens
├── lib/           # Library utilities and hooks
├── store/         # Zustand state management
├── constants/     # Application constants
└── types/         # TypeScript type definitions

specs/             # Spec-driven development specs
├── feature/       # Feature specifications
├── bugfix/        # Bugfix specifications
└── experiment/    # Experiment specifications

docs/
├── adr/           # Architecture Decision Records
└── ai-playbook/   # AI tool usage guides

.cursor/
├── rules/         # Cursor AI rules
├── cli-config.json # Cursor CLI configuration
└── mcp.json       # MCP server configuration

.codex/
└── config.toml   # Codex CLI configuration template

.claude/
├── settings.json           # Claude Code settings
└── settings.local.json.example # Local settings template
```

## 📦 Package Management: Yarn Berry PnP

This project uses **Yarn Berry (v4.9.2) with Plug'n'Play (PnP)** mode, following [Toss's best practices](https://toss.tech/article/node-modules-and-yarn-berry).

### Key Benefits

- **Zero-Install**: Dependencies are version-controlled (`.pnp.cjs`, `.yarn/cache/`) - no `yarn install` needed after clone
- **Faster CI/CD**: Saves 60-90 seconds per build (no dependency installation step)
- **Guaranteed Correctness**: No phantom dependencies, strict dependency validation
- **Smaller Repository**: ~139MB vs ~1.2GB with node_modules (2,000 zip files vs 135,000 files)
- **Better Performance**: Faster dependency resolution, no deep directory traversal

### Configuration

- **PnP Mode**: `nodeLinker: pnp` in `.yarnrc.yml`
- **Loose Mode**: `pnpMode: loose` for compatibility
- **Zero-Install**: `.pnp.cjs` and `.yarn/cache/` are committed to Git

### Usage

```bash
# Add a dependency
yarn add <package-name>

# Add a dev dependency
yarn add -D <package-name>

# Update dependencies
yarn upgrade

# Run scripts (no node_modules needed!)
yarn dev
yarn build
yarn test
```

### Important Notes

- **Never use `npm`** - Always use `yarn` commands
- **No `node_modules` directory** - Dependencies resolved via PnP
- **For CLI tools**: Use `yarn dlx` instead of `npx`
- **IDE Support**: Install [ZipFS extension](https://marketplace.visualstudio.com/items?itemName=arcanis.vscode-zipfs) for VS Code/Cursor

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.4.1, React 19.1.0, TypeScript 5.9.2
- **Styling**: Tailwind CSS 4.1.11 with custom design system
- **State Management**: Zustand 5.0.6, React Query 5.83.0
- **Testing**: Playwright 1.55.0
- **Build Tools**: Yarn 4.9.2 (PnP), ESLint, TypeScript
- **Deployment**: Vercel

## 📝 License

[Add your license information here]
