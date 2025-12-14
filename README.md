# Mock API Studio

A powerful and intuitive tool for creating, managing, and testing mock API endpoints. Built with React, TypeScript, and Express.js, Mock API Studio provides a clean interface for setting up mock servers with dynamic routing, request validation, and customizable responses.

## Features

- **Dynamic API Mocking**: Create mock endpoints with support for path parameters (e.g., `/api/users/:id`)
- **Request Validation**: JSON Schema-based validation for request bodies
- **Real-time Testing**: Built-in interface for testing your mock endpoints
- **Modern UI**: Clean, developer-friendly interface built with shadcn/ui components
- **In-memory Storage**: Fast, lightweight data storage (with PostgreSQL support available)
- **Hot Reloading**: Instant updates during development
- **Docker Support**: Containerized deployment with Docker Compose

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
git clone <repository-url>
cd Mock-API-Studio
npm install
```

### Development

Start the development server with hot reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Production Build

```bash
npm run build
npm run start
```

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

### Manual Docker Build

```bash
docker build -t mock-api-studio .
docker run -p 5000:5000 mock-api-studio
```

## Usage

### Creating Mock Endpoints

1. Open the application in your browser
2. Use the sidebar to create new mock endpoints
3. Configure:
   - **Path**: URL path with optional parameters (e.g., `/api/users/:id`)
   - **HTTP Method**: GET, POST, PUT, DELETE, PATCH
   - **Response Body**: JSON or plain text response
   - **Status Code**: HTTP status code to return
   - **Request Schema** (optional): JSON Schema for request validation

### Testing Endpoints

Use the built-in test interface or make direct HTTP requests:

- **Mock API**: `http://localhost:5000/mock/{your-path}`
- **Configuration API**: `http://localhost:5000/api/endpoints`

### Example Mock Endpoint

```json
{
  "path": "/api/users/:id",
  "method": "GET",
  "responseBody": {
    "id": "{{id}}",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "statusCode": 200
}
```

## API Reference

### Configuration API

- `GET /api/endpoints` - List all mock endpoints
- `POST /api/endpoints` - Create new mock endpoint
- `PUT /api/endpoints/:id` - Update existing endpoint
- `DELETE /api/endpoints/:id` - Delete endpoint

### Mock API

- `ANY /mock/*` - Serves configured mock responses with dynamic route matching

## Architecture

### Tech Stack

- **Frontend**: React 18, TypeScript, Vite, shadcn/ui, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Validation**: Zod schemas, AJV for JSON Schema
- **State Management**: TanStack React Query
- **Routing**: Wouter (client), Express (server)

### Project Structure

```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components  
│   │   └── lib/         # Utilities
├── server/           # Express backend
│   ├── index.ts        # Server entry point
│   ├── routes.ts       # API routes
│   └── storage.ts      # Data storage layer
├── shared/           # Shared TypeScript types
└── script/           # Build scripts
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run check` | Type checking with TypeScript |
| `npm run db:push` | Push database schema changes (if using PostgreSQL) |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Run type checking: `npm run check`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

## License

MIT License - see LICENSE file for details