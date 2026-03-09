# Rooted Web App

A unified web application hosting two platforms:
1. **Machine IoT** - BLE-based device provisioning for Raspberry Pi machines
2. **Rooted Planner** - Microgreen farm management ERP system

## Project Structure

```
Rooted-Web-App/
├── src/                    # Frontend source
│   ├── machines/          # Machine IoT platform
│   │   ├── device-discovery/
│   │   ├── wifi-provisioning/
│   │   ├── dashboard/
│   │   └── lib/
│   ├── planner/           # Rooted Planner platform
│   └── lib/               # Shared frontend utilities
├── apps/
│   └── api/               # Backend API server
│       ├── src/
│       │   ├── domains/   # Domain-driven logic
│       │   │   ├── machine-domain/
│       │   │   ├── admin-domain/
│       │   │   ├── onboarding-domain/
│       │   │   └── planner-domain/
│       │   └── lib/       # Shared backend utilities
│       └── prisma/        # Database schema
├── shared/                # Shared code (Frontend & API)
│   ├── ui/                # Shared UI components
│   ├── types/             # Shared TypeScript types
│   └── api-types/         # Shared API definitions
├── pi-src/                # Raspberry Pi BLE service
└── docs/                  # Documentation
```

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for detailed structure.

## Platforms

### Machine IoT
Web-based BLE provisioning for IoT devices. Scan, connect, and configure WiFi on Raspberry Pi machines directly from your browser.

- **Technology**: React + Web Bluetooth API + Python (bluezero)
- **Routes**: `/machines/*`
- **Browser Support**: Chrome, Edge (desktop & Android)

### Rooted Planner
Microgreen farm management application for production workflow management.

- **Technology**: React + tRPC + Fastify + PostgreSQL
- **Routes**: `/planner/*`
- **Authentication**: Clerk

## Architecture

```mermaid
graph TB
    subgraph "Frontend (Vite)"
        ROUTER[React Router]
        MACHINES[Machine IoT]
        PLANNER[Rooted Planner]
        SHARED[Shared UI]
    end
    
    subgraph "Backend API (Fastify)"
        API[tRPC Server]
        MACHINE_DOMAIN[Machine Domain]
        PLANNER_DOMAIN[Planner Domain]
    end
    
    subgraph "Infrastructure"
        PI[Raspberry Pi + BLE]
        DB[(PostgreSQL - Relational)]
        TIMESCALE[(TimescaleDB - Telemetry)]
        REDIS[(Redis Cache)]
    end
    
    ROUTER --> MACHINES
    ROUTER --> PLANNER
    MACHINES --> SHARED
    PLANNER --> SHARED
    MACHINES -.BLE.-> PI
    PLANNER --> API
    API --> MACHINE_DOMAIN
    API --> PLANNER_DOMAIN
    MACHINE_DOMAIN --> DB
    MACHINE_DOMAIN --> TIMESCALE
    PLANNER_DOMAIN --> DB
    API --> REDIS
```

## Setup

### Prerequisites
- Node.js 18+
- pnpm 9+
- Docker & Docker Compose

### Quick Start

```bash
# Clone repository
git clone <repo-url>
cd Rooted-Web-App

# Install dependencies
pnpm install

# Start infrastructure (PostgreSQL + TimescaleDB + Redis)
docker compose -f docker/docker-compose.yml up -d

# Setup environment
cp .env.example .env
cp apps/api/.env.example apps/api/.env

# Run database migrations (PostgreSQL)
cd apps/api
pnpm prisma migrate dev
cd ../..

# Start development servers
pnpm dev              # Frontend (port 5173)
cd apps/api && pnpm dev  # Backend API (port 3001)
```

### Environment Variables

**Root `.env`:**
```env
VITE_API_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

**`apps/api/.env`:**
```env
DATABASE_URL=postgresql://rooted:rooted_dev_password@localhost:5433/rooted_planner
TIMESCALE_DATABASE_URL=postgresql://rooted:rooted_dev_password@localhost:5434/rooted_telemetry
REDIS_URL=redis://localhost:6379
CLERK_SECRET_KEY=your_clerk_secret
PORT=3001
```

## Development

### Frontend Development
```bash
pnpm dev  # Starts Vite dev server on port 5173
```

### Backend Development
```bash
cd apps/api
pnpm dev  # Starts Fastify server on port 3001
```

### Docker Commands
```bash
# Start all services
docker compose -f docker/docker-compose.yml up -d

# View logs
docker compose -f docker/docker-compose.yml logs -f

# Stop services
docker compose -f docker/docker-compose.yml down
```

### Database Management
```bash
cd apps/api

# Generate Prisma client
pnpm prisma generate

# Create migration
pnpm prisma migrate dev --name migration_name

# Reset database
pnpm prisma migrate reset
```

## Documentation

- [Project Structure](docs/PROJECT_STRUCTURE.md) - Detailed file organization
- [Style Guide](docs/STYLE.md) - Code conventions and patterns
- [Agent Guide](docs/AGENT.md) - Development workflow
- [Database Schema](docs/DATABASE_SCHEMA.md) - Database design

### Machine IoT
- [Requirements](docs/machine-iot/REQUIREMENTS.md) - Business requirements
- [Architecture](docs/machine-iot/ARCH.md) - Technical design

### Rooted Planner
- [Requirements](docs/rooted-planner/REQUIREMENTS.md) - Business requirements
- [Architecture](docs/rooted-planner/ARCH.md) - Technical design

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS + Shadcn UI
- React Router
- Zustand (state management)

### Backend
- Fastify
- tRPC
- Prisma ORM
- PostgreSQL (Relational)
- TimescaleDB (Telemetry)
- Redis
- Clerk (authentication)

### Machine IoT Specific
- Web Bluetooth API
- Python + bluezero (Raspberry Pi)

## Contributing

1. Read documentation in `docs/`
2. Create feature branch from `main`
3. Follow style guide and patterns
4. Document session in `docs/agentic-sessions/`
5. Submit pull request
