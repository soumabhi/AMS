import React, { useState, useEffect } from 'react';
import { Plus, Edit, UserPlus, X, Search, Clock, AlertCircle, CheckCircle, Users, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

// Toast Component
const Toast = ({ message, type, isVisible, onClose }) => {
    if (!isVisible) return null;
    
    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
    
    return (
        <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg`}>
            <div className="flex items-center justify-between">
                <span>{message}</span>
                <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
                    <X className="w-4 h-4" />
                </button>
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
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-8 mx-auto"></div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24"></div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-32"></div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24"></div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

// Enhanced Input Component
const Input = ({ label, name, value, onChange, placeholder, error, type = "text", className = "", disabled = false, icon }) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-semibold text-gray-700">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full px-3 py-2 ${icon ? 'pl-10' : ''} border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 ${error ? 'border-gray-400 bg-gray-50/50' : 'hover:border-gray-300'} ${className}`}
                />
            </div>
            {error && (
                <p className="text-xs text-gray-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </p>
            )}
        </div>
    );
};

// Enhanced Select Component
const Select = ({ label, name, value, onChange, options, error, className = "", disabled = false }) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-semibold text-gray-700">
                    {label}
                </label>
            )}
            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 ${error ? 'border-gray-400 bg-gray-50/50' : 'hover:border-gray-300'} ${className}`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-xs text-gray-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </p>
            )}
        </div>
    );
};

// Enhanced Switch Component
const Switch = ({ name, checked, onChange, checkedChildren, unCheckedChildren }) => {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input 
                type="checkbox" 
                name={name}
                checked={checked} 
                onChange={onChange} 
                className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-800"></div>
            <span className="ml-2 text-sm font-medium text-gray-700">
                {checked ? checkedChildren : unCheckedChildren}
            </span>
        </label>
    );
};

// Enhanced Tag Component
const Tag = ({ children, color, className = "" }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-800',
        green: 'bg-green-100 text-green-800',
        red: 'bg-red-100 text-red-800',
        orange: 'bg-orange-100 text-orange-800',
        gray: 'bg-gray-100 text-gray-800'
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClasses[color] || colorClasses.gray} ${className}`}>
            {children}
        </span>
    );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const leftBound = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            const rightBound = Math.min(totalPages, leftBound + maxVisiblePages - 1);
            
            if (leftBound > 1) {
                pages.push(1);
                if (leftBound > 2) {
                    pages.push('...');
                }
            }
            
            for (let i = leftBound; i <= rightBound; i++) {
                pages.push(i);
            }
            
            if (rightBound < totalPages) {
                if (rightBound < totalPages - 1) {
                    pages.push('...');
                }
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * 10, totalPages * 10)}</span> of{' '}
                        <span className="font-medium">{totalPages * 10}</span> results
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">First</span>
                            <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        
                        {getPageNumbers().map((page, index) => (
                            <button
                                key={index}
                                onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                                disabled={page === '...'}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    page === currentPage
                                        ? 'z-10 bg-gray-800 border-gray-800 text-white'
                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                } ${page === '...' ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                                {page}
                            </button>
                        ))}
                        
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                            onClick={() => onPageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Last</span>
                            <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

// API Service
const apiService = {
    baseURL: 'http://localhost:5000/api/branch',
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
            throw error;
        }
    },

    async getAllBranches() {
        return this.request('/all');
    },
    async getBranches(page = 1, limit = 10) {
    return this.request(`/all?page=${page}&limit=${limit}`);
},


    async createBranch(branchData) {
        return this.request('/create', {
            method: 'POST',
            body: JSON.stringify(branchData),
        });
    },

    async updateBranch(id, branchData) {
        return this.request(`/${id}`, {
            method: 'PUT',
            body: JSON.stringify(branchData),
        });
    },

    async assignEmployees(id, assignedAdmins) {
        return this.request(`/${id}/assign`, {
            method: 'PUT',
            body: JSON.stringify({ assignedAdmins }),
        });
    }
};

// Branch Management Component
const BranchManagement = () => {
    // Branch types configuration
    const branchTypes = [
        { value: "Primary Eyecare Center", label: "Primary Eyecare Center" },
        { value: "Secondary Eyecare Center", label: "Secondary Eyecare Center" },
        { value: "Tertiary Eyecare Center", label: "Tertiary Eyecare Center" },
        { value: "Corporate Office", label: "Corporate Office" },
        { value: "Central Store", label: "Central Store" }
    ];

    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
    const [formData, setFormData] = useState({
        branchId: "",
        branchName: "",
        branchType: "Corporate Office",
        location: "",
        branchEmail: "",
        branchPhone: "",
        status: 1,
        assignedAdmins: [],
        coordinates: {
            type: "Point",
            coordinates: [0, 0]
        },
        password: ""
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [currentBranch, setCurrentBranch] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [searchText, setSearchText] = useState('');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Toast functions
    const showToast = (message, type = 'success') => {
        setToast({ message, type, isVisible: true });
        setTimeout(() => {
            setToast({ ...toast, isVisible: false });
        }, 3000);
    };

    // Fetch branches on component mount
    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        setLoading(true);
        try {
            const response = await apiService.getAllBranches();
            setBranches(response.branches || []);
        } catch (error) {
            showToast('Failed to fetch branches. Please check your connection and try again.', 'error');
            setBranches([]);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            branchId: "",
            branchName: "",
            branchType: "Corporate Office",
            location: "",
            branchEmail: "",
            branchPhone: "",
            status: 1,
            assignedAdmins: [],
            coordinates: {
                type: "Point",
                coordinates: [0, 0]
            },
            password: ""
        });
        setValidationErrors({});
        setEditingBranch(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'branchPhone') {
            const numericValue = value.replace(/\D/g, '').slice(0, 10);
            setFormData({
                ...formData,
                [name]: numericValue
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

        setValidationErrors({
            ...validationErrors,
            [name]: ''
        });
    };

    const handleCoordinateChange = (index, value) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;
        
        const newCoordinates = [...formData.coordinates.coordinates];
        newCoordinates[index] = numValue;
        
        setFormData({
            ...formData,
            coordinates: {
                ...formData.coordinates,
                coordinates: newCoordinates
            }
        });
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.branchId.trim()) {
            errors.branchId = 'Branch ID is required';
        }

        if (!formData.branchName.trim()) {
            errors.branchName = 'Branch name is required';
        }

        if (!formData.location.trim()) {
            errors.location = 'Location is required';
        }

        if (!formData.branchEmail) {
            errors.branchEmail = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.branchEmail)) {
            errors.branchEmail = 'Please enter a valid email';
        }

        if (!formData.branchPhone) {
            errors.branchPhone = 'Phone number is required';
        } else if (formData.branchPhone.length !== 10) {
            errors.branchPhone = 'Phone number must be 10 digits';
        }

        if (!editingBranch && !formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password && formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
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
            const dataToSubmit = {
                branchId: formData.branchId.trim(),
                branchName: formData.branchName.trim(),
                branchType: formData.branchType,
                location: formData.location.trim(),
                branchEmail: formData.branchEmail.trim(),
                branchPhone: parseInt(formData.branchPhone, 10),
                status: formData.status,
                assignedAdmins: formData.assignedAdmins,
                coordinates: {
                    type: "Point",
                    coordinates: [
                        parseFloat(formData.coordinates.coordinates[0]) || 0,
                        parseFloat(formData.coordinates.coordinates[1]) || 0
                    ]
                },
                password: formData.password
            };

            if (editingBranch) {
                const response = await apiService.updateBranch(editingBranch._id, dataToSubmit);
                showToast(`Branch "${response.branch.branchName}" updated successfully`);
            } else {
                const response = await apiService.createBranch(dataToSubmit);
                showToast(`Branch "${response.branch.branchName}" created successfully`);
            }

            resetForm();
            await fetchBranches();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Submission error:', error);
            let errorMessage = 'Failed to save branch. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message.includes('network')) {
                errorMessage = 'Network error. Please check your connection.';
            } else if (error.message.includes('duplicate')) {
                errorMessage = 'Branch ID or email already exists.';
            }
            
            showToast(errorMessage, 'error');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEdit = (branch) => {
        setEditingBranch(branch);
        setFormData({ 
            ...JSON.parse(JSON.stringify(branch)),
            password: "",
            assignedAdmins: branch.assignedAdmins ? [...branch.assignedAdmins] : []
        });
        setIsModalOpen(true);
    };

    const handleAssign = (branch) => {
        setCurrentBranch(branch);
        const currentBranchData = branches.find(b => b.branchId === branch.branchId);
        setSelectedEmployees(currentBranchData?.assignedAdmins || []);
        setIsAssignModalOpen(true);
    };

    const handleAssignSubmit = async () => {
        if (!currentBranch) {
            showToast('No branch selected', 'error');
            return;
        }

        try { 
            setLoading(true);
            await apiService.assignEmployees(currentBranch._id, selectedEmployees);
            
            showToast(`Updated employee assignments for ${currentBranch.branchName}`);
            fetchBranches();
            setIsAssignModalOpen(false);
            setSelectedEmployees([]);
            setSearchText('');
        } catch (error) {
            showToast(error.message || 'Failed to assign employees', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = selectedEmployees.filter(emp => 
        emp.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.id?.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.designation?.toLowerCase().includes(searchText.toLowerCase())
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBranches = branches.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(branches.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast({ ...toast, isVisible: false })}
            />

            <div className="flex flex-col h-screen">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Fixed Header */}
                    <div className="p-4 sm:p-6 bg-gradient-to-r from-GRAY-50 to-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                            <div className="mb-4 sm:mb-0">
                                <h1 className="text-2xl sm:text-3xl font-bold bg-black bg-clip-text text-transparent">
                                    Branch Management
                                </h1>
                                <p className="text-gray-600 flex items-center gap-2 text-sm">
                                    <Users className="w-4 h-4" />
                                    Manage your branches and assignments
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-xs sm:text-sm text-gray-500">Total Branches</p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{branches.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-auto">
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Branch List</h2>
                                <button
                                    onClick={() => {
                                        resetForm();
                                        setIsModalOpen(true);
                                    }}
                                    className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-lg hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow hover:shadow-md"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Branch
                                </button>
                            </div>

                            {/* Enhanced Table */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow border border-gray-200 overflow-auto">
                                <div className="min-w-full">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    #
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    Branch ID
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    Branch Name
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    Location
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    Branch Admin
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>

                                        {loading ? (
                                            <TableSkeleton />
                                        ) : (
                                            <tbody className="bg-white divide-y divide-gray-50">
                                                {currentBranches.map((branch, index) => (
                                                    <tr key={branch._id || index} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                                                                {indexOfFirstItem + index + 1}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                                                                {branch.branchId}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                                                                {branch.branchName}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                                                                {branch.branchType}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                                                                {branch.location}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="flex flex-wrap gap-1">
                                                                {branch.assignedAdmins?.length > 0 ? (
                                                                    branch.assignedAdmins.map((admin, idx) => (
                                                                        <Tag key={idx} color="blue">
                                                                            {admin.name} ({admin.designation})
                                                                        </Tag>
                                                                    ))
                                                                ) : (
                                                                    <Tag color="orange">Not Assigned</Tag>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <Tag color={branch.status === 1 ? 'green' : 'red'}>
                                                                {branch.status === 1 ? 'Active' : 'Inactive'}
                                                            </Tag>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="flex gap-1">
                                                                <button
                                                                    onClick={() => handleEdit(branch)}
                                                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-md hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-sm"
                                                                >
                                                                    <Edit className="w-3 h-3 mr-1" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAssign(branch)}
                                                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 border border-gray-700 rounded-md hover:from-gray-700 hover:to-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-sm"
                                                                >
                                                                    <UserPlus className="w-3 h-3 mr-1" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {!loading && branches.length === 0 && (
                                                    <tr>
                                                        <td colSpan="8" className="px-4 py-8 text-center">
                                                            <div className="text-center">
                                                                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-2">
                                                                    <Users className="w-8 h-8 text-gray-500" />
                                                                </div>
                                                                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">No branches available</h3>
                                                                <p className="text-xs sm:text-sm text-gray-500">Get started by creating your first branch.</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        )}
                                    </table>
                                </div>
                                {branches.length > 0 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Branch Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/50 bg-opacity-50 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-black px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">
                                {editingBranch ? 'Edit Branch' : 'Add New Branch'}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    resetForm();
                                }}
                                className="text-gray-300 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Branch ID *"
                                    name="branchId"
                                    value={formData.branchId}
                                    onChange={handleInputChange}
                                    placeholder="Enter branch ID"
                                    error={validationErrors.branchId}
                                    disabled={!!editingBranch}
                                    className="bg-gray-50 border-gray-200 focus:border-gray-400"
                                />
                                <Input
                                    label="Branch Name *"
                                    name="branchName"
                                    value={formData.branchName}
                                    onChange={handleInputChange}
                                    placeholder="Enter branch name"
                                    error={validationErrors.branchName}
                                    className="bg-gray-50 border-gray-200 focus:border-gray-400"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select
                                    label="Branch Type *"
                                    name="branchType"
                                    value={formData.branchType}
                                    onChange={handleInputChange}
                                    options={branchTypes}
                                    className="bg-gray-50 border-gray-200 focus:border-gray-400"
                                />
                                <Input
                                    label="Location *"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Enter location"
                                    error={validationErrors.location}
                                    className="bg-gray-50 border-gray-200 focus:border-gray-400"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Email *"
                                    name="branchEmail"
                                    value={formData.branchEmail}
                                    onChange={handleInputChange}
                                    placeholder="Enter branch"
                                    error={validationErrors.branchEmail}
                                    className="bg-gray-50 border-gray-200 focus:border-gray-400"
                                />
                                <Input
                                    label="Phone Number *"
                                    name="branchPhone"
                                    value={formData.branchPhone}
                                    onChange={handleInputChange}
                                    placeholder="Enter phone number"
                                    error={validationErrors.branchPhone}
                                    className="bg-gray-50 border-gray-200 focus:border-gray-400"
                                />
                            </div>

                            <Input
                                label={editingBranch ? "New Password (leave blank to keep current)" : "Password *"}
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder={editingBranch ? "Enter new password" : "Enter password"}
                                error={validationErrors.password}
                                className="bg-gray-50 border-gray-200 focus:border-gray-400"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Longitude"
                                    name="longitude"
                                    type="number"
                                    value={formData.coordinates.coordinates[0]}
                                    onChange={(e) => handleCoordinateChange(0, e.target.value)}
                                    placeholder="Enter longitude"
                                    className="bg-gray-50 border-gray-200 focus:border-gray-400"
                                />
                                <Input
                                    label="Latitude"
                                    name="latitude"
                                    type="number"
                                    value={formData.coordinates.coordinates[1]}
                                    onChange={(e) => handleCoordinateChange(1, e.target.value)}
                                    placeholder="Enter latitude"
                                    className="bg-gray-50 border-gray-200 focus:border-gray-400"
                                />
                            </div>

                            <div className="flex items-center">
                                <Switch
                                    name="status"
                                    checked={formData.status === 1}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 1 : 0 })}
                                    checkedChildren="Active"
                                    unCheckedChildren="Inactive"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    {formData.status === 1 ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    resetForm();
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-md hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitLoading ? (
                                    <span className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                                        {editingBranch ? 'Updating...' : 'Creating...'}
                                    </span>
                                ) : (
                                    <span>{editingBranch ? 'Update Branch' : 'Create Branch'}</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Employees Modal */}
            {isAssignModalOpen && currentBranch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/50 bg-opacity-50 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-black px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">
                                Assign Employees to {currentBranch.branchName}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsAssignModalOpen(false);
                                    setSelectedEmployees([]);
                                    setSearchText('');
                                }}
                                className="text-gray-300 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    placeholder="Search employees..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                                />
                            </div>

                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Select
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Designation
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredEmployees.length > 0 ? (
                                            filteredEmployees.map((employee) => (
                                                <tr key={employee.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedEmployees.some(e => e.id === employee.id)}
                                                            onChange={() => {
                                                                setSelectedEmployees(prev =>
                                                                    prev.some(e => e.id === employee.id)
                                                                        ? prev.filter(e => e.id !== employee.id)
                                                                        : [...prev, employee]
                                                                );
                                                            }}
                                                            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {employee.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {employee.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {employee.designation}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No employees found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAssignModalOpen(false);
                                    setSelectedEmployees([]);
                                    setSearchText('');
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAssignSubmit}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-md hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </span>
                                ) : (
                                    <span>Save Assignments</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchManagement;