# React Router POC

A full-stack React application demonstrating authentication, routing, and database management using React Router v7, SQLite with Drizzle ORM, and TailwindCSS.


## [DEMO](https://react-router-v7-production.up.railway.app/)


## Features

- 🔐 User Authentication (Register/Login/Logout)
- 📝 Post Management (Create/Edit/Delete)
- 🎨 Modern UI with TailwindCSS
- 🔄 Server-Side Rendering (SSR)
- 🗄️ SQLite Database with Drizzle ORM
- 🚀 TypeScript Support
- 🐳 Docker Support

## Tech Stack

- **Frontend**: React with React Router v7
- **Styling**: TailwindCSS
- **Database**: SQLite
- **ORM**: Drizzle ORM
- **Authentication**: Cookie-based sessions with bcrypt
- **Language**: TypeScript
- **Build Tool**: Vite
- **Container**: Docker

## Prerequisites

- Node.js (v20 or later recommended)
- npm/pnpm/yarn
- Docker (optional, for containerized deployment)

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Initialize the database:
```bash
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run type checking
- `npm run studio` - Open Drizzle Studio for database management
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:erd` - Generate Entity Relationship Diagram

## Project Structure

```
├── app/                    # Application source code
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── db/               # Database configuration and schemas
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   ├── services/         # Business logic services
│   └── utils/            # Utility functions
├── build/                # Build output
├── drizzle/             # Database migrations
├── public/              # Static assets
└── docker/              # Docker configuration
```

## Database Schema

The application uses two main tables:

### Users Table
- id (Primary Key)
- username (Unique)
- email (Unique)
- password (Hashed)
- timestamps (created, updated, deleted)

### Posts Table
- id (Primary Key)
- user_id (Foreign Key)
- content
- timestamps (created, updated, deleted)

## Docker Deployment

To build and run using Docker:

```bash
# Build the image
docker build -t react-router-poc .

# Run the container
docker run -p 3000:3000 react-router-poc
```