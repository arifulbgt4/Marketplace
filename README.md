# 🏪 Marketplace

A Next.js, TypeScript, PostgreSQL, Prisma, and Material-UI marketplace foundation. The current implementation is primarily a property/rental listing starter; the repository now includes a complete technical plan for evolving it into a configurable reusable B2C marketplace while preserving the current homepage visual design—especially the Hero and Search sections.

## 📌 Current Status and Planning

Implemented foundations and planned capabilities are intentionally documented separately. Do not treat roadmap items as already implemented.

- **Planning start page:** [docs/PLANNING_INDEX.md](docs/PLANNING_INDEX.md)
- **Verified current analysis:** [docs/CURRENT_PROJECT_ANALYSIS.md](docs/CURRENT_PROJECT_ANALYSIS.md)
- **Target architecture:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Phase roadmap:** [docs/PROJECT_ROADMAP.md](docs/PROJECT_ROADMAP.md)
- **Detailed agent task plan:** [docs/TASK_PLAN.md](docs/TASK_PLAN.md)
- **COD and payment plan:** [docs/COD_AND_PAYMENT_PLAN.md](docs/COD_AND_PAYMENT_PLAN.md)
- **Customization plan:** [docs/REUSABILITY_AND_CUSTOMIZATION_PLAN.md](docs/REUSABILITY_AND_CUSTOMIZATION_PLAN.md)
- **Testing plan:** [docs/TESTING_PLAN.md](docs/TESTING_PLAN.md)
- **Documentation plan:** [docs/DOCUMENTATION_PLAN.md](docs/DOCUMENTATION_PLAN.md)

No marketplace implementation phase should be marked complete until its task acceptance criteria and related test requirements are satisfied.

Design policy: MUI is the current implementation stack, not a future restriction. Product, account, checkout and admin surfaces may adopt the design system or custom UI approach that best fits the target business. The homepage visual composition remains protected, with the Hero and Search sections receiving strict visual-regression coverage.

## ✨ Current Foundations

- 🌍 **Internationalization (i18n)** - Multi-language support with next-intl
- 🔐 **Authentication** - Secure authentication with NextAuth.js
- 🎨 **Design System** - Material-UI components with custom theming
- 🗄️ **Database** - PostgreSQL with Prisma ORM
- 🐳 **Docker** - Containerized database setup
- 🌙 **Dark/Light Mode** - Theme switching support
- 📱 **Responsive Design** - Mobile-first approach
- 🗺️ **Maps Integration** - Mapbox integration for location features
- 🔍 **Search & Filters** - Basic persisted listing search and filtering foundation

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Component library and theming
- **Emotion** - CSS-in-JS styling
- **next-intl** - Internationalization

### Backend

- **PostgreSQL** - Primary database
- **Prisma** - Database ORM and migrations
- **NextAuth.js** - Authentication
- **Vercel** - Deployment platform

### Development Tools

- **Docker** - Local database development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **pnpm** - Package manager

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- Docker (for local database)

### 1. Clone and Install

```bash
git clone https://github.com/arifulbgt4/Marketplace
cd marketplace
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Update .env with your values
# Database URLs are pre-configured for Docker setup
```

### 3. Start Local Development

#### Option A: Complete Setup (Recommended)

```bash
pnpm setup:local
```

This will:

- Install dependencies
- Start Docker database
- Deploy database migrations
- Seed database
- You can then run `pnpm dev`

#### Option B: Manual Setup

```bash
# Start database
pnpm db:start

# Wait for database to be ready, then:
pnpm db:migrate:prod
pnpm db:seed  # If you have seed data

# Start development server
pnpm dev
```

### 4. Access the Application

- **Main App**: http://localhost:3000
- **Database UI**: http://localhost:5050 (run `pnpm pgadmin:start`)

## 📜 Available Scripts

