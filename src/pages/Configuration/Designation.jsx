import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, Edit, X, Users, Briefcase, ChevronDown, Filter } from 'lucide-react';
import Toast from '../../components/Toast';

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
                        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-16"></div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

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
                    <X className="w-4 h-4" />
                    {error}
                </p>
            )}
        </div>
    );
};

const apiService = {
    baseURL: 'http://localhost:5000/api/designation',

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    },

    async getAllDesignations() {
        return this.request('/all');
    },

    async createDesignation(designationData) {
        return this.request('/create', {
            method: 'POST',
            body: JSON.stringify(designationData),
        });
    },

    async updateDesignation(id, designationData) {
        return this.request(`/${id}`, {
            method: 'PUT',
            body: JSON.stringify(designationData),
        });
    },

    async deleteDesignation(id) {
        return this.request(`/${id}`, {
            method: 'DELETE',
        });
    }
};

const DesignationManagement = () => {
    const [designations, setDesignations] = useState([]);
    const [allDesignations, setAllDesignations] = useState([]); // Store all designations for filtering
    const [editingDesignation, setEditingDesignation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
    const [formData, setFormData] = useState({
        designationName: "",
        departmentName: ""
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [uniqueDepartments, setUniqueDepartments] = useState([]);

    useEffect(() => {
        fetchDesignations();
    }, []);

    useEffect(() => {
        // Extract unique departments when designations change
        if (allDesignations.length > 0) {
            const departments = [...new Set(allDesignations.map(d => d.departmentName))];
            setUniqueDepartments(departments);
        }
    }, [allDesignations]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    const hideToast = () => {
        setToast({ ...toast, isVisible: false });
    };

    const fetchDesignations = async () => {
        setLoading(true);
        try {
            const response = await apiService.getAllDesignations();
            let designationsList = [];

            if (Array.isArray(response.data)) {
                designationsList = response.data;
            } else if (response.data.designations && Array.isArray(response.data.designations)) {
                designationsList = response.data.designations;
            } else if (response.data && typeof response.data === 'object') {
                const possibleArrays = Object.values(response.data).filter(Array.isArray);
                if (possibleArrays.length > 0) {
                    designationsList = possibleArrays[0];
                }
            }

            const designationsWithSerial = designationsList.map((designation, index) => ({
                ...designation,
                key: designation._id || designation.id || `designation-${index}`,
                serialNo: index + 1
            }));

            setAllDesignations(designationsWithSerial); // Store all designations
            filterDesignations(departmentFilter, designationsWithSerial); // Apply current filter
        } catch (error) {
            console.error('Error fetching designations:', error);
            showToast('Failed to fetch designations. Please check your connection and try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filterDesignations = (department, designationsList = allDesignations) => {
        if (department === 'all') {
            setDesignations(designationsList);
        } else {
            const filtered = designationsList.filter(d => d.departmentName === department);
            setDesignations(filtered);
        }
    };

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setDepartmentFilter(value);
        filterDesignations(value);
    };

    const resetForm = () => {
        setFormData({
            designationName: "",
            departmentName: ""
        });
        setValidationErrors({});
        setEditingDesignation(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setValidationErrors({
            ...validationErrors,
            [name]: ''
        });
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.designationName.trim()) {
            errors.designationName = 'Designation name is required';
        }

        if (!formData.departmentName.trim()) {
            errors.departmentName = 'Department name is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            showToast('Please fix all validation errors', 'error');
            return;
        }

        setSubmitLoading(true);

        try {
            const finalFormData = {
                designationName: formData.designationName.trim(),
                departmentName: formData.departmentName.trim()
            };

            if (editingDesignation) {
                const idField = editingDesignation._id ? '_id' : 'id';
                const designationId = editingDesignation[idField];
                
                await apiService.updateDesignation(designationId, finalFormData);
                showToast('Designation updated successfully');
            } else {
                await apiService.createDesignation(finalFormData);
                showToast('Designation created successfully');
            }

            resetForm();
            await fetchDesignations();
        } catch (error) {
            console.error('Error saving designation:', error);
            showToast(error.message || 'Failed to save designation. Please try again.', 'error');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEdit = (designation) => {
        setEditingDesignation(designation);
        setFormData({ 
            designationName: designation.designationName || "",
            departmentName: designation.departmentName || ""
        });
    };

    const handleCancel = () => {
        resetForm();
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
                                    Designation Management
                                </h1>
                                <p className="text-gray-600 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" />
                                    Manage your employee designations and departments
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Designations</p>
                                    <p className="text-2xl font-bold text-gray-800">{designations.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-8 overflow-auto">
                        {/* Filter Section */}
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Filter className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <select
                                        value={departmentFilter}
                                        onChange={handleFilterChange}
                                        className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-10 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                    >
                                        <option value="all">All Departments</option>
                                        {uniqueDepartments.map((dept, index) => (
                                            <option key={index} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Table */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            #
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Designation Name
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
                                        {designations.map((designation, index) => (
                                            <tr key={designation.key} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300">
                                                        {designation.designationName}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {designation.departmentName}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleEdit(designation)}
                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                                                    >
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {!loading && designations.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-16 text-center">
                                                    <div className="text-center">
                                                        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                                            <Briefcase className="w-12 h-12 text-gray-500" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No designations available</h3>
                                                        <p className="text-gray-500">
                                                            {departmentFilter === 'all' 
                                                                ? "Get started by creating your first designation using the form on the right."
                                                                : "No designations found for the selected department."}
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

                {/* Enhanced Right Sidebar Form */}
                <div className="w-96 bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 flex flex-col backdrop-blur-sm">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold bg-black bg-clip-text text-transparent">
                                    {editingDesignation ? 'Edit Designation' : 'Add New Designation'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {editingDesignation ? 'Update designation details' : 'Create a new employee designation'}
                                </p>
                            </div>
                            {editingDesignation && (
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
                                label="Designation Name *"
                                name="designationName"
                                value={formData.designationName}
                                onChange={handleInputChange}
                                placeholder="Enter designation name"
                                error={validationErrors.designationName}
                                className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
                            />

                            <Input
                                label="Department Name *"
                                name="departmentName"
                                value={formData.departmentName}
                                onChange={handleInputChange}
                                placeholder="Enter department name"
                                error={validationErrors.departmentName}
                                className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
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
                                                <span>Department must exist in the system</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                                                <span>Ensure department name is correct</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex gap-3">
                            {editingDesignation && (
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
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            {editingDesignation ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            {editingDesignation ? 'Update Designation' : 'Create Designation'}
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

export default DesignationManagement;