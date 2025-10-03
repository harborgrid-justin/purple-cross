# Purple Cross API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All API requests require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
All responses follow this structure:
```json
{
  "status": "success",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## 1. Patient Management

### Get All Patients
```http
GET /patients?page=1&limit=20&search=keyword&ownerId=uuid
```

### Get Patient by ID
```http
GET /patients/:id
```
Returns patient with owner details, recent medical records, and appointments.

### Create Patient
```http
POST /patients
Content-Type: application/json

{
  "name": "Max",
  "species": "Dog",
  "breed": "Labrador",
  "dateOfBirth": "2020-01-15",
  "gender": "male",
  "weight": 25.5,
  "color": "Golden",
  "microchipId": "123456789",
  "ownerId": "uuid"
}
```

### Update Patient
```http
PUT /patients/:id
Content-Type: application/json

{
  "weight": 27.0,
  "status": "active"
}
```

### Delete Patient (Soft Delete)
```http
DELETE /patients/:id
```

---

## 2. Client Management

### Get All Clients
```http
GET /clients?page=1&limit=20&search=keyword&status=active
```

### Get Client by ID
```http
GET /clients/:id
```
Returns client with all patients, appointments, and invoices.

### Create Client
```http
POST /clients
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "phone": "555-0123",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "emergencyContact": "Jane Smith",
  "emergencyPhone": "555-0124",
  "preferredContact": "email"
}
```

### Update Client
```http
PUT /clients/:id
```

### Delete Client (Soft Delete)
```http
DELETE /clients/:id
```

---

## 3. Appointment Scheduling

### Get All Appointments
```http
GET /appointments?page=1&limit=20&patientId=uuid&clientId=uuid&veterinarianId=uuid&status=scheduled&startDate=2024-01-01&endDate=2024-01-31
```

### Get Appointment by ID
```http
GET /appointments/:id
```

### Create Appointment
```http
POST /appointments
Content-Type: application/json

{
  "patientId": "uuid",
  "clientId": "uuid",
  "veterinarianId": "uuid",
  "appointmentType": "checkup",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T10:30:00Z",
  "reason": "Annual checkup",
  "notes": "Patient is nervous around other animals"
}
```

**Note:** The system automatically checks for scheduling conflicts.

### Update Appointment
```http
PUT /appointments/:id
```

### Cancel Appointment
```http
DELETE /appointments/:id
```

---

## 4. Medical Records

### Get All Medical Records
```http
GET /medical-records?page=1&limit=20&patientId=uuid&veterinarianId=uuid
```

### Get Medical Record by ID
```http
GET /medical-records/:id
```

### Create Medical Record
```http
POST /medical-records
Content-Type: application/json

{
  "patientId": "uuid",
  "veterinarianId": "uuid",
  "visitDate": "2024-01-15",
  "chiefComplaint": "Coughing for 3 days",
  "diagnosis": "Kennel cough",
  "treatment": "Antibiotics prescribed",
  "notes": "Follow-up in 2 weeks",
  "vitalSigns": {
    "temperature": 38.5,
    "heartRate": 120,
    "respiratoryRate": 24,
    "weight": 25.5
  }
}
```

### Update Medical Record
```http
PUT /medical-records/:id
```

### Delete Medical Record
```http
DELETE /medical-records/:id
```

---

## 5. Prescription Management

### Get All Prescriptions
```http
GET /prescriptions?page=1&limit=20&patientId=uuid&prescribedById=uuid&status=active
```

### Get Prescription by ID
```http
GET /prescriptions/:id
```

### Create Prescription
```http
POST /prescriptions
Content-Type: application/json

{
  "patientId": "uuid",
  "medicationId": "uuid",
  "prescribedById": "uuid",
  "prescriptionDate": "2024-01-15",
  "dosage": "10mg",
  "frequency": "twice daily",
  "duration": "10 days",
  "instructions": "Give with food",
  "refills": 2
}
```

### Update Prescription
```http
PUT /prescriptions/:id
```

### Delete Prescription
```http
DELETE /prescriptions/:id
```

---

## 6. Inventory Management

### Get All Inventory Items
```http
GET /inventory?page=1&limit=20&category=medication&search=keyword&lowStock=true
```

### Get Inventory Item by ID
```http
GET /inventory/:id
```

### Create Inventory Item
```http
POST /inventory
Content-Type: application/json

{
  "name": "Amoxicillin 500mg",
  "sku": "MED-001",
  "category": "medication",
  "quantity": 100,
  "unit": "tablets",
  "reorderPoint": 20,
  "unitCost": 2.50,
  "supplier": "MedSupply Inc",
  "expirationDate": "2025-12-31"
}
```

### Update Inventory Item
```http
PUT /inventory/:id
```

### Delete Inventory Item
```http
DELETE /inventory/:id
```

---

## 7. Billing & Payment

### Get All Invoices
```http
GET /invoices?page=1&limit=20&clientId=uuid&status=pending
```

### Get Invoice by ID
```http
GET /invoices/:id
```
Returns invoice with line items and payment history.

### Create Invoice
```http
POST /invoices
Content-Type: application/json

