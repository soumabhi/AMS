import React, { useEffect, useState, useCallback } from 'react';
import { ChevronDown, Plus, Edit, Trash2, AlertCircle, X, ArrowLeft, Save, ChevronRight, Home } from 'lucide-react';
import Toast from '../../components/Toast';
import TableSkeleton from '../../components/TableSkeleton';
import RoleFormPage from './RoleFormPage'; 

const RoleManagement = () => {
  const [currentPage, setCurrentPage] = useState('list');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    role: "",
    permissions: {
      Dashboard: false,
      Branch: false,
      BranchView: false,
      Staff: false,
      StaffView: false,
      Attendance: false,
      AttendanceView: false,
      Salary: false,
      SalaryView: false,
    }
  });

  const API_BASE_URL = 'http://localhost:5000/api';
  const API_ENDPOINTS = {
    roles: `${API_BASE_URL}/role/all`,
    createRole: `${API_BASE_URL}/role/create`,
    updateRole: (id) => `${API_BASE_URL}/role/${id}`,
    deleteRole: (id) => `${API_BASE_URL}/role/${id}`
  };

  const permissionGroups = [
    { name: "Dashboard", label: "Dashboard", viewField: "Dashboard" },
    { name: "Branch", label: "Branch", viewField: "BranchView", editField: "Branch" },
    { name: "Staff", label: "Staff", viewField: "StaffView", editField: "Staff" },
    { name: "Attendance", label: "Attendance", viewField: "AttendanceView", editField: "Attendance" },
    { name: "Salary", label: "Salary", viewField: "SalaryView", editField: "Salary" }
  ];

  const permissionColors = {
    'Dashboard': 'bg-purple-100 text-purple-800',
    'Branch': 'bg-blue-100 text-blue-800',
    'BranchView': 'bg-blue-50 text-blue-700',
    'Staff': 'bg-green-100 text-green-800',
    'StaffView': 'bg-green-50 text-green-700',
    'Attendance': 'bg-orange-100 text-orange-800',
    'AttendanceView': 'bg-orange-50 text-orange-700',
    'Salary': 'bg-red-100 text-red-800',
    'SalaryView': 'bg-red-50 text-red-700'
  };

  const permissionIcons = {
    'Dashboard': '📊',
    'Branch': '🏢',
    'BranchView': '👁',
    'Staff': '👥',
    'StaffView': '👁',
    'Attendance': '⏰',
    'AttendanceView': '👁',
    'Salary': '💰',
    'SalaryView': '👁'
  };

  const apiCall = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  }, []);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiCall(API_ENDPOINTS.roles);
      const rolesData = Array.isArray(response) ? response : 
                       (response?.roles && Array.isArray(response.roles)) ? response.roles : [];
      setRoles(rolesData);
    } catch (error) {
      showMessage('error', 'Failed to fetch roles. Please try again.');
      console.error('Fetch roles error:', error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const getPermissionDisplay = (permission) => {
    const permissionMap = {
      'Dashboard': 'Dashboard',
      'Branch': 'Branch edit',
      'BranchView': 'Branch view',
      'Staff': 'Staff edit',
      'StaffView': 'Staff view',
      'Attendance': 'Attendance edit',
      'AttendanceView': 'Attendance view',
      'Salary': 'Salary edit',
      'SalaryView': 'Salary view'
    };
    return permissionMap[permission] || permission;
  };

  const resetForm = useCallback(() => {
    setFormData({
      role: "",
      permissions: {
        Dashboard: false,
        Branch: false,
        BranchView: false,
        Staff: false,
        StaffView: false,
        Attendance: false,
        AttendanceView: false,
        Salary: false,
        SalaryView: false,
      }
    });
    setEditingRole(null);
    setSubmitAttempted(false);
  }, []);

  const navigateToAddRole = () => {
  resetForm();
  setCurrentPage('form');
};


  const navigateToRoleList = () => {
    setCurrentPage('list');
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (module, type, checked) => {
    const permissionKey = type === 'view' 
      ? module === 'Dashboard' ? 'Dashboard' : `${module}View`
      : module;
    
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permissionKey]: checked
      }
    }));
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    
    if (!formData.role.trim()) {
      showMessage('error', 'Role name is required');
      return;
    }

    const isDuplicate = roles.some(
      role => role.role.toLowerCase() === formData.role.trim().toLowerCase() && 
             (!editingRole || role._id !== editingRole._id)
    );

    if (isDuplicate) {
      showMessage('error', 'Role name already exists');
      return;
    }

    try {
      setLoading(true);
      
      const requestData = {
        role: formData.role.trim(),
        permissions: formData.permissions
      };

      if (editingRole) {
        const updatedRole = await apiCall(API_ENDPOINTS.updateRole(editingRole._id), {
          method: 'PUT',
          body: JSON.stringify(requestData)
        });
        
        showMessage('success', 'Role updated successfully');
      } else {
        const newRole = await apiCall(API_ENDPOINTS.createRole, {
          method: 'POST',
          body: JSON.stringify(requestData)
        });
        
        showMessage('success', 'Role created successfully');
      }

      await fetchRoles();
      navigateToRoleList();
    } catch (error) {
      console.error('Submit error:', error);
      
      if (error.message.includes('409') || error.message.toLowerCase().includes('duplicate')) {
        showMessage('error', 'Role name already exists');
      } else {
        showMessage('error', 
          editingRole 
            ? 'Failed to update role. Please try again.' 
            : 'Failed to create role. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

const handleEdit = (role) => {
  setEditingRole(role);
  setFormData({
    role: role.role,
    permissions: { 
      Dashboard: role.permissions.Dashboard || false,
      Branch: role.permissions.Branch || false,
      BranchView: role.permissions.BranchView || false,
      Staff: role.permissions.Staff || false,
      StaffView: role.permissions.StaffView || false,
      Attendance: role.permissions.Attendance || false,
      AttendanceView: role.permissions.AttendanceView || false,
      Salary: role.permissions.Salary || false,
      SalaryView: role.permissions.SalaryView || false,
    }
  });
  setCurrentPage('form');
  setSubmitAttempted(false);
};


  const handleDelete = async (roleId) => {
    if (!roleId) {
      showMessage('error', 'Invalid role ID');
      return;
    }

    try {
      setLoading(true);
      
      await apiCall(API_ENDPOINTS.deleteRole(roleId), {
        method: 'DELETE'
      });
      
      showMessage('success', 'Role deleted successfully');
      setDeleteConfirm(null);
      
      await fetchRoles();
    } catch (error) {
      console.error('Delete error:', error);
      showMessage('error', 'Failed to delete role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Breadcrumb = () => {
    const breadcrumbItems = [
      { label: 'Dashboard', href: '#', icon: Home },
      { label: 'Role Management', href: '#' },
    ];

    if (currentPage === 'form') {
      breadcrumbItems.push({
        label: editingRole ? 'Edit Role' : 'Add Role',
        href: '#'
      });
    }

    return (
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="inline-flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
              )}
              <div className="flex items-center">
                {item.icon && <item.icon className="w-4 h-4 mr-2 text-gray-500" />}
                <span
                  className={`text-sm font-medium ${
                    index === breadcrumbItems.length - 1
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700 cursor-pointer'
                  }`}
                  onClick={() => {
                    if (index === 0) {
                      
                    } else if (index === 1 && currentPage !== 'list') {
                      navigateToRoleList();
                    }
                  }}
                >
                  {item.label}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    );
  };

  const RoleListPage = () => {
    // Show skeleton while loading
    if (loading && roles.length === 0) {
  return (
    <TableSkeleton
      columns={4}
      rows={5}
      headerWidths={['60px', '120px', '200px', '100px']}
      cellWidths={['60px', '120px', '100%', '100px']}
    />
  );
}


    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
          <button
            onClick={navigateToAddRole}
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-colors"
            disabled={loading}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sl.No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && roles.length > 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mr-2"></div>
                      Updating roles...
                    </div>
                  </td>
                </tr>
              )}
              {!loading && roles.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No roles found. Click "Add Role" to create your first role.
                  </td>
                </tr>
              )}
              {roles.map((role, index) => (
                <tr key={role._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {role.role}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(role.permissions || {})
                        .filter(([_, hasAccess]) => hasAccess)
                        .map(([permission]) => (
                          <span
                            key={permission}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${permissionColors[permission] || 'bg-gray-100 text-gray-800'}`}
                          >
                            <span className="mr-1">{permissionIcons[permission] || '📋'}</span>
                            {getPermissionDisplay(permission)}
                          </span>
                        ))}
                      {Object.values(role.permissions || {}).every(val => !val) && (
                        <span className="text-xs text-gray-400 italic">No permissions assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(role)}
                        disabled={loading}
                        className="inline-flex items-center px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(role)}
                        disabled={loading}
                        className="inline-flex items-center px-3 py-1 bg-gray-400 text-gray-800 rounded-md hover:bg-gray-500 hover:text-white transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const RoleFormPage = () => {
    console.log("Form rendered, current value:", formData.role);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingRole ? "Edit Role" : "Add New Role"}
          </h2>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.role.trim()}
            className="inline-flex items-center px-3 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {loading && <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>}
            <Save className="w-3 h-3 mr-2" />
            {loading ? 'Saving...' : (editingRole ? "Update" : "Save")}
          </button>
        </div>

        <div className="p-5">
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
              <label className="block text-sm font-medium text-gray-700">
                Role Information
              </label>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                Role Name *
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Enter role name"
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm disabled:opacity-50 disabled:bg-gray-100 ${
                  submitAttempted && !formData.role.trim() ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                }`}
              />
              {submitAttempted && !formData.role.trim() && (
                <p className="text-red-500 text-xs mt-1">Role name is required</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
              <h3 className="text-sm font-medium text-gray-700">Permission Settings</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid gap-3">
             {permissionGroups.map(group => (
  <div key={group.name} className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:border-gray-300 transition-colors">
    <div className="flex items-center space-x-2">
      <span className="text-sm">{permissionIcons[group.name] || '📋'}</span>
      <span className="text-sm font-medium text-gray-900">{group.label}</span>
    </div>
    <div className="flex items-center space-x-4">
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={
            group.name === 'Dashboard' 
              ? formData.permissions.Dashboard
              : formData.permissions[`${group.name}View`]
          }
          onChange={(e) => handlePermissionChange(group.name, 'view', e.target.checked)}
          disabled={loading}
          className="mr-2 h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded disabled:opacity-50"
        />
        <span className="text-xs font-medium text-gray-600">View</span>
      </label>
      {group.name !== 'Dashboard' && (
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.permissions[group.name]}
            onChange={(e) => handlePermissionChange(group.name, 'edit', e.target.checked)}
            disabled={loading || !formData.permissions[`${group.name}View`]} // Disable edit if view is not checked
            className="mr-2 h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded disabled:opacity-50"
          />
          <span className="text-xs font-medium text-gray-600">Edit</span>
        </label>
      )}
    </div>
  </div>
))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={navigateToRoleList}
              disabled={loading}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.role.trim()}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              {loading && <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2 inline-block"></div>}
              {loading ? 'Processing...' : (editingRole ? "Update Role" : "Create Role")}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toast
  message={message.text}
  type={message.type}
  isVisible={!!message.text}
  onClose={() => setMessage({ type: '', text: '' })}
/>


      <div className="max-w-7xl mx-auto">
        <Breadcrumb />
        {currentPage === 'list' ? (
  <RoleListPage />
) : (
  <RoleFormPage
    formData={formData}
    handleInputChange={handleInputChange}
    handlePermissionChange={handlePermissionChange}
    handleSubmit={handleSubmit}
    loading={loading}
    editingRole={editingRole}
    submitAttempted={submitAttempted}
    navigateToRoleList={navigateToRoleList}
    permissionGroups={permissionGroups}
    permissionIcons={permissionIcons}
  />
)}


      </div>

     {deleteConfirm && (
  <div 
    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        setDeleteConfirm(null);
      }
    }}
  >
    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start mb-5">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Delete Role</h3>
            <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
          </div>
        </div>
        
        <div className="mt-2 mb-6">
          <p className="text-gray-700">
            Are you sure you want to delete the role <span className="font-semibold text-gray-900">"{deleteConfirm.role}"</span>? 
            This will permanently remove the role and all associated permissions.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(deleteConfirm._id)}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </span>
            ) : 'Delete Role'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default RoleManagement;