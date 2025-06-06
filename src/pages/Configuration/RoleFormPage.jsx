import React from 'react';
import { Save } from 'lucide-react';

const RoleFormPage = ({
  formData,
  handleInputChange,
  handlePermissionChange,
  handleSubmit,
  loading,
  editingRole,
  submitAttempted,
  navigateToRoleList,
  permissionGroups,
  permissionIcons
}) => {
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
          <Save className="w-3 h-3 mr-2" />
          {loading ? 'Saving...' : (editingRole ? "Update" : "Save")}
        </button>
      </div>

      <div className="p-5">
        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Role Name *</label>
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

        <div className="grid gap-3">
          {permissionGroups.map(group => (
            <div key={group.name} className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200">
              <div className="flex items-center space-x-2">
                <span>{permissionIcons[group.name] || '📋'}</span>
                <span className="text-sm font-medium">{group.label}</span>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={group.name === 'Dashboard' ? formData.permissions.Dashboard : formData.permissions[`${group.name}View`]}
                    onChange={(e) => handlePermissionChange(group.name, 'view', e.target.checked)}
                    disabled={loading}
                    className="mr-2 h-4 w-4"
                  />
                  <span className="text-xs">View</span>
                </label>
                {group.name !== 'Dashboard' && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permissions[group.name]}
                      onChange={(e) => handlePermissionChange(group.name, 'edit', e.target.checked)}
                      disabled={loading}
                      className="mr-2 h-4 w-4"
                    />
                    <span className="text-xs">Edit</span>
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={navigateToRoleList}
            disabled={loading}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.role.trim()}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-colors text-sm font-medium"
          >
            {loading ? 'Processing...' : (editingRole ? "Update Role" : "Create Role")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleFormPage;
