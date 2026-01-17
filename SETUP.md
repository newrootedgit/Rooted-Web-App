# Rooted Web App - Development Environment

## Structure

```
Rooted-Web-App/
├── src/              # Main app entry point
├── machines/src/     # Machine IoT platform
├── planner/src/      # Rooted Planner platform
├── shared/src/       # Shared components/utils
├── docs/             # Documentation
└── docker-compose.yml # PostgreSQL + Redis for Planner
```

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Docker Services (for Planner backend - future)

```bash
pnpm docker:up
```

### 3. Start Development Server

```bash
pnpm dev
```

App will be available at `http://localhost:3000`

## Path Aliases

- `@machines/*` → `machines/src/*`
- `@planner/*` → `planner/src/*`
- `@shared/*` → `shared/src/*`

## Docker Services

- **PostgreSQL**: `localhost:5432`
  - User: `rooted`
  - Password: `rooted_dev_password`
  - Database: `rooted_planner`

- **Redis**: `localhost:6379`

## Scripts

- `pnpm dev` - Start Vite dev server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm docker:up` - Start Docker services
- `pnpm docker:down` - Stop Docker services
- `pnpm docker:logs` - View Docker logs

## Next Steps

1. Implement Machine IoT features in `machines/src/`
2. Stub out Planner backend when needed
3. Add shared components to `shared/src/`
