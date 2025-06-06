import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Plus, 
  Edit3, 
  Eye, 
  Power, 
  PowerOff, 
  Info,
  X,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  CheckCircle,
  Users
} from "lucide-react";

const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success'
    ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
    : 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-400';
  const textColor = type === 'success' ? 'text-gray-800' : 'text-gray-900';
  const IconComponent = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
      <div className={`max-w-sm w-full ${bgColor} border rounded-xl shadow-lg backdrop-blur-sm p-4`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <IconComponent className="h-5 w-5 text-gray-700" />
          </div>
          <div className="ml-3">
            <p className={`text-sm font-medium ${textColor}`}>
              {message}
            </p>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="inline-flex rounded-lg p-1.5 text-gray-400 hover:bg-white/50 focus:outline-none transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loader Component
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
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
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
const Input = ({ label, value, onChange, placeholder, error, type = "text", className = "", disabled = false }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 ${error ? 'border-gray-400 bg-gray-50/50' : 'hover:border-gray-300'} ${className}`}
      />
      {error && (
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [formData, setFormData] = useState({
    leaveType: "",
    remarks: "",
    status: "Active", 
  });
  const [remarkModalVisible, setRemarkModalVisible] = useState(false);
  const [currentRemark, setCurrentRemark] = useState("");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });

  // API Base Configuration
  const API_BASE_URL = "http://localhost:5000/api/leaveType";

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.leaveType.trim()) {
      newErrors.leaveType = "Leave type is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch all leave types
  const fetchLeaveTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/all`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Format the data to match our component structure
      const formattedData = data.data.map(item => ({
        ...item,
        id: item._id || item.id || item.leaveType, // Ensure we have an ID
        status: item.status === true ? "Active" : "InActive"
      }));
      
      setLeaves(formattedData || []);
      showToast("Leave types loaded successfully", "success");
    } catch (error) {
      console.error("Fetch error:", error);
      showToast("Failed to fetch leave types", "error");
      setLeaves([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    
    setSubmitLoading(true);
    
    try {
      const payload = {
        ...formData,
        status: formData.status === "Active"
      };

      let response;
      if (editingLeave) {
        // Update existing leave type
        response = await fetch(`${API_BASE_URL}/update/${editingLeave.leaveType}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new leave type
        response = await fetch(`${API_BASE_URL}/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      showToast(
        editingLeave ? "Leave type updated successfully" : "Leave type added successfully",
        "success"
      );
      
      resetForm();
      fetchLeaveTypes(); // Refresh the list
      
    } catch (error) {
      console.error("Submit error:", error);
      showToast("An error occurred while saving the leave type", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      leaveType: "",
      remarks: "",
      status: "Active",
    });
    setEditingLeave(null);
    setErrors({});
  };

  const handleEdit = (leave) => {
    setEditingLeave(leave);
    setFormData({
      leaveType: leave.leaveType,
      remarks: leave.remarks || "",
      status: leave.status,
    });
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleToggleStatus = async (leaveId, currentStatus) => {
    try {
      const leaveToUpdate = leaves.find((leave) => leave.id === leaveId || leave.leaveType === leaveId);
      if (leaveToUpdate) {
        const newStatus = currentStatus === "Active" ? "InActive" : "Active";
        
        const response = await fetch(`${API_BASE_URL}/updateStatus/${leaveToUpdate.leaveType}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus === "Active" })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        showToast(`Leave type ${newStatus === "Active" ? "activated" : "deactivated"} successfully`);
        fetchLeaveTypes(); // Refresh the list
      }
    } catch (error) {
      console.error("Toggle status error:", error);
      showToast("Failed to update status", "error");
    }
  };

  const getLeaveTypeColor = (leaveType) => {
    const type = leaveType.toLowerCase();
    if (type.includes('annual') || type.includes('vacation')) return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    if (type.includes('sick') || type.includes('medical')) return 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 border-gray-400';
    if (type.includes('personal') || type.includes('emergency')) return 'bg-gradient-to-r from-gray-800 to-black text-white border-gray-600';
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
                  Leave Management
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Manage your leave types and configurations
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Leave Types</p>
                  <p className="text-2xl font-bold text-gray-800">{leaves.length}</p>
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
                      Leave Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Status
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
                    {leaves.map((leave, index) => (
                      <tr key={leave.id || leave.leaveType} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${getLeaveTypeColor(leave.leaveType)}`}>
                            {leave.leaveType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${
                            leave.status === "Active" 
                              ? "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300" 
                              : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 border-gray-400"
                          }`}>
                            {leave.status === "Active" && <Check className="w-3 h-3 mr-1.5" />}
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {leave.remarks ? (
                            <div className="flex items-start gap-2">
                              <span className="text-sm text-gray-600 leading-relaxed max-w-xs">
                                {leave.remarks.length > 50 ? `${leave.remarks.substring(0, 50)}...` : leave.remarks}
                              </span>
                              {leave.remarks.length > 50 && (
                                <button
                                  onClick={() => {
                                    setCurrentRemark(leave.remarks);
                                    setRemarkModalVisible(true);
                                  }}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                  <Eye className="w-3 h-3" />
                                  View
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 italic">No remarks</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(leave)}
                              disabled={leave.status === "InActive"}
                              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleStatus(leave.id || leave.leaveType, leave.status)}
                              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border ${
                                leave.status === "Active"
                                  ? "text-white bg-gradient-to-r from-gray-800 to-black border-gray-600 hover:from-gray-900 hover:to-gray-800"
                                  : "text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 hover:from-gray-200 hover:to-gray-300"
                              }`}
                            >
                              {leave.status === "Active" ? (
                                <>
                                  <PowerOff className="w-3 h-3" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Power className="w-3 h-3" />
                                  Activate
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!loading && leaves.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-16 text-center">
                          <div className="text-center">
                            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                              <Calendar className="w-12 h-12 text-gray-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No leave types available</h3>
                            <p className="text-gray-500">Get started by creating your first leave type using the form on the right.</p>
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
                  {editingLeave ? 'Edit Leave Type' : 'Add New Leave Type'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editingLeave ? 'Update leave type details' : 'Create a new leave type'}
                </p>
              </div>
              {editingLeave && (
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
            <div className="space-y-6">
              <Input
                label="Leave Type *"
                value={formData.leaveType}
                onChange={(e) => {
                  setFormData({...formData, leaveType: e.target.value});
                  if (e.target.value.trim()) {
                    setErrors({...errors, leaveType: ""});
                  }
                }}
                placeholder="e.g., Annual, Sick, Personal"
                error={errors.leaveType}
                className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                >
                  <option value="Active">Active</option>
                  <option value="InActive">Inactive</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Remarks</label>
                <textarea
                  rows={3}
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  placeholder="Optional notes or description..."
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 resize-none hover:border-gray-300 transition-all duration-200"
                />
              </div>

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
                        <span>Inactive types won't be available for selection</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex gap-3">
              {editingLeave && (
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-xl hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="flex items-center justify-center">
                  {submitLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {editingLeave ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      {editingLeave ? 'Update Leave Type' : 'Create Leave Type'}
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Remarks Modal */}
      {remarkModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Remark Details</h3>
                <button
                  onClick={() => setRemarkModalVisible(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 text-sm text-gray-700 leading-relaxed max-h-96 overflow-y-auto border border-gray-200">
                {currentRemark || "No remarks available"}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <button
                onClick={() => setRemarkModalVisible(false)}
                className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white text-sm font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
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

export default LeaveManagement;