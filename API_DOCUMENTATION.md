# Progress API Documentation

This API manages workout sessions, exercises, performed exercises, and sets for advanced lifters.

## Base URL

```
http://localhost:3000
```

## Authentication

All endpoints require JWT authentication via Auth0, except for public endpoints under `/public/*`.

---

## Session Endpoints

### Get Session by Date

```http
GET /sessions/{date}
```

**Parameters:**

- `date` (path parameter): Date in ISO format (YYYY-MM-DD)

**Response:**

```json
{
  "ssid": 123,
  "date": "2024-09-25",
  "name": "Push Day",
  "uid": "auth0|user123",
  "performedExercises": [
    {
      "peid": 456,
      "order": 1,
      "exercise": {
        "eid": 789,
        "name": "Bench Press"
      },
      "sets": [
        {
          "stid": 101,
          "order": 1,
          "reps": 8,
          "weight": 225.5
        }
      ]
    }
  ]
}
```

### Create Session

```http
POST /sessions
```

**Request Body:**

```json
{
  "name": "Push Day"
}
```

**Response:**

```json
{
  "ssid": 123,
  "date": "2024-09-25",
  "name": "Push Day",
  "uid": "auth0|user123",
  "performedExercises": []
}
```

### Update Session

```http
PATCH /sessions/{date}
```

**Parameters:**

- `date` (path parameter): Date in ISO format (YYYY-MM-DD)

**Request Body:**

```json
{
  "name": "Updated Push Day"
}
```

**Response:**

```json
{
  "ssid": 123,
  "date": "2024-09-25",
  "name": "Updated Push Day",
  "uid": "auth0|user123",
  "performedExercises": []
}
```

### Delete Session

```http
DELETE /sessions/{date}
```

**Parameters:**

- `date` (path parameter): Date in ISO format (YYYY-MM-DD)

**Response:**

```http
204 No Content
```

---

## Exercise Endpoints

### Get All Exercises

```http
GET /exercises
```

**Response:**

```json
[
  {
    "eid": 789,
    "name": "Bench Press"
  },
  {
    "eid": 790,
    "name": "Squat"
  }
]
```

### Create Exercise

```http
POST /exercises
```

**Request Body:**

```json
{
  "name": "Deadlift"
}
```

**Response:**

```json
{
  "eid": 791,
  "name": "Deadlift"
}
```

### Delete Exercise

```http
DELETE /exercises/{eid}
```

**Parameters:**

- `eid` (path parameter): Exercise ID

**Response:**

```http
204 No Content
```

---

## Performed Exercise Endpoints

### Create Performed Exercise

```http
POST /performed-exercises
```

**Request Body:**

```json
{
  "eid": 789,
  "ssid": 123,
  "order": 1
}
```

**Response:**

```json
{
  "peid": 456,
  "order": 1,
  "exercise": {
    "eid": 789,
    "name": "Bench Press"
  },
  "sets": []
}
```

### Update Performed Exercise

```http
PATCH /performed-exercises/{peid}
```

**Parameters:**

- `peid` (path parameter): Performed Exercise ID

**Request Body:**

```json
{
  "eid": 790
}
```

**Response:**

```json
{
  "peid": 456,
  "order": 1,
  "exercise": {
    "eid": 790,
    "name": "Squat"
  },
  "sets": []
}
```

### Delete Performed Exercise

```http
DELETE /performed-exercises/{peid}
```

**Parameters:**

- `peid` (path parameter): Performed Exercise ID

**Response:**

```http
204 No Content
```

---

## Set Endpoints

### Create Set

```http
POST /sets
```

**Request Body:**

```json
{
  "peid": 456,
  "order": 1,
  "reps": 8,
  "weight": 225.5
}
```

**Response:**

```json
{
  "stid": 101,
  "order": 1,
  "reps": 8,
  "weight": 225.5
}
```

### Update Set

```http
PATCH /sets/{stid}
```

**Parameters:**

- `stid` (path parameter): Set ID

**Request Body:**

```json
{
  "reps": 10,
  "weight": 230.0
}
```

**Response:**

```json
{
  "stid": 101,
  "order": 1,
  "reps": 10,
  "weight": 230.0
}
```

### Delete Set

```http
DELETE /sets/{stid}
```

**Parameters:**

- `stid` (path parameter): Set ID

**Response:**

```http
204 No Content
```

---

## Data Transfer Objects (DTOs)

### Session DTOs

#### SessionRequestDto

Used for creating and updating sessions.

```json
{
  "name": "string"
}
```

#### SessionResponseDto

```json
{
  "ssid": "number",
  "date": "string (ISO date)",
  "name": "string",
  "uid": "string",
  "performedExercises": "PerformedExerciseResponseDto[]"
}
```

### Exercise DTOs

#### CreateExerciseDto

```json
{
  "name": "string"
}
```

#### ExerciseResponseDto

```json
{
  "eid": "number",
  "name": "string"
}
```

### Performed Exercise DTOs

#### CreatePerformedExerciseDto

```json
{
  "eid": "number",
  "ssid": "number",
  "order": "number"
}
```

#### UpdatePerformedExerciseDto

```json
{
  "eid": "number"
}
```

#### PerformedExerciseResponseDto

```json
{
  "peid": "number",
  "order": "number",
  "exercise": "ExerciseResponseDto",
  "sets": "SetResponseDto[]"
}
```

### Set DTOs

#### CreateSetDto

```json
{
  "peid": "number",
  "order": "number",
  "reps": "number",
  "weight": "number"
}
```

#### UpdateSetDto

```json
{
  "reps": "number",
  "weight": "number"
}
```

#### SetResponseDto

```json
{
  "stid": "number",
  "order": "number",
  "reps": "number",
  "weight": "number"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Bad Request",
  "message": "Invalid request data",
  "timestamp": "2024-09-25T14:30:00Z"
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Authentication required",
  "timestamp": "2024-09-25T14:30:00Z"
}
```

### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "Resource not found",
  "timestamp": "2024-09-25T14:30:00Z"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "timestamp": "2024-09-25T14:30:00Z"
}
```

---

## Notes

1. All endpoints require authentication except those under `/public/*`
2. Date parameters should be in ISO format (YYYY-MM-DD)
3. The `uid` field is automatically populated from the authenticated user's JWT token
4. When creating sessions, the `date` is automatically set to the current date
5. Deleting a session will cascade delete all associated performed exercises and sets
6. Deleting a performed exercise will cascade delete all associated sets
7. Exercise deletion does not cascade (performed exercises will retain references)
8. The `order` field determines the sequence of performed exercises within a session and sets within a performed exercise
