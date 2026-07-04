# Docker Database Setup

This Docker Compose configuration provides a local PostgreSQL database for development.

## Services Included

### PostgreSQL Database
- **Container**: `marketplace-postgres`
- **Host Port**: `5433`
- **Container Port**: `5432`
- **Database**: `marketplace`
- **Username**: `marketplace_user`
- **Password**: `marketplace_password`

### pgAdmin (Optional)
- **Container**: `marketplace-pgadmin`
- **Port**: `5050`
- **Email**: `admin@marketplace.com`
- **Password**: `admin123`
- **URL**: http://localhost:5050

## Quick Start

### 1. Start the Database
```bash
docker-compose up -d
```

### 2. Stop the Database
```bash
docker-compose down
```

### 3. Stop and Remove All Data
```bash
docker-compose down -v
```

## Database Configuration

The database connection is configured in the project `.env` file:

```env
POSTGRES_PRISMA_URL=postgresql://marketplace_user:marketplace_password@localhost:5433/marketplace
POSTGRES_URL_NON_POOLING=postgresql://marketplace_user:marketplace_password@localhost:5433/marketplace
```

## Prisma Commands

After starting the database, run these commands to set up your schema:

```bash
# Generate Prisma client
pnpm prisma generate

# Push the schema to the database
pnpm prisma db push

# Or run migrations
pnpm prisma migrate dev

# Seed the database (if you have a seed script)
pnpm prisma db seed
```

## Accessing the Database

### Via pgAdmin
1. Open http://localhost:5050
2. Login with `admin@marketplace.com` / `admin123`
3. Add server:
   - **Host**: `postgres`
   - **Port**: `5432`
   - **Database**: `marketplace`
   - **Username**: `marketplace_user`
   - **Password**: `marketplace_password`

### Via Command Line
```bash
# Connect to the PostgreSQL container
docker exec -it marketplace-postgres psql -U marketplace_user -d marketplace

# Or use psql from your local machine (if installed)
psql -h localhost -p 5433 -U marketplace_user -d marketplace
```

## Troubleshooting

### Port Already in Use
If host port 5433 is already in use, change the host-side port in `docker-compose.yml`:
```yaml
ports:
  - "5434:5432"  # Example: use host port 5434 instead
```

Then update your `.env`:
```env
POSTGRES_PRISMA_URL=postgresql://marketplace_user:marketplace_password@localhost:5434/marketplace
POSTGRES_URL_NON_POOLING=postgresql://marketplace_user:marketplace_password@localhost:5434/marketplace
```

### Reset Database
To completely reset the database:
```bash
docker-compose down -v
docker-compose up -d
pnpm prisma db push
```
