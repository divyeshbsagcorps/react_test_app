import React, { useState, useEffect } from 'react';
import type { Employee } from '../types';
import { api } from '../api';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: number | null;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  onEdit,
  onDelete
}) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!employeeId) return;

    let ignore = false;
    api.getEmployee(employeeId)
      .then((data) => {
        if (!ignore) {
          setEmployee(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to fetch employee details.');
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [employeeId]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Employee Details</h2>
            <p className="modal-subtitle">Employee profile and department information</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {isLoading && (
            <div className="detail-loading-box">
              <svg className="animate-spin text-accent" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"></path>
              </svg>
              <span>Loading record...</span>
            </div>
          )}

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

          {!isLoading && !error && employee && (
            <div className="detail-content">
              <div className="detail-profile-card">
                <div className="detail-avatar">
                  {employee.first_name?.[0]?.toUpperCase()}
                  {employee.last_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="detail-name">{employee.first_name} {employee.last_name}</h3>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-field">
                  <span className="detail-field-label">Email Address</span>
                  <a href={`mailto:${employee.email}`} className="email-link">
                    {employee.email}
                  </a>
                </div>

                <div className="detail-field">
                  <span className="detail-field-label">Department</span>
                  <span className="dept-badge dept-blue">{employee.department}</span>
                </div>

                {employee.hire_date && (
                  <div className="detail-field">
                    <span className="detail-field-label">Hire Date</span>
                    <span className="detail-field-value">{employee.hire_date}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {employee && (
            <div className="detail-footer-actions">
              <button
                type="button"
                className="btn-danger-outline btn-sm"
                onClick={() => {
                  onClose();
                  onDelete(employee);
                }}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => {
                  onClose();
                  onEdit(employee);
                }}
              >
                Edit Profile
              </button>
            </div>
          )}
          <button type="button" className="btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
