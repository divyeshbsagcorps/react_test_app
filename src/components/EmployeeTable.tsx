import React, { useState, useMemo } from 'react';
import type { Employee } from '../types';

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onOpenCreate: () => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading,
  error,
  onRetry,
  onView,
  onEdit,
  onDelete,
  onOpenCreate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Compute unique departments for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    employees.forEach((emp) => {
      if (emp.department && emp.department.trim()) {
        set.add(emp.department.trim());
      }
    });
    return Array.from(set).sort();
  }, [employees]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
      const email = emp.email.toLowerCase();
      const dept = emp.department.toLowerCase();
      const q = searchTerm.toLowerCase().trim();

      const matchesSearch = !q || fullName.includes(q) || email.includes(q) || dept.includes(q);
      const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [employees, searchTerm, selectedDept]);

  // Generate avatar initials
  const getInitials = (first: string, last: string) => {
    const f = first ? first[0].toUpperCase() : '';
    const l = last ? last[0].toUpperCase() : '';
    return `${f}${l}` || 'EP';
  };

  // Generate department badge color variant
  const getDeptColorClass = (dept: string) => {
    const d = dept.toLowerCase();
    if (d.includes('backend') || d.includes('platform')) return 'dept-purple';
    if (d.includes('engineer') || d.includes('tech') || d.includes('dev')) return 'dept-blue';
    if (d.includes('product') || d.includes('manage')) return 'dept-indigo';
    if (d.includes('design') || d.includes('ui') || d.includes('ux')) return 'dept-pink';
    if (d.includes('market') || d.includes('sales')) return 'dept-amber';
    if (d.includes('hr') || d.includes('people') || d.includes('talent')) return 'dept-green';
    return 'dept-gray';
  };

  return (
    <div className="table-card">
      {/* Search and Filters Toolbar */}
      <div className="table-toolbar">
        <div className="search-box">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        <div className="toolbar-filters">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="dept-select"
            aria-label="Filter by department"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <span className="count-pill">
            {filteredEmployees.length} {filteredEmployees.length === 1 ? 'employee' : 'employees'}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="table-loading-container">
          <div className="skeleton-row"></div>
          <div className="skeleton-row"></div>
          <div className="skeleton-row"></div>
          <div className="skeleton-row"></div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="table-error-container">
          <div className="error-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div>
            <h3 className="error-heading">Failed to load employee records</h3>
            <p className="error-subtext">{error}</p>
          </div>
          <button type="button" className="btn-secondary btn-sm" onClick={onRetry}>
            Retry Request
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredEmployees.length === 0 && (
        <div className="table-empty-container">
          <div className="empty-avatar-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
          </div>
          <h3 className="empty-title">
            {searchTerm || selectedDept !== 'ALL'
              ? 'No matching employees found'
              : 'No employees in directory yet'}
          </h3>
          <p className="empty-subtitle">
            {searchTerm || selectedDept !== 'ALL'
              ? 'Try adjusting your search query or department filter.'
              : 'Add your first employee to populate the directory.'}
          </p>
          {!searchTerm && selectedDept === 'ALL' && (
            <button type="button" className="btn-primary" onClick={onOpenCreate}>
              + Add First Employee
            </button>
          )}
        </div>
      )}

      {/* Table Content */}
      {!isLoading && !error && filteredEmployees.length > 0 && (
        <div className="table-wrapper">
          <table className="emp-table">
            <thead>
              <tr>
                <th scope="col" className="col-id">ID</th>
                <th scope="col" className="col-emp">Employee</th>
                <th scope="col" className="col-dept">Department</th>
                <th scope="col" className="col-email">Email</th>
                <th scope="col" className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="table-row">
                  <td className="col-id">
                    <span className="id-badge">#{emp.id}</span>
                  </td>

                  <td className="col-emp">
                    <div className="emp-cell">
                      <div className="emp-avatar">
                        {getInitials(emp.first_name, emp.last_name)}
                      </div>
                      <div className="emp-info">
                        <span className="emp-name">{emp.first_name} {emp.last_name}</span>
                        {emp.hire_date && (
                          <span className="emp-meta">Hired: {emp.hire_date}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="col-dept">
                    <span className={`dept-badge ${getDeptColorClass(emp.department)}`}>
                      {emp.department}
                    </span>
                  </td>

                  <td className="col-email">
                    <a href={`mailto:${emp.email}`} className="email-link">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <span>{emp.email}</span>
                    </a>
                  </td>

                  <td className="col-actions">
                    <div className="actions-cluster">
                      <button
                        type="button"
                        className="action-btn action-view"
                        onClick={() => onView(emp)}
                        title="View Employee Details (GET)"
                        aria-label={`View ${emp.first_name}`}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>

                      <button
                        type="button"
                        className="action-btn action-edit"
                        onClick={() => onEdit(emp)}
                        title="Edit Full Profile (PUT)"
                        aria-label={`Edit ${emp.first_name}`}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>


                      <button
                        type="button"
                        className="action-btn action-delete"
                        onClick={() => onDelete(emp)}
                        title="Delete Employee (DELETE)"
                        aria-label={`Delete ${emp.first_name}`}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
