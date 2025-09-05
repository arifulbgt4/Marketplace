#!/bin/bash

echo "🐳 Starting Marketplace Database..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start the database
docker-compose up -d postgres

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if PostgreSQL is ready
while ! docker exec marketplace-postgres pg_isready -U marketplace_user > /dev/null 2>&1; do
    echo "⏳ Still waiting for PostgreSQL..."
    sleep 2
done

echo "✅ PostgreSQL is ready!"
echo "📊 Database URL: postgresql://marketplace_user:marketplace_password@localhost:5433/marketplace"
echo "🌐 To start pgAdmin: docker-compose up -d pgadmin"
echo "🌐 pgAdmin URL: http://localhost:5050"
echo ""
echo "🚀 Next steps:"
echo "   1. Run: pnpm prisma db push"
echo "   2. Run: pnpm prisma db seed (if you have a seed script)"
echo "   3. Start your app: pnpm dev"
