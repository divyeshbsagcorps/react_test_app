# Employee Management API Documentation

**Module:** Employee Management
**Base URL:** `https://api.community.gramanikulasangam.org/api/employees/`

## 1. Overview

The Employee Management API provides endpoints to create, retrieve, update, and delete employee records.

### Employee fields

| Field        | Type         | Description                |
| ------------ | ------------ | -------------------------- |
| `id`         | Integer / ID | Unique employee identifier |
| `first_name` | String       | Employee's first name      |
| `last_name`  | String       | Employee's last name       |
| `email`      | String       | Employee's email address   |
| `department` | String       | Employee's department      |

Required-field rules and validation constraints should be confirmed against the backend implementation.

## 2. API Endpoints

| Operation                 | Method | Endpoint               |
| ------------------------- | ------ | ---------------------- |
| List employees            | GET    | `/api/employees/`      |
| Retrieve employee         | GET    | `/api/employees/{id}/` |
| Create employee           | POST   | `/api/employees/`      |
| Update employee           | PUT    | `/api/employees/{id}/` |
| Partially update employee | PATCH  | `/api/employees/{id}/` |
| Delete employee           | DELETE | `/api/employees/{id}/` |

## 3. List Employees

**Method:** `GET`

**Endpoint:** `/api/employees/`

Retrieves the employee collection for displaying in the UI.

**Request headers**

```http
Accept: application/json
```

**Example request**

```bash
curl -X GET "https://api.community.gramanikulasangam.org/api/employees/" \
  -H "Accept: application/json"
```

**UI usage**

- Display employees in a table or list.
- Provide loading, empty, and error states.
- Use employee IDs for detail, edit, and delete actions.

The response structure, pagination, and filtering capabilities should be confirmed against the actual API.

## 4. Retrieve Employee Details

**Method:** `GET`

**Endpoint:** `/api/employees/{id}/`

Retrieves an individual employee using their unique ID.

**Example request**

```bash
curl -X GET "https://api.community.gramanikulasangam.org/api/employees/1/" \
  -H "Accept: application/json"
```

Replace `1` with the actual employee ID.

**UI usage**

- Populate the employee details page or edit form.
- Handle cases where the employee does not exist.

## 5. Create Employee

**Method:** `POST`

**Endpoint:** `/api/employees/`

Creates a new employee record.

**Request headers**

```http
Content-Type: application/json
Accept: application/json
```

**Request body**

```json
{
  "first_name": "Arjun",
  "last_name": "Sharma",
  "email": "arjun.sharma@example.com",
  "department": "Engineering"
}
```

**Example request**

```bash
curl -X POST "https://api.community.gramanikulasangam.org/api/employees/" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "first_name": "Arjun",
    "last_name": "Sharma",
    "email": "arjun.sharma@example.com",
    "department": "Engineering"
  }'
```

**UI usage**

1. Provide a form with the four employee fields.
2. Submit the form as JSON.
3. On success, show a confirmation and refresh the employee list.
4. On validation failure, display relevant error messages.

## 6. Update Employee

**Method:** `PUT`

**Endpoint:** `/api/employees/{id}/`

Updates an employee using the supplied fields.

**Request body**

```json
{
  "first_name": "Arjun",
  "last_name": "Sharma",
  "email": "arjun.sharma@example.com",
  "department": "Backend Engineering"
}
```

**Example request**

```bash
curl -X PUT "https://api.community.gramanikulasangam.org/api/employees/1/" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "first_name": "Arjun",
    "last_name": "Sharma",
    "email": "arjun.sharma@example.com",
    "department": "Backend Engineering"
  }'
```

**UI usage**

- Populate the form with existing employee details.
- Submit all fields expected by the backend for a full update.
- Refresh the employee record or list after success.

## 7. Partially Update Employee

**Method:** `PATCH`

**Endpoint:** `/api/employees/{id}/`

Updates only the fields included in the request.

**Request body**

```json
{
  "department": "Backend Engineering"
}
```

**Example request**

```bash
curl -X PATCH "https://api.community.gramanikulasangam.org/api/employees/1/" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "department": "Backend Engineering"
  }'
```

**UI usage**

- Use PATCH when only specific fields need to change.
- Send only the fields being updated.
- Refresh the employee details after success.

## 8. Delete Employee

**Method:** `DELETE`

**Endpoint:** `/api/employees/{id}/`

Deletes the employee identified by the supplied ID, if deletion is supported by the backend.

**Example request**

```bash
curl -X DELETE "https://api.community.gramanikulasangam.org/api/employees/2/"
```

**UI usage**

1. Show a confirmation dialog before deletion.
2. Call the DELETE endpoint using the selected employee's ID.
3. Remove the employee from the list after confirmed success.
4. Display an appropriate error if the operation fails.

Use a test employee when validating deletion.