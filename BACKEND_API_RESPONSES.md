# Backend API Response Documentation

This document defines all API endpoints and response structures needed for the CV Builder application based on the frontend codebase.

## Base URL

```
Production: https://api.yourdomain.com/api
Development: http://localhost:3000/api
```

## Authentication

All protected endpoints require an `Authorization` header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "firstName": "Ahmed",
  "lastName": "Atia",
  "email": "ahmed@example.com",
  "password": "SecurePassword123!",
  "confirmedPassword": "SecurePassword123!"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "ahmed@example.com",
      "firstName": "Ahmed",
      "lastName": "Atia",
      "createdAt": "2025-01-15T10:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 3600
    }
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is already registered"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "ahmed@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "ahmed@example.com",
      "firstName": "Ahmed",
      "lastName": "Atia"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 3600
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

---

### 3. Get Current User

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "ahmed@example.com",
    "firstName": "Ahmed",
    "lastName": "Atia",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

---

### 4. Logout User

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 5. Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

---

## 👤 User Profile Endpoints

### 1. Get User Profile

**Endpoint:** `GET /api/user/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "Ahmed",
    "lastName": "Atia",
    "email": "ahmed@example.com",
    "phone": "+1234567890",
    "country": "United States",
    "profilePicture": "https://example.com/profile.jpg",
    "links": [
      {
        "id": "link-1",
        "label": "LinkedIn",
        "url": "https://linkedin.com/in/ahmed"
      },
      {
        "id": "link-2",
        "label": "GitHub",
        "url": "https://github.com/ahmed"
      }
    ],
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### 2. Update User Profile

**Endpoint:** `PUT /api/user/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "firstName": "Ahmed",
  "lastName": "Atia",
  "phone": "+1234567890",
  "country": "United States",
  "profilePicture": "https://example.com/profile.jpg",
  "links": [
    {
      "id": "link-1",
      "label": "LinkedIn",
      "url": "https://linkedin.com/in/ahmed"
    }
  ]
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "Ahmed",
    "lastName": "Atia",
    "email": "ahmed@example.com",
    "phone": "+1234567890",
    "country": "United States",
    "profilePicture": "https://example.com/profile.jpg",
    "links": [
      {
        "id": "link-1",
        "label": "LinkedIn",
        "url": "https://linkedin.com/in/ahmed"
      }
    ],
    "updatedAt": "2025-01-15T11:00:00.000Z"
  }
}
```

---

## 📄 CV Endpoints

### 1. Get All CVs

**Endpoint:** `GET /api/cv`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Sort field (default: "updatedAt")
- `order` (optional): Sort order - "asc" or "desc" (default: "desc")

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "cvs": [
      {
        "id": "cv-123",
        "title": "Software Engineer Resume",
        "createdAt": "2025-01-10T10:00:00.000Z",
        "updatedAt": "2025-01-15T10:30:00.000Z",
        "template": "Professional"
      },
      {
        "id": "cv-456",
        "title": "Frontend Developer CV",
        "createdAt": "2025-01-12T14:20:00.000Z",
        "updatedAt": "2025-01-14T09:15:00.000Z",
        "template": "Modern"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "totalPages": 1
    }
  }
}
```

**Empty Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "cvs": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

---

### 2. Get CV by ID

