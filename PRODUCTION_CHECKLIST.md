# Production Deployment Checklist

Use this checklist to ensure all aspects of the application are production-ready before deployment.

---

## Pre-Deployment

### Code Quality ✅

- [ ] All TypeScript files compile without errors
  ```bash
  npm run typecheck
  ```
- [ ] No ESLint errors
  ```bash
  npm run lint
  ```
- [ ] Code is properly formatted
  ```bash
  npm run format:check
  ```
- [ ] All console.logs removed from production code
- [ ] No commented-out code blocks
- [ ] All TODOs resolved or documented

### Testing ✅

- [ ] All unit tests passing
  ```bash
  npm test
  ```
- [ ] Test coverage meets thresholds (70%+)
  ```bash
  npm run test:coverage
  ```
- [ ] E2E tests passing (Playwright)
  ```bash
  npm run test:playwright
  ```
- [ ] E2E tests passing (Cypress)
  ```bash
  npm run test:e2e
  ```
- [ ] Manual testing of critical paths completed
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness tested
- [ ] Accessibility testing completed

### Build & Performance ✅

- [ ] Production build successful
  ```bash
  npm run build
  ```
- [ ] Bundle size optimized (< 500KB initial)
  ```bash
  npm run build:analyze
  ```
- [ ] Code splitting implemented
- [ ] Lazy loading configured for routes
- [ ] Images optimized
- [ ] Fonts optimized
- [ ] Lighthouse score > 90 (Performance, Accessibility, Best Practices, SEO)
  ```bash
  lighthouse https://your-staging-url.com
  ```

---

## Environment & Configuration

### Environment Variables ✅

**Frontend (.env.production):**

- [ ] `VITE_API_BASE_URL` set to production API
- [ ] `VITE_SENTRY_DSN` configured (if using Sentry)
- [ ] `VITE_GA_TRACKING_ID` configured (if using GA)
- [ ] All sensitive data removed from code
- [ ] No development URLs in production config

**Backend (.env.production):**

- [ ] `DATABASE_URL` points to production database
- [ ] `JWT_SECRET` changed from default (strong, unique)
- [ ] `CORS_ORIGIN` set to production frontend URL
- [ ] `NODE_ENV` set to `production`
- [ ] Email service credentials configured (SendGrid, etc.)
- [ ] SMS service credentials configured (Twilio, etc.)
- [ ] Redis URL configured (if applicable)
- [ ] All API keys secured in environment variables

### Database ✅

- [ ] Database backup strategy in place
- [ ] Database migrations tested
- [ ] Database migrations applied to production
  ```bash
  npx prisma migrate deploy
  ```
- [ ] Database indexes optimized
- [ ] Connection pooling configured
- [ ] Database monitoring enabled

---

## Security

### Application Security ✅

- [ ] JWT secret changed from default
- [ ] All passwords hashed (bcrypt)
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Helmet.js security headers enabled
- [ ] Input validation implemented (Joi/Zod)
- [ ] SQL injection protection (Prisma ORM)
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] File upload size limits set
- [ ] Sensitive routes protected (authentication required)

### Infrastructure Security ✅

- [ ] SSL/TLS certificate installed
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] Firewall rules configured
- [ ] Database not publicly accessible
- [ ] SSH key-based authentication only
- [ ] Non-root user for application
- [ ] Security patches up to date
- [ ] npm audit passed (no high/critical vulnerabilities)
  ```bash
  npm audit
  ```
- [ ] Docker containers run as non-root user
- [ ] Secrets not in version control
- [ ] .env files in .gitignore

---

## Infrastructure

### Server Setup ✅

- [ ] Server provisioned (CPU, RAM, Disk)
- [ ] Operating system updated
- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] Docker installed (if using containers)
- [ ] PostgreSQL installed and configured
- [ ] Redis installed and configured (if applicable)
- [ ] Nginx installed and configured
- [ ] PM2 installed (if not using Docker)

### Domain & DNS ✅

