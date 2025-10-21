# Docker Scaffold

This repository includes Docker assets generated from the UI.

## Build & Run
```bash
docker compose up --build -d
docker compose logs -f app
```

- App: http://localhost:3000
- PRISMA_PROVIDER / DATABASE_URL are set via docker-compose.yml (override as needed).