**Endpoint:** `GET /api/cv/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cv-123",
    "title": "Software Engineer Resume",
    "createdAt": "2025-01-10T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z",
    "personalInfo": {
      "firstName": "Ahmed",
      "lastName": "Atia",
      "email": "ahmed@example.com",
      "phone": "+1234567890",
      "country": "United States",
      "profilePicture": "https://example.com/profile.jpg",
      "links": [
        {
          "id": "link-1",
          "label": "LinkedIn",
          "url": "https://linkedin.com/in/ahmed"
        }
      ]
    },
    "professionalSummary": "Experienced software engineer with 5+ years of experience in full-stack development...",
    "workExperience": [
      {
        "id": "exp-1",
        "title": "Senior Software Engineer",
        "company": "Tech Corp",
        "location": "San Francisco, CA",
        "startDate": "2022-01-01",
        "endDate": "2024-12-31",
        "current": false,
        "description": "Led a team of 5 developers in building scalable web applications..."
      }
    ],
    "education": [
      {
        "id": "edu-1",
        "degree": "Bachelor of Science in Computer Science",
        "institution": "University of Technology",
        "location": "Cairo, Egypt",
        "startDate": "2016-09-01",
        "endDate": "2020-06-30",
        "current": false,
        "description": "Graduated with honors, GPA: 3.8/4.0"
      }
    ],
    "skills": [
      {
        "id": "skill-1",
        "category": "Frontend",
        "skills": ["React", "TypeScript", "Next.js", "Tailwind CSS"]
      },
      {
        "id": "skill-2",
        "category": "Backend",
        "skills": ["Node.js", "Express", "PostgreSQL", "MongoDB"]
      }
    ],
    "projects": [
      {
        "id": "proj-1",
        "title": "E-commerce Platform",
        "description": "Built a full-stack e-commerce platform using React and Node.js",
        "url": "https://example.com/project",
        "technologies": ["React", "Node.js", "PostgreSQL", "Stripe API"]
      }
    ],
    "languages": [
      {
        "id": "lang-1",
        "name": "English",
        "proficiency": "Native"
      },
      {
        "id": "lang-2",
        "name": "Arabic",
        "proficiency": "Native"
      }
    ],
    "certifications": [
      {
        "id": "cert-1",
        "name": "AWS Certified Solutions Architect",
        "company": "Amazon Web Services",
        "startDate": "2023-06-01",
        "description": "Professional certification in cloud architecture",
        "url": "https://aws.amazon.com/certification"
      }
    ],
    "template": "Professional"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "CV_NOT_FOUND",
    "message": "CV not found or you don't have access to it"
  }
}
```

---

### 3. Create CV

**Endpoint:** `POST /api/cv`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Software Engineer Resume",
  "template": "Professional",
  "personalInfo": {
    "firstName": "Ahmed",
    "lastName": "Atia",
    "email": "ahmed@example.com",
    "phone": "+1234567890",
    "country": "United States"
  },
  "professionalSummary": "Experienced software engineer...",
  "workExperience": [],
  "education": [],
  "skills": [],
  "projects": [],
  "languages": [],
  "certifications": []
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "CV created successfully",
  "data": {
    "id": "cv-789",
    "title": "Software Engineer Resume",
    "createdAt": "2025-01-15T12:00:00.000Z",
    "updatedAt": "2025-01-15T12:00:00.000Z",
    "template": "Professional",
    "personalInfo": {
      "firstName": "Ahmed",
      "lastName": "Atia",
      "email": "ahmed@example.com",
      "phone": "+1234567890",
      "country": "United States"
    },
    "professionalSummary": "Experienced software engineer...",
    "workExperience": [],
    "education": [],
    "skills": [],
    "projects": [],
    "languages": [],
    "certifications": []
  }
}
```

---

### 4. Update CV

**Endpoint:** `PUT /api/cv/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:** (Same structure as Create, all fields optional)
```json
{
  "title": "Updated Resume Title",
  "professionalSummary": "Updated summary...",
  "workExperience": [
    {
      "id": "exp-1",
      "title": "Senior Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "startDate": "2022-01-01",
      "endDate": "2024-12-31",
      "current": false,
      "description": "Led a team of 5 developers..."
    }
  ]
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "CV updated successfully",
  "data": {
    "id": "cv-123",
    "title": "Updated Resume Title",
    "updatedAt": "2025-01-15T12:30:00.000Z",
    // ... full CV object
  }
}
```

---

### 5. Delete CV

**Endpoint:** `DELETE /api/cv/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "CV deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "CV_NOT_FOUND",
    "message": "CV not found or you don't have access to it"
  }
}
```

---

### 6. Duplicate CV

**Endpoint:** `POST /api/cv/:id/duplicate`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "CV duplicated successfully",
  "data": {
    "id": "cv-999",
    "title": "Software Engineer Resume (Copy)",
    // ... full CV object (duplicate)
  }
}
```

---

## 📤 Export Endpoints

### 1. Export CV to PDF

**Endpoint:** `POST /api/cv/:id/export/pdf`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body (optional):**
```json
{
  "template": "Professional",
  "format": "A4"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://api.yourdomain.com/api/cv/cv-123/export/pdf/download?token=...",
    "expiresAt": "2025-01-15T13:00:00.000Z"
  }
}
```

**Alternative: Direct PDF Response**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="resume.pdf"`
- Returns PDF binary data

---

## 🔄 Standard Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [] // Optional: Array of validation errors or additional info
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication token |
| `FORBIDDEN` | 403 | User doesn't have permission |
| `NOT_FOUND` | 404 | Resource not found |
| `CV_NOT_FOUND` | 404 | CV not found or no access |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate email) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

### Validation Error Example

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}