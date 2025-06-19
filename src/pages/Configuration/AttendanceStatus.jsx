import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, X, AlertCircle, CheckCircle, Calendar, User, Settings } from 'lucide-react';
import Toast from '../../components/Toast';

// Skeleton Loader Component with enhanced styling
const TableSkeleton = () => {
  return (
    <tbody className="bg-white divide-y divide-gray-100">
      {[...Array(5)].map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-8 mx-auto"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-48"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-16"></div>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

// Enhanced Input Component
const Input = ({ label, name, value, onChange, placeholder, error, type = "text", className = "", disabled = false, maxLength }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 ${error ? 'border-gray-400 bg-gray-50/50' : 'hover:border-gray-300'} ${className}`}
        />
        {maxLength && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {value.length}/{maxLength}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

// Enhanced TextArea Component
const TextArea = ({ label, name, value, onChange, placeholder, error, className = "", disabled = false, rows = 4, maxLength }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 resize-none ${error ? 'border-gray-400 bg-gray-50/50' : 'hover:border-gray-300'} ${className}`}
        />
        {maxLength && (
          <div className="absolute right-3 bottom-3 text-xs text-gray-400">
            {value.length}/{maxLength}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

// API Service with improved error handling
const apiService = {
  baseURL: 'http://localhost:5000/api', // Base API URL
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log('API Request URL:', url);
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request to ${url} failed:`, error);
      throw error;
    }
  },

  async getAllStatuses() {
    return this.request('/aStatus/all'); // Updated endpoint
  },

  async createStatus(statusData) {
    return this.request('/aStatus/create', {
      method: 'POST',
      body: JSON.stringify(statusData),
    });
  },

  async updateStatus(id, statusData) {
    return this.request(`/aStatus/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }
};

const StatusManagement = () => {
  const [statuses, setStatuses] = useState([]);
  const [editingStatus, setEditingStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  const [formData, setFormData] = useState({
    statusName: "",
    remarks: ""
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [remarkModalVisible, setRemarkModalVisible] = useState(false);
  const [currentRemark, setCurrentRemark] = useState('');

  // Fetch statuses on component mount
  useEffect(() => {
    fetchStatuses();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
    setTimeout(hideToast, 5000);
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllStatuses();
      // Handle different response structures
      const statusesData = Array.isArray(response) ? response : 
                         response.data ? response.data : 
                         response.result ? response.result : [];
      setStatuses(statusesData);
    } catch (error) {
      console.error('Fetch error:', error);
      showToast(`Failed to fetch statuses: ${error.message}`, 'error');
      setStatuses([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ statusName: "", remarks: "" });
    setValidationErrors({});
    setEditingStatus(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.statusName.trim()) {
      errors.statusName = 'Status name is required';
    } else if (formData.statusName.trim().length > 50) {
      errors.statusName = 'Status name must be less than 50 characters';
    }
    
    if (!formData.remarks.trim()) {
      errors.remarks = 'Remarks are required';
    } else if (formData.remarks.trim().length > 500) {
      errors.remarks = 'Remarks must be less than 500 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix all validation errors', 'error');
      return;
    }

    setSubmitLoading(true);
    try {
      const finalFormData = {
        statusName: formData.statusName.trim(),
        remarks: formData.remarks.trim()
      };

      if (editingStatus) {
        await apiService.updateStatus(editingStatus._id, finalFormData);
        showToast('Status updated successfully');
      } else {
        await apiService.createStatus(finalFormData);
        showToast('Status created successfully');
      }
      

      resetForm();
      await fetchStatuses();
    } catch (error) {
      console.error('Submit error:', error);
      showToast(error.message || 'Failed to save status. Please try again.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (status) => {
    setEditingStatus(status);
    setFormData({
      statusName: status.statusName,
      remarks: status.remarks
    });
    setValidationErrors({});
  };

  const handleCancel = () => {
    resetForm();
  };

  const showRemarkModal = (remarks) => {
    setCurrentRemark(remarks);
    setRemarkModalVisible(true);
  };

  const handleRemarkModalClose = () => {
    setRemarkModalVisible(false);
  };

  const getStatusColor = (statusName) => {
    const name = statusName.toLowerCase();
    if (name.includes('resent') || name.includes('active')) return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
    if (name.includes('absent') || name.includes('leave')) return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300';
    if (name.includes('late') || name.includes('delay')) return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
    if (name.includes('holiday') || name.includes('weekend')) return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
    return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="flex h-screen">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header */}
          <div className="p-8 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl h-10 font-bold bg-black bg-clip-text text-transparent">
                  Attendance Status Management
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Manage your attendance status types and definitions
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Status Types</p>
                  <p className="text-2xl font-bold text-gray-800">{statuses.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-8 overflow-auto">
            {/* Enhanced Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Status Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Remarks
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                {loading ? (
                  <TableSkeleton />
                ) : (
                  <tbody className="bg-white divide-y divide-gray-50">
                    {statuses.map((status, index) => (
                      <tr key={status._id || index} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(status.statusName)}`}>
                            {status.statusName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 max-w-xs">
                            <div className="truncate text-gray-700 font-medium">
                              {status.remarks || '-'}
                            </div>
                            {status.remarks && status.remarks.length > 30 && (
                              <button
                                onClick={() => showRemarkModal(status.remarks)}
                                className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
                                title="View full remarks"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleEdit(status)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}

                    {!loading && statuses.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-16 text-center">
                          <div className="text-center">
                            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                              <Calendar className="w-12 h-12 text-gray-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No status types available</h3>
                            <p className="text-gray-500">Get started by creating your first status type using the form on the right.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>

        {/* Enhanced Right Sidebar Form */}
        <div className="w-96 bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 flex flex-col backdrop-blur-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold bg-black bg-clip-text text-transparent">
                  {editingStatus ? 'Edit Status' : 'Add New Status'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editingStatus ? 'Update status details' : 'Create a new attendance status'}
                </p>
              </div>
              {editingStatus && (
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 p-6 overflow-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Status Name *"
                name="statusName"
                value={formData.statusName}
                onChange={handleInputChange}
                placeholder="Enter status name (e.g., Present, Absent, Leave)"
                error={validationErrors.statusName}
                maxLength={50}
              />

              <TextArea
                label="Remarks *"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Enter detailed remarks for this status..."
                error={validationErrors.remarks}
                rows={4}
                maxLength={500}
              />

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm text-gray-800">
                    <p className="font-semibold mb-2">Guidelines:</p>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                        <span>All fields marked with * are required</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                        <span>Status names should be clear and descriptive</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                        <span>Provide detailed remarks for each status</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex gap-3">
              {editingStatus && (
                <button
                  onClick={handleCancel}
                  type="button"
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                type="button"
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-xl hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="flex items-center justify-center">
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingStatus ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      {editingStatus ? 'Update Status' : 'Create Status'}
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Remark Modal */}
      {remarkModalVisible && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Remarks Details
                </h3>
                <button
                  onClick={handleRemarkModalClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-white/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{currentRemark}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end bg-gray-50">
              <button
                onClick={handleRemarkModalClose}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusManagement;      