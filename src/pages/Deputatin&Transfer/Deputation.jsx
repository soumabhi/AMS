import React, { useState, useEffect, useMemo } from "react";
import { 
  ChevronDown, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight,
  Search, Filter, FileText, Download, Upload, User, Clock, Calendar, CheckCircle, X, AlertCircle, Edit, Plus
} from 'lucide-react';

const DeputationTable = () => {
  // Sample data - replace with real API data
  const [deputations, setDeputations] = useState([
    {
      id: 1,
      employee: { name: "John Doe", id: "EMP001" },
      baseBranch: "Head Office",
      deputedBranch: "Regional Office - East",
      fromDate: "2023-05-15",
      toDate: "2023-06-15",
      days: 31,
      reportingDate: "2023-05-17",
      status: "Active"
    },
    {
      id: 2,
      employee: { name: "Jane Smith", id: "EMP002" },
      baseBranch: "Regional Office - West",
      deputedBranch: "Head Office",
      fromDate: "2023-06-01",
      toDate: "2023-08-31",
      days: 92,
      reportingDate: "2023-06-03",
      status: "Active"
    },
    {
      id: 3,
      employee: { name: "Robert Johnson", id: "EMP003" },
      baseBranch: "Regional Office - North",
      deputedBranch: "Regional Office - South",
      fromDate: "2023-04-10",
      toDate: "2023-04-20",
      days: 10,
      reportingDate: "2023-04-11",
      status: "Completed"
    },
    {
      id: 4,
      employee: { name: "Emily Davis", id: "EMP004" },
      baseBranch: "Head Office",
      deputedBranch: "Regional Office - West",
      fromDate: "2023-07-01",
      toDate: "2023-09-30",
      days: 92,
      reportingDate: "2023-07-05",
      status: "Upcoming"
    },
    {
      id: 5,
      employee: { name: "Michael Brown", id: "EMP005" },
      baseBranch: "Regional Office - South",
      deputedBranch: "Head Office",
      fromDate: "2023-03-15",
      toDate: "2023-03-25",
      days: 10,
      reportingDate: "2023-03-16",
      status: "Completed"
    },
    {
      id: 6,
      employee: { name: "Sarah Wilson", id: "EMP006" },
      baseBranch: "Head Office",
      deputedBranch: "Regional Office - East",
      fromDate: "2023-08-01",
      toDate: "2023-10-31",
      days: 92,
      reportingDate: "2023-08-02",
      status: "Active"
    },
    {
      id: 7,
      employee: { name: "David Taylor", id: "EMP007" },
      baseBranch: "Regional Office - East",
      deputedBranch: "Regional Office - North",
      fromDate: "2023-05-20",
      toDate: "2023-05-30",
      days: 10,
      reportingDate: "2023-05-21",
      status: "Completed"
    },
    {
      id: 8,
      employee: { name: "Jessica Martinez", id: "EMP008" },
      baseBranch: "Regional Office - West",
      deputedBranch: "Head Office",
      fromDate: "2023-09-15",
      toDate: "2023-11-15",
      days: 62,
      reportingDate: "2023-09-18",
      status: "Upcoming"
    },
    {
      id: 9,
      employee: { name: "Thomas Anderson", id: "EMP009" },
      baseBranch: "Head Office",
      deputedBranch: "Regional Office - South",
      fromDate: "2023-06-10",
      toDate: "2023-06-20",
      days: 10,
      reportingDate: "2023-06-11",
      status: "Completed"
    },
    {
      id: 10,
      employee: { name: "Lisa Jackson", id: "EMP010" },
      baseBranch: "Regional Office - North",
      deputedBranch: "Regional Office - West",
      fromDate: "2023-07-05",
      toDate: "2023-09-05",
      days: 63,
      reportingDate: "2023-07-07",
      status: "Active"
    }
  ]);

  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeputation, setNewDeputation] = useState({
    employee: "",
    baseBranch: "",
    deputedBranch: "",
    fromDate: "",
    toDate: "",
    reportingDate: ""
  });

  // Filter deputations based on search and status
  const filteredDeputations = useMemo(() => {
    return deputations.filter(dep => {
      const matchesSearch = 
        dep.employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
        dep.employee.id.toLowerCase().includes(searchText.toLowerCase()) ||
        dep.baseBranch.toLowerCase().includes(searchText.toLowerCase()) ||
        dep.deputedBranch.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesStatus = selectedStatus === "all" || dep.status.toLowerCase() === selectedStatus.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [deputations, searchText, selectedStatus]);

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
    
    setDeputations([
      ...deputations,
      {
        id: deputations.length + 1,
        employee: { name: "New Employee", id: "EMP" + (deputations.length + 1).toString().padStart(3, '0') },
        baseBranch: newDeputation.baseBranch,
        deputedBranch: newDeputation.deputedBranch,
        fromDate: newDeputation.fromDate,
        toDate: newDeputation.toDate,
        days: days,
        reportingDate: newDeputation.reportingDate,
        status: "Upcoming"
      }
    ]);
    
    setShowAddModal(false);
    setNewDeputation({
      employee: "",
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
                            <div className="font-semibold text-gray-900 text-sm">{deputation.employee.name}</div>
                            <div className="text-xs text-gray-500">{deputation.employee.id}</div>
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
                      value={newDeputation.employee}
                      onChange={(e) => setNewDeputation({...newDeputation, employee: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                    >
                      <option value="">Select Employee</option>
                      <option value="EMP001">John Doe (EMP001)</option>
                      <option value="EMP002">Jane Smith (EMP002)</option>
                      <option value="EMP003">Robert Johnson (EMP003)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Base Branch</label>
                    <select
                      value={newDeputation.baseBranch}
                      onChange={(e) => setNewDeputation({...newDeputation, baseBranch: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                    >
                      <option value="">Select Base Branch</option>
                      <option value="Head Office">Head Office</option>
                      <option value="Regional Office - East">Regional Office - East</option>
                      <option value="Regional Office - West">Regional Office - West</option>
                      <option value="Regional Office - North">Regional Office - North</option>
                      <option value="Regional Office - South">Regional Office - South</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Deputed Branch</label>
                    <select
                      value={newDeputation.deputedBranch}
                      onChange={(e) => setNewDeputation({...newDeputation, deputedBranch: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                    >
                      <option value="">Select Deputed Branch</option>
                      <option value="Head Office">Head Office</option>
                      <option value="Regional Office - East">Regional Office - East</option>
                      <option value="Regional Office - West">Regional Office - West</option>
                      <option value="Regional Office - North">Regional Office - North</option>
                      <option value="Regional Office - South">Regional Office - South</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">From Date</label>
                    <input
                      type="date"
                      value={newDeputation.fromDate}
                      onChange={(e) => setNewDeputation({...newDeputation, fromDate: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">To Date</label>
                    <input
                      type="date"
                      value={newDeputation.toDate}
                      onChange={(e) => setNewDeputation({...newDeputation, toDate: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Reporting Date</label>
                    <input
                      type="date"
                      value={newDeputation.reportingDate}
                      onChange={(e) => setNewDeputation({...newDeputation, reportingDate: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
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
                  disabled={!newDeputation.employee || !newDeputation.baseBranch || !newDeputation.deputedBranch || !newDeputation.fromDate || !newDeputation.toDate || !newDeputation.reportingDate}
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