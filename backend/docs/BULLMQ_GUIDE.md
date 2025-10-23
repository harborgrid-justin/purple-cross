# BullMQ Queue Guide

## Overview

BullMQ provides robust background job processing for Purple Cross, enabling async operations for emails, reports, reminders, and notifications.

## Architecture

### Queues

- **Email Queue** - Sending emails asynchronously
- **Reports Queue** - Generating reports in the background
- **Reminders Queue** - Scheduling appointment/medication reminders
- **Notifications Queue** - Multi-channel notifications (push, in-app, email)

### Workers

Workers process jobs from queues. Start the worker process:

```bash
npm run worker        # Development
npm run start:worker  # Production
```

### Bull Board Dashboard

Monitor queues at: `http://localhost:3000/admin/queues`

- View queue status
- Monitor job progress
- Retry failed jobs
- View job details and logs

## Usage

### Queueing Jobs

#### Email Jobs

```typescript
import { queueEmail } from './jobs';

// Queue an email
const jobId = await queueEmail({
  to: 'client@example.com',
  subject: 'Appointment Confirmation',
  template: 'appointment-confirmation',
  context: {
    clientName: 'John Doe',
    appointmentDate: '2024-01-15',
    appointmentTime: '10:00 AM',
  },
  priority: 3, // Higher number = higher priority
});
```

#### Report Jobs

```typescript
import { queueReport } from './jobs';

// Queue a report generation
const jobId = await queueReport({
  reportType: 'financial',
  format: 'pdf',
  dateRange: {
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31'),
  },
  requestedBy: 'user-123',
  email: 'user@example.com', // Optional - send email when ready
});
```

#### Reminder Jobs

```typescript
import { queueReminder, queueBulkReminders } from './jobs';

// Queue a single reminder
const jobId = await queueReminder({
  type: 'appointment',
  recipientType: 'client',
  recipientId: 'client-123',
  recipientEmail: 'client@example.com',
  recipientPhone: '+1234567890',
  channel: 'both', // 'email', 'sms', or 'both'
  message: 'Your appointment is tomorrow at 10:00 AM',
  scheduledFor: new Date('2024-01-14T09:00:00Z'), // Optional - schedule for future
});

// Queue multiple reminders at once
const jobIds = await queueBulkReminders([
  { /* reminder 1 */ },
  { /* reminder 2 */ },
  { /* reminder 3 */ },
]);
```

#### Notification Jobs

```typescript
import { queueNotification, queueBulkNotifications } from './jobs';

// Queue a notification
const jobId = await queueNotification({
  type: 'appointment_confirmed',
  recipientId: 'client-123',
  recipientType: 'client',
  title: 'Appointment Confirmed',
  message: 'Your appointment has been confirmed for Jan 15 at 10:00 AM',
  actionUrl: '/appointments/123',
  channels: ['push', 'in_app'], // 'push', 'in_app', 'email'
  priority: 5,
});

// Queue bulk notifications
const jobIds = await queueBulkNotifications([
  { /* notification 1 */ },
  { /* notification 2 */ },
]);
```

## Integration with Services

### Example: Patient Service

```typescript
import { queueEmail, queueNotification } from '../jobs';

export class PatientService {
  async createAppointment(data: CreateAppointmentDTO): Promise<Appointment> {
    const appointment = await prisma.appointment.create({ data });

    // Queue confirmation email (non-blocking)
    queueEmail({
      to: appointment.clientEmail,
      subject: 'Appointment Confirmed',
      template: 'appointment-confirmation',
      context: {
        appointmentDate: appointment.date,
        appointmentTime: appointment.time,
      },
    }).catch(err => {
      logger.error('Failed to queue confirmation email', { err });
    });

    // Queue in-app notification (non-blocking)
    queueNotification({
      type: 'appointment_confirmed',
      recipientId: appointment.clientId,
      recipientType: 'client',
      title: 'Appointment Confirmed',
      message: `Your appointment is confirmed for ${appointment.date}`,
      channels: ['in_app', 'push'],
    }).catch(err => {
      logger.error('Failed to queue notification', { err });
    });

    return appointment;
  }
}
```

## Job Options

### Priority

Jobs are processed by priority (1-10):
- 1 = Highest priority
- 5 = Default
- 10 = Lowest priority

### Retry Logic

Queues have built-in retry with exponential backoff:

```typescript
{
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000, // Start with 2 seconds
  },
}
```

Failed jobs are retried automatically:
- 1st retry: after 2 seconds
- 2nd retry: after 4 seconds
- 3rd retry: after 8 seconds

### Scheduled Jobs

Jobs can be scheduled for future execution:

```typescript
await queueReminder({
  // ... job data ...
  scheduledFor: new Date('2024-01-14T09:00:00Z'),
});
```

## Monitoring

### Bull Board Dashboard

Access at `/admin/queues` to:
- View queue metrics (waiting, active, completed, failed)
- Monitor job progress in real-time
- View job details and logs
- Manually retry failed jobs
- Clean old jobs

### Logging

Workers log all job activity:

```
[INFO] Processing email job jobId=abc123 template=appointment-confirmation
[INFO] Email sent successfully jobId=abc123
[ERROR] Failed to send email jobId=xyz789 error="SMTP connection failed"
```

### Health Check

Queue health is monitored through Redis health checks:

```bash
GET /health/ready    # Check Redis connection
GET /health/detailed # Get detailed cache/queue stats
```

## Best Practices

### 1. Always Queue Async Operations

```typescript
// Good - non-blocking
await createAppointment(data);
queueEmail(emailData).catch(logger.error);

// Bad - blocking
await createAppointment(data);
await sendEmail(emailData); // Blocks request
```

### 2. Handle Queue Failures Gracefully

```typescript
try {
  await queueEmail(emailData);
} catch (error) {
  logger.error('Failed to queue email', { error });
  // Application continues normally
}
```

### 3. Use Appropriate Priority

```typescript
// High priority - time-sensitive
await queueEmail({ ...data, priority: 1 });

// Normal priority
await queueEmail({ ...data, priority: 5 });

// Low priority - bulk operations
await queueEmail({ ...data, priority: 10 });
```

### 4. Batch Operations

```typescript
// Instead of queueing one by one
const jobs = [];
for (const client of clients) {
  jobs.push({
    type: 'appointment_reminder',
    recipientId: client.id,
    // ...
  });
}

// Queue all at once
await queueBulkReminders(jobs);
```

### 5. Set Appropriate TTL for Job Data

```typescript
{
  removeOnComplete: {
    count: 100,    // Keep last 100 completed jobs
    age: 86400,    // Keep for 24 hours
  },
  removeOnFail: {
    count: 500,    // Keep last 500 failed jobs for debugging
  },
}
```

## Configuration

### Environment Variables

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-password-here
```

### Queue Configuration

Edit `backend/src/config/queue.ts` to customize:
- Retry attempts
- Backoff delays
- Job retention policies
- Concurrency levels

### Worker Concurrency

Adjust in `backend/src/worker.ts`:

```typescript
// Email worker - 5 concurrent jobs
const emailWorker = new Worker(QUEUES.EMAIL, processEmailJob, {
  connection: redisConnection,
  concurrency: 5,
});

// Reports worker - 2 concurrent (resource-intensive)
const reportsWorker = new Worker(QUEUES.REPORTS, processReportJob, {
  connection: redisConnection,
  concurrency: 2,
});
```

## Troubleshooting

### Jobs Stuck in "Active"

- Check if worker process is running
- Check Redis connection
- Review worker logs for errors

### High Failure Rate

- Check external service availability (SMTP, SMS)
- Review job data validity
- Check retry configuration

### Memory Issues

- Reduce job retention counts
- Increase concurrency if too many jobs waiting
- Check for memory leaks in job processors

### Slow Processing

- Increase worker concurrency
- Add more worker instances
- Optimize job processor code
- Check external service latency

## Testing

### Unit Tests

```typescript
import { queueEmail } from './jobs';

jest.mock('./config/queue', () => ({
  emailQueue: {
    add: jest.fn().mockResolvedValue({ id: 'job-123' }),
  },
}));

test('should queue email', async () => {
  const jobId = await queueEmail(emailData);
  expect(jobId).toBe('job-123');
});
```

### Integration Tests

Test with actual Redis (requires running Redis instance):

```typescript
import { emailQueue } from './config/queue';

test('should process email job', async () => {
  const job = await emailQueue.add('test-email', emailData);
  
  // Wait for processing
  await job.waitUntilFinished(queueEvents);
  
  expect(job.finishedOn).toBeDefined();
});
```

## Production Deployment

### Scaling Workers

Run multiple worker instances for high load:

```bash
# Instance 1
node dist/worker.js

# Instance 2
node dist/worker.js

# Instance 3
node dist/worker.js
```

### Redis Configuration

For production, use:
- Redis persistence (RDB + AOF)
- Redis Sentinel or Cluster for high availability
- Separate Redis instance for queues vs cache

### Monitoring

Monitor these metrics:
- Queue depths (waiting jobs)
- Processing rate (jobs/second)
- Failure rate
- Average processing time
- Redis memory usage

## Resources

- [BullMQ Documentation](https://docs.bullmq.io/)
- [Redis Best Practices](https://redis.io/topics/admin)
- [Bull Board GitHub](https://github.com/felixmosh/bull-board)
