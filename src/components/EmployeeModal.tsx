import React, { useState } from 'react';
import type { Employee, EmployeeFormData } from '../types';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  initialData?: Employee | null;
  mode: 'create' | 'edit';
}

const COMMON_DEPARTMENTS = [
  'Engineering',
  'Backend Engineering',
  'Frontend Engineering',
  'Product Design',
  'Product Management',
  'Human Resources',
  'Quality Assurance',
  'Operations',
  'Sales'
];

interface EmployeeModalContentProps {
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  initialData?: Employee | null;
  mode: 'create' | 'edit';
}

const EmployeeModalContent: React.FC<EmployeeModalContentProps> = ({
  onClose,
  onSubmit,
  initialData,
  mode
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>(() => ({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    email: initialData?.email || '',
    department: initialData?.department || 'Engineering'
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim() || !formData.department.trim()) {
      setValidationError('Please fill in all required fields.');
      return;
    }

    if (!formData.email.includes('@')) {
      setValidationError('Please provide a valid email address.');
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setValidationError(err.message);
      } else {
        setValidationError('Operation failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {mode === 'create' ? 'Add New Employee' : `Edit Employee #${initialData?.id}`}
            </h2>
            <p className="modal-subtitle">
              {mode === 'create'
                ? 'Create a new employee profile in the system'
                : 'Update the employee details across all records'}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {validationError && (
              <div className="form-error-banner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{validationError}</span>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="first_name">
                  First Name <span className="req-star">*</span>
                </label>
                <input
                  id="first_name"
                  type="text"
                  required
                  placeholder="e.g. Arjun"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="last_name">
                  Last Name <span className="req-star">*</span>
                </label>
                <input
                  id="last_name"
                  type="text"
                  required
                  placeholder="e.g. Sharma"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address <span className="req-star">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="e.g. arjun.sharma@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="department">
                Department <span className="req-star">*</span>
              </label>
              <div className="dept-input-cluster">
                <input
                  id="department"
                  type="text"
                  required
                  placeholder="Enter or select department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="quick-dept-chips">
                {COMMON_DEPARTMENTS.slice(0, 5).map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`dept-chip ${formData.department === d ? 'is-selected' : ''}`}
                    onClick={() => setFormData({ ...formData, department: d })}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{mode === 'create' ? 'Create Employee' : 'Save Changes'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}) => {
  if (!isOpen) return null;

  return (
    <EmployeeModalContent
      key={initialData?.id ? `edit-${initialData.id}` : 'create'}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData}
      mode={mode}
    />
  );
};
