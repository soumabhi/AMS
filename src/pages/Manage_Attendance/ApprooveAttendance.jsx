import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Clock, Calendar, AlertCircle, X, User, 
  FileText, ChevronDown, ChevronUp, Search, Download, 
  Edit2, ChevronRight, ChevronLeft, Loader, Info
} from 'lucide-react';
import Toast from '../../components/Toast';

// Dummy data (same as before)
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

  // ... (same dummy data as in your original code)
];

const AttendanceApproval = ({ employees = [] }) => {
  const [attendanceRequests, setAttendanceRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
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
    filterRequests(enrichedRequests, searchText, statusFilter);
  }, [employees]);

  // Statistics for the dashboard
  const stats = {
    totalRequests: attendanceRequests.length,
    pendingRequests: attendanceRequests.filter(req => req.status === 'Pending').length,
    missingPunch: attendanceRequests.filter(req => 
      req.clock_in_time === null || req.clock_out_time === null
    ).length,
    timeCorrectionRequests: attendanceRequests.filter(req => 
      (req.clock_in_time !== null && req.requested_clock_in !== req.clock_in_time) || 
      (req.clock_out_time !== null && req.requested_clock_out !== req.clock_out_time)
    ).length,
  };

  // Filter requests based on search text and status
  const filterRequests = (requests, text, status) => {
    const filtered = requests.filter(req => 
      (status === 'All' || req.status === status) &&
      (!text || 
        req.emp_id.toLowerCase().includes(text.toLowerCase()) ||
        req.name.toLowerCase().includes(text.toLowerCase()) ||
        req.email.toLowerCase().includes(text.toLowerCase()) ||
        req.department?.toLowerCase().includes(text.toLowerCase()) ||
        req.reason?.toLowerCase().includes(text.toLowerCase()) ||
        req.shift_name?.toLowerCase().includes(text.toLowerCase())
      )
    );
    setFilteredRequests(filtered);
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    filterRequests(attendanceRequests, value, statusFilter);
  };

  // Handle status filter change
  const handleStatusChange = (value) => {
    setStatusFilter(value);
    filterRequests(attendanceRequests, searchText, value);
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => setToast({ ...toast, isVisible: false }), 4000);
  };

  // Export to Excel functionality
  const exportToExcel = () => {
    setExportLoading(true);
    setTimeout(() => {
      showToast('Attendance requests exported successfully');
      setExportLoading(false);
    }, 1500);
  };

  // Approve attendance request
  const approveRequest = (id) => {
    setLoading(true);
    setTimeout(() => {
      const updatedRequests = attendanceRequests.map(req => 
        req.id === id ? { ...req, status: 'Approved' } : req
      );
      setAttendanceRequests(updatedRequests);
      filterRequests(updatedRequests, searchText, statusFilter);
      showToast('Attendance request approved');
      setLoading(false);
      setViewModalVisible(false);
    }, 800);
  };

  // Reject attendance request
  const rejectRequest = (id) => {
    setLoading(true);
    setTimeout(() => {
      const updatedRequests = attendanceRequests.map(req => 
        req.id === id ? { ...req, status: 'Rejected' } : req
      );
      setAttendanceRequests(updatedRequests);
      filterRequests(updatedRequests, searchText, statusFilter);
      showToast('Attendance request rejected');
      setLoading(false);
    }, 800);
  };

  // View request details
  const viewRequestDetails = (record) => {
    setCurrentRequest(record);
    setViewModalVisible(true);
  };

  // Edit request
  const editRequest = (record) => {
    setCurrentRequest(record);
    setFormData({
      requested_clock_in: record.requested_clock_in,
      requested_clock_out: record.requested_clock_out,
      notes: ''
    });
    setEditModalVisible(true);
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
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const updatedRequests = attendanceRequests.map(req => 
        req.id === currentRequest.id ? { 
          ...req, 
          requested_clock_in: formData.requested_clock_in,
          requested_clock_out: formData.requested_clock_out,
          admin_notes: formData.notes,
          status: 'Approved'
        } : req
      );
      setAttendanceRequests(updatedRequests);
      filterRequests(updatedRequests, searchText, statusFilter);
      showToast('Attendance request updated and approved');
      setEditModalVisible(false);
      setLoading(false);
    }, 800);
  };

  // Toggle row expansion
  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id) 
        : [...prev, id]
    );
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusClasses = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  // Time comparison component
  const TimeComparison = ({ current, requested, type }) => {
    const changed = current && current !== requested;
    return (
      <div className="flex items-center">
        <Clock className="w-4 h-4 mr-1 text-gray-500" />
        <span className="font-medium">{type}:</span>
        <span className={`ml-1 ${changed ? 'text-orange-600' : 'text-gray-700'}`}>
          {requested}
        </span>
        {changed && (
          <span className="ml-1 text-xs bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded">
            Changed
          </span>
        )}
        {!current && (
          <span className="ml-1 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
            Missing
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-blue-600" />
            Attendance Approval
          </h1>
          <p className="text-gray-600 mt-1">
            Review and approve attendance correction requests from employees
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600 mr-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-50 text-red-600 mr-4">
                <X className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Missing Punch</p>
                <p className="text-2xl font-bold text-gray-900">{stats.missingPunch}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600 mr-4">
                <Edit2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Time Corrections</p>
                <p className="text-2xl font-bold text-gray-900">{stats.timeCorrectionRequests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Filters and Actions */}
          <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative">
                <select
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors disabled:opacity-50"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shift
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Request
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <React.Fragment key={request.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <User className="w-5 h-5" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {request.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {request.department} • {request.emp_id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(request.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(request.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {request.shift_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.shift_start} - {request.shift_end}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm space-y-1">
                            <TimeComparison 
                              current={request.clock_in_time} 
                              requested={request.requested_clock_in} 
                              type="In" 
                            />
                            <TimeComparison 
                              current={request.clock_out_time} 
                              requested={request.requested_clock_out} 
                              type="Out" 
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={request.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center space-x-2">
                            <button
                              onClick={() => toggleRowExpansion(request.id)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            >
                              {expandedRows.includes(request.id) ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                            
                            <button
                              onClick={() => viewRequestDetails(request)}
                              className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                            >
                              <Info className="w-5 h-5" />
                            </button>
                            
                            {request.status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => editRequest(request)}
                                  className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                >
                                  <Edit2 className="w-5 h-5" />
                                </button>
                                
                                <button
                                  onClick={() => approveRequest(request.id)}
                                  className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                
                                <button
                                  onClick={() => rejectRequest(request.id)}
                                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded row details */}
                      {expandedRows.includes(request.id) && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Reason for Correction</h3>
                                <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded-lg">
                                  {request.reason}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Details</h3>
                                <div className="text-sm text-gray-700 space-y-1">
                                  <p><span className="font-medium">Submitted:</span> {new Date(request.submitted_on).toLocaleDateString()}</p>
                                  <p><span className="font-medium">Manager:</span> {request.manager_name}</p>
                                  <p>
                                    <span className="font-medium">Evidence:</span> 
                                    {request.supporting_evidence ? (
                                      <span className="ml-1 text-green-600">Provided</span>
                                    ) : (
                                      <span className="ml-1 text-yellow-600">Not Provided</span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No attendance requests found
                        </h3>
                        <p className="text-gray-500 max-w-md">
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
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
                    <span className="font-medium">{filteredRequests.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      aria-current="page"
                      className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      1
                    </button>
                    <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      2
                    </button>
                    <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      3
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                    <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      8
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Request Modal */}
      {viewModalVisible && currentRequest && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Attendance Request Details
              </h2>
              <button
                onClick={() => setViewModalVisible(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Employee Information</h3>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900">{currentRequest.name}</p>
                    <p className="text-gray-700">{currentRequest.emp_id}</p>
                    <p className="text-gray-700">{currentRequest.department} • {currentRequest.position}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Date Information</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      {new Date(currentRequest.date).toLocaleDateString()} ({new Date(currentRequest.date).toLocaleDateString('en-US', { weekday: 'long' })})
                    </p>
                    <p className="text-gray-700">
                      <Clock className="inline w-4 h-4 mr-1" />
                      {currentRequest.shift_name}: {currentRequest.shift_start} - {currentRequest.shift_end}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Time Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Current Record</h4>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Clock In:</span> {currentRequest.clock_in_time || 'Not recorded'}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Clock Out:</span> {currentRequest.clock_out_time || 'Not recorded'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Requested Change</h4>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Clock In:</span> {currentRequest.requested_clock_in}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Clock Out:</span> {currentRequest.requested_clock_out}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Reason for Correction</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {currentRequest.reason}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Information</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Submitted On:</span> {new Date(currentRequest.submitted_on).toLocaleDateString()}</p>
                    <p><span className="font-medium">Manager:</span> {currentRequest.manager_name}</p>
                    <p>
                      <span className="font-medium">Supporting Evidence:</span> 
                      {currentRequest.supporting_evidence ? (
                        <span className="ml-1 text-green-600">Provided</span>
                      ) : (
                        <span className="ml-1 text-yellow-600">Not Provided</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                  <div className="flex items-center">
                    <StatusBadge status={currentRequest.status} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
              <button
                onClick={() => setViewModalVisible(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              {currentRequest.status === 'Pending' && (
                <button
                  onClick={() => approveRequest(currentRequest.id)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Request Modal */}
      {editModalVisible && currentRequest && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Edit & Approve Request
              </h2>
              <button
                onClick={() => setEditModalVisible(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Employee</h3>
                <p className="text-gray-900 font-medium">
                  {currentRequest.name} ({currentRequest.emp_id})
                </p>
                <p className="text-gray-700 text-sm">
                  {new Date(currentRequest.date).toLocaleDateString()} • {currentRequest.shift_name}
                </p>
              </div>
              
              <div>
                <label htmlFor="requested_clock_in" className="block text-sm font-medium text-gray-700 mb-1">
                  Clock In Time
                </label>
                <input
                  type="text"
                  id="requested_clock_in"
                  name="requested_clock_in"
                  value={formData.requested_clock_in}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="HH:MM"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="requested_clock_out" className="block text-sm font-medium text-gray-700 mb-1">
                  Clock Out Time
                </label>
                <input
                  type="text"
                  id="requested_clock_out"
                  name="requested_clock_out"
                  value={formData.requested_clock_out}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="HH:MM"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any notes about this adjustment..."
                />
              </div>
              
              <div className="border-t border-gray-200 pt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditModalVisible(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  )}
                  Update & Approve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceApproval;