import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Users, 
  Timer,
  Search,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Toast from '../../components/Toast';

// Dummy employee data with leave credits
const employees = [
  { 
    slNo: 1, 
    empId: 'EMP001', 
    name: 'Krishna Das', 
    branch: 'Head Office',
    leaveCredits: {
      casual: { total: 12, used: 3, remaining: 9 },
      sick: { total: 10, used: 2, remaining: 8 },
      earned: { total: 30, used: 5, remaining: 25 },
      optional: { total: 2, used: 0, remaining: 2 },
      maternity: { total: 180, used: 0, remaining: 180 },
      paternity: { total: 15, used: 0, remaining: 15 }
    }
  },
  { 
    slNo: 2, 
    empId: 'EMP002', 
    name: 'Ananya Iyer', 
    branch: 'North Branch',
    leaveCredits: {
      casual: { total: 12, used: 5, remaining: 7 },
      sick: { total: 10, used: 1, remaining: 9 },
      earned: { total: 30, used: 10, remaining: 20 },
      optional: { total: 2, used: 1, remaining: 1 },
      maternity: { total: 180, used: 0, remaining: 180 },
      paternity: { total: 15, used: 0, remaining: 15 }
    }
  },
  {
    slNo: 3,
    empId: "EMP003",
    name: "Aarav Sharma",
    branch: "North Branch",
    leaveCredits: {
      casual: { total: 12, used: 7, remaining: 5 },
      sick: { total: 10, used: 10, remaining: 0 },
      earned: { total: 30, used: 20, remaining: 10 },
      optional: { total: 2, used: 2, remaining: 0 },
      maternity: { total: 180, used: 64, remaining: 116 },
      paternity: { total: 15, used: 0, remaining: 15 }
    }
  },
  {
    slNo: 4,
    empId: "EMP004",
    name: "Neha Gupta",
    branch: "West Branch",
    leaveCredits: {
      casual: { total: 12, used: 3, remaining: 9 },
      sick: { total: 10, used: 2, remaining: 8 },
      earned: { total: 30, used: 10, remaining: 20 },
      optional: { total: 2, used: 0, remaining: 2 },
      maternity: { total: 180, used: 0, remaining: 180 },
      paternity: { total: 15, used: 0, remaining: 15 }
    }
  },
  {
    slNo: 5,
    empId: "EMP005",
    name: "Vikram Singh",
    branch: "Central Branch",
    leaveCredits: {
      casual: { total: 12, used: 12, remaining: 0 },
      sick: { total: 10, used: 5, remaining: 5 },
      earned: { total: 30, used: 18, remaining: 12 },
      optional: { total: 2, used: 1, remaining: 1 },
      maternity: { total: 180, used: 0, remaining: 180 },
      paternity: { total: 15, used: 7, remaining: 8 }
    }
  }
];

