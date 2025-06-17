import React, { useState, useEffect, useMemo } from "react";
import { 
  ChevronDown, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight,
  Search, Filter, FileText, Download, Upload, User, Clock, Calendar, CheckCircle, X, AlertCircle, Edit, Plus
} from 'lucide-react';

const TransferTable = () => {
  // Initialize with empty array instead of mock data
  const [transfers, setTransfers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransfer, setNewTransfer] = useState({
    empId: "",
    empName: "",
    fromBranch: "",
    toBranch: "",
    dateOfReporting: "",
    actualDateOfReporting: ""
  });

  // Generate unique ID for new transfers
  const generateId = () => {
    return Date.now(); // Using timestamp as a simple unique ID
  };

  // Filter transfers based on search and status
  const filteredTransfers = useMemo(() => {
    return transfers.filter(transfer => {
      const matchesSearch = 
        transfer.empName.toLowerCase().includes(searchText.toLowerCase()) ||
        transfer.empId.toLowerCase().includes(searchText.toLowerCase()) ||
        transfer.fromBranch.toLowerCase().includes(searchText.toLowerCase()) ||
        transfer.toBranch.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesStatus = selectedStatus === "all" || transfer.status.toLowerCase() === selectedStatus.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [transfers, searchText, selectedStatus]);

  // Pagination calculations
  const paginationData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const totalPages = Math.ceil(filteredTransfers.length / pageSize);
    const paginatedTransfers = filteredTransfers.slice(startIndex, endIndex);

    return {
      startIndex,
      endIndex,
      totalPages,
      paginatedTransfers
    };
  }, [filteredTransfers, currentPage, pageSize]);

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
      case "completed":
        return "bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200";
      case "pending":
        return "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200";
      case "cancelled":
        return "bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200";
    }
  };

  // Add new transfer
  const handleAddTransfer = () => {
    if (!newTransfer.empId || !newTransfer.empName || !newTransfer.fromBranch || !newTransfer.toBranch || !newTransfer.dateOfReporting) {
      return; // Don't add if required fields are empty
    }
    
    const status = newTransfer.actualDateOfReporting ? "Completed" : "Pending";
    
    const transferToAdd = {
      id: generateId(),
      empId: newTransfer.empId,
      empName: newTransfer.empName,
      fromBranch: newTransfer.fromBranch,
      toBranch: newTransfer.toBranch,
      dateOfReporting: newTransfer.dateOfReporting,
      actualDateOfReporting: newTransfer.actualDateOfReporting || null,
      status: status
    };
    
    setTransfers([...transfers, transferToAdd]);
    setShowAddModal(false);
    setNewTransfer({
      empId: "",
      empName: "",
      fromBranch: "",
      toBranch: "",
      dateOfReporting: "",
      actualDateOfReporting: ""
    });
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not reported";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Check if reporting is delayed
  const isDelayed = (dateOfReporting, actualDateOfReporting) => {
    if (!actualDateOfReporting) return false;
    const expected = new Date(dateOfReporting);
    const actual = new Date(actualDateOfReporting);
    return actual > expected;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4">
      <div className="flex-1">
        <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl shadow-xl p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Transfer Management</h1>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search transfers..."
                  className="w-48 px-3 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-xl shadow-sm hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transfer
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-16">SL</th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-24">Emp ID</th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-40">Emp Name</th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-32">From Branch</th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-32">To Branch</th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-32">Date of Reporting</th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-32">Actual Date</th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-24">Status</th>
                  </tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginationData.paginatedTransfers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-16 text-center">
                        <div className="text-center">
                          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                            <User className="w-12 h-12 text-gray-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No transfers found</h3>
                          <p className="text-gray-500">
                            {transfers.length === 0 
                              ? "Add your first transfer using the 'Add Transfer' button above." 
                              : "Try adjusting your search criteria."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginationData.paginatedTransfers.map((transfer, index) => (
                      <tr key={transfer.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="w-6 h-6 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {paginationData.startIndex + index + 1}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="font-semibold text-gray-900 text-sm">{transfer.empId}</div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="font-semibold text-gray-900 text-sm">{transfer.empName}</div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div className="truncate" title={transfer.fromBranch}>
                            {transfer.fromBranch.replace('Regional Office - ', 'RO - ')}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div className="truncate" title={transfer.toBranch}>
                            {transfer.toBranch.replace('Regional Office - ', 'RO - ')}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-500" />
                            <span className="text-xs">{formatDate(transfer.dateOfReporting)}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <Calendar className={`w-3 h-3 ${isDelayed(transfer.dateOfReporting, transfer.actualDateOfReporting) ? 'text-red-500' : 'text-gray-500'}`} />
                            <span className={`text-xs ${isDelayed(transfer.dateOfReporting, transfer.actualDateOfReporting) ? 'text-red-600 font-medium' : ''}`}>
                              {formatDate(transfer.actualDateOfReporting)}
                            </span>
                            {isDelayed(transfer.dateOfReporting, transfer.actualDateOfReporting) && (
                              <AlertCircle className="w-3 h-3 text-red-500 ml-1" title="Delayed reporting" />
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transfer.status)}`}>
                            {transfer.status}
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
          {transfers.length > 0 && (
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
          )}
        </div>
      </div>

      {/* Add Transfer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Add New Transfer</h3>
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
                    <label className="block text-sm font-medium text-gray-700">Employee ID*</label>
                    <input
                      type="text"
                      value={newTransfer.empId}
                      onChange={(e) => setNewTransfer({...newTransfer, empId: e.target.value})}
                      placeholder="Enter Employee ID"
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Employee Name*</label>
                    <input
                      type="text"
                      value={newTransfer.empName}
                      onChange={(e) => setNewTransfer({...newTransfer, empName: e.target.value})}
                      placeholder="Enter Employee Name"
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">From Branch*</label>
                    <select
                      value={newTransfer.fromBranch}
                      onChange={(e) => setNewTransfer({...newTransfer, fromBranch: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                      required
                    >
                      <option value="">Select From Branch</option>
                      <option value="Head Office">Head Office</option>
                      <option value="Regional Office - East">Regional Office - East</option>
                      <option value="Regional Office - West">Regional Office - West</option>
                      <option value="Regional Office - North">Regional Office - North</option>
                      <option value="Regional Office - South">Regional Office - South</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">To Branch*</label>
                    <select
                      value={newTransfer.toBranch}
                      onChange={(e) => setNewTransfer({...newTransfer, toBranch: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                      required
                    >
                      <option value="">Select To Branch</option>
                      <option value="Head Office">Head Office</option>
                      <option value="Regional Office - East">Regional Office - East</option>
                      <option value="Regional Office - West">Regional Office - West</option>
                      <option value="Regional Office - North">Regional Office - North</option>
                      <option value="Regional Office - South">Regional Office - South</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Date of Reporting*</label>
                    <input
                      type="date"
                      value={newTransfer.dateOfReporting}
                      onChange={(e) => setNewTransfer({...newTransfer, dateOfReporting: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Actual Date of Reporting</label>
                    <input
                      type="date"
                      value={newTransfer.actualDateOfReporting}
                      onChange={(e) => setNewTransfer({...newTransfer, actualDateOfReporting: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500">Leave empty if not yet reported</p>
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
                  onClick={handleAddTransfer}
                  disabled={!newTransfer.empId || !newTransfer.empName || !newTransfer.fromBranch || !newTransfer.toBranch || !newTransfer.dateOfReporting}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-xl hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Add Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferTable;