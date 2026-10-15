import { useState, useEffect, useCallback } from 'react';
import type { Employee, EmployeeFormData, ToastMessage } from './types';
import { api } from './api';
import { Header } from './components/Header';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeModal } from './components/EmployeeModal';
import { EmployeeDetailModal } from './components/EmployeeDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';
import './App.css';

export function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployeeId, setViewingEmployeeId] = useState<number | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial load
  useEffect(() => {
    let ignore = false;
    api.getEmployees()
      .then((data) => {
        if (!ignore) {
          setEmployees(Array.isArray(data) ? data : []);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load employee records.');
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Manual refresh or retry
  const handleReload = async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const data = await api.getEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load employee records.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Create Employee (POST /api/employees/)
  const handleCreate = async (formData: EmployeeFormData) => {
    const created = await api.createEmployee(formData);
    setEmployees((prev) => [created, ...prev]);
    addToast('success', `Created employee ${created.first_name} ${created.last_name} (#${created.id})`);
  };

  // Update Employee (PUT /api/employees/{id}/)
  const handleUpdate = async (formData: EmployeeFormData) => {
    if (!editingEmployee) return;
    const updated = await api.updateEmployee(editingEmployee.id, formData);
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === updated.id ? updated : emp))
    );
    addToast('success', `Updated employee ${updated.first_name} ${updated.last_name}`);
  };

  // Delete Employee (DELETE /api/employees/{id}/)
  const handleDelete = async (id: number) => {
    await api.deleteEmployee(id);
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    addToast('info', `Employee #${id} has been removed.`);
  };

  return (
    <div className="emp-app-layout">
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenCreate={() => setIsCreateOpen(true)}
        onRefresh={() => handleReload(true)}
        isRefreshing={isRefreshing}
      />

      <main className="emp-main">
        <EmployeeTable
          employees={employees}
          isLoading={isLoading}
          error={error}
          onRetry={() => handleReload(false)}
          onView={(emp) => setViewingEmployeeId(emp.id)}
          onEdit={(emp) => setEditingEmployee(emp)}
          onDelete={(emp) => setDeletingEmployee(emp)}
          onOpenCreate={() => setIsCreateOpen(true)}
        />
      </main>

      {/* Create Modal (POST) */}
      <EmployeeModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        mode="create"
      />

      {/* Edit Modal (PUT) */}
      <EmployeeModal
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        onSubmit={handleUpdate}
        initialData={editingEmployee}
        mode="edit"
      />

      {/* View Detail Modal (GET /api/employees/{id}/) */}
      <EmployeeDetailModal
        isOpen={viewingEmployeeId !== null}
        onClose={() => setViewingEmployeeId(null)}
        employeeId={viewingEmployeeId}
        onEdit={(emp) => setEditingEmployee(emp)}
        onDelete={(emp) => setDeletingEmployee(emp)}
      />

      {/* Delete Confirmation Modal (DELETE) */}
      <DeleteConfirmModal
        isOpen={!!deletingEmployee}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={handleDelete}
        employee={deletingEmployee}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
