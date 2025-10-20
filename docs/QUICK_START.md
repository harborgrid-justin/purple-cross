# 🚀 Purple Cross - Quick Start

Get up and running with Purple Cross in 5 minutes!

## Step 1: Prerequisites

Make sure you have these installed:

- ✅ **Node.js 18+** - [Download](https://nodejs.org/)
- ✅ **Docker Desktop** - [Download](https://docs.docker.com/get-docker/)
- ✅ **Git** - [Download](https://git-scm.com/)

Verify installations:

```bash
node -v    # Should show v18.x.x or higher
docker -v  # Should show Docker version
git --version
```

## Step 2: Clone & Setup

```bash
# Clone the repository
git clone https://github.com/harborgrid-justin/purple-cross.git
cd purple-cross

# Run the automated setup (takes 3-5 minutes)
npm run setup
```

The setup script will:

- ✅ Check prerequisites
- ✅ Create configuration files
- ✅ Start Docker containers
- ✅ Install dependencies
- ✅ Setup database
- ✅ Run migrations
- ✅ Verify everything works

## Step 3: Access the Application

Once setup completes, open these URLs:

- 🌐 **Frontend**: http://localhost:5173
- 🔌 **Backend API**: http://localhost:3000
- ❤️ **Health Check**: http://localhost:3000/health

## Step 4: Start Development

### View Available Commands

```bash
make help
# or
npm run
```

### Start Development Servers

```bash
npm run dev
# Backend: http://localhost:3000
# Frontend: http://localhost:5173
```

### Access Database GUI

```bash
npm run prisma:studio
# Opens at http://localhost:5555
```

### Run Tests

```bash
npm test
```

### View Logs

```bash
docker-compose logs -f
```

## Common Commands

| Command                  | Description                      |
| ------------------------ | -------------------------------- |
| `npm run setup`          | Complete setup (first time only) |
| `npm run dev`            | Start development servers        |
| `npm test`               | Run all tests                    |
| `npm run lint`           | Lint code                        |
| `npm run format`         | Format code                      |
| `npm run prisma:studio`  | Open database GUI                |
| `docker-compose up -d`   | Start containers                 |
| `docker-compose down`    | Stop containers                  |
| `docker-compose logs -f` | View logs                        |

## Project Structure

```
purple-cross/
├── backend/          # Backend API (Node.js + Express)
│   ├── src/         # Source code
│   ├── prisma/      # Database schema & migrations
│   └── tests/       # Tests
├── frontend/         # Frontend (React + TypeScript)
│   ├── src/         # Source code
│   └── public/      # Static assets
├── docs/            # Documentation
└── scripts/         # Setup & utility scripts
```

## Need Help?

### Troubleshooting

If something goes wrong, see the [Complete Setup Guide](./docs/SETUP.md#troubleshooting) for detailed troubleshooting steps.

### Documentation

- 📖 [Complete Setup Guide](./docs/SETUP.md) - Detailed installation
- 💻 [Development Guide](./docs/DEVELOPMENT.md) - Development workflow
- 🤝 [Contributing Guide](./docs/CONTRIBUTING.md) - How to contribute
- 🔌 [API Documentation](./docs/API.md) - API reference

### Common Issues

**Port already in use?**

```bash
docker-compose down
npx kill-port 3000 5173 5432
npm run setup
```

**Docker not running?**

- Start Docker Desktop
- Wait for it to fully start
- Run `npm run setup` again

**Need to reset everything?**

```bash
docker-compose down -v
rm -rf node_modules backend/node_modules frontend/node_modules
npm run setup
```

## What's Next?

1. ✅ Explore the application at http://localhost:5173
2. ✅ Check out the codebase structure
3. ✅ Read the [Development Guide](./docs/DEVELOPMENT.md)
4. ✅ Make your first change and see hot reload in action!
5. ✅ Run tests with `npm test`

---

**Happy Coding! 🎉**

For detailed documentation, visit the [docs/](./docs/) directory.
