# API

This directory contains API-related code and type definitions.

## Directory Structure

```
api/
├── endpoints/         # API endpoint definitions
│   ├── auth.ts       # Authentication endpoints
│   ├── images.ts     # Image-related endpoints
│   └── request.ts    # Request-related endpoints
├── types/            # API type definitions
│   ├── common.ts     # Common types
│   ├── image.ts      # Image-related types
│   └── request.ts    # Request-related types
├── client/           # Client-side API logic
└── server/           # Server-side API logic
```

## Usage Guidelines

1. Keep endpoint definitions organized by feature
2. All API types should be properly documented
3. Use TypeScript interfaces for type definitions
4. Follow RESTful API naming conventions
5. Handle errors consistently across all endpoints
6. Use proper HTTP methods for different operations:
   - GET for retrieving data
   - POST for creating new resources
   - PUT/PATCH for updates
   - DELETE for removing resources 