### Development

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run linting
pnpm lint:fix         # Fix linting issues
pnpm type-check       # Type checking
pnpm format           # Format code with Prettier
```

### Database Management

```bash
pnpm db:start         # Start PostgreSQL container
pnpm db:stop          # Stop database
pnpm db:reset         # Reset database (removes all data)
pnpm db:studio        # Open Prisma Studio
pnpm db:push          # Push schema to database
pnpm db:seed          # Seed database
pnpm db:migrate       # Create and run migration
pnpm db:migrate:prod  # Deploy committed migrations
pnpm db:generate      # Generate Prisma client
```

### Docker Services

```bash
pnpm docker:up        # Start all Docker services
pnpm docker:down      # Stop all Docker services
pnpm docker:logs      # View Docker logs
pnpm docker:clean     # Clean up Docker containers and volumes
pnpm pgadmin:start    # Start pgAdmin web interface
```

### Utility

```bash
pnpm setup:local      # Complete local setup
pnpm clean            # Clean build files and dependencies
pnpm clean:install    # Clean and reinstall dependencies
```

## 🗄️ Database Setup

The project uses PostgreSQL with Docker for local development:

### Local Development Database

- **Host**: localhost
- **Port**: 5433
- Portটি ব্যস্ত থাকলে `MARKETPLACE_DB_PORT=5435 pnpm db:start` চালিয়ে database URLs-এ একই port ব্যবহার করুন।
- **Database**: marketplace
- **Username**: marketplace_user
- **Password**: marketplace_password

### Database Management

- **pgAdmin**: http://localhost:5050
  - Login: admin@marketplace.com / admin123
- **Prisma Studio**: `pnpm db:studio`

## 🌍 Internationalization

The app supports multiple languages:

- English (en) - Default
- Arabic (ar) - RTL support
- Bengali (bn)
- Amharic (am)
- Armenian (hy)
- Assamese (as)
- Azerbaijani (az)
- Afrikaans (af)

Language files are located in `/messages/[locale].json`

## 🎨 Design System

The project includes a comprehensive design system built with Material-UI:

### Theme Customization

Custom themes are defined in `src/theme/` with support for:

- Dark/Light mode
- Custom color palettes
- Typography scales
- Component overrides
- RTL support

## 🔐 Authentication

Authentication is handled by NextAuth.js with support for:

- Email/Password authentication
- Session management
- Protected routes

Configure providers in `src/app/api/auth/[...nextauth]/route.ts`

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── [locale]/        # Internationalized routes
│   │   └── api/             # API routes
│   ├── components/          # Reusable components
│   ├── forms/               # Form components
│   ├── layouts/             # Layout components
│   ├── widgets/             # Complex UI widgets
│   ├── global/              # Global utilities and config
│   ├── theme/               # Material-UI theme
│   └── lib/                 # Utility libraries
├── messages/                # i18n translation files
├── prisma/                  # Database schema and migrations
├── docs/                    # Planning documents
├── docker/                  # Docker configuration
└── public/                  # Static assets
```

## 🚢 Deployment

### Vercel (Recommended)

The project is optimized for Vercel deployment:

1. Push to GitHub
2. Connect to Vercel
3. Configure environment variables
4. Deploy

### Environment Variables for Production

```env
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
POSTGRES_PRISMA_URL=your-production-db-url
POSTGRES_URL_NON_POOLING=your-production-db-direct-url
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=Marketplace <no-reply@example.com>
```

Production signup, email verification এবং password recovery-এর জন্য সব `SMTP_*` value configure করতে হবে। Partial SMTP configuration environment validation-এ rejected হবে। Development/test environment-এ email delivery-এর বদলে safe preview URL response পাওয়া যায়।

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pnpm lint && pnpm type-check`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Port Already in Use

If you get port conflicts:

```bash
# Check what's using the port
lsof -i :5433

# Kill the process or change the port in docker-compose.yml
```

### Database Connection Issues

```bash
# Reset the database
pnpm db:reset

# Check Docker status
docker ps
```

### Build Issues

```bash
# Clean and reinstall
pnpm clean:install

# Clear Next.js cache
rm -rf .next
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)

---

**Happy coding! 🎉**
