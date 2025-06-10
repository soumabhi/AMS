import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertCircle, CheckCircle, X, User, UserPlus, Search, Download, FileText, FileSpreadsheet } from 'lucide-react';
import Toast from '../../components/Toast';

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
                        <div className="flex items-center">
                            <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                            <div>
                                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24 mb-2"></div>
                                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24"></div>
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

const DisabledEmployees = () => {
    // Dummy data - in a real app, this would come from an API
    const dummyDisabledEmployees = Array.from({ length: 25 }, (_, i) => ({
        id: `emp-${2000 + i}`,
        emp_id: `EMP${2000 + i}`,
        name: `Inactive Employee ${i + 1}`,
        email: `inactive${i + 1}@company.com`,
        department: ['HR', 'Finance', 'Engineering', 'Marketing', 'Operations'][i % 5],
        position: ['Manager', 'Developer', 'Analyst', 'Designer', 'Coordinator'][i % 5],
        join_date: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365 * 5)).toISOString(),
        disabled_date: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30 * (i + 1))).toISOString(),
        reason: ['Resigned', 'Terminated', 'Contract Ended', 'Long Leave', 'Retired'][i % 5],
        last_active: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * (i + 10))).toISOString()
    }));

    const [employees, setEmployees] = useState(dummyDisabledEmployees);
    const [filteredEmployees, setFilteredEmployees] = useState(dummyDisabledEmployees);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [enableModalVisible, setEnableModalVisible] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [resumeDate, setResumeDate] = useState('');
    const [enableLoading, setEnableLoading] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    const hideToast = () => {
        setToast({ ...toast, isVisible: false });
    };

    const handleSearch = (value) => {
        setSearchText(value);
        if (!value) {
            setFilteredEmployees(employees);
        } else {
            const filtered = employees.filter(emp => 
                emp.emp_id.toLowerCase().includes(value.toLowerCase()) ||
                emp.name.toLowerCase().includes(value.toLowerCase()) ||
                emp.email.toLowerCase().includes(value.toLowerCase()) ||
                emp.department?.toLowerCase().includes(value.toLowerCase()) ||
                emp.reason?.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredEmployees(filtered);
        }
    };

    const showEnableModal = (employee) => {
        setSelectedEmployee(employee);
        setEnableModalVisible(true);
    };

    const handleEnable = () => {
        if (!resumeDate) {
            showToast('Please select a resume date', 'error');
            return;
        }

        setEnableLoading(true);
        setTimeout(() => {
            setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
            setFilteredEmployees(filteredEmployees.filter(emp => emp.id !== selectedEmployee.id));
            showToast(`Employee enabled successfully with resume date ${resumeDate}`);
            setEnableLoading(false);
            setEnableModalVisible(false);
            setResumeDate('');
            
            if (detailModalVisible) {
                setDetailModalVisible(false);
            }
        }, 800);
    };

    const showEmployeeDetails = (employee) => {
        setSelectedEmployee(employee);
        setDetailModalVisible(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDepartmentColor = (department) => {
        switch (department) {
            case 'HR': return 'bg-gradient-to-r from-gray-500 to-gray-500 text-white';
            case 'Finance': return 'bg-gradient-to-r from-gray-500 to-gray-500 text-white';
            case 'Engineering': return 'bg-gradient-to-r from-gray-500 to-gray-500 text-white';
            case 'Marketing': return 'bg-gradient-to-r from-gray-500 to-gray-500 text-white';
            case 'Operations': return 'bg-gradient-to-r from-gray-500 to-gray-500 text-white';
            default: return 'bg-gradient-to-r from-gray-500 to-gray-500 text-white';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />

            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl h-10 font-bold bg-black bg-clip-text text-transparent">
                        Disabled Employees
                    </h1>
                    <p className="text-gray-600 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Manage inactive and disabled employee accounts
                    </p>
                </div>

                {/* Search and Controls */}
                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200 hover:border-gray-300"
                            placeholder="Search employees..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchText)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200 shadow-sm hover:shadow-md">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Enhanced Table */}
       <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                    <th className="px-3 py-2 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        #
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Employee
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Employee ID
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Department
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Disabled Since
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Reason
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
            </thead>

            {loading ? (
                <TableSkeleton />
            ) : (
                <tbody className="bg-white divide-y divide-gray-50">
                    {filteredEmployees.map((employee, index) => (
                        <tr key={employee.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                                <div className="w-6 h-6 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto">
                                    {index + 1}
                                </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                                <div 
                                    className="cursor-pointer hover:text-blue-500"
                                    onClick={() => showEmployeeDetails(employee)}
                                >
                                    <div className="font-medium text-sm">{employee.name}</div>
                                    <div className="text-gray-500 text-xs">{employee.position}</div>
                                </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-mono text-gray-900 text-center">
                                {employee.emp_id}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getDepartmentColor(employee.department)}`}>
                                    {employee.department}
                                </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
                                {formatDate(employee.disabled_date)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                                <span className="text-sm font-medium text-gray-700">
                                    {employee.reason || 'Not specified'}
                                </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                                <button
                                    onClick={() => showEnableModal(employee)}
                                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 border border-white-700 rounded-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    <UserPlus className="w-4 h-4 mr-1" />
                                    Enable
                                </button>
                            </td>
                        </tr>
                    ))}

                    {!loading && filteredEmployees.length === 0 && (
                        <tr>
                            <td colSpan="7" className="px-3 py-12 text-center">
                                <div className="text-center">
                                    <div className="mx-auto w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-3">
                                        <User className="w-10 h-10 text-gray-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No disabled employees found</h3>
                                    <p className="text-gray-500">Try adjusting your search query</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            )}
        </table>
</div>
            </div>

            {/* Employee Detail Modal */}
            {detailModalVisible && (
                <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold bg-black bg-clip-text text-transparent">
                                        Employee Details
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        View and manage employee details
                                    </p>
                                </div>
                                <button
                                    onClick={() => setDetailModalVisible(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {selectedEmployee && (
                                <div>
                                    <div className="flex items-start gap-6 mb-8">
                                        <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-500">
                                            <User className="w-10 h-10" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">{selectedEmployee.name}</h3>
                                            <p className="text-gray-600">{selectedEmployee.position}</p>
                                            <p className="text-gray-500">{selectedEmployee.department} Department</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Employee ID</h4>
                                            <p className="text-gray-900 font-mono">{selectedEmployee.emp_id}</p>
                                        </div>
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Email</h4>
                                            <a href={`mailto:${selectedEmployee.email}`} className="text-blue-600 hover:underline">
                                                {selectedEmployee.email}
                                            </a>
                                        </div>
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Join Date</h4>
                                            <p className="text-gray-900">{formatDate(selectedEmployee.join_date)}</p>
                                        </div>
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Disabled Date</h4>
                                            <p className="text-gray-900">{formatDate(selectedEmployee.disabled_date)}</p>
                                        </div>
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 md:col-span-2">
                                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Reason</h4>
                                            <p className="text-gray-900">{selectedEmployee.reason || 'Not specified'}</p>
                                        </div>
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Last Active</h4>
                                            <p className="text-gray-900">{formatDateTime(selectedEmployee.last_active)}</p>
                                        </div>
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Status</h4>
                                            <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-red-100 to-red-200 text-red-800">
                                                Disabled
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                        <button
                                            onClick={() => {
                                                setDetailModalVisible(false);
                                                showEnableModal(selectedEmployee);
                                            }}
                                            className="inline-flex items-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-black to-green-700 border border-green-700 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Re-enable Employee
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Enable Employee Modal */}
            {enableModalVisible && (
                <div className="fixed inset-0 bg-gray-500/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold bg-black bg-clip-text text-transparent">
                                        Enable Employee - {selectedEmployee?.name || ''}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Set resume date for this employee
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setEnableModalVisible(false);
                                        setResumeDate('');
                                    }}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Resume Date *
                                </label>
                                <input
                                    type="date"
                                    value={resumeDate}
                                    onChange={(e) => setResumeDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200 hover:border-gray-300"
                                />
                            </div>

                            {selectedEmployee && (
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-500">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{selectedEmployee.name}</p>
                                            <p className="text-sm text-gray-600">{selectedEmployee.position}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-gray-500">Department</p>
                                            <p className="font-medium">{selectedEmployee.department}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Status</p>
                                            <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r from-red-100 to-red-200 text-red-800">
                                                Disabled
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setEnableModalVisible(false);
                                    setResumeDate('');
                                }}
                                className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEnable}
                                disabled={enableLoading}
                                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                {enableLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Enabling...
                                    </div>
                                ) : (
                                    'Confirm Enable'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DisabledEmployees;