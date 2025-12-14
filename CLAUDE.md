# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development server:**
```bash
npm run dev
```
Starts the development server with HMR on port 5000 (or PORT env var)

**Build:**
```bash
npm run build
```
Builds both client (Vite) and server (esbuild) to `dist/`

**Production:**
```bash
npm run start
```
Runs the production build

**Type checking:**
```bash
npm run check
```

**Database (configured but not actively used):**
```bash
npm run db:push
```
Pushes schema changes to PostgreSQL via Drizzle Kit

## Docker Deployment

**Run with Docker Compose:**
```bash
docker-compose up -d
```
Builds and runs the application in a container on port 5000

**Build Docker image:**
```bash
docker build -t mock-api-studio .
```

**Run standalone container:**
```bash
docker run -p 5000:5000 mock-api-studio
```

**Stop services:**
```bash
docker-compose down
```

The Docker setup includes:
- Multi-stage build for optimized image size
- Non-root user for security
- Health checks for container monitoring
- Optional PostgreSQL service (currently commented out)

## Architecture Overview

### Full-Stack Structure
- **Frontend**: React + TypeScript with Vite, served from `/client`
- **Backend**: Express.js server in `/server`, serves both API and static files
- **Shared**: Type definitions and Zod schemas in `/shared`
- **Single Port**: Everything served on port 5000 (development and production)

### API Architecture
The application exposes two distinct API surfaces:

1. **Configuration API** (`/api/endpoints/*`): CRUD operations for managing mock endpoint definitions
2. **Mock API** (`/mock/*`): Dynamic route handler that serves configured mock responses with validation

### Data Storage
Currently uses **in-memory storage** (`MemStorage` class) with a Map-based implementation. PostgreSQL configuration exists via Drizzle ORM but is not active. All data is stored in `server/storage.ts`.

### Path Matching
Mock endpoints support dynamic parameters (e.g., `/api/users/:id`) using regex-based pattern matching in `MemStorage.matchPath()`.

### Build System
- **Client**: Vite bundles React app to `dist/public`
- **Server**: esbuild compiles TypeScript server to `dist/index.cjs` with selective dependency bundling for optimized cold start times
- **Development**: Vite dev server integrated via middleware for HMR

### Key Technologies
- **UI**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with dark/light theme support
- **State Management**: TanStack React Query for server state
- **Validation**: Zod for TypeScript schemas, AJV for JSON Schema validation of request bodies
- **Routing**: Wouter for lightweight client-side routing

## File Structure Notes

**Core Server Files:**
- `server/index.ts`: Express app setup, logging, error handling
- `server/routes.ts`: API route definitions for both configuration and mock APIs
- `server/storage.ts`: In-memory storage implementation with path matching logic

**Shared Schema:**
- `shared/schema.ts`: Zod schemas for MockEndpoint, HttpMethod types

**Client Architecture:**
- `client/src/App.tsx`: Root component with providers (Query, Theme, Tooltip)
- `client/src/pages/home.tsx`: Main application interface (split-pane with sidebar)
- `client/src/components/`: Custom components for endpoint management
- `client/src/components/ui/`: shadcn/ui component library

## Development Patterns

### Schema Validation
- Request validation uses Zod schemas from `shared/schema.ts`
- Mock endpoint request body validation uses AJV with JSON Schema
- Permissive validation approach: "all that is not limited - allowed" (sets `additionalProperties: true` by default)

### Error Handling
- Server uses structured error responses with status codes
- Client uses React Query for automatic error handling and retries

### Mock Response Logic
- Dynamic route matching supports parameterized paths
- JSON Schema validation for request bodies (optional)
- Configurable response body and status codes
- Fallback to text response if JSON parsing fails

## Testing Endpoints
Use the built-in test functionality in the UI, or directly call:
- Mock endpoints: `GET/POST/etc /mock/{your-path}`
- Configuration API: `/api/endpoints` for CRUD operations

## Design System
Follows developer tool patterns inspired by Linear, GitHub, and Postman. See `design_guidelines.md` for complete UI specifications including typography, layout, and component patterns.