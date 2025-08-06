# Decoded App

A modern web application built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production Build

```bash
# Build the application
yarn build

# Start production server
yarn start
```

## 📚 Documentation

- **[Access Guide](docs/access-guide.md)** - How to access the development server
- **[Deployment Guide](docs/deployment.md)** - Complete deployment instructions
- **[API Documentation](docs/api/)** - API integration guides

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

#### API Configuration

API types are automatically generated and committed to Git to ensure:

- Type safety across the team
- Build stability even when API server is down
- Immediate access to API schema changes

**Note**: Generated files in `src/api/generated/` should not be manually edited as they will be overwritten on the next type generation.

### Environment Variables

Copy the example environment file and configure it:

```bash
# Copy example environment file
cp env.example .env.local

# Edit with your actual values
nano .env.local
```

#### Required Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://dev.decoded.style
API_BASE_URL=https://dev.decoded.style

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# Server Configuration
PORT=3000
```

## 🌐 Development Server

The development server is deployed on macOS Mini:

- **URL**: `http://121.130.214.186:3000`
- **Environment**: Development
- **API**: `https://dev.decoded.style`

For access instructions, see [Access Guide](docs/access-guide.md).

## 🚀 Deployment

### Quick Deployment

```bash
# Build and deploy to development server
./deploy-macos-dev.sh
```

### Manual Deployment

See [Deployment Guide](docs/deployment.md) for detailed instructions.

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API**: React Query
- **Authentication**: Google OAuth
- **Package Manager**: Yarn (PnP)

## 📁 Project Structure

```
src/
├── api/           # API integration and generated types
├── app/           # Next.js App Router pages
├── components/    # Reusable UI components
├── domains/       # Feature-based modules
├── lib/           # Utility libraries
├── shared/        # Shared components
├── store/         # State management
└── styles/        # Global styles
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type generation
5. Submit a pull request

## 📄 License

This project is private and proprietary.

---

For more information, see the [Next.js Documentation](https://nextjs.org/docs).
