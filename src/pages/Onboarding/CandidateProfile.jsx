import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Eye, Plus, ChevronRight, Home, Search, AlertCircle, X, Filter, ChevronLeft, Mail, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Toast Component
const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 max-w-sm w-full p-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform";
    return `${baseStyles} bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300`;
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-3 text-gray-600 hover:text-gray-800 focus:outline-none">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-3 border-t border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Show:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 border border-gray-400 rounded-md text-sm bg-gradient-to-b from-white to-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600"
          >
            <option value={5}>5</option>
            <option value={8}>8</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-2 py-1 text-sm font-medium text-gray-500 bg-gradient-to-b from-white to-gray-100 border border-gray-400 rounded-l-md hover:bg-gradient-to-b hover:from-gray-100 hover:to-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-2 py-1 text-sm font-medium border-t border-b border-gray-400 ${
              page === currentPage
                ? 'bg-gradient-to-r from-gray-800 to-black text-white border-gray-800'
                : page === '...'
                ? 'text-gray-400 cursor-default bg-gradient-to-b from-white to-gray-100'
                : 'text-gray-700 bg-gradient-to-b from-white to-gray-100 hover:bg-gradient-to-b hover:from-gray-100 hover:to-gray-200'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-2 py-1 text-sm font-medium text-gray-500 bg-gradient-to-b from-white to-gray-100 border border-gray-400 rounded-r-md hover:bg-gradient-to-b hover:from-gray-100 hover:to-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

// Mock Data Service
const candidateService = {
  getMockData() {
    return [
      {
        id: 1,
        name: 'Rajan Kumar',
        email: 'rajan.kumar@email.com',
        contactNumber: '+91 8522452258',
        applyingFor: 'Software Engineer',
        status: 'Under Review',
        appliedDate: '2024-05-15',
        experience: '3 years',
        location: 'Bangalore'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        contactNumber: '+1 (555) 987-6543',
        applyingFor: 'UI/UX Designer',
        status: 'Shortlisted',
        appliedDate: '2024-05-14',
        experience: '5 years',
        location: 'New York'
      },
      {
        id: 3,
        name: 'Michael Brown',
        email: 'michael.b@email.com',
        contactNumber: '+1 (555) 456-7890',
        applyingFor: 'Data Analyst',
        status: 'Interview Scheduled',
        appliedDate: '2024-05-13',
        experience: '2 years',
        location: 'California'
      },
      {
        id: 4,
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        contactNumber: '+91 9876543210',
        applyingFor: 'Full Stack Developer',
        status: 'Under Review',
        appliedDate: '2024-05-12',
        experience: '4 years',
        location: 'Mumbai'
      },
      {
        id: 5,
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        contactNumber: '+1 (555) 234-5678',
        applyingFor: 'Product Manager',
        status: 'Final Round',
        appliedDate: '2024-05-11',
        experience: '6 years',
        location: 'Seattle'
      },
      {
        id: 6,
        name: 'Lisa Chen',
        email: 'lisa.chen@email.com',
        contactNumber: '+1 (555) 345-6789',
        applyingFor: 'DevOps Engineer',
        status: 'Shortlisted',
        appliedDate: '2024-05-10',
        experience: '4 years',
        location: 'Toronto'
      },
      {
        id: 7,
        name: 'Amit Patel',
        email: 'amit.patel@email.com',
        contactNumber: '+91 7654321098',
        applyingFor: 'QA Engineer',
        status: 'Under Review',
        appliedDate: '2024-05-09',
        experience: '3 years',
        location: 'Pune'
      },
      {
        id: 8,
        name: 'Emma Thompson',
        email: 'emma.t@email.com',
        contactNumber: '+1 (555) 567-8901',
        applyingFor: 'Marketing Manager',
        status: 'Interview Scheduled',
        appliedDate: '2024-05-08',
        experience: '5 years',
        location: 'London'
      },
      {
        id: 9,
        name: 'Rajesh Singh',
        email: 'rajesh.singh@email.com',
        contactNumber: '+91 9123456789',
        applyingFor: 'Tech Lead',
        status: 'Final Round',
        appliedDate: '2024-05-07',
        experience: '7 years',
        location: 'Delhi'
      },
      {
        id: 10,
        name: 'Jennifer Davis',
        email: 'jennifer.d@email.com',
        contactNumber: '+1 (555) 678-9012',
        applyingFor: 'Business Analyst',
        status: 'Shortlisted',
        appliedDate: '2024-05-06',
        experience: '4 years',
        location: 'Chicago'
      },
      {
        id: 11,
        name: 'Karthik Reddy',
        email: 'karthik.reddy@email.com',
        contactNumber: '+91 8765432109',
        applyingFor: 'Frontend Developer',
        status: 'Under Review',
        appliedDate: '2024-05-05',
        experience: '2 years',
        location: 'Hyderabad'
      },
      {
        id: 12,
        name: 'Maria Rodriguez',
        email: 'maria.r@email.com',
        contactNumber: '+1 (555) 789-0123',
        applyingFor: 'HR Manager',
        status: 'Interview Scheduled',
        appliedDate: '2024-05-04',
        experience: '6 years',
        location: 'Miami'
      }
    ];
  },

  searchMockData(searchTerm, filters = {}) {
    const data = this.getMockData();
    
    if (!searchTerm.trim() && Object.keys(filters).length === 0) {
      return data;
    }

    return data.filter(candidate => {
      const searchMatch = !searchTerm.trim() || [
        candidate.name.split(' ')[0], // First name filtering
        candidate.applyingFor,
        candidate.contactNumber,
        candidate.email,
        candidate.location
      ].some(field => 
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const filterMatch = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (key === 'position') {
          return candidate.applyingFor?.toLowerCase().includes(value.toLowerCase());
        }
        return candidate[key]?.toLowerCase().includes(value.toLowerCase());
      });

      return searchMatch && filterMatch;
    });
  }
};

