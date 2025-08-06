# Decoded App

A modern web application built with Next.js, TypeScript, and Tailwind CSS.

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Type Generation

This project uses OpenAPI TypeScript codegen to generate API types from the backend OpenAPI specification.

### Generate API Types

```bash
# Generate types from development API
yarn typegen:dev

# Before committing (automatically updates types)
yarn pre-commit
```

### API Configuration

API types are automatically generated and committed to Git to ensure:

- Type safety across the team
- Build stability even when API server is down
- Immediate access to API schema changes

**Note**: Generated files in `src/api/generated/` should not be manually edited as they will be overwritten on the next type generation.

## Environment Variables

Create a `.env` file in the root directory:

```bash
NEXT_PUBLIC_APP_ENV=local
NEXT_PUBLIC_API_BASE_URL=http://dev.decoded.style
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
