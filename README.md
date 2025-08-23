# CouchKlub Backend

A modern Bun HTTP server with file-system based routing for managing users, clubs, and games in a gaming platform.

## Architecture

This project uses a clean, modular architecture:

- **File-system based routing** - Routes are automatically generated from the `src/routes/` directory structure
- **Service layer** - Business logic separated into dedicated service files
- **Type-safe models** - TypeScript interfaces for all data structures
- **In-memory storage** - Fast data access using Maps for development

## Project Structure

```
src/
├── index.ts              # Main server with FileSystemRouter
├── models/               # TypeScript interfaces
│   ├── User.ts
│   ├── Club.ts
│   └── Game.ts
├── services/             # Business logic layer
│   ├── userService.ts
│   ├── clubService.ts
│   └── gameService.ts
├── routes/               # File-system based API routes
│   ├── health-check/
│   ├── users/
│   ├── clubs/
│   └── games/
└── utils/
    └── fileSystemRouter.ts
```

## Setup

1. Install dependencies:
```bash
bun install
```

2. Run in development mode:
```bash
bun run dev
```

3. Run in production mode:
```bash
bun run start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Users
- `GET /users` - Get all users
- `POST /users` - Create a new user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Clubs
- `GET /clubs` - Get all clubs
- `POST /clubs` - Create a new club
- `GET /clubs/:id` - Get club by ID
- `PUT /clubs/:id` - Update club
- `DELETE /clubs/:id` - Delete club
- `POST /clubs/:id/members/:userId` - Add member to club
- `DELETE /clubs/:id/members/:userId` - Remove member from club

### Games
- `GET /games` - Get all games
- `GET /games?clubId=:clubId` - Get games by club
- `POST /games` - Create a new game
- `GET /games/:id` - Get game by ID
- `PUT /games/:id` - Update game
- `DELETE /games/:id` - Delete game
- `POST /games/:id/players/:userId` - Add player to game
- `DELETE /games/:id/players/:userId` - Remove player from game

## Example API Calls

### Create a User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Create a Club
```bash
curl -X POST http://localhost:3000/clubs \
  -H "Content-Type: application/json" \
  -d '{"name": "Gaming Club", "description": "A club for gamers", "ownerId": "user-id-here"}'
```

### Create a Game
```bash
curl -X POST http://localhost:3000/games \
  -H "Content-Type: application/json" \
  -d '{"name": "Chess Tournament", "description": "Weekly chess tournament", "clubId": "club-id-here", "createdBy": "user-id-here"}'
```

### Get All Users
```bash
curl http://localhost:3000/users
```

### Update a User
```bash
curl -X PUT http://localhost:3000/users/user-id-here \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe"}'
```

### Add Member to Club
```bash
curl -X POST http://localhost:3000/clubs/club-id-here/members/user-id-here
```

### Update Game Status
```bash
curl -X PUT http://localhost:3000/games/game-id-here \
  -H "Content-Type: application/json" \
  -d '{"status": "active"}'
```

## Data Models

### User
```typescript
{
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Club
```typescript
{
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Game
```typescript
{
  id: string;
  name: string;
  description: string;
  clubId: string;
  createdBy: string;
  players: string[];
  status: 'pending' | 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
```

## Features

- **File-system based routing** - Automatic route generation from folder structure
- **Modular architecture** - Separated concerns with services and models
- **In-memory storage** - Fast data access using Maps
- **CORS enabled** - Ready for frontend integration
- **Input validation** - Basic validation for required fields
- **Error handling** - Proper HTTP status codes and error messages
- **TypeScript** - Full type safety throughout the application
- **Relationship validation** - Checks for valid user/club references

## Development

The project follows Next.js-style file-system routing conventions:
- `index.ts` files handle the base route
- `[id].ts` files handle dynamic parameters
- Nested folders create nested routes
- Each route file exports HTTP method handlers (GET, POST, PUT, DELETE)

Route handlers receive:
- `req: Request` - The incoming request
- `corsHeaders: Record<string, string>` - CORS headers to include in response
- `query: Record<string, string>` - Query parameters (for dynamic routes)
