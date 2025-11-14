# UCID App - Career Path Explorer

A Domain-Driven Design application to help UC/DAAP students discover personalized career paths based on their talents and interests.

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Setup Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

The backend will run on `http://localhost:3001`

**Note:** After seeding, copy the test student ID from the console output and update it in `frontend/src/App.tsx`

### 2. Setup Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
ucid-app/
├── backend/              # Express + Prisma backend
│   ├── src/
│   │   ├── student/      # Student profile services
│   │   ├── recommendation/ # Recommendation engine
│   │   └── index.ts      # Express server
│   └── prisma/
│       ├── schema.prisma # Database schema
│       └── seed.ts       # Seed data
├── frontend/             # React + Vite + Tailwind
│   └── src/
│       ├── components/   # React components
│       └── styles/       # CSS with design system
└── 1-domain/             # Domain model documentation
```

## API Endpoints

- `POST /api/v1/students/:id/quiz` - Submit quiz (talents & interests)
- `GET /api/v1/recommendations/students/:id/paths` - Get career paths

## Design System

The frontend uses a clean, minimal, high-contrast design system:
- Black/white color scheme
- 2px bold borders
- System fonts (SF Pro Display)
- Generous spacing
- Inverted hover states

See `CSS-AESTHETIC-GUIDELINES.md` for full details.

## Development

### Backend
- `npm run dev` - Start dev server with hot reload
- `npm run build` - Build for production
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:seed` - Seed database

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Database

Uses SQLite for development (easy to launch). The schema includes:
- Students, Interests, Talents
- Industries, Subfields, SkillTrees
- Skills, Courses, SkillProgress
- CoopOpportunities

## License

Internal UC/DAAP project

