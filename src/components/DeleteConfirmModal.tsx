import React, { useState } from 'react';
import type { Employee } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
  employee: Employee | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  employee
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !employee) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm(employee.id);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete employee.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-danger-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div>
            <h2 className="modal-title">Delete Employee Record</h2>
            <p className="modal-subtitle">This action cannot be undone</p>
          </div>
        </div>

        <div className="modal-body">
          {error && (
            <div className="form-error-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <p className="delete-confirm-text">
            Are you sure you want to delete <strong>{employee.first_name} {employee.last_name}</strong> (ID #{employee.id}) from the <strong>{employee.department}</strong> department?
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button type="button" className="btn-danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"></path>
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              <span>Confirm Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
