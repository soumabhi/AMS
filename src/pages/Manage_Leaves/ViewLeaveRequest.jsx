import React, { useState, useEffect } from 'react';
import { 
  Search, FileText, CheckCircle, X, Calendar, Clock, 
  User, Download, Users, Home, FileCheck, AlertCircle, Eye 
} from 'lucide-react';
import Toast from '../../components/Toast';

// Dummy data remains the same as in your original code
const dummyLeaveApplications = [
  {
    id: 'la-001',
    emp_id: 'EMP1001',
    name: 'John Smith',
    email: 'john.smith@company.com',
    department: 'HR',
    branch: 'New York',
    position: 'Manager',
    leave_type: 'Sick Leave',
    start_date: '2025-04-10',
    end_date: '2025-04-15',
    total_days: 5,
    reason: 'Medical treatment',
    status: 'Pending',
    applied_on: '2025-04-05',
    documents_provided: true,
    approver: 'Sarah Johnson',
    leave_credits: {
      total: 15,
      used: 5,
      remaining: 10
    },
    employee_data: {}
  },
  {
    id: 'la-002',
    emp_id: 'EMP1002',
    name: 'Jane Doe',
    email: 'jane.doe@company.com',
    department: 'Finance',
    branch: 'Chicago',
    position: 'Accountant',
    leave_type: 'Annual Leave',
    start_date: '2025-05-01',
    end_date: '2025-05-10',
    total_days: 10,
    reason: 'Vacation',
    status: 'Approved',
    applied_on: '2025-04-20',
    documents_provided: false,
    approver: 'Michael Brown',
    leave_credits: {
      total: 20,
      used: 10,
      remaining: 10
    },
    employee_data: {}
  },
  {
    id: 'la-003',
    emp_id: 'EMP1003',
    name: 'Robert Johnson',
    email: 'robert.johnson@company.com',
    department: 'IT',
    branch: 'San Francisco',
    position: 'Developer',
    leave_type: 'Emergency Leave',
    start_date: '2025-04-18',
    end_date: '2025-04-19',
    total_days: 2,
    reason: 'Family emergency',
    status: 'Pending',
    applied_on: '2025-04-17',
    documents_provided: true,
    approver: 'Emily Davis',
    leave_credits: {
      total: 10,
      used: 3,
      remaining: 7
    },
    employee_data: {}
  },
  {
    id: 'la-004',
    emp_id: 'EMP1004',
    name: 'Maria Garcia',
    email: 'maria.garcia@company.com',
    department: 'Marketing',
    branch: 'Los Angeles',
    position: 'Marketing Specialist',
    leave_type: 'Maternity Leave',
    start_date: '2025-06-01',
    end_date: '2025-09-01',
    total_days: 92,
    reason: 'Childbirth and recovery',
    status: 'Approved',
    applied_on: '2025-05-15',
    documents_provided: true,
    approver: 'David Wilson',
    leave_credits: {
      total: 92,
      used: 92,
      remaining: 0
    },
    employee_data: {}
  },
  {
    id: 'la-005',
    emp_id: 'EMP1005',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    department: 'Operations',
    branch: 'Houston',
    position: 'Operations Manager',
    leave_type: 'Paternity Leave',
    start_date: '2025-06-15',
    end_date: '2025-07-15',
    total_days: 30,
    reason: 'Newborn care',
    status: 'Pending',
    applied_on: '2025-06-01',
    documents_provided: true,
    approver: 'Lisa Thompson',
    leave_credits: {
      total: 30,
      used: 0,
      remaining: 30
    },
    employee_data: {}
  },
  {
    id: 'la-006',
    emp_id: 'EMP1006',
    name: 'Sarah Lee',
    email: 'sarah.lee@company.com',
    department: 'IT',
    branch: 'Seattle',
    position: 'UX Designer',
    leave_type: 'Sick Leave',
    start_date: '2025-04-22',
    end_date: '2025-04-23',
    total_days: 2,
    reason: 'Flu',
    status: 'Approved',
    applied_on: '2025-04-21',
    documents_provided: false,
    approver: 'Robert Chen',
    leave_credits: {
      total: 12,
      used: 4,
      remaining: 8
    },
    employee_data: {}
  },
  {
    id: 'la-007',
    emp_id: 'EMP1007',
    name: 'David Kim',
    email: 'david.kim@company.com',
    department: 'Sales',
    branch: 'Boston',
    position: 'Sales Executive',
    leave_type: 'Annual Leave',
    start_date: '2025-07-15',
    end_date: '2025-07-30',
    total_days: 15,
    reason: 'Summer vacation',
    status: 'Pending',
    applied_on: '2025-06-10',
    documents_provided: false,
    approver: 'Jessica Adams',
    leave_credits: {
      total: 20,
      used: 5,
      remaining: 15
    },
    employee_data: {}
  },
  {
    id: 'la-008',
    emp_id: 'EMP1008',
    name: 'Emma Davis',
    email: 'emma.davis@company.com',
    department: 'Customer Support',
    branch: 'Austin',
    position: 'Support Specialist',
    leave_type: 'Sick Leave',
    start_date: '2025-04-25',
    end_date: '2025-04-26',
    total_days: 2,
    reason: 'Dental surgery',
    status: 'Rejected',
    applied_on: '2025-04-24',
    documents_provided: true,
    approver: 'Mark Taylor',
    leave_credits: {
      total: 10,
      used: 8,
      remaining: 2
    },
    employee_data: {}
  },
  {
    id: 'la-009',
    emp_id: 'EMP1009',
    name: 'Michael Brown',
    email: 'michael.brown@company.com',
    department: 'Engineering',
    branch: 'Denver',
    position: 'Senior Engineer',
    leave_type: 'Bereavement Leave',
    start_date: '2025-05-05',
    end_date: '2025-05-07',
    total_days: 3,
    reason: 'Family bereavement',
    status: 'Approved',
    applied_on: '2025-05-04',
    documents_provided: false,
    approver: 'Susan Miller',
    leave_credits: {
      total: 5,
      used: 3,
      remaining: 2
    },
    employee_data: {}
  },
  {
    id: 'la-010',
    emp_id: 'EMP1010',
    name: 'Olivia Wilson',
    email: 'olivia.wilson@company.com',
    department: 'HR',
    branch: 'Miami',
    position: 'Recruiter',
    leave_type: 'Work From Home',
    start_date: '2025-04-28',
    end_date: '2025-04-28',
    total_days: 1,
    reason: 'Home maintenance',
    status: 'Approved',
    applied_on: '2025-04-27',
    documents_provided: false,
    approver: 'Daniel Clark',
    leave_credits: {
      total: 10,
      used: 2,
      remaining: 8
    },
    employee_data: {}
  },
  {
    id: 'la-011',
    emp_id: 'EMP1011',
    name: 'William Taylor',
    email: 'william.taylor@company.com',
    department: 'IT',
    branch: 'Portland',
    position: 'System Admin',
    leave_type: 'Sick Leave',
    start_date: '2025-05-10',
    end_date: '2025-05-12',
    total_days: 3,
    reason: 'Migraine',
    status: 'Pending',
    applied_on: '2025-05-09',
    documents_provided: true,
    approver: 'Nancy White',
    leave_credits: {
      total: 15,
      used: 5,
      remaining: 10
    },
    employee_data: {}
  },
  {
    id: 'la-012',
    emp_id: 'EMP1012',
    name: 'Sophia Martinez',
    email: 'sophia.martinez@company.com',
    department: 'Finance',
    branch: 'Dallas',
    position: 'Financial Analyst',
    leave_type: 'Annual Leave',
    start_date: '2025-08-01',
    end_date: '2025-08-14',
    total_days: 14,
    reason: 'Summer holiday',
    status: 'Pending',
    applied_on: '2025-07-15',
    documents_provided: false,
    approver: 'Richard Lee',
    leave_credits: {
      total: 20,
      used: 6,
      remaining: 14
    },
    employee_data: {}
  }
];

const LeaveApplications = () => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [branchFilter, setBranchFilter] = useState('All');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  const [remarks, setRemarks] = useState('');

  // Get unique branches for filter
  const uniqueBranches = [...new Set(dummyLeaveApplications.map(app => app.branch))];

  // Statistics for the dashboard
  const stats = {
    totalApplications: leaveApplications.length,
    pendingApplications: leaveApplications.filter(app => app.status === 'Pending').length,
    urgentApplications: leaveApplications.filter(app => 
      app.status === 'Pending' && 
      new Date(app.start_date) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    ).length,
    sickLeaveApplications: leaveApplications.filter(app => app.leave_type === 'Sick Leave').length,
    annualLeaveApplications: leaveApplications.filter(app => app.leave_type === 'Annual Leave').length,
  };

  // Initialize with dummy data
  useEffect(() => {
    setLeaveApplications(dummyLeaveApplications);
    filterApplications(dummyLeaveApplications, '', 'Pending', 'All');
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  // Filter applications
  const filterApplications = (apps, text, status, branch) => {
    const filtered = apps.filter(app => 
      (status === 'All' || app.status === status) &&
      (branch === 'All' || app.branch === branch) &&
      (!text || 
        app.emp_id.toLowerCase().includes(text.toLowerCase()) ||
        app.name.toLowerCase().includes(text.toLowerCase()) ||
        app.email.toLowerCase().includes(text.toLowerCase()) ||
        app.department?.toLowerCase().includes(text.toLowerCase()) ||
        app.leave_type?.toLowerCase().includes(text.toLowerCase()) ||
        app.branch?.toLowerCase().includes(text.toLowerCase()) ||
        app.approver?.toLowerCase().includes(text.toLowerCase())
      )
    );
    setFilteredApplications(filtered);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    filterApplications(leaveApplications, value, statusFilter, branchFilter);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    filterApplications(leaveApplications, searchText, value, branchFilter);
  };

  const handleBranchChange = (value) => {
    setBranchFilter(value);
    filterApplications(leaveApplications, searchText, statusFilter, value);
  };

  const exportToExcel = () => {
    setExportLoading(true);
    setTimeout(() => {
      showToast('Leave applications exported to Excel successfully');
      setExportLoading(false);
    }, 1500);
  };

  const approveLeave = (id, remark = '') => {
    setLoading(true);
    setTimeout(() => {
      const updatedApplications = leaveApplications.map(app => 
        app.id === id ? { 
          ...app, 
          status: 'Approved',
          remarks: remark || app.remarks 
        } : app
      );
      setLeaveApplications(updatedApplications);
      filterApplications(updatedApplications, searchText, statusFilter, branchFilter);
      showToast('Leave application approved successfully');
      setLoading(false);
      setRemarks('');
      setIsModalVisible(false);
    }, 800);
  };

  const rejectLeave = (id, remark = '') => {
    setLoading(true);
    setTimeout(() => {
      const updatedApplications = leaveApplications.map(app => 
        app.id === id ? { 
          ...app, 
          status: 'Rejected',
          remarks: remark || app.remarks 
        } : app
      );
      setLeaveApplications(updatedApplications);
      filterApplications(updatedApplications, searchText, statusFilter, branchFilter);
      showToast('Leave application rejected');
      setLoading(false);
      setRemarks('');
      setIsModalVisible(false);
    }, 800);
  };

  const showApplicationDetails = (record) => {
    setSelectedApplication(record);
    setRemarks(record.remarks || '');
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setRemarks('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case 'Sick Leave': return 'bg-red-100 text-red-800 border-red-200';
      case 'Annual Leave': return 'bg-green-100 text-green-800 border-green-200';
      case 'Emergency Leave': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Table Skeleton Loader
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
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-32 mt-2"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-16"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-16"></div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="flex flex-col">
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl h-10 font-bold bg-black bg-clip-text text-transparent">
                Leave Request Management
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Manage employee leave requests and approvals
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Requests</p>
                <p className="text-2xl font-bold text-gray-800">{leaveApplications.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-8 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Applications</p>
                  <p className="text-xl font-bold text-gray-800">{stats.totalApplications}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-full flex items-center justify-center mr-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Review</p>
                  <p className="text-xl font-bold text-gray-800">{stats.pendingApplications}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-red-50 rounded-full flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Sick Leave Requests</p>
                  <p className="text-xl font-bold text-gray-800">{stats.sickLeaveApplications}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-50 rounded-full flex items-center justify-center mr-3">
                  <FileCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Annual Leave Requests</p>
                  <p className="text-xl font-bold text-gray-800">{stats.annualLeaveApplications}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 pb-8 flex-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Filters */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Leave Applications ({filteredApplications.length})
                  </h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select 
                    value={statusFilter}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <select 
                    value={branchFilter}
                    onChange={(e) => handleBranchChange(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500"
                  >
                    <option value="All">All Branches</option>
                    {uniqueBranches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search applications..."
                      value={searchText}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 w-full"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                  <button
                    onClick={exportToExcel}
                    disabled={exportLoading}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-xl hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {exportLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
           <div className="overflow-x-auto p-4">
  <table className="w-full border-collapse border border-gray-200 rounded-lg shadow-sm">
    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
      <tr>
        <th className="border border-gray-200 px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
          #
        </th>
        <th className="border border-gray-200 px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
          Employee
        </th>
        <th className="border border-gray-200 px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
          Branch
        </th>
        <th className="border border-gray-200 px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
          Approver
        </th>
        <th className="border border-gray-200 px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
          Leave Type
        </th>
        <th className="border border-gray-200 px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
          Status
        </th>
        <th className="border border-gray-200 px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
          Request Info
        </th>
        <th className="border border-gray-200 px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
          Leave Credits
        </th>
        <th className="border border-gray-200 px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>

    {loading ? (
      <TableSkeleton />
    ) : (
      <tbody className="bg-white">
        {filteredApplications.map((application, index) => (
          <tr key={application.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
            <td className="border border-gray-200 px-6 py-2">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center text-white text-sm font-bold">
                {index + 1}
              </div>
            </td>
            <td className="border border-gray-200 px-6 py-2">
              <div className="space-y-1">
                <div className="font-medium text-sm"></div>
                <div className="text-gray-700 font-semibold">{application.name}</div>
                <div className="text-gray-500 text-xs"><b>{application.emp_id}</b>-{application.department}</div>
              </div>
            </td>
            <td className="border border-gray-200 px-6 py-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                <Home className="w-3 h-3 mr-2" />
                {application.branch}
              </span>
            </td>
            <td className="border border-gray-200 px-6 py-2">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">{application.approver}</span>
              </div>
            </td>
            <td className="border border-gray-200 px-6 py-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(application.leave_type)}`}>
                {application.leave_type}
              </span>
            </td>
            <td className="border border-gray-200 px-6 py-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                {application.status}
              </span>
            </td>
            <td className="border border-gray-200 px-6 py-2">
              <div className="text-xs space-y-1">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-2 text-gray-500" />
                  <span>
                    {new Date(application.start_date).toLocaleDateString()} - {new Date(application.end_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-2 text-gray-500" />
                  <span>{application.total_days} {application.total_days > 1 ? 'days' : 'day'}</span>
                </div>
              </div>
            </td>
            <td className="border border-gray-200 px-6 py-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(application.leave_credits.used / application.leave_credits.total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium min-w-max">
                  {application.leave_credits.remaining}/{application.leave_credits.total}
                </span>
              </div>
            </td>
            <td className="border border-gray-200 px-6 py-2">
              <div className="flex items-center">
                <button
                  onClick={() => showApplicationDetails(application)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
              </div>
            </td>
          </tr>
        ))}

        {!loading && filteredApplications.length === 0 && (
          <tr>
            <td colSpan="9" className="border border-gray-200 px-6 py-12 text-center">
              <div className="text-center">
                <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                  <FileText className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">No leave applications found</h3>
                <p className="text-gray-500">Try adjusting your filters or search criteria</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    )}
  </table>
</div>

            {/* Pagination */}
            {filteredApplications.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">{filteredApplications.length}</span> results
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
{isModalVisible && selectedApplication && (
  <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 bg-opacity-50 backdrop-blur-sm">
    <div className="flex items-start justify-center min-h-screen pt-8 px-4 pb-8">
      <div className="relative bg-white rounded-xl shadow-2xl transform transition-all w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Fixed Header */}
        <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-200 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Leave Application
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                <b>{selectedApplication.name}</b> ({selectedApplication.emp_id}/{selectedApplication.department}/{selectedApplication.branch})
              </p>
            </div>
            <button
              onClick={handleModalCancel}
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] px-8 py-6 space-y-8">
          {/* Employee and Leave Information Grid */}
         <div className="bg-gradient-to-br from-gray-50 to-gray-50 p-6 rounded-xl border border-green-100">
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center">
      <div className="p-2 bg-green-100 rounded-lg mr-4">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h4 className="text-lg font-semibold text-gray-800">Leave Information</h4>
    </div>
  </div>
  
  <div className="grid grid-cols-4 gap-4">
    <div className="min-w-0">
      <div className="text-sm font-medium text-gray-600 mb-2">Leave Type</div>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLeaveTypeColor(selectedApplication.leave_type)}`}>
        {selectedApplication.leave_type}
      </span>
    </div>
    
    <div className="min-w-0">
      <div className="text-sm font-medium text-gray-600 mb-2">Status</div>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedApplication.status)}`}>
        {selectedApplication.status}
      </span>
    </div>
    
    <div className="min-w-0">
      <div className="text-sm font-medium text-gray-600 mb-2">Duration</div>
      <div>
        <div className="font-semibold text-gray-900">
          {new Date(selectedApplication.start_date).toLocaleDateString()} - {new Date(selectedApplication.end_date).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-500">{selectedApplication.total_days} days</div>
      </div>
    </div>
    
    <div className="min-w-0">
      <div className="text-sm font-medium text-gray-600 mb-2">Applied On</div>
      <span className="font-semibold text-gray-900">
        {new Date(selectedApplication.applied_on).toLocaleDateString()}
      </span>
    </div>
  </div>
</div>

          {/* Leave Credits Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-50 p-6 rounded-xl border border-purple-100">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800">Leave Credits</h4>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-gray-500 to-black h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${(selectedApplication.leave_credits.used / selectedApplication.leave_credits.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-right min-w-[100px]">
                <div className="text-sm font-semibold text-gray-900">
                  {selectedApplication.leave_credits.remaining} / {selectedApplication.leave_credits.total}
                </div>
                <div className="text-xs text-gray-500">remaining</div>
              </div>
            </div>
          </div>

          {/* Reason Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-50 p-6 rounded-xl border border-orange-100">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-orange-100 rounded-lg mr-4">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800">Reason for Leave</h4>
            </div>
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <p className="text-gray-700 leading-relaxed">{selectedApplication.reason}</p>
            </div>
          </div>

          {/* Previous Remarks */}
          {selectedApplication.remarks && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gray-100 rounded-lg mr-4">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-800">Previous Remarks</h4>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 leading-relaxed">{selectedApplication.remarks}</p>
              </div>
            </div>
          )}

          {/* Action Section for Pending Applications */}
          {selectedApplication.status === 'Pending' && (
            <div className="bg-transparent p-6 rounded-xl border border-indigo-100">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-800">Add Remarks</h4>
              </div>
              <textarea
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter your remarks here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
              ></textarea>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => rejectLeave(selectedApplication.id, remarks)}
                  className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <X className="w-4 h-4 mr-2 inline" />
                  Reject Application
                </button>
                <button
                  onClick={() => approveLeave(selectedApplication.id, remarks)}
                  className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <CheckCircle className="w-4 h-4 mr-2 inline" />
                  Approve Application
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default LeaveApplications;