# 🟣 Purple Cross

**Enterprise-Grade Veterinary Practice Management Platform**

[![CI](https://github.com/harborgrid-justin/purple-cross/workflows/CI/badge.svg)](https://github.com/harborgrid-justin/purple-cross/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-18+-green)](https://nodejs.org/)

A comprehensive, full-featured enterprise platform designed to manage all aspects of a modern veterinary practice. Built with scalability, security, and compliance at its core following Google engineering best practices.

---

## ✨ Features

### 🎯 Core Modules (15)

1. **Patient Management** - Complete pet health records and profiles
2. **Client Management** - Pet owner information and communication
3. **Appointment Scheduling** - Calendar and booking system
4. **Medical Records** - Digital health records and history
5. **Prescription Management** - Medication tracking and refills
6. **Inventory Management** - Supply chain and stock control
7. **Billing & Payments** - Invoice and payment processing
8. **Laboratory Management** - Test ordering and results
9. **Staff Management** - Employee scheduling and permissions
10. **Reports & Analytics** - Business intelligence and insights
11. **Communication** - SMS, email, and client portal
12. **Document Management** - Secure file storage
13. **Compliance & Regulatory** - HIPAA-equivalent compliance
14. **Integration & API** - Third-party integrations
15. **Mobile Access** - iOS and Android support

### 🚀 Technical Highlights

- ✅ **TypeScript** - 100% type-safe codebase
- ✅ **Prisma ORM** - Modern database toolkit
- ✅ **React 18** - Modern UI framework
- ✅ **RESTful API** - Well-documented endpoints
- ✅ **Docker** - Containerized deployment
- ✅ **CI/CD** - Automated testing and deployment
- ✅ **Production-Ready** - Battle-tested architecture

---

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Node.js 18+ with Express
- TypeScript 5.3+
- Prisma ORM
- PostgreSQL 15
- Redis (caching)
- JWT authentication

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- React Query (data fetching)
- Zustand (state management)
- React Router 6

**Infrastructure:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Nginx (production)

### Project Structure

```
purple-cross/
├── backend/           # Backend API
│   ├── prisma/       # Database schema
│   ├── src/          # Source code
│   └── tests/        # Test suites
├── frontend/          # Frontend app
│   ├── src/          # Source code
│   └── public/       # Static assets
├── shared/            # Shared types
├── docs/              # Documentation
└── .github/           # CI/CD workflows
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/harborgrid-justin/purple-cross.git
   cd purple-cross
   ```

2. **Start with Docker**
   ```bash
   docker-compose up
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Health: http://localhost:3000/health

4. **Run migrations**
   ```bash
   docker-compose exec backend npx prisma migrate dev
   ```

### Local Development

See [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for detailed setup instructions.

---

## 📚 Documentation

- **[Development Guide](./docs/DEVELOPMENT.md)** - Setup and development workflow
- **[Contributing Guide](./docs/CONTRIBUTING.md)** - How to contribute
- **[API Documentation](./docs/API.md)** - API endpoints and usage (coming soon)
- **[Architecture Overview](./ARCHITECTURE.md)** - System design and architecture
- **[Features Documentation](./FEATURES.md)** - Detailed feature list

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
npm run test:e2e
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Run All Tests
```bash
docker-compose exec backend npm test
docker-compose exec frontend npm test
```

---

## 🛠️ Development

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Database Management
```bash
cd backend

# Prisma Studio (Database GUI)
npm run prisma:studio

# Create migration
npm run prisma:migrate -- --name migration_name

# Seed database
npm run prisma:seed
```

---

## 🔐 Security & Compliance

- **HIPAA-Equivalent** - Healthcare data protection standards
- **Encrypted Data** - At rest and in transit
- **Role-Based Access** - Fine-grained permissions
- **Audit Logging** - Complete activity tracking
- **Regular Updates** - Security patches and updates

---

## 📊 Statistics

- **15** Primary Enterprise Modules
- **120** Comprehensive Sub-Features
- **200+** TypeScript Interfaces
- **100%** Type-Safe Codebase
- **70%+** Test Coverage Target
- **Production-Ready** - Enterprise architecture

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Support

For support and questions:

- 📧 Email: support@purplecross.vet
- 📖 Documentation: [docs/](./docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/harborgrid-justin/purple-cross/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/harborgrid-justin/purple-cross/discussions)

---

## 🗺️ Roadmap

### Phase 1 - MVP ✅
- [x] Core modules implementation
- [x] Backend API with Prisma
- [x] Frontend React app
- [x] Docker setup
- [x] CI/CD pipeline

### Phase 2 - Enhancement 🚧
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics
- [ ] AI-powered features
- [ ] Telemedicine support
- [ ] Integration marketplace

### Phase 3 - Scale 📋
- [ ] Multi-tenant support
- [ ] Advanced reporting
- [ ] Machine learning insights
- [ ] Global deployment
- [ ] Enterprise SSO

---

## 🌟 Acknowledgments

Built with modern best practices and inspired by:
- Google Engineering Practices
- HIPAA Compliance Standards
- Veterinary Industry Standards
- Open Source Community

---

**Purple Cross** - Empowering veterinary professionals with enterprise-grade technology.

*Made with ❤️ for veterinary practices worldwide*