const LeaveManagement = () => {
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [leaveType, setLeaveType] = useState('');
  const [days, setDays] = useState(0);
  const [reason, setReason] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const [dateSelectionType, setDateSelectionType] = useState('single');
  const [leaveCreditInfo, setLeaveCreditInfo] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedEmployee, setExpandedEmployee] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  useEffect(() => {
    if (selectedEmployee && leaveType) {
      const employee = employees.find(emp => emp.empId === selectedEmployee);
      if (employee && employee.leaveCredits[leaveType]) {
        setLeaveCreditInfo(employee.leaveCredits[leaveType]);
      } else {
        setLeaveCreditInfo(null);
      }
    } else {
      setLeaveCreditInfo(null);
    }
  }, [selectedEmployee, leaveType]);

  useEffect(() => {
    const filtered = employees.filter(emp => 
      emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.empId.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.branch.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredEmployees(filtered);
    setCurrentPage(1);
  }, [searchText]);

  const handleApplyLeave = (empId) => {
    setSelectedEmployee(empId);
    setLeaveModalVisible(true);
  };

  const calculateDays = (dates) => {
    if (!dates || dates.length < 2 || !dates[0] || !dates[1]) {
      setDays(0);
      return;
    }
    
    const start = new Date(dates[0]);
    const end = new Date(dates[1]);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
    
    setDays(diffDays);
  };

  const handleDateChange = (date, dateString) => {
    if (dateSelectionType === 'single') {
      if (date) {
        setSelectedDates([date, date]);
        setDays(1);
      } else {
        setSelectedDates([]);
        setDays(0);
      }
    } else {
      if (date && date.length === 2) {
        setSelectedDates(date);
        calculateDays(date);
      } else {
        setSelectedDates([]);
        setDays(0);
      }
    }
  };

  const handleSubmitLeave = () => {
    if (days <= 0) {
      showToast('Please select valid dates', 'error');
      return;
    }

    if (leaveCreditInfo && days > leaveCreditInfo.remaining) {
      showToast(`You only have ${leaveCreditInfo.remaining} days remaining for this leave type`, 'error');
      return;
    }

    if (!reason) {
      showToast('Please enter a reason for leave', 'error');
      return;
    }

    console.log({
      empId: selectedEmployee,
      leaveType,
      days,
      reason,
      dates: selectedDates,
      status: 'pending'
    });

    showToast('Leave application submitted successfully!');
    setLeaveModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setLeaveType('');
    setDays(0);
    setReason('');
    setSelectedDates([]);
    setDateSelectionType('single');
    setSelectedEmployee(null);
  };

  const disabledDate = (current) => {
    return current < new Date().setHours(0, 0, 0, 0);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const toggleExpandEmployee = (empId) => {
    if (expandedEmployee === empId) {
      setExpandedEmployee(null);
    } else {
      setExpandedEmployee(empId);
    }
  };

  const getLeaveTypeColor = (leaveType) => {
    switch (leaveType) {
      case 'casual': return 'bg-gradient-to-r from-blue-100 to-blue-200';
      case 'sick': return 'bg-gradient-to-r from-green-100 to-green-200';
      case 'earned': return 'bg-gradient-to-r from-purple-100 to-purple-200';
      case 'optional': return 'bg-gradient-to-r from-yellow-100 to-yellow-200';
      case 'maternity': return 'bg-gradient-to-r from-pink-100 to-pink-200';
      case 'paternity': return 'bg-gradient-to-r from-indigo-100 to-indigo-200';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200';
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

      <div className="flex flex-col">
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl h-10 font-bold bg-black bg-clip-text text-transparent">
                Leave Management
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Manage employee leave applications and balances
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Employees</p>
                <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-auto">
          {/* Search and Filters */}
          <div className="mb-6 flex justify-between items-center">
            <div className="relative w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
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
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('empId')}
                  >
                    <div className="flex items-center">
                      Employee ID
                      {sortConfig.key === 'empId' && (
                        sortConfig.direction === 'asc' ? 
                        <ChevronUp className="ml-1 w-4 h-4" /> : 
                        <ChevronDown className="ml-1 w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortConfig.key === 'name' && (
                        sortConfig.direction === 'asc' ? 
                        <ChevronUp className="ml-1 w-4 h-4" /> : 
                        <ChevronDown className="ml-1 w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('branch')}
                  >
                    <div className="flex items-center">
                      Branch
                      {sortConfig.key === 'branch' && (
                        sortConfig.direction === 'asc' ? 
                        <ChevronUp className="ml-1 w-4 h-4" /> : 
                        <ChevronDown className="ml-1 w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Leave Credits
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-50">
                {sortedEmployees.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                ).map((employee, index) => (
                  <React.Fragment key={employee.empId}>
                    <tr className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900">
                          {employee.empId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {employee.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {employee.branch}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${employee.leaveCredits.casual.remaining > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            CL: {employee.leaveCredits.casual.remaining}/{employee.leaveCredits.casual.total}
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${employee.leaveCredits.sick.remaining > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            SL: {employee.leaveCredits.sick.remaining}/{employee.leaveCredits.sick.total}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApplyLeave(employee.empId)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Apply Leave
                          </button>
                          <button
                            onClick={() => toggleExpandEmployee(employee.empId)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <Info className="w-4 h-4 mr-2" />
                            {expandedEmployee === employee.empId ? 'Hide' : 'View'}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedEmployee === employee.empId && (
                      <tr className="bg-gray-50">
                        <td colSpan="6" className="px-6 py-4">
                          <div className="grid grid-cols-3 gap-6">
                            {Object.entries(employee.leaveCredits).map(([type, credits]) => (
                              <div key={type} className={`p-4 rounded-xl ${getLeaveTypeColor(type)}`}>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-semibold capitalize">{type} Leave</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${credits.remaining > 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                    {credits.remaining} remaining
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${credits.remaining > 0 ? 'bg-blue-600' : 'bg-red-600'}`} 
                                    style={{ width: `${(credits.used / credits.total) * 100}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                  <span>Used: {credits.used}</span>
                                  <span>Total: {credits.total}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="p-4 flex justify-between items-center bg-white border-t">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * pageSize) + 1} to{' '}
                {Math.min(currentPage * pageSize, filteredEmployees.length)} of{' '}
                {filteredEmployees.length} employees
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => 
                    Math.min(prev + 1, Math.ceil(filteredEmployees.length / pageSize))
                  )}
                  disabled={currentPage === Math.ceil(filteredEmployees.length / pageSize)}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Application Modal */}
      {leaveModalVisible && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-6 h-6 text-gray-700 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Apply for Leave
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setLeaveModalVisible(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Employee Info */}
              {selectedEmployee && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="font-medium text-gray-700 mb-2">Employee Information</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Employee ID</p>
                      <p className="font-medium">{selectedEmployee}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">
                        {employees.find(e => e.empId === selectedEmployee)?.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Leave Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option value="">Select leave type</option>
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="earned">Earned Leave</option>
                  <option value="optional">Optional Holiday</option>
                  <option value="maternity">Maternity Leave</option>
                  <option value="paternity">Paternity Leave</option>
                </select>
              </div>

              {/* Leave Credit Info */}
              {leaveCreditInfo && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center mb-3">
                    <Info className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-medium">Leave Credit Information</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Total Days</p>
                      <p className="text-lg font-bold">{leaveCreditInfo.total}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Used Days</p>
                      <p className="text-lg font-bold">{leaveCreditInfo.used}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Remaining Days</p>
                      <p className="text-lg font-bold text-green-600">{leaveCreditInfo.remaining}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${leaveCreditInfo.remaining > 0 ? 'bg-blue-600' : 'bg-red-600'}`} 
                      style={{ width: `${(leaveCreditInfo.used / leaveCreditInfo.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Selection <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setDateSelectionType('single')}
                    className={`px-4 py-2 rounded-lg ${dateSelectionType === 'single' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
                  >
                    Single Day
                  </button>
                  <button
                    onClick={() => setDateSelectionType('multiple')}
                    className={`px-4 py-2 rounded-lg ${dateSelectionType === 'multiple' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
                  >
                    Multiple Days
                  </button>
                </div>
                {dateSelectionType === 'single' ? (
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200"
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(e.target.valueAsDate, e.target.value)}
                  />
                ) : (
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">From</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200"
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => handleDateChange([e.target.valueAsDate, selectedDates[1]], e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">To</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200"
                        min={selectedDates[0] ? selectedDates[0].toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                        onChange={(e) => handleDateChange([selectedDates[0], e.target.valueAsDate], e.target.value)}
                      />
                    </div>
                  </div>
                )}
                {days > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {days} day{days !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200"
                  placeholder="Enter reason for leave"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => {
                  setLeaveModalVisible(false);
                  resetForm();
                }}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitLeave}
                disabled={!leaveType || days <= 0 || !reason}
                className="px-6 py-3 text-white bg-gradient-to-r from-gray-800 to-black rounded-xl hover:from-gray-900 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Submit Leave Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;