{
  "clientId": "uuid",
  "invoiceNumber": "INV-2024-001",
  "invoiceDate": "2024-01-15",
  "dueDate": "2024-02-15",
  "subtotal": 150.00,
  "tax": 12.00,
  "total": 162.00,
  "notes": "Annual checkup and vaccinations"
}
```

### Update Invoice
```http
PUT /invoices/:id
```

### Delete Invoice
```http
DELETE /invoices/:id
```

---

## 8. Laboratory Management

### Get All Lab Tests
```http
GET /lab-tests?page=1&limit=20&patientId=uuid&orderedById=uuid&status=pending
```

### Get Lab Test by ID
```http
GET /lab-tests/:id
```

### Create Lab Test
```http
POST /lab-tests
Content-Type: application/json

{
  "patientId": "uuid",
  "orderedById": "uuid",
  "testName": "Complete Blood Count",
  "testType": "hematology",
  "orderDate": "2024-01-15",
  "notes": "Patient showing signs of anemia"
}
```

### Update Lab Test
```http
PUT /lab-tests/:id
Content-Type: application/json

{
  "status": "completed",
  "results": {
    "wbc": 7.5,
    "rbc": 5.2,
    "hemoglobin": 14.5
  },
  "completedDate": "2024-01-16"
}
```

### Delete Lab Test
```http
DELETE /lab-tests/:id
```

---

## 9. Staff Management

### Get All Staff
```http
GET /staff?page=1&limit=20&role=veterinarian&status=active&search=keyword
```

### Get Staff by ID
```http
GET /staff/:id
```
Returns staff member with recent appointments and schedules.

### Create Staff
```http
POST /staff
Content-Type: application/json

{
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah@vetclinic.com",
  "phone": "555-0125",
  "role": "veterinarian",
  "licenseNumber": "VET-12345",
  "specialization": "Surgery",
  "hireDate": "2023-01-15"
}
```

### Update Staff
```http
PUT /staff/:id
```

### Delete Staff (Soft Delete)
```http
DELETE /staff/:id
```

---

## 10. Communication Management

### Get All Communications
```http
GET /communications?page=1&limit=20&clientId=uuid&type=email
```

### Get Communication by ID
```http
GET /communications/:id
```

### Create Communication
```http
POST /communications
Content-Type: application/json

{
  "clientId": "uuid",
  "type": "email",
  "subject": "Appointment Reminder",
  "message": "Your appointment is scheduled for tomorrow at 10 AM",
  "sentAt": "2024-01-15T09:00:00Z",
  "status": "sent"
}
```

### Update Communication
```http
PUT /communications/:id
```

### Delete Communication
```http
DELETE /communications/:id
```

---

## 11. Document Management

### Get All Documents
```http
GET /documents?page=1&limit=20&entityType=patient&entityId=uuid&category=medical
```

### Get Document by ID
```http
GET /documents/:id
```

### Create Document
```http
POST /documents
Content-Type: application/json

{
  "fileName": "lab_results.pdf",
  "fileType": "application/pdf",
  "fileSize": 1024000,
  "filePath": "/uploads/documents/lab_results.pdf",
  "entityType": "patient",
  "entityId": "uuid",
  "category": "medical",
  "description": "Blood test results from Jan 2024"
}
```

### Update Document
```http
PUT /documents/:id
```

### Delete Document
```http
DELETE /documents/:id
```

---

## 12. Analytics & Reporting

### Get Dashboard Statistics
```http
GET /analytics/dashboard
```
Returns: total patients, clients, appointments, active patients, today's appointments, pending invoices.

### Get Patient Demographics
```http
GET /analytics/patients
```
Returns: patients grouped by species and status.

### Get Appointment Analytics
```http
GET /analytics/appointments?startDate=2024-01-01&endDate=2024-01-31
```
Returns: appointments grouped by status and type for the date range.

### Get Financial Report
```http
GET /analytics/financial?startDate=2024-01-01&endDate=2024-01-31
```
Returns: revenue, payments, pending amounts, and invoices by status.

### Get Inventory Report
```http
GET /analytics/inventory
```
Returns: low stock items, expiring items, items by category.

### Get Staff Analytics
```http
GET /analytics/staff
```
Returns: total staff, staff by role, staff by status.

---

## Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Authentication required"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "status": "error",
  "message": "Time slot already booked"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## Rate Limiting
API requests are limited to 100 requests per 15 minutes per IP address.

## Pagination
Default page size is 20 items. Maximum page size is 100 items.

## Data Validation
All input data is validated using Joi schemas. Required fields, data types, and formats are enforced at the API level.