- [ ] Domain registered
- [ ] DNS A records configured
- [ ] SSL certificate obtained (Let's Encrypt or purchased)
- [ ] SSL auto-renewal configured
- [ ] WWW redirect configured (or vice versa)
- [ ] DNS propagation verified
  ```bash
  nslookup your-domain.com
  ```

### Docker (if applicable) ✅

- [ ] docker-compose.prod.yml configured
- [ ] Docker images built successfully
  ```bash
  docker-compose -f docker-compose.prod.yml build
  ```
- [ ] Docker volumes configured for data persistence
- [ ] Docker networks configured
- [ ] Docker health checks working
- [ ] Docker restart policies set (unless-stopped)
- [ ] Docker logs configured

---

## Deployment

### Pre-Deployment Backup ✅

- [ ] Database backed up
  ```bash
  pg_dump -U user dbname > backup.sql
  ```
- [ ] Current code tagged in Git
  ```bash
  git tag -a v1.0.0 -m "Production release 1.0.0"
  git push origin v1.0.0
  ```
- [ ] Rollback plan documented
- [ ] Maintenance window scheduled (if needed)

### Deployment Process ✅

- [ ] Application deployed to server
- [ ] Database migrations run
- [ ] Environment variables set
- [ ] Application started
- [ ] Health checks passing
  ```bash
  curl https://api.your-domain.com/health
  ```
- [ ] Frontend accessible
  ```bash
  curl https://your-domain.com
  ```
- [ ] API endpoints responding
- [ ] WebSocket connections working (if applicable)

### Post-Deployment Verification ✅

- [ ] Login flow works
- [ ] Main features functional
- [ ] Forms submit correctly
- [ ] File uploads work
- [ ] Email sending works
- [ ] SMS sending works (if applicable)
- [ ] Payment processing works (if applicable)
- [ ] No JavaScript errors in console
- [ ] No network errors
- [ ] SSL certificate valid
  ```bash
  openssl s_client -connect your-domain.com:443
  ```

---

## Monitoring & Logging

### Error Tracking ✅

- [ ] Sentry configured and tested
- [ ] Error notifications set up
- [ ] Error alerts configured
- [ ] Source maps uploaded (for Sentry)
- [ ] Test error sent to verify tracking

### Application Monitoring ✅

- [ ] Health check endpoints working
  - `/health` - Basic health
  - `/health/detailed` - Detailed health
- [ ] Uptime monitoring configured (UptimeRobot, Pingdom, etc.)
- [ ] Performance monitoring enabled
- [ ] Database monitoring enabled
- [ ] Server resource monitoring (CPU, RAM, Disk)
- [ ] Log aggregation configured

### Logging ✅

- [ ] Application logs configured (Winston)
- [ ] Log rotation configured
- [ ] Log levels set appropriately (info, warn, error)
- [ ] Structured logging enabled (JSON format)
- [ ] Sensitive data excluded from logs
- [ ] Logs being written to correct location

### Alerting ✅

- [ ] Error rate alerts configured
- [ ] Response time alerts configured
- [ ] Server resource alerts (CPU > 80%, RAM > 80%, Disk > 90%)
- [ ] Database alerts configured
- [ ] Uptime alerts configured
- [ ] Alert recipients configured
- [ ] Alert test notifications sent

---

## Performance

### Frontend Performance ✅

- [ ] Lighthouse Performance score > 90
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.8s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Total Blocking Time < 200ms
- [ ] Code splitting implemented
- [ ] Lazy loading for images
- [ ] Lazy loading for routes
- [ ] Bundle size optimized
- [ ] Fonts optimized

### Backend Performance ✅

- [ ] API response times < 500ms (p95)
- [ ] Database queries optimized
- [ ] Database indexes created
- [ ] Caching implemented (Redis)
- [ ] Connection pooling configured
- [ ] N+1 queries resolved
- [ ] Load testing completed
  ```bash
  # Example with Apache Bench
  ab -n 1000 -c 10 https://api.your-domain.com/health
  ```

---

## Compliance & Legal

### Data Protection ✅

- [ ] GDPR compliance reviewed (if applicable)
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent implemented (if needed)
- [ ] Data retention policy defined
- [ ] Data deletion process documented
- [ ] User data export functionality (if required)

### Accessibility ✅

- [ ] WCAG 2.1 Level AA compliance
- [ ] Screen reader tested
- [ ] Keyboard navigation tested
- [ ] Color contrast meets standards
- [ ] Alt text for images
- [ ] Form labels present
- [ ] ARIA attributes used correctly

---

## Documentation

### Internal Documentation ✅

- [ ] Architecture diagram created
- [ ] API documentation complete (Swagger/OpenAPI)
- [ ] Environment setup documented
- [ ] Deployment process documented
- [ ] Rollback procedure documented
- [ ] Troubleshooting guide created
- [ ] Monitoring dashboard documented
- [ ] Team onboarding guide created

### User Documentation ✅

- [ ] User manual created
- [ ] Help documentation published
- [ ] FAQ created
- [ ] Support contact information visible
- [ ] Release notes published

---

## Team Preparation

### Knowledge Transfer ✅

- [ ] Team trained on new features
- [ ] Production access documented
- [ ] Emergency procedures documented
- [ ] On-call rotation established
- [ ] Runbook created for common issues

### Support ✅

- [ ] Support email configured
- [ ] Support ticket system set up (if applicable)
- [ ] Customer communication plan ready
- [ ] Known issues documented
- [ ] FAQs prepared

---

## Continuous Integration

### CI/CD Pipeline ✅

- [ ] GitHub Actions workflow configured
- [ ] All tests run on push
- [ ] All tests run on pull request
- [ ] Automated deployment configured (if desired)
- [ ] Build artifacts stored
- [ ] Test reports generated
- [ ] Coverage reports uploaded
- [ ] Security scans passing
- [ ] Lighthouse audits running

---

## Post-Launch

### Week 1 ✅

- [ ] Monitor error rates daily
- [ ] Monitor performance metrics daily
- [ ] Review user feedback
- [ ] Address critical bugs immediately
- [ ] Deploy hotfixes as needed
- [ ] Update documentation with learnings

### Week 2-4 ✅

- [ ] Analyze usage patterns
- [ ] Review performance data
- [ ] Plan optimizations based on real data
- [ ] Gather user feedback
- [ ] Plan next features/improvements

---

## Rollback Plan

### If Issues Arise ✅

1. **Assess Severity**
   - Critical: Immediate rollback
   - High: Fix forward if possible, otherwise rollback
   - Medium: Fix forward
   - Low: Schedule fix

2. **Rollback Procedure**
   ```bash
   # Docker deployment
   docker-compose -f docker-compose.prod.yml down
   git checkout <previous-tag>
   docker-compose -f docker-compose.prod.yml up -d --build

   # Manual deployment
   pm2 stop all
   git checkout <previous-tag>
   npm install
   npm run build
   pm2 restart all
   ```

3. **Database Rollback**
   ```bash
   # Restore from backup
   psql -U user dbname < backup.sql

   # Or rollback migrations
   npx prisma migrate resolve --rolled-back <migration-name>
   ```

4. **Communication**
   - Notify team
   - Update status page
   - Communicate with users (if needed)

---

## Sign-Off

### Pre-Launch Approval ✅

- [ ] Technical lead approval
- [ ] Product owner approval
- [ ] Security review completed
- [ ] Performance review completed
- [ ] Legal review completed (if needed)

### Launch Checklist ✅

- [ ] All checklist items above completed
- [ ] Rollback plan tested
- [ ] Team notified of launch
- [ ] Users notified (if needed)
- [ ] Status page ready
- [ ] Launch time scheduled
- [ ] Monitoring dashboards open
- [ ] On-call team ready

---

## Success Criteria

### Technical Metrics ✅

- [ ] Uptime > 99.9%
- [ ] Error rate < 0.1%
- [ ] Response time p95 < 500ms
- [ ] Lighthouse score > 90
- [ ] Zero critical security vulnerabilities

### Business Metrics ✅

- [ ] User adoption rate > 95%
- [ ] User satisfaction maintained or improved
- [ ] Support tickets < baseline
- [ ] Performance improvement > 30% (if migration)

---

## Notes

**Last Updated:** 2024-02-15

**Version:** 1.0.0

**Deployment Date:** _________________

**Deployed By:** _________________

**Issues Encountered:** _________________

**Resolutions:** _________________
