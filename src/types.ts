export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  hire_date?: string;
}

export interface EmployeeFormData {
  first_name: string;
  last_name: string;
  email: string;
  department: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
