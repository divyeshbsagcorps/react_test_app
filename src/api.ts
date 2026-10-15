import type { Employee, EmployeeFormData } from './types';

const API_BASE = '/api/employees';

// Helper to handle API response errors cleanly
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    try {
      const errorJson = await res.json();
      if (typeof errorJson === 'object' && errorJson !== null) {
        // Collect field validation errors
        const messages = Object.entries(errorJson).map(([field, err]) => {
          if (Array.isArray(err)) return `${field}: ${err.join(', ')}`;
          return `${field}: ${String(err)}`;
        });
        if (messages.length > 0) {
          errorMessage = messages.join(' | ');
        }
      }
    } catch {
      const text = await res.text();
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  // DELETE might return 204 No Content
  if (res.status === 204) {
    return {} as T;
  }

  return res.json() as Promise<T>;
}

export const api = {
  // GET /api/employees/
  async getEmployees(): Promise<Employee[]> {
    const res = await fetch(`${API_BASE}/`, {
      headers: {
        Accept: 'application/json'
      }
    });
    return handleResponse<Employee[]>(res);
  },

  // GET /api/employees/{id}/
  async getEmployee(id: number): Promise<Employee> {
    const res = await fetch(`${API_BASE}/${id}/`, {
      headers: {
        Accept: 'application/json'
      }
    });
    return handleResponse<Employee>(res);
  },

  // POST /api/employees/
  async createEmployee(data: EmployeeFormData): Promise<Employee> {
    const res = await fetch(`${API_BASE}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse<Employee>(res);
  },

  // PUT /api/employees/{id}/
  async updateEmployee(id: number, data: EmployeeFormData): Promise<Employee> {
    const res = await fetch(`${API_BASE}/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse<Employee>(res);
  },

  // PATCH /api/employees/{id}/
  async patchEmployee(id: number, data: Partial<EmployeeFormData>): Promise<Employee> {
    const res = await fetch(`${API_BASE}/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse<Employee>(res);
  },

  // DELETE /api/employees/{id}/
  async deleteEmployee(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}/`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json'
      }
    });
    return handleResponse<void>(res);
  }
};