const CandidateProfile = () => {
  const navigate = useNavigate();
  const [allCandidates, setAllCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filters, setFilters] = useState({
    status: '',
    position: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
  }, []);

  useEffect(() => {
    const mockData = candidateService.getMockData();
    setAllCandidates(mockData);
    setFilteredCandidates(mockData);
  }, []);

  // Filter and search logic
  useEffect(() => {
    const filtered = candidateService.searchMockData(searchTerm, filters);
    setFilteredCandidates(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, filters]);

  // Get current page data
  const getCurrentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCandidates.slice(startIndex, endIndex);
  }, [filteredCandidates, currentPage, itemsPerPage]);

  const handleAddCandidate = () => {
    navigate('/AddCandidate');
  };

  const handleViewDetails = (candidate) => {
    showMessage('info', `Viewing details for ${candidate.name}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilters({ status: '', position: '' });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Under Review': 'bg-gradient-to-r from-amber-100 to-yellow-200 text-amber-800 border border-amber-300',
      'Shortlisted': 'bg-gradient-to-r from-blue-100 to-cyan-200 text-blue-800 border border-blue-300',
      'Interview Scheduled': 'bg-gradient-to-r from-purple-100 to-indigo-200 text-purple-800 border border-purple-300',
      'Final Round': 'bg-gradient-to-r from-emerald-100 to-teal-200 text-emerald-800 border border-emerald-300',
      'Rejected': 'bg-gradient-to-r from-red-100 to-pink-200 text-red-800 border border-red-300'
    };
    return colors[status] || 'bg-gradient-to-r from-gray-100 to-slate-200 text-gray-800 border border-gray-300';
  };

  const getAvatarGradient = (name) => {
    const gradients = [
      'bg-gradient-to-br from-pink-300 to-rose-400',
      'bg-gradient-to-br from-blue-300 to-indigo-400',
      'bg-gradient-to-br from-green-300 to-emerald-400',
      'bg-gradient-to-br from-purple-300 to-violet-400',
      'bg-gradient-to-br from-yellow-300 to-amber-400',
      'bg-gradient-to-br from-red-300 to-pink-400',
      'bg-gradient-to-br from-teal-300 to-cyan-400',
      'bg-gradient-to-br from-orange-300 to-red-400',
      'bg-gradient-to-br from-lime-300 to-green-400',
      'bg-gradient-to-br from-sky-300 to-blue-400',
      'bg-gradient-to-br from-fuchsia-300 to-purple-400',
      'bg-gradient-to-br from-emerald-300 to-teal-400'
    ];
    
    // Use the first character of the name to determine gradient
    const charCode = name.charCodeAt(0);
    return gradients[charCode % gradients.length];
  };

  // Helper function to format date properly
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const uniquePositions = [...new Set(allCandidates.map(c => c.applyingFor))];
  const uniqueStatuses = [...new Set(allCandidates.map(c => c.status))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4 rounded-lg">
      <Toast
        message={message.text}
        type={message.type}
        isVisible={!!message.text}
        onClose={() => setMessage({ type: '', text: '' })}
      />

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Home className="w-4 h-4 mr-1 text-gray-500" />
              <span className="text-sm font-medium text-gray-500">Dashboard</span>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                <span className="text-sm font-medium text-black">Candidate Profiles</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header with Search and Actions */}
        <div className="border border-gray-300 rounded-lg mb-4 bg-gradient-to-r from-white via-gray-50 to-gray-100 shadow-lg backdrop-blur-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
              <div>
                <h2 className="text-2xl font-bold bg-black bg-clip-text text-transparent">
                  Candidate Profiles
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and review candidate applications ({filteredCandidates.length} total)
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-80">
                    <input
                      type="text"
                      placeholder="Search by name, position, contact..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 pr-16 border border-gray-400 rounded-lg text-sm bg-gradient-to-r from-white to-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-600 focus:bg-white transition-all duration-200"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                      {searchTerm && (
                        <button
                          onClick={clearSearch}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      <Search className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-3 py-2 border border-gray-400 rounded-lg text-sm bg-gradient-to-b from-white to-gray-100 hover:bg-gradient-to-b hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    Filters
                  </button>

                  <button
                    onClick={handleAddCandidate}
                    className="flex items-center px-3 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-900 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Candidate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-400 rounded-lg text-sm bg-gradient-to-b from-white to-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:bg-white"
                  >
                    <option value="">All Statuses</option>
                    {uniqueStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <select
                    value={filters.position}
                    onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-400 rounded-lg text-sm bg-gradient-to-b from-white to-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:bg-white"
                  >
                    <option value="">All Positions</option>
                    {uniquePositions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearSearch}
                    className="w-full px-3 py-2 border border-gray-400 rounded-lg text-sm bg-gradient-to-b from-white to-gray-100 hover:bg-gradient-to-b hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {getCurrentPageData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="w-10 h-10 text-gray-400 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
                        <p className="text-gray-500">
                          {searchTerm || filters.status || filters.position
                            ? 'Try adjusting your search or filters'
                            : 'No candidates have been added yet'}
                        </p>
                        {(searchTerm || filters.status || filters.position) && (
                          <button
                            onClick={clearSearch}
                            className="mt-3 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 underline transition-colors"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  getCurrentPageData.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className={`h-8 w-8 rounded-full ${getAvatarGradient(candidate.name)} flex items-center justify-center shadow-md`}>
                              <span className="text-xs font-semibold text-white">
                                {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-semibold text-gray-900">{candidate.name}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {candidate.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        <div className="text-sm text-gray-700">{candidate.contactNumber}</div>
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{candidate.applyingFor}</div>
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        <div className="text-sm text-gray-700">{candidate.experience}</div>
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        <div className="text-sm text-gray-700 flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                          {candidate.location}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        <div className="text-sm text-gray-700 flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          {formatDate(candidate.appliedDate)}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(candidate)}
                          className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-gray-700 bg-gradient-to-b from-white to-gray-100 hover:bg-gradient-to-b hover:from-gray-100 hover:to-gray-200 transition-all duration-200 shadow-sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredCandidates.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;