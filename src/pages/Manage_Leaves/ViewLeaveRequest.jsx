import React, { useState, useEffect } from 'react';
import { 
  Search, FileText, CheckCircle, X, Calendar, Clock, 
  User, Download, Users, Home, FileCheck, AlertCircle, Eye 
} from 'lucide-react';
import Toast from '../../components/Toast';

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

  const uniqueBranches = [...new Set(dummyLeaveApplications.map(app => app.branch))];

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
      case 'Sick Leave': return 'bg-black text-white border-red-200';
      case 'Annual Leave': return 'bg-black text-white border-green-200';
      case 'Emergency Leave': return 'bg-black text-white border-orange-200';
      default: return 'bg-black text-white border-blue-200';
    }
  };

  const TableSkeleton = () => {
    return (
      <tbody className="bg-white divide-y divide-gray-100">
        {[...Array(5)].map((_, index) => (
          <tr key={index} className="animate-pulse">
            <td className="px-3 py-2 whitespace-nowrap">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-6 mx-auto"></div>
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
              <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24 mt-1"></div>
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-12"></div>
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20"></div>
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-12"></div>
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20"></div>
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-12"></div>
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
        <div className="p-6 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-black bg-clip-text text-transparent">
                Leave Request Management
              </h1>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Users className="w-3 h-3" />
                Manage employee leave requests and approvals
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Total Requests</p>
                <p className="text-xl font-bold text-gray-800">{leaveApplications.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Total Applications</p>
                  <p className="text-lg font-bold text-gray-800">{stats.totalApplications}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-full flex items-center justify-center mr-3">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Pending Review</p>
                  <p className="text-lg font-bold text-gray-800">{stats.pendingApplications}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-red-100 to-red-50 rounded-full flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Sick Leave Requests</p>
                  <p className="text-lg font-bold text-gray-800">{stats.sickLeaveApplications}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-green-50 rounded-full flex items-center justify-center mr-3">
                  <FileCheck className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Annual Leave Requests</p>
                  <p className="text-lg font-bold text-gray-800">{stats.annualLeaveApplications}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 pb-4 flex-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Leave Applications ({filteredApplications.length})
                  </h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select 
                    value={statusFilter}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="px-3 py-1 text-xs border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500/20 focus:border-gray-500"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <select 
                    value={branchFilter}
                    onChange={(e) => handleBranchChange(e.target.value)}
                    className="px-3 py-1 text-xs border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500/20 focus:border-gray-500"
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
                      className="pl-8 pr-3 py-1 text-xs border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500/20 focus:border-gray-500 w-full"
                    />
                    <Search className="w-3 h-3 text-gray-400 absolute left-3 top-2" />
                  </div>
                  <button
                    onClick={exportToExcel}
                    disabled={exportLoading}
                    className="flex items-center justify-center px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-lg hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {exportLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto p-2">
              <table className="w-full border-collapse">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Approver
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Request Info
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Leave Credits
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                {loading ? (
                  <TableSkeleton />
                ) : (
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredApplications.map((application, index) => (
                      <tr 
                        key={application.id} 
                        className="hover:bg-gray-50 transition-colors duration-100"
                      >
                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                          <div className="w-6 h-6 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <div className="text-xs font-semibold text-gray-900">{application.name}</div>
                            <div className="text-2xs text-gray-500"><b>{application.emp_id}</b>-{application.department}</div>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium bg-blue-50 text-blue-800">
                            <Home className="w-2.5 h-2.5 mr-1" />
                            {application.branch}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1 text-gray-500" />
                            {application.approver}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium ${getLeaveTypeColor(application.leave_type)}`}>
                            {application.leave_type}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-2xs space-y-0.5">
                            <div className="flex items-center">
                              <Calendar className="w-2.5 h-2.5 mr-1 text-gray-500" />
                              <span>
                                {new Date(application.start_date).toLocaleDateString()} - {new Date(application.end_date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-2.5 h-2.5 mr-1 text-gray-500" />
                              <span>{application.total_days} {application.total_days > 1 ? 'days' : 'day'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full" 
                                style={{ width: `${(application.leave_credits.used / application.leave_credits.total) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-2xs font-medium min-w-max">
                              {application.leave_credits.remaining}/{application.leave_credits.total}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <button
                            onClick={() => showApplicationDetails(application)}
                            className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs leading-3 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-500"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}

                    {!loading && filteredApplications.length === 0 && (
                      <tr>
                        <td colSpan="9" className="px-6 py-8 text-center">
                          <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                              <FileText className="w-8 h-8 text-gray-500" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">No leave applications found</h3>
                            <p className="text-xs text-gray-500">Try adjusting your filters or search criteria</p>
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
              <div className="px-4 py-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">{filteredApplications.length}</span> results
                </div>
                <div className="flex space-x-2">
                  <button className="px-2 py-1 text-xs border border-gray-300 rounded-md font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-2 py-1 text-xs border border-gray-300 rounded-md font-medium text-gray-700 bg-white hover:bg-gray-50">
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
  <div className="fixed inset-0 z-50 bg-black/70 bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Leave Application</h3>
          <p className="text-sm text-gray-600 mt-1">
            {selectedApplication.name} ({selectedApplication.emp_id}/{selectedApplication.department})
          </p>
        </div>
        <button
          onClick={handleModalCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Content */}
      <div className="overflow-y-auto p-6 space-y-6">
        {/* Leave Info */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Leave Details</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium">{selectedApplication.leave_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium">{selectedApplication.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-medium">
                {new Date(selectedApplication.start_date).toLocaleDateString()} - {new Date(selectedApplication.end_date).toLocaleDateString()}
                <span className="block text-sm text-gray-600">{selectedApplication.total_days} days</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Applied On</p>
              <p className="font-medium">{new Date(selectedApplication.applied_on).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Employee Info */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Employee Information</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-medium">{selectedApplication.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Branch</p>
              <p className="font-medium">{selectedApplication.branch}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Position</p>
              <p className="font-medium">{selectedApplication.position}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Approver</p>
              <p className="font-medium">{selectedApplication.approver}</p>
            </div>
          </div>
        </div>

        {/* Leave Credits & Reason */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Leave Credits</h4>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Used</span>
                  <span className="font-medium">{selectedApplication.leave_credits.used} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-gray-800 h-2 rounded-full" 
                    style={{ width: `${(selectedApplication.leave_credits.used / selectedApplication.leave_credits.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-medium">{selectedApplication.leave_credits.remaining} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-gray-600 h-2 rounded-full" 
                    style={{ width: `${(selectedApplication.leave_credits.remaining / selectedApplication.leave_credits.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">Total: {selectedApplication.leave_credits.total} days</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Reason</h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-800">{selectedApplication.reason}</p>
            </div>
            <p className="text-sm text-gray-600">
              Documents provided: {selectedApplication.documents_provided ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        {/* Remarks */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Remarks</h4>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add your remarks..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            rows={3}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
        <button
          onClick={handleModalCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        
        {selectedApplication.status === 'Pending' && (
          <>
            <button
              onClick={() => rejectLeave(selectedApplication.id, remarks)}
              disabled={loading}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Reject'}
            </button>
            <button
              onClick={() => approveLeave(selectedApplication.id, remarks)}
              disabled={loading}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Approve'}
            </button>
          </>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default LeaveApplications;
                          