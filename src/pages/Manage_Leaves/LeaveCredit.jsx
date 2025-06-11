import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, User, Briefcase, Calendar, Clock, X } from 'lucide-react';
import Toast from '../../components/Toast';

// Generate dummy data
const departments = ['Operations', 'Marketing', 'Finance', 'IT', 'HR', 'Sales', 'Customer Support'];
const positions = ['Manager', 'Executive', 'Analyst', 'Software Engineer', 'Coordinator', 'Director', 'Specialist'];

const generateEmployeeData = () => {
  const employees = [];
  for (let i = 1; i <= 50; i++) {
    const dept = departments[Math.floor(Math.random() * departments.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    
    const sickLeave = {
      total: 12,
      used: Math.floor(Math.random() * 8),
    };
    const casualLeave = {
      total: 15,
      used: Math.floor(Math.random() * 10),
    };
    const maternityLeave = {
      total: 180,
      used: Math.floor(Math.random() * 120),
    };
    
    employees.push({
      sl_no: i,
      emp_id: `EMP${1000 + i}`,
      name: `Employee ${i}`,
      department: dept,
      designation: position,
      sick_leave: {
        ...sickLeave,
        remaining: sickLeave.total - sickLeave.used,
      },
      casual_leave: {
        ...casualLeave,
        remaining: casualLeave.total - casualLeave.used,
      },
      maternity_leave: {
        ...maternityLeave,
        remaining: maternityLeave.total - maternityLeave.used,
      },
      join_date: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1)
        .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    });
  }
  return employees;
};

const leaveData = generateEmployeeData();
const ITEMS_PER_PAGE = 10;

const LeaveCreditManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'sl_no', direction: 'asc' });
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  const [hoveredEmployee, setHoveredEmployee] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  // Filter and sort data
  const filteredData = leaveData.filter(emp => {
    const matchesSearch = 
      emp.emp_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'All' || emp.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedData = sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const renderLeaveProgress = (used, total) => {
    const percentage = (used / total) * 100;
    let progressColor = 'from-green-100 to-green-200';
    if (percentage > 75) progressColor = 'from-red-100 to-red-200';
    else if (percentage > 50) progressColor = 'from-yellow-100 to-yellow-200';

    return (
      <div className="w-full h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${progressColor}`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        ></div>
      </div>
    );
  };

  const getDepartmentColor = (department) => {
    switch(department) {
      case 'Operations': return 'bg-gradient-to-r from-gray-500 to-gray-700 text-white';
      case 'Marketing': return 'bg-gradient-to-r from-gray-500 to-gray-700 text-white';
      case 'Finance': return 'bg-gradient-to-r from-gray-500 to-gray-700 text-white';
      case 'IT': return 'bg-gradient-to-r from-gray-500 to-gray-700 text-white';
      case 'HR': return 'bg-gradient-to-r from-gray-500 to-gray-700 text-white';
      case 'Sales': return 'bg-gradient-to-r from-gray-500 to-gray-700 text-white';
      case 'Customer Support': return 'bg-gradient-to-r from-gray-500 to-gray-700 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-700 text-white';
    }
  };

  const handleLeaveCellHover = (employee, e) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    
    if (employee) {
      setHoverTimeout(setTimeout(() => {
        setHoveredEmployee({
          ...employee,
          clientX: e.clientX,
          clientY: e.clientY
        });
      }, 200));
    } else {
      setHoverTimeout(setTimeout(() => {
        setHoveredEmployee(null);
      }, 200));
    }
  };

  const handleLeaveCellClick = (employee) => {
    setHoveredEmployee(employee);
    setShowLeaveModal(true);
  };

  const renderTotalLeaveCell = (employee) => {
    const totalUsed = employee.sick_leave.used + employee.casual_leave.used + employee.maternity_leave.used;
    const totalAvailable = employee.sick_leave.total + employee.casual_leave.total + employee.maternity_leave.total;

    return (
      <div 
        className="flex flex-col items-center cursor-pointer relative"
        onMouseEnter={(e) => handleLeaveCellHover(employee, e)}
        onMouseLeave={() => handleLeaveCellHover(null)}
        onClick={() => handleLeaveCellClick(employee)}
      >
        <div className="text-sm font-medium text-gray-700">
          <span className="text-red-600">{totalUsed}</span>
          <span className="text-gray-400">/</span>
          <span className="text-black">{totalAvailable}</span>
        </div>
      </div>
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

      {/* Leave Details Modal */}
      {showLeaveModal && hoveredEmployee && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{hoveredEmployee.name}</h3>
                  <p className="text-gray-600">{hoveredEmployee.emp_id}</p>
                </div>
                <button 
                  onClick={() => setShowLeaveModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">Sick Leave</h4>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Used: {hoveredEmployee.sick_leave.used} days</span>
                    <span className="text-sm text-gray-600">Total: {hoveredEmployee.sick_leave.total} days</span>
                  </div>
                  {renderLeaveProgress(hoveredEmployee.sick_leave.used, hoveredEmployee.sick_leave.total)}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">Casual Leave</h4>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Used: {hoveredEmployee.casual_leave.used} days</span>
                    <span className="text-sm text-gray-600">Total: {hoveredEmployee.casual_leave.total} days</span>
                  </div>
                  {renderLeaveProgress(hoveredEmployee.casual_leave.used, hoveredEmployee.casual_leave.total)}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">Maternity Leave</h4>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Used: {hoveredEmployee.maternity_leave.used} days</span>
                    <span className="text-sm text-gray-600">Total: {hoveredEmployee.maternity_leave.total} days</span>
                  </div>
                  {renderLeaveProgress(hoveredEmployee.maternity_leave.used, hoveredEmployee.maternity_leave.total)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 backdrop-blur-sm p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl h-10 font-bold bg-black bg-clip-text text-transparent">
                Leave Credit Management
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <User className="w-4 h-4" />
                Manage employee leave balances and allocations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Employees</p>
                <p className="text-2xl font-bold text-gray-800">{leaveData.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-4">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Avg. Sick Leave Used</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(leaveData.reduce((sum, emp) => sum + emp.sick_leave.used, 0) / leaveData.length)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mr-4">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Avg. Casual Leave Used</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(leaveData.reduce((sum, emp) => sum + emp.casual_leave.used, 0) / leaveData.length)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mr-4">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Avg. Maternity Leave Used</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(leaveData.reduce((sum, emp) => sum + emp.maternity_leave.used, 0) / leaveData.length)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200 hover:border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200 hover:border-gray-300"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="All">All Departments</option>
              {[...new Set(leaveData.map(emp => emp.department))].map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('sl_no')}
                  >
                    <div className="flex items-center">
                      <span>#</span>
                      <span className="ml-1">{getSortIndicator('sl_no')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('emp_id')}
                  >
                    <div className="flex items-center">
                      <span>Employee ID</span>
                      <span className="ml-1">{getSortIndicator('emp_id')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      <span>Employee</span>
                      <span className="ml-1">{getSortIndicator('name')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('department')}
                  >
                    <div className="flex items-center">
                      <span>Department</span>
                      <span className="ml-1">{getSortIndicator('department')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('designation')}
                  >
                    <div className="flex items-center">
                      <span>Designation</span>
                      <span className="ml-1">{getSortIndicator('designation')}</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Total Leave
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {selectedData.length > 0 ? (
                  selectedData.map((emp) => (
                    <tr 
                      key={emp.emp_id} 
                      className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {emp.sl_no}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                        {emp.emp_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{emp.name}</div>
                        <div className="text-xs text-gray-500">{emp.join_date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getDepartmentColor(emp.department)}`}>
                          {emp.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {emp.designation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderTotalLeaveCell(emp)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="text-center">
                        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                          <User className="w-12 h-12 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {selectedData.length > 0 && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                <span className="font-semibold">{Math.min(startIndex + ITEMS_PER_PAGE, sortedData.length)}</span> of{' '}
                <span className="font-semibold">{sortedData.length}</span> employees
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronsLeft className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-gray-800 to-black text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronsRight className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredEmployee && !showLeaveModal && (
        <div className="fixed bg-white shadow-xl rounded-xl p-2 border border-gray-200 z-50 pointer-events-none"
          style={{
            left: `${Math.min(hoveredEmployee.clientX + 10, window.innerWidth - 100)}px`,
            top: `${Math.min(hoveredEmployee.clientY + 10, window.innerHeight - 100)}px`,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="space-y-2 min-w-[180px]">
            <div>
              <h4 className="font-semibold text-black text-sm">Sick Leave</h4>
              <div className="text-xs text-gray-600">
                {hoveredEmployee.sick_leave.used}/{hoveredEmployee.sick_leave.total} days
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-black text-sm">Casual Leave</h4>
              <div className="text-xs text-gray-600">
                {hoveredEmployee.casual_leave.used}/{hoveredEmployee.casual_leave.total} days
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-black text-sm">Maternity Leave</h4>
              <div className="text-xs text-gray-600">
                {hoveredEmployee.maternity_leave.used}/{hoveredEmployee.maternity_leave.total} days
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveCreditManagement;