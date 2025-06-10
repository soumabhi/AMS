import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Plus, Clock, Calendar, User, Briefcase, Building, Sun, Moon, Star, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Toast from '../../components/Toast';

const AttendancePage = () => {
  const initialEmployees = [
    { slNo: 1, empId: 'EMP001', empName: 'John Doe', designation: 'Developer', departmentId: 'DEPT001', branch: 'Head Office', shift: 'Morning', date: '2023-05-01', inTime: '09:00 AM', flagTime: '09:15 AM', outTime: '05:00 PM', duration: '8h 0m', flags: 'None', status: 'Present' },
    { slNo: 2, empId: 'EMP002', empName: 'Jane Smith', designation: 'Manager', departmentId: 'DEPT002', branch: 'North Branch', shift: 'Morning', date: '2023-05-01', inTime: '08:45 AM', flagTime: '09:00 AM', outTime: '05:30 PM', duration: '8h 45m', flags: 'Late', status: 'Present' },
    { slNo: 3, empId: 'EMP003', empName: 'Robert Johnson', designation: 'Designer', departmentId: 'DEPT003', branch: 'East Branch', shift: 'Morning', date: '2023-05-01', inTime: '--', flagTime: '--', outTime: '--', duration: '0h 0m', flags: 'Absent', status: 'Absent' },
    { slNo: 4, empId: 'EMP004', empName: 'Sarah Taylor', designation: 'Designer', departmentId: 'DEPT004', branch: 'South Branch', shift: 'Evening', date: '2023-05-01', inTime: '09:15 AM', flagTime: '09:30 AM', outTime: '06:00 PM', duration: '8h 45m', flags: 'Late', status: 'Present' },
    { slNo: 5, empId: 'EMP005', empName: 'Daniel Harris', designation: 'Analyst', departmentId: 'DEPT001', branch: 'West Branch', shift: 'Morning', date: '2023-05-01', inTime: '08:00 AM', flagTime: '08:10 AM', outTime: '04:15 PM', duration: '8h 15m', flags: 'Late', status: 'Present' },
    { slNo: 6, empId: 'EMP006', empName: 'Laura Martinez', designation: 'Tester', departmentId: 'DEPT004', branch: 'Head Office', shift: 'Night', date: '2023-05-01', inTime: '08:30 AM', flagTime: '08:30 AM', outTime: '05:15 PM', duration: '8h 45m', flags: 'None', status: 'Present' },
    { slNo: 7, empId: 'EMP007', empName: 'James Anderson', designation: 'Tester', departmentId: 'DEPT002', branch: 'West Branch', shift: 'Night', date: '2023-05-01', inTime: '--', flagTime: '--', outTime: '--', duration: '0h 0m', flags: 'Absent', status: 'Absent' },
    { slNo: 8, empId: 'EMP008', empName: 'Linda Thomas', designation: 'Manager', departmentId: 'DEPT003', branch: 'North Branch', shift: 'Night', date: '2023-05-01', inTime: '09:00 AM', flagTime: '09:15 AM', outTime: '05:15 PM', duration: '8h 15m', flags: 'Late', status: 'Present' },
    { slNo: 9, empId: 'EMP009', empName: 'Christopher Moore', designation: 'Developer', departmentId: 'DEPT004', branch: 'North Branch', shift: 'Night', date: '2023-05-01', inTime: '09:45 AM', flagTime: '09:50 AM', outTime: '05:45 PM', duration: '8h 0m', flags: 'Late', status: 'Present' },
    { slNo: 10, empId: 'EMP010', empName: 'Barbara Jackson', designation: 'Tester', departmentId: 'DEPT002', branch: 'East Branch', shift: 'Night', date: '2023-05-01', inTime: '09:30 AM', flagTime: '09:30 AM', outTime: '05:30 PM', duration: '8h 0m', flags: 'None', status: 'Present' },
    { slNo: 11, empId: 'EMP011', empName: 'Matthew White', designation: 'Analyst', departmentId: 'DEPT001', branch: 'South Branch', shift: 'Morning', date: '2023-05-01', inTime: '09:45 AM', flagTime: '09:45 AM', outTime: '05:45 PM', duration: '8h 0m', flags: 'None', status: 'Present' },
    { slNo: 12, empId: 'EMP012', empName: 'Jennifer Martin', designation: 'Manager', departmentId: 'DEPT005', branch: 'North Branch', shift: 'Morning', date: '2023-05-01', inTime: '09:45 AM', flagTime: '09:50 AM', outTime: '06:30 PM', duration: '8h 45m', flags: 'Late', status: 'Present' },
    { slNo: 13, empId: 'EMP013', empName: 'Anthony Thompson', designation: 'Analyst', departmentId: 'DEPT002', branch: 'Head Office', shift: 'Morning', date: '2023-05-01', inTime: '08:45 AM', flagTime: '08:50 AM', outTime: '05:00 PM', duration: '8h 15m', flags: 'Late', status: 'Present' },
    { slNo: 14, empId: 'EMP014', empName: 'Susan Garcia', designation: 'Analyst', departmentId: 'DEPT005', branch: 'Head Office', shift: 'Evening', date: '2023-05-01', inTime: '08:30 AM', flagTime: '08:45 AM', outTime: '05:00 PM', duration: '8h 30m', flags: 'Late', status: 'Present' },
    { slNo: 15, empId: 'EMP015', empName: 'Joshua Martinez', designation: 'Tester', departmentId: 'DEPT004', branch: 'Head Office', shift: 'Evening', date: '2023-05-01', inTime: '09:15 AM', flagTime: '09:30 AM', outTime: '05:30 PM', duration: '8h 15m', flags: 'Late', status: 'Present' },
  ];

  const [employees] = useState(initialEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState(initialEmployees);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate] = useState('2023-05-01');
  const [exportFormat, setExportFormat] = useState('csv');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedShift, setSelectedShift] = useState('All Shifts');
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  const itemsPerPage = 10;

  const branchOptions = ['All Branches', ...new Set(initialEmployees.map(emp => emp.branch))];
  const shiftOptions = ['All Shifts', 'Morning', 'Evening', 'Night'];

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const filterEmployees = (term, branch, shift) => {
    const lowercasedTerm = term.toLowerCase();
    const filtered = initialEmployees.filter(emp => 
      (emp.empId.toLowerCase().includes(lowercasedTerm) || 
      emp.empName.toLowerCase().includes(lowercasedTerm) ||
      emp.designation.toLowerCase().includes(lowercasedTerm) ||
      emp.departmentId.toLowerCase().includes(lowercasedTerm)) &&
      (branch === 'All Branches' || emp.branch === branch) &&
      (shift === 'All Shifts' || emp.shift === shift)
    );
    setFilteredEmployees(filtered);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterEmployees(term, selectedBranch, selectedShift);
  };

  const handleBranchChange = (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);
    filterEmployees(searchTerm, branch, selectedShift);
  };

  const handleShiftChange = (e) => {
    const shift = e.target.value;
    setSelectedShift(shift);
    filterEmployees(searchTerm, selectedBranch, shift);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginationRange = () => {
    const totalPageCount = totalPages;
    const currentPageNumber = currentPage;
    const siblingCount = 1;
    const DOTS = '...';

    const range = (start, end) => {
      let length = end - start + 1;
      return Array.from({ length }, (_, idx) => idx + start);
    };

    if (totalPageCount <= 5) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPageNumber - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPageNumber + siblingCount,
      totalPageCount
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [1, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, DOTS, ...middleRange, DOTS, totalPageCount];
    }
  };

  const exportToCSV = () => {
    return filteredEmployees.map(emp => ({
      'SL No': emp.slNo,
      'Employee ID': emp.empId,
      'Employee Name': emp.empName,
      'Designation': emp.designation,
      'Branch': emp.branch,
      'Shift': emp.shift,
      'Date': emp.date,
      'In Time': emp.inTime,
      'Out Time': emp.outTime,
      'Duration': emp.duration,
      'Flags': emp.flags,
      'Status': emp.status
    }));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportToCSV());
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `attendance_${selectedDate}.xlsx`);
    showToast('Excel exported successfully');
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    doc.text(`Employee Attendance - ${selectedDate}`, 14, 16);

    const headers = [
      'SL No', 'Employee ID', 'Name', 'Designation', 'Branch', 'Shift', 'Date',
      'In Time', 'Out Time', 'Duration', 'Flags', 'Status'
    ];

    const data = filteredEmployees.map(emp => [
      emp.slNo, emp.empId, emp.empName, emp.designation, emp.branch, emp.shift,
      emp.date, emp.inTime, emp.outTime, emp.duration, emp.flags, emp.status
    ]);

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] }
    });

    doc.save(`attendance_${selectedDate}.pdf`);
    showToast('PDF exported successfully');
  };

  const handleExport = () => {
    if (exportFormat === 'excel') {
      exportToExcel();
    } else if (exportFormat === 'pdf') {
      exportToPDF();
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'Present': return 'bg-green-100 text-green-800 border-green-200';
      case 'Absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'Half Day': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Leave': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Present': return <CheckCircle className="w-4 h-4" />;
      case 'Absent': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getFlagBadgeColor = (flag) => {
    if (flag === 'Late') return 'bg-amber-100 text-amber-800 border-amber-200';
    if (flag === 'Absent') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getShiftIcon = (shift) => {
    switch(shift) {
      case 'Morning': return <Sun className="w-4 h-4" />;
      case 'Evening': return <Moon className="w-4 h-4" />;
      case 'Night': return <Star className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getShiftBadgeColor = (shift) => {
    switch(shift) {
      case 'Morning': return 'bg-blue-50 text-blue-800 border-blue-100';
      case 'Evening': return 'bg-purple-50 text-purple-800 border-purple-100';
      case 'Night': return 'bg-gray-800 text-white border-gray-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl h-10 font-bold bg-black bg-clip-text text-transparent">
                Attendance Management
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                View and manage employee attendance records
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Records</p>
                <p className="text-2xl font-bold text-gray-800">{filteredEmployees.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={selectedBranch}
                    onChange={handleBranchChange}
                    className="appearance-none block pl-10 pr-8 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 bg-white transition-all duration-200"
                  >
                    {branchOptions.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={selectedShift}
                    onChange={handleShiftChange}
                    className="appearance-none block pl-10 pr-8 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 bg-white transition-all duration-200"
                  >
                    {shiftOptions.map((shift) => (
                      <option key={shift} value={shift}>
                        {shift}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="flex items-center">
                <label htmlFor="date" className="mr-2 text-sm text-gray-600">
                  Date:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    className="block pl-10 pr-3 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 bg-white transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="appearance-none block pl-3 pr-8 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 bg-white transition-all duration-200"
                  >
                    <option value="csv">CSV</option>
                  
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <Download className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {exportFormat === "csv" ? (
                  <CSVLink
                    data={exportToCSV()}
                    filename={`attendance_${selectedDate}.csv`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                  >
                    Export
                  </CSVLink>
                ) : (
                  <button
                    onClick={handleExport}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                  >
                    Export
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Employee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Shift
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      In Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Out Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Flags
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {currentItems.length > 0 ? (
                    currentItems.map((emp) => (
                      <tr key={emp.empId} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {emp.slNo}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{emp.empName}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Briefcase className="w-3 h-3" /> {emp.designation}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Building className="w-3 h-3" /> {emp.branch}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getShiftBadgeColor(emp.shift)}`}>
                            {getShiftIcon(emp.shift)}
                            <span className="ml-1">{emp.shift}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {emp.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {emp.inTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {emp.outTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {emp.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getFlagBadgeColor(emp.flags)}`}>
                            {emp.flags}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(emp.status)}`}>
                            {getStatusIcon(emp.status)}
                            <span className="ml-1">{emp.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-gray-600 hover:text-gray-900">
                            <Plus className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="px-6 py-16 text-center">
                        <div className="text-center">
                          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                            <User className="w-12 h-12 text-gray-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No records found</h3>
                          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredEmployees.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredEmployees.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {paginationRange().map((pageNumber, index) => {
                      if (pageNumber === '...') {
                        return (
                          <span
                            key={index}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                          >
                            ...
                          </span>
                        );
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handlePageChange(Number(pageNumber))}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNumber
                              ? 'z-10 bg-gray-100 border-gray-300 text-gray-800'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;