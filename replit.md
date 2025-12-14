# MockAPI - REST API Mock Service

## Overview

MockAPI is a developer tool for creating and managing mock REST API endpoints. It allows users to configure custom endpoints with JSON validation schemas and fixed responses, enabling API simulation for testing and development purposes. The application provides a split-pane interface with an endpoint list sidebar and a main content area for editing endpoint configurations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and data fetching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Design Pattern**: Developer tool pattern inspired by Linear, GitHub, and Postman with emphasis on information density and code-centric displays

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **API Structure**: RESTful API with two route categories:
  1. Configuration API (`/api/endpoints/*`) - CRUD operations for managing mock endpoint definitions
  2. Mock API (`/mock/*`) - Dynamic route handler that serves configured mock responses
- **Validation**: Zod for request validation, AJV for JSON Schema validation of mock endpoint request bodies
- **Development Server**: Vite middleware integration for HMR in development

### Data Storage
- **Current Implementation**: In-memory storage using a Map data structure (`MemStorage` class)
- **Schema Definition**: Drizzle ORM with Zod integration for type-safe schema definitions
- **Database Ready**: PostgreSQL configuration exists via Drizzle Kit, but currently uses memory storage
- **Data Model**: MockEndpoint with fields: id, method, path, validationSchema, response, statusCode

### Path Matching
The mock API supports dynamic route parameters (e.g., `/api/users/:id`) using regex-based pattern matching to handle parameterized routes.

### Build System
- **Client Build**: Vite bundles React app to `dist/public`
- **Server Build**: esbuild compiles TypeScript server with selective dependency bundling for optimized cold start times
- **Output Format**: CommonJS for production server bundle

## External Dependencies

### UI Libraries
- Radix UI primitives for accessible components
- Lucide React for icons
- class-variance-authority for component variants
- cmdk for command palette functionality

### Data & Validation
- TanStack React Query for data fetching
- Zod for schema validation
- AJV with ajv-formats for JSON Schema validation

### Database (configured but not actively used)
- Drizzle ORM for database operations
- PostgreSQL driver (pg)
- connect-pg-simple for session storage

### Development Tools
- Vite with React plugin
- Replit-specific plugins for development overlay and cartographer