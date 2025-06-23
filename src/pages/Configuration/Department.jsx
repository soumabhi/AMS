import React, { useState, useEffect } from 'react';
import { Plus, Edit, Users, AlertCircle, CheckCircle, X } from 'lucide-react';

// Toast Component
const Toast = ({ message, type, isVisible, onClose }) => {
  if (!isVisible) return null;
  
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    }`}>
      <div className="flex items-center gap-2">
        {type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Table Skeleton Loader
const TableSkeleton = () => {
    return (
        <tbody className="bg-white divide-y divide-gray-100">
            {[...Array(5)].map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-8 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-16"></div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

// Input Component
const Input = ({ label, value, onChange, placeholder, error, type = "text", className = "", disabled = false, name }) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-semibold text-gray-700">
                    {label}
                </label>
            )}
            <input
                type={type}
                name={name}
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

// Main Department Management Component
const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        departmentName: ""
    });
    const [validationErrors, setValidationErrors] = useState({});

    // API Configuration
    const API_BASE_URL = 'http://localhost:5000/api/department'; // Adjust to your actual API endpoint
    const API_HEADERS = {
        'Content-Type': 'application/json',
        // Add authorization headers if needed
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const showToast = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => {
            setMessage({ type: '', text: '' });
        }, 4000);
    };

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/all`, {
                headers: API_HEADERS
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Transform the API response to match our expected format
            const departmentList = Array.isArray(data) ? data : data.data || data.departments || [];
            
            const enrichedDepartments = departmentList.map((item, index) => ({
                departmentName: item.departmentName || item.name,
                serialNo: index + 1
            }));
            
            setDepartments(enrichedDepartments);
        } catch (error) {
            console.error('Fetch error:', error);
            showToast('Failed to fetch departments. Please try again later.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.departmentName.trim()) {
            errors.departmentName = 'Department name is required';
        } else if (formData.departmentName.trim().length < 1) {
            errors.departmentName = 'Department name must be at least 1 characters';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

  // Update your API calls to include better error handling
const handleSubmit = async () => {
    if (!validateForm()) {
        showToast('Please fix all validation errors', 'error');
        return;
    }

    setSubmitLoading(true);

    try {
        const payload = {
            departmentName: formData.departmentName.trim()
        };
            console.log('Submitting payload:', payload); // Debug log
            
        let response;
let url = `${API_BASE_URL}/create`; // Adds 'create' to the base URL
let method = 'POST';


        if (editingDepartment) {
            // Make sure your backend expects the ID in this format
            url = `${API_BASE_URL}/${editingDepartment.serialNo}`;
            method = 'PUT';
        }
         console.log(`Making ${method} request to:`, url); // Debug log


        response = await fetch(url, {
            method,
            headers: API_HEADERS,
            body: JSON.stringify(payload)
        });
        
        console.log('Received response:', response); // Debug log

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || 
                    `Server returned ${response.status}: ${response.statusText}`
                );
            }

        const result = await response.json();
           console.log('Response data:', result); // Debug log


        showToast(
            result.message || 
            (editingDepartment 
                ? 'Department updated successfully' 
                : 'Department added successfully')
        );
        
        resetForm();
       await fetchDepartments();
    } catch (error) {
        console.error('Submission error:', error);
        showToast(error.message || 'Failed to save department. Please try again.', 'error');
    } finally {
        setSubmitLoading(false);
    }
};

    const handleEdit = (department) => {
        setEditingDepartment(department);
        setFormData({
            departmentName: department.departmentName
        });
    };

    const resetForm = () => {
        setFormData({
            departmentName: ""
        });
        setValidationErrors({});
        setEditingDepartment(null);
    };

    

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
            <Toast
                message={message.text}
                type={message.type}
                isVisible={!!message.text}
                onClose={() => setMessage({ type: '', text: '' })}
            />

            <div className="flex h-screen">
                <div className="flex-1 flex flex-col">
                    <div className="p-8 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h5 className="text-3xl h-10 font-bold bg-black bg-clip-text text-transparent">
                                    Department Management
                                </h5>
                                <p className="text-gray-600 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Manage your organization departments
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Departments</p>
                                    <p className="text-2xl font-bold text-gray-800">{departments.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-8 overflow-auto">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            #
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Department Name
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
                                        {departments.map((department) => (
                                            <tr
                                                key={department.serialNo}
                                                className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                        {department.serialNo}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                                                    {department.departmentName}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleEdit(department)}
                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                                                    >
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {!loading && departments.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-16 text-center">
                                                    <div className="text-center">
                                                        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                                            <Users className="w-12 h-12 text-gray-500" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No departments available</h3>
                                                        <p className="text-gray-500">
                                                            Get started by creating your first department using the form on the right.
                                                        </p>
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

                <div className="w-96 bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 flex flex-col backdrop-blur-sm">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold bg-black bg-clip-text text-transparent">
                                    {editingDepartment ? 'Edit Department' : 'Add New Department'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {editingDepartment ? 'Update department details' : 'Create a new department'}
                                </p>
                            </div>
                            {editingDepartment && (
                                <button
                                    onClick={resetForm}
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
                                label="Department Name *"
                                name="departmentName"
                                value={formData.departmentName}
                                onChange={handleInputChange}
                                placeholder="Enter department name (e.g., Human Resources, IT)"
                                error={validationErrors.departmentName}
                                className='bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200'
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
                                                <span>Department names should be unique</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex gap-3">
                            {editingDepartment && (
                                <button
                                    onClick={resetForm}
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
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            {editingDepartment ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            {editingDepartment ? 'Update Department' : 'Create Department'}
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentManagement;