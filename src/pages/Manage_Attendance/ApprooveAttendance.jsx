import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle, Clock, Calendar, AlertCircle, X, User, 
  FileText, ChevronDown, ChevronUp, Search, Download, 
  Edit2, ChevronRight, ChevronLeft, Loader, Info
} from 'lucide-react';

// Toast Component
const Toast = ({ message, type, isVisible, onClose }) => {
  if (!isVisible) return null;
  
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  
  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity`}>
      <div className="flex items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Dummy data
const dummyAttendanceRequests = [
  {
    id: 'att-001',
    emp_id: 'EMP1002',
    name: 'Employee 2',
    email: 'emp2@company.com',
    department: 'Engineering',
    position: 'Developer',
    date: '2025-04-05',
    clock_in_time: null,
    clock_out_time: null,
    requested_clock_in: '09:15',
    requested_clock_out: '18:30',
    reason: 'Forgot to punch in/out',
    status: 'Pending',
    submitted_on: '2025-04-06',
    manager_name: 'Manager A',
    supporting_evidence: false,
    shift_name: 'Morning Shift',
    shift_start: '08:00',
    shift_end: '17:00',
    shift_type: 'Regular'
  },
  {
    id: 'att-002',
    emp_id: 'EMP1007',
    name: 'Employee 7',
    email: 'emp7@company.com',
    department: 'HR',
    position: 'Coordinator',
    date: '2025-04-04',
    clock_in_time: '08:45',
    clock_out_time: null,
    requested_clock_in: '08:45',
    requested_clock_out: '17:30',
    reason: 'System error - failed to record checkout',
    status: 'Pending',
    submitted_on: '2025-04-05',
    manager_name: 'Manager B',
    supporting_evidence: true,
    shift_name: 'Day Shift',
    shift_start: '09:00',
    shift_end: '18:00',
    shift_type: 'Regular'
  },
  {
    id: 'att-003',
    emp_id: 'EMP1012',
    name: 'Employee 12',
    email: 'emp12@company.com',
    department: 'Finance',
    position: 'Analyst',
    date: '2025-04-05',
    clock_in_time: '09:30',
    clock_out_time: '17:15',
    requested_clock_in: '08:30',
    requested_clock_out: '17:15',
    reason: 'Late entry - traffic issue, but arrived on time',
    status: 'Pending',
    submitted_on: '2025-04-05',
    manager_name: 'Manager C',
    supporting_evidence: true,
    shift_name: 'Flexi Shift',
    shift_start: '08:30',
    shift_end: '17:30',
    shift_type: 'Flexible'
  },
  {
    id: 'att-004',
    emp_id: 'EMP1018',
    name: 'Employee 18',
    email: 'emp18@company.com',
    department: 'Marketing',
    position: 'Designer',
    date: '2025-04-04',
    clock_in_time: '08:15',
    clock_out_time: '16:45',
    requested_clock_in: '08:15',
    requested_clock_out: '18:45',
    reason: 'Worked late on project deadline, forgot to update checkout',
    status: 'Pending',
    submitted_on: '2025-04-05',
    manager_name: 'Manager D',
    supporting_evidence: true,
    shift_name: 'Evening Shift',
    shift_start: '13:00',
    shift_end: '22:00',
    shift_type: 'Regular'
  },
  {
    id: 'att-005',
    emp_id: 'EMP1023',
    name: 'Employee 23',
    email: 'emp23@company.com',
    department: 'Operations',
    position: 'Supervisor',
    date: '2025-04-03',
    clock_in_time: null,
    clock_out_time: null,
    requested_clock_in: '08:00',
    requested_clock_out: '17:00',
    reason: 'Working from client site, no access to clock system',
    status: 'Pending',
    submitted_on: '2025-04-04',
    manager_name: 'Manager E',
    supporting_evidence: true,
    shift_name: 'Night Shift',
    shift_start: '22:00',
    shift_end: '06:00',
    shift_type: 'Regular'
  }
];

const AttendanceApproval = ({ employees = [] }) => {
  const [attendanceRequests, setAttendanceRequests] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  const [formData, setFormData] = useState({
    requested_clock_in: '',
    requested_clock_out: '',
    notes: ''
  });

  // Initialize with dummy data
  useEffect(() => {
    const enrichedRequests = dummyAttendanceRequests.map(request => {
      const employeeData = employees.find(emp => emp.emp_id === request.emp_id) || {};
      return {
        ...request,
        employee_data: employeeData
      };
    });
    
    setAttendanceRequests(enrichedRequests);
  }, []);

  // Use useMemo to filter requests instead of useEffect to prevent infinite loops
  const filteredRequests = useMemo(() => {
    return attendanceRequests.filter(req => 
      (statusFilter === 'All' || req.status === statusFilter) &&
      (!searchText || 
        req.emp_id.toLowerCase().includes(searchText.toLowerCase()) ||
        req.name.toLowerCase().includes(searchText.toLowerCase()) ||
        req.email.toLowerCase().includes(searchText.toLowerCase()) ||
        req.department?.toLowerCase().includes(searchText.toLowerCase()) ||
        req.reason?.toLowerCase().includes(searchText.toLowerCase()) ||
        req.shift_name?.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [attendanceRequests, searchText, statusFilter]);

  // Statistics for the dashboard
  const stats = useMemo(() => ({
    totalRequests: attendanceRequests.length,
    pendingRequests: attendanceRequests.filter(req => req.status === 'Pending').length,
    missingPunch: attendanceRequests.filter(req => 
      req.clock_in_time === null || req.clock_out_time === null
    ).length,
    timeCorrectionRequests: attendanceRequests.filter(req => 
      (req.clock_in_time !== null && req.requested_clock_in !== req.clock_in_time) || 
      (req.clock_out_time !== null && req.requested_clock_out !== req.clock_out_time)
    ).length,
  }), [attendanceRequests]);

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Handle status filter change
  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 4000);
  };

  // Export to Excel functionality
  const exportToExcel = () => {
    setExportLoading(true);
    setTimeout(() => {
      showToast('Attendance requests exported successfully');
      setExportLoading(false);
      
      const headers = ['Sl No', 'Employee ID', 'Name', 'Date', 'Status', 'Requested In', 'Requested Out', 'Reason'];
      const csvContent = [
        headers.join(','),
        ...filteredRequests.map((req, index) => [
          index + 1,
          req.emp_id,
          req.name,
          req.date,
          req.status,
          req.requested_clock_in,
          req.requested_clock_out,
          req.reason
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'attendance_requests.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  // Approve attendance request
  const approveRequest = (id) => {
    setLoading(true);
    setTimeout(() => {
      setAttendanceRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: 'Approved' } : req
      ));
      showToast('Attendance request approved');
      setLoading(false);
      setActionModalVisible(false);
    }, 800);
  };

  // Reject attendance request
  const rejectRequest = (id) => {
    setLoading(true);
    setTimeout(() => {
      setAttendanceRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: 'Rejected' } : req
      ));
      showToast('Attendance request rejected');
      setLoading(false);
      setActionModalVisible(false);
    }, 800);
  };

  // Open action modal with request details
  const openActionModal = (request) => {
    setCurrentRequest(request);
    setFormData({
      requested_clock_in: request.requested_clock_in || '',
      requested_clock_out: request.requested_clock_out || '',
      notes: ''
    });
    setActionModalVisible(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle edit form submission
  const handleEditSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setAttendanceRequests(prev => prev.map(req => 
        req.id === currentRequest.id ? { 
          ...req, 
          requested_clock_in: formData.requested_clock_in,
          requested_clock_out: formData.requested_clock_out,
          admin_notes: formData.notes,
          status: 'Approved'
        } : req
      ));
      showToast('Attendance request updated and approved');
      setActionModalVisible(false);
      setLoading(false);
    }, 800);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusClasses = {
      'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
      'Approved': 'bg-green-100 text-green-700 border-green-200',
      'Rejected': 'bg-red-100 text-red-700 border-red-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />

      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-blue-600" />
            Attendance Approval
          </h1>
          <p className="text-gray-600 mt-1">
            Review and approve attendance correction requests from employees
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Requests</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 mr-3">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending Review</p>
                <p className="text-xl font-bold text-gray-900">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-50 text-red-600 mr-3">
                <X className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Missing Punch</p>
                <p className="text-xl font-bold text-gray-900">{stats.missingPunch}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600 mr-3">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Time Corrections</p>
                <p className="text-xl font-bold text-gray-900">{stats.timeCorrectionRequests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Filters and Actions */}
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative">
                <select
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={exportToExcel}
                disabled={exportLoading}
                className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors disabled:opacity-50 text-sm"
              >
                {exportLoading ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export
              </button>
            </div>
          </div>

          {/* Requests Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shift
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Request
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request, index) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {request.department} • {request.emp_id}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(request.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(request.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.shift_name}</div>
                        <div className="text-xs text-gray-500">
                          {request.shift_start} - {request.shift_end}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 w-6">In:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {request.requested_clock_in}
                            </span>
                            {!request.clock_in_time && (
                              <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                                Missing
                              </span>
                            )}
                            {request.clock_in_time && request.clock_in_time !== request.requested_clock_in && (
                              <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">
                                Changed
                              </span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 w-6">Out:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {request.requested_clock_out}
                            </span>
                            {!request.clock_out_time && (
                              <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                                Missing
                              </span>
                            )}
                            {request.clock_out_time && request.clock_out_time !== request.requested_clock_out && (
                              <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">
                                Changed
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-center">
                        <button
                          onClick={() => openActionModal(request)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-400 mb-2" />
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          No attendance requests found
                        </h3>
                        <p className="text-xs text-gray-500 max-w-md text-center">
                          {searchText 
                            ? 'Try adjusting your search or filter to find what you\'re looking for.'
                            : 'When employees submit attendance corrections, they will appear here.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredRequests.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
                <span className="font-medium">{filteredRequests.length}</span> results
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button className="bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-3 py-2 border text-sm font-medium">
                    1
                  </button>
                  <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-3 py-2 border text-sm font-medium">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {actionModalVisible && currentRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Attendance Request</h2>
                <p className="text-sm text-gray-600">
                  {currentRequest.name} • {currentRequest.emp_id}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-blue-600" />
                    {new Date(currentRequest.date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1 text-blue-600" />
                    {currentRequest.shift_name}: {currentRequest.shift_start} - {currentRequest.shift_end}
                  </div>
                </div>
                
                <button
                  onClick={() => setActionModalVisible(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Time Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <h4 className="text-sm font-semibold text-red-800 mb-2">Current</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>In:</span>
                      <span className="font-medium">{currentRequest.clock_in_time || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Out:</span>
                      <span className="font-medium">{currentRequest.clock_out_time || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <h4 className="text-sm font-semibold text-green-800 mb-2">Requested</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>In:</span>
                      <span className="font-medium">{currentRequest.requested_clock_in}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Out:</span>
                      <span className="font-medium">{currentRequest.requested_clock_out}</span>
                      </div>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Reason</h4>
                <p className="text-sm text-gray-700">{currentRequest.reason}</p>
              </div>

              {/* Employee Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Department:</span>
                  <span className="ml-2 font-medium">{currentRequest.department}</span>
                </div>
                <div>
                  <span className="text-gray-500">Position:</span>
                  <span className="ml-2 font-medium">{currentRequest.position}</span>
                </div>
                <div>
                  <span className="text-gray-500">Manager:</span>
                  <span className="ml-2 font-medium">{currentRequest.manager_name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Evidence:</span>
                  <span className="ml-2 font-medium">
                    {currentRequest.supporting_evidence ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {/* Edit Times */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Adjust Times (Optional)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Clock In Time</label>
                    <input
                      type="time"
                      name="requested_clock_in"
                      value={formData.requested_clock_in}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Clock Out Time</label>
                    <input
                      type="time"
                      name="requested_clock_out"
                      value={formData.requested_clock_out}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Admin Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any notes about this approval..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  rows="3"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-3 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
              <button
                onClick={() => setActionModalVisible(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                Cancel
              </button>
              
              {currentRequest.status === 'Pending' && (
                <>
                  <button
                    onClick={() => rejectRequest(currentRequest.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Reject'}
                  </button>
                  
                  <button
                    onClick={handleEditSubmit}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Approve'}
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

export default AttendanceApproval;