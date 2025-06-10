import React, { useState } from 'react';
import { Plus, Edit, Clock, Calendar, AlertCircle, CheckCircle, X, Users, Timer, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

const LeaveManagement = () => {
    const [leaveRequests, setLeaveRequests] = useState([
        {
            id: 1,
            empId: 'EMP101',
            name: 'Amit Kumar',
            designation: 'Backend Developer',
            department: 'IT',
            fromDate: '2023-07-01',
            toDate: '2023-07-05',
            totalDays: 5,
            status: 'Approved',
            remark: 'Vacation'
        },
        {
            id: 2,
            empId: 'EMP102',
            name: 'Priya Sharma',
            designation: 'UI/UX Designer',
            department: 'Design',
            fromDate: '2023-08-10',
            toDate: '2023-08-12',
            totalDays: 3,
            status: 'Pending',
            remark: 'Family function'
        },
        {
            id: 3,
            empId: 'EMP103',
            name: 'Rahul Verma',
            designation: 'Software Tester',
            department: 'QA',
            fromDate: '2023-06-20',
            toDate: '2023-06-22',
            totalDays: 3,
            status: 'Rejected',
            remark: 'Personal reasons'
        },
        {
            id: 4,
            empId: 'EMP104',
            name: 'Sneha Joshi',
            designation: 'HR Executive',
            department: 'Human Resources',
            fromDate: '2023-07-15',
            toDate: '2023-07-17',
            totalDays: 3,
            status: 'Approved',
            remark: 'Medical leave'
        },
        {
            id: 5,
            empId: 'EMP105',
            name: 'Ankit Sahu',
            designation: 'Frontend Developer',
            department: 'IT',
            fromDate: '2023-09-05',
            toDate: '2023-09-10',
            totalDays: 6,
            status: 'Pending',
            remark: 'Festival holidays'
        }
    ]);

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 5;
    const [toast, setToast] = useState({ message: '', type: '', isVisible: false });

    const showToast = (message, type = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    const hideToast = () => {
        setToast({ ...toast, isVisible: false });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const filteredRequests = leaveRequests.filter(request => {
        const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             request.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             request.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const indexOfLastRequest = currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
    const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
    const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleNewLeaveRequest = (newRequest) => {
        const newLeaveRequest = {
            id: leaveRequests.length + 1,
            empId: 'EMP' + (100 + leaveRequests.length + 1),
            name: 'Current User',
            designation: 'Employee',
            department: 'Your Department',
            fromDate: newRequest.fromDate,
            toDate: newRequest.toDate,
            totalDays: calculateDays(newRequest.fromDate, newRequest.toDate),
            status: 'Pending',
            remark: newRequest.reason
        };

        setLeaveRequests([...leaveRequests, newLeaveRequest]);
        showToast('Leave request submitted successfully');
    };

    const calculateDays = (fromDate, toDate) => {
        if (!fromDate || !toDate) return 0;
        const diffTime = new Date(toDate) - new Date(fromDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
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
                    <h1 className="text-3xl font-bold bg-black bg-clip-text text-transparent mb-2">
                        Leave Management
                    </h1>
                    <p className="text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Manage your leave requests and approvals
                    </p>
                </div>

                {/* Filters and Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search employees..."
                            className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <select
                            className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 bg-white shadow-sm"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                        </select>

                        <button
                            onClick={() => navigate('/ApplyLeave')}
                            className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Apply Leave
                        </button>
                    </div>
                </div>

                {/* Leave Requests Table */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    #
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Employee
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Date Period
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Days
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Notes
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {currentRequests.length > 0 ? (
                                currentRequests.map((request, index) => (
                                    <tr key={request.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                {indexOfFirstRequest + index + 1}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{request.name}</div>
                                            <div className="text-xs text-gray-500">{request.designation} • {request.department}</div>
                                            <div className="text-xs text-gray-400 mt-1">{request.empId}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(request.fromDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                                        <span className="mx-1">-</span>
                                                        {new Date(request.toDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(request.fromDate).toLocaleDateString('en-US', { weekday: 'short' })}
                                                        <span className="mx-1">→</span>
                                                        {new Date(request.toDate).toLocaleDateString('en-US', { weekday: 'short' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-700">
                                                {request.totalDays} {request.totalDays === 1 ? 'day' : 'days'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700 max-w-xs">
                                                {request.remark}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <div className="text-center">
                                            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                                <Calendar className="w-12 h-12 text-gray-500" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No leave requests found</h3>
                                            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {filteredRequests.length > 0 && (
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                            <div className="text-sm text-gray-500">
                                Showing <span className="font-medium">{indexOfFirstRequest + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(indexOfLastRequest, filteredRequests.length)}
                                </span> of{' '}
                                <span className="font-medium">{filteredRequests.length}</span> requests
                            </div>
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => paginate(currentPage - 1)} 
                                    disabled={currentPage === 1}
                                    className={`p-2 border border-gray-200 rounded-lg ${currentPage === 1 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                    <button
                                        key={number}
                                        onClick={() => paginate(number)}
                                        className={`px-3 py-1 border rounded-lg text-sm font-medium ${currentPage === number ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        {number}
                                    </button>
                                ))}
                                <button 
                                    onClick={() => paginate(currentPage + 1)} 
                                    disabled={currentPage === totalPages}
                                    className={`p-2 border border-gray-200 rounded-lg ${currentPage === totalPages ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaveManagement;