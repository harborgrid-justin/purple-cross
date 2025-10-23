# Webhook System Documentation

## Overview

The Purple Cross webhook system enables real-time event-driven integrations with external systems. When events occur in the platform (e.g., patient created, appointment scheduled), the system automatically delivers HTTP POST requests to configured webhook endpoints.

## Features

- **Event-Driven Architecture**: Subscribe to 30+ event types across all modules
- **Secure Delivery**: HMAC-SHA256 signature verification
- **Automatic Retries**: 5 retry attempts with exponential backoff (5s initial delay)
- **Monitoring**: Real-time queue monitoring via Bull Board UI
- **High Performance**: Asynchronous delivery via BullMQ

## Available Events

### Patient Events
- `patient.created` - New patient registered
- `patient.updated` - Patient information updated
- `patient.deleted` - Patient record deleted

### Client Events
- `client.created` - New client registered
- `client.updated` - Client information updated
- `client.deleted` - Client record deleted

### Appointment Events
- `appointment.created` - New appointment scheduled
- `appointment.updated` - Appointment details updated
- `appointment.cancelled` - Appointment cancelled
- `appointment.completed` - Appointment marked as completed

### Invoice Events
- `invoice.created` - New invoice generated
- `invoice.paid` - Invoice payment received
- `invoice.overdue` - Invoice became overdue

### Medical Record Events
- `medical_record.created` - New medical record created
- `medical_record.updated` - Medical record updated

### Lab Test Events
- `lab_test.ordered` - New lab test ordered
- `lab_test.completed` - Lab test results available

### Prescription Events
- `prescription.created` - New prescription created
- `prescription.refilled` - Prescription refilled

### Test Event
- `webhook.test` - Test event for webhook verification

## API Endpoints

### Create Webhook Subscription

```http
POST /api/v1/webhooks
Content-Type: application/json

{
  "name": "Patient Management Sync",
  "url": "https://api.example.com/webhooks/patients",
  "events": ["patient.created", "patient.updated"],
  "active": true
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "webhook-123",
    "name": "Patient Management Sync",
    "url": "https://api.example.com/webhooks/patients",
    "events": ["patient.created", "patient.updated"],
    "secret": "3f7a4b2c8e1d9f6a5b3c7e2d8f4a6b1c...",
    "active": true,
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  }
}
```

### List Webhooks

```http
GET /api/v1/webhooks?page=1&limit=10&active=true
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10, max: 100)
- `active` (optional): Filter by active status (true/false)

### Get Webhook by ID

```http
GET /api/v1/webhooks/:id
```

### Update Webhook

```http
PUT /api/v1/webhooks/:id
Content-Type: application/json

{
  "name": "Updated Webhook Name",
  "active": false
}
```

### Delete Webhook

```http
DELETE /api/v1/webhooks/:id
```

### Regenerate Secret

```http
POST /api/v1/webhooks/:id/regenerate-secret
```

### Test Webhook

```http
POST /api/v1/webhooks/:id/test
```

## Webhook Payload Format

When an event occurs, the webhook system sends an HTTP POST request to your configured URL:

```json
{
  "event": "patient.created",
  "data": {
    "id": "patient-123",
    "name": "Max",
    "species": "Dog",
    "breed": "Labrador",
    "ownerId": "client-456",
    "createdAt": "2024-01-20T10:30:00Z"
  },
  "timestamp": "2024-01-20T10:30:00Z",
  "webhookId": "webhook-123"
}
```

## Security - Signature Verification

All webhook payloads include an HMAC-SHA256 signature in the `X-Webhook-Signature` header. Verify this signature to ensure the webhook is legitimate.

### Headers Sent

```
Content-Type: application/json
X-Webhook-Signature: sha256=3f7a4b2c8e1d9f6a5b3c7e2d8f4a6b1c...
X-Webhook-Event: patient.created
User-Agent: Purple-Cross-Webhooks/1.0
```

### Verification Example (Node.js)

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Express middleware
app.post('/webhooks/patients', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const secret = 'your-webhook-secret';
  
  if (!verifyWebhookSignature(req.body, signature, secret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process webhook
  console.log('Event:', req.body.event);
  console.log('Data:', req.body.data);
  
  res.status(200).json({ received: true });
});
```

### Verification Example (Python)

```python
import hmac
import hashlib

def verify_webhook_signature(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)

# Flask example
@app.route('/webhooks/patients', methods=['POST'])
def webhook_handler():
    signature = request.headers.get('X-Webhook-Signature')
    secret = 'your-webhook-secret'
    
    if not verify_webhook_signature(
        request.get_data(as_text=True),
        signature,
        secret
    ):
        return jsonify({'error': 'Invalid signature'}), 401
    
    data = request.json
    print(f"Event: {data['event']}")
    print(f"Data: {data['data']}")
    
    return jsonify({'received': True}), 200
```

## Retry Logic

If a webhook delivery fails, the system automatically retries with exponential backoff:

- **Attempt 1**: Immediate
- **Attempt 2**: 5 seconds delay
- **Attempt 3**: 10 seconds delay
- **Attempt 4**: 20 seconds delay
- **Attempt 5**: 40 seconds delay

After 5 failed attempts, the delivery is marked as failed and logged. You can view failed deliveries in the Bull Board monitoring UI at `/admin/queues`.

## Best Practices

### 1. Return Success Quickly

Respond with HTTP 200-299 status code as quickly as possible:

```javascript
app.post('/webhook', (req, res) => {
  // Acknowledge receipt immediately
  res.status(200).json({ received: true });
  
  // Process asynchronously
  processWebhookAsync(req.body);
});
```

### 2. Handle Duplicate Deliveries

Due to retries, you may receive the same event multiple times. Use idempotency:

```javascript
const processedEvents = new Set();

app.post('/webhook', (req, res) => {
  const eventId = `${req.body.webhookId}-${req.body.timestamp}`;
  
  if (processedEvents.has(eventId)) {
    return res.status(200).json({ received: true, duplicate: true });
  }
  
  processedEvents.add(eventId);
  processWebhook(req.body);
  
  res.status(200).json({ received: true });
});
```

### 3. Verify Signatures Always

Always verify the HMAC signature before processing webhooks to prevent spoofing.

### 4. Use HTTPS URLs

Always use HTTPS URLs for webhook endpoints to ensure payload encryption in transit.

### 5. Monitor Webhook Health

Regularly check the Bull Board monitoring UI at `/admin/queues` to monitor webhook delivery success rates.

## Monitoring

### Bull Board UI

Access the queue monitoring dashboard at:
```
http://your-domain.com/admin/queues
```

Features:
- View all queued webhooks
- Monitor success/failure rates
- Retry failed jobs manually
- View job details and errors

### Webhook Statistics

Get webhook statistics via API:

```http
GET /api/v1/webhooks?active=true
```

Track:
- Total webhook subscriptions
- Active vs inactive webhooks
- Events subscribed per webhook

## Troubleshooting

### Webhook Not Receiving Events

1. **Check webhook is active**: Ensure `active: true` in webhook configuration
2. **Verify URL is accessible**: Test the URL from the server
3. **Check event subscription**: Ensure the webhook is subscribed to the event
4. **Review Bull Board**: Check for failed deliveries in the queue UI

### Signature Verification Failing

1. **Use raw payload**: Verify signature against the raw JSON string, not parsed object
2. **Check secret**: Ensure you're using the correct secret from the webhook object
3. **Algorithm mismatch**: Verify you're using HMAC-SHA256

### Timeouts

Webhook requests timeout after 10 seconds. Ensure your endpoint responds quickly.

## Example Integration

Complete example of a webhook endpoint that receives Purple Cross events:

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const WEBHOOK_SECRET = process.env.PURPLE_CROSS_WEBHOOK_SECRET;

function verifySignature(payload, signature) {
  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

app.post('/webhooks/purple-cross', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  
  // Verify signature
  if (!verifySignature(req.body, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const { event, data, timestamp } = req.body;
  
  // Acknowledge receipt
  res.status(200).json({ received: true });
  
  // Process event
  switch (event) {
    case 'patient.created':
      console.log(`New patient: ${data.name} (${data.species})`);
      // Sync to your system
      break;
      
    case 'appointment.created':
      console.log(`New appointment: ${data.startTime}`);
      // Send calendar invitation
      break;
      
    case 'invoice.paid':
      console.log(`Invoice paid: ${data.invoiceNumber}`);
      // Update accounting system
      break;
      
    default:
      console.log(`Unhandled event: ${event}`);
  }
});

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

## Support

For questions or issues with the webhook system:
1. Check the Bull Board UI for delivery logs
2. Review the application logs for errors
3. Contact support with webhook ID and timestamp
