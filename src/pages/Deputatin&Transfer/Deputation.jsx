import React, { useState, useEffect, useMemo } from "react";
import { 
  ChevronDown, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight,
  Search, Filter, FileText, Download, Upload, User, Clock, Calendar, CheckCircle, X, AlertCircle, Edit, Plus
} from 'lucide-react';

const DeputationTable = () => {
  // Start with empty array instead of mock data
  const [deputations, setDeputations] = useState([]);
  const [employees, setEmployees] = useState([
    { id: "EMP001", name: "John Doe" },
    { id: "EMP002", name: "Jane Smith" },
    { id: "EMP003", name: "Robert Johnson" },
    { id: "EMP004", name: "Emily Davis" },
    { id: "EMP005", name: "Michael Brown" }
  ]);
  
  const branches = [
    "Head Office",
    "Regional Office - East",
    "Regional Office - West",
    "Regional Office - North",
    "Regional Office - South"
  ];

  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeputation, setNewDeputation] = useState({
    employeeId: "",
    baseBranch: "",
    deputedBranch: "",
    fromDate: "",
    toDate: "",
    reportingDate: ""
  });

  // Filter deputations based on search and status
  const filteredDeputations = useMemo(() => {
    return deputations.filter(dep => {
      const employee = employees.find(emp => emp.id === dep.employeeId);
      const employeeName = employee ? employee.name : "";
      
      const matchesSearch = 
        employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
        dep.employeeId.toLowerCase().includes(searchText.toLowerCase()) ||
        dep.baseBranch.toLowerCase().includes(searchText.toLowerCase()) ||
        dep.deputedBranch.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesStatus = selectedStatus === "all" || dep.status.toLowerCase() === selectedStatus.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [deputations, employees, searchText, selectedStatus]);

  // Pagination calculations
  const paginationData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const totalPages = Math.ceil(filteredDeputations.length / pageSize);
    const paginatedDeputations = filteredDeputations.slice(startIndex, endIndex);

    return {
      startIndex,
      endIndex,
      totalPages,
      paginatedDeputations
    };
  }, [filteredDeputations, currentPage, pageSize]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200";
      case "completed":
        return "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200";
      case "upcoming":
        return "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200";
    }
  };

  // Add new deputation
  const handleAddDeputation = () => {
    // Calculate days between from and to date
    const fromDate = new Date(newDeputation.fromDate);
    const toDate = new Date(newDeputation.toDate);
    const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
    
    // Determine status based on dates
    const today = new Date();
    let status = "upcoming";
    if (fromDate <= today && toDate >= today) {
      status = "active";
    } else if (toDate < today) {
      status = "completed";
    }
    
    const newEntry = {
      id: Date.now(), // Use timestamp as unique ID
      employeeId: newDeputation.employeeId,
      baseBranch: newDeputation.baseBranch,
      deputedBranch: newDeputation.deputedBranch,
      fromDate: newDeputation.fromDate,
      toDate: newDeputation.toDate,
      days: days,
      reportingDate: newDeputation.reportingDate,
      status: status
    };
    
    setDeputations([...deputations, newEntry]);
    
    setShowAddModal(false);
    setNewDeputation({
      employeeId: "",
      baseBranch: "",
      deputedBranch: "",
      fromDate: "",
      toDate: "",
      reportingDate: ""
    });
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get employee name by ID
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : "Unknown Employee";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4">
      <div className="flex-1">
        <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl shadow-xl p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Deputation Management</h1>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search deputations..."
                  className="w-48 px-3 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-xl shadow-sm hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-16">SL</th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-40">Employee</th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-32">Base Branch</th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-32">Deputed Branch</th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-28">From Date</th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-28">To Date</th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-20">Days</th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-28">Reporting</th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-24">Status</th>
                  </tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginationData.paginatedDeputations.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-16 text-center">
                        <div className="text-center">
                          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                            <User className="w-12 h-12 text-gray-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No deputations found</h3>
                          <p className="text-gray-500">Try adjusting your search criteria or add new deputations.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginationData.paginatedDeputations.map((deputation, index) => (
                      <tr key={deputation.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="w-6 h-6 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {paginationData.startIndex + index + 1}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{getEmployeeName(deputation.employeeId)}</div>
                            <div className="text-xs text-gray-500">{deputation.employeeId}</div>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div className="truncate" title={deputation.baseBranch}>
                            {deputation.baseBranch.replace('Regional Office - ', 'RO - ')}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div className="truncate" title={deputation.deputedBranch}>
                            {deputation.deputedBranch.replace('Regional Office - ', 'RO - ')}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-500" />
                            <span className="text-xs">{formatDate(deputation.fromDate)}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-500" />
                            <span className="text-xs">{formatDate(deputation.toDate)}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span className="text-xs">{deputation.days}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-500" />
                            <span className="text-xs">{formatDate(deputation.reportingDate)}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(deputation.status)}`}>
                            {deputation.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {paginationData.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === paginationData.totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(paginationData.totalPages)}
                disabled={currentPage === paginationData.totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Deputation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Add New Deputation</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-auto max-h-[70vh]">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Employee</label>
                    <select
                      value={newDeputation.employeeId}
                      onChange={(e) => setNewDeputation({...newDeputation, employeeId: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                      required
                    >
                      <option value="">Select Employee</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} ({employee.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Base Branch</label>
                    <select
                      value={newDeputation.baseBranch}
                      onChange={(e) => setNewDeputation({...newDeputation, baseBranch: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                      required
                    >
                      <option value="">Select Base Branch</option>
                      {branches.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Deputed Branch</label>
                    <select
                      value={newDeputation.deputedBranch}
                      onChange={(e) => setNewDeputation({...newDeputation, deputedBranch: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                      required
                    >
                      <option value="">Select Deputed Branch</option>
                      {branches.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">From Date</label>
                    <input
                      type="date"
                      value={newDeputation.fromDate}
                      onChange={(e) => setNewDeputation({...newDeputation, fromDate: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">To Date</label>
                    <input
                      type="date"
                      value={newDeputation.toDate}
                      onChange={(e) => setNewDeputation({...newDeputation, toDate: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Reporting Date</label>
                    <input
                      type="date"
                      value={newDeputation.reportingDate}
                      onChange={(e) => setNewDeputation({...newDeputation, reportingDate: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDeputation}
                  disabled={!newDeputation.employeeId || !newDeputation.baseBranch || !newDeputation.deputedBranch || !newDeputation.fromDate || !newDeputation.toDate || !newDeputation.reportingDate}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-xl hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Add Deputation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeputationTable;