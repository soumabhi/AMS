import React, { useState, useEffect } from 'react';
import {Search, FileText, ChevronRight, Home, X, ChevronLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Updated Toast Component with gradient styling
const Toast = ({ message, type, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
      <div className="max-w-sm w-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-xl shadow-lg backdrop-blur-sm p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`h-5 w-5 rounded-full ${
              type === 'success' ? 'bg-green-500' : 
              type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}></div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">
              {message}
            </p>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="inline-flex rounded-lg p-1.5 text-gray-400 hover:bg-white/50 focus:outline-none transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated Table Skeleton Component with gradient styling
const TableSkeleton = ({ columns, rows, headerWidths, cellWidths }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-3 py-2 text-center">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse mx-auto" style={{width: headerWidths?.[i] || '100px'}}></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-100">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-3 py-2 text-center">
                    <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full animate-pulse mx-auto" style={{width: cellWidths?.[colIndex] || '80px'}}></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EmployeeManagement = () => {
  // Dummy employee data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'John Smith',
      dateOfJoining: '2023-01-15',
      branch: 'New York',
      designation: 'Software Engineer',
      designationId: 'SE001',
      role: 'Developer',
      shiftId: 'SHIFT001',
      jobBand: 'B2',
      salary: '$75,000',
      userPassword: '********',
      userId: 'john.smith',
      faceEmbedding: 'embedded_data_string',
      updatedCv: '/static/cv/john_smith.pdf',
      entityName: 'Principal',
      kra: 'Develop web applications, Code reviews, Mentoring junior developers',
      email: 'john.smith@company.com',
      phone: '+1-234-567-8901',
      address: '123 Main St, NY 10001',
      reportingManager: 'Jane Doe',
      status: 'Verified'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Sarah Johnson',
      dateOfJoining: '2022-08-20',
      branch: 'California',
      designation: 'Product Manager',
      designationId: 'PM001',
      role: 'Manager',
      shiftId: 'SHIFT002',
      jobBand: 'B3',
      salary: '$95,000',
      userPassword: '********',
      userId: 'sarah.johnson',
      faceEmbedding: 'embedded_data_string',
      updatedCv: '/static/cv/sarah_johnson.pdf',
      entityName: 'Principal',
      kra: 'Product roadmap planning, Stakeholder management, Market analysis',
      email: 'sarah.johnson@company.com',
      phone: '+1-234-567-8902',
      address: '456 Oak Ave, CA 90210',
      reportingManager: 'Mike Wilson',
      status: 'Pending'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      name: 'Michael Brown',
      dateOfJoining: '2023-03-10',
      branch: 'Texas',
      designation: 'Data Analyst',
      designationId: 'DA001',
      role: 'Analyst',
      shiftId: 'SHIFT001',
      jobBand: 'B1',
      salary: '$65,000',
      userPassword: '********',
      userId: 'michael.brown',
      faceEmbedding: 'embedded_data_string',
      updatedCv: '/static/cv/michael_brown.pdf',
      entityName: 'Principal',
      kra: 'Data visualization, Statistical analysis, Report generation',
      email: 'michael.brown@company.com',
      phone: '+1-234-567-8903',
      address: '789 Pine St, TX 75001',
      reportingManager: 'Lisa Chen',
      status: 'Verified'
    },
    {
      id: 4,
      employeeId: 'EMP004',
      name: 'Emily Davis',
      dateOfJoining: '2021-11-05',
      branch: 'New York',
      designation: 'HR Manager',
      designationId: 'HR001',
      role: 'Manager',
      shiftId: 'SHIFT003',
      jobBand: 'B4',
      salary: '$85,000',
      userPassword: '********',
      userId: 'emily.davis',
      faceEmbedding: 'embedded_data_string',
      updatedCv: '/static/cv/emily_davis.pdf',
      entityName: 'Principal',
      kra: 'Recruitment, Employee relations, Policy development',
      email: 'emily.davis@company.com',
      phone: '+1-234-567-8904',
      address: '321 Elm St, NY 10002',
      reportingManager: 'Robert Taylor',
      status: 'Verified'
    },
    {
      id: 5,
      employeeId: 'EMP005',
      name: 'David Wilson',
      dateOfJoining: '2022-12-01',
      branch: 'California',
      designation: 'Marketing Specialist',
      designationId: 'MS001',
      role: 'Specialist',
      shiftId: 'SHIFT002',
      jobBand: 'B2',
      salary: '$70,000',
      userPassword: '********',
      userId: 'david.wilson',
      faceEmbedding: 'embedded_data_string',
      updatedCv: '/static/cv/david_wilson.pdf',
      entityName: 'Principal',
      kra: 'Campaign management, Social media strategy, Content creation',
      email: 'david.wilson@company.com',
      phone: '+1-234-567-8905',
      address: '654 Maple Dr, CA 90211',
      reportingManager: 'Anna Martinez',
      status: 'Payroll'
    },
    {
      id: 6,
      employeeId: 'EMP006',
      name: 'Alice Cooper',
      dateOfJoining: '2023-02-15',
      branch: 'Texas',
      designation: 'UI/UX Designer',
      designationId: 'UD001',
      role: 'Designer',
      shiftId: 'SHIFT001',
      jobBand: 'B2',
      salary: '$72,000',
      userPassword: '********',
      userId: 'alice.cooper',
      faceEmbedding: 'embedded_data_string',
      updatedCv: '/static/cv/alice_cooper.pdf',
      entityName: 'Principal',
      kra: 'UI design, User research, Prototyping',
      email: 'alice.cooper@company.com',
      phone: '+1-234-567-8906',
      address: '987 Cedar Ave, TX 75002',
      reportingManager: 'Design Lead',
      status: 'Pending'
    },
    {
      id: 7,
      employeeId: 'EMP007',
      name: 'Bob Smith',
      dateOfJoining: '2023-04-20',
      branch: 'New York',
      designation: 'DevOps Engineer',
      designationId: 'DO001',
      role: 'Engineer',
      shiftId: 'SHIFT001',
      jobBand: 'B3',
      salary: '$88,000',
      userPassword: '********',
      userId: 'bob.smith',
      faceEmbedding: 'embedded_data_string',
      updatedCv: '/static/cv/bob_smith.pdf',
      entityName: 'Principal',
      kra: 'Infrastructure management, CI/CD pipelines, Monitoring',
      email: 'bob.smith@company.com',
      phone: '+1-234-567-8907',
      address: '654 Broadway, NY 10003',
      reportingManager: 'Tech Lead',
      status: 'Verified'
    }
  ]);

  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [designationFilter, setDesignationFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [kraTooltip, setKraTooltip] = useState({ visible: false, employee: null, position: { x: 0, y: 0 } });

  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Get unique branches and designations for filters
  const branches = [...new Set(employees.map(emp => emp.branch))];
  const designations = [...new Set(employees.map(emp => emp.designation))];

  // Filter employees based on search and filters
  const filterEmployees = () => {
    let filtered = employees.filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBranch = branchFilter === '' || employee.branch === branchFilter;
      const matchesDesignation = designationFilter === '' || employee.designation === designationFilter;
      
      return matchesSearch && matchesBranch && matchesDesignation;
    });
    setFilteredEmployees(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, branchFilter, designationFilter, employees]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleEditEmployee = (employee, e) => {
    e.stopPropagation();
    navigate(`/employee/edit/${employee.id}`);
  };

  const handleKraMouseEnter = (employee, e) => {
    const rect = e.target.getBoundingClientRect();
    setKraTooltip({
      visible: true,
      employee,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      }
    });
  };

  const handleKraMouseLeave = () => {
    setKraTooltip({ visible: false, employee: null, position: { x: 0, y: 0 } });
  };

  // Preserved status colors with gradients
  const getStatusColor = (status) => {
    const colors = {
      'Verified': 'bg-gradient-to-r from-green-500 to-emerald-600',
      'Payroll': 'bg-gradient-to-r from-yellow-500 to-amber-600',
      'Pending': 'bg-gradient-to-r from-gray-500 to-slate-600'
    };
    return colors[status] || 'bg-gradient-to-r from-gray-500 to-slate-600';
  };

  // Updated Breadcrumb with gradient text
  const Breadcrumb = () => {
    return (
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Home className="w-4 h-4 mr-1 text-gray-500" />
            <span className="text-sm font-medium text-gray-500">Dashboard</span>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
              <span className="text-sm font-medium bg-black bg-clip-text text-transparent">Employee Management</span>
            </div>
          </li>
        </ol>
      </nav>
    );
  };

  // Enhanced KRA Tooltip Component
  const KraTooltip = ({ employee, position }) => {
    if (!employee) return null;

    return (
      <div 
        className="fixed z-[9999] bg-gray-900 text-white text-sm rounded-lg p-3 shadow-xl max-w-xs"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -100%)',
          pointerEvents: 'none'
        }}
      >
        <div className="font-medium mb-1">Key Result Areas:</div>
        <div className="text-gray-200">{employee.kra}</div>
        {/* Arrow */}
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"
        ></div>
      </div>
    );
  };

  // Updated Pagination Component with gradients
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} results
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="ml-4 px-2 py-1 border border-gray-300 rounded text-sm bg-gradient-to-r from-gray-50 to-gray-100"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-l hover:from-gray-100 hover:to-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className={`px-3 py-1 text-sm border-t border-b border-gray-300 hover:from-gray-100 hover:to-gray-200 bg-gradient-to-r from-gray-50 to-gray-100`}
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
            </>
          )}
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 text-sm border-t border-b border-gray-300 ${
                currentPage === number 
                  ? 'bg-gradient-to-r from-gray-800 to-black text-white' 
                  : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200'
              }`}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`px-3 py-1 text-sm border-t border-b border-gray-300 hover:from-gray-100 hover:to-gray-200 bg-gradient-to-r from-gray-50 to-gray-100`}
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-r hover:from-gray-100 hover:to-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4">
      <Toast
        message={message.text}
        type={message.type}
        isVisible={!!message.text}
        onClose={() => setMessage({ type: '', text: '' })}
      />

      <div className="max-w-7xl mx-auto">
        <Breadcrumb />
        
        {/* Header with gradient styling */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 mb-6">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold bg-black bg-clip-text text-transparent">Employee Management</h2>
          </div>

          {/* Search and Filters with gradients */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm pl-9 pr-3 py-2 focus:ring-1 focus:ring-gray-500 focus:border-transparent outline-none bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
              />
            </div>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            <select
              value={designationFilter}
              onChange={(e) => setDesignationFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
            >
              <option value="">All Designations</option>
              {designations.map(designation => (
                <option key={designation} value={designation}>{designation}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Employee Table with gradients */}
        {loading && filteredEmployees.length === 0 ? (
          <TableSkeleton
            columns={10}
            rows={5}
            headerWidths={['60px', '120px', '200px', '120px', '150px', '150px', '120px', '80px', '120px', '100px']}
            cellWidths={['60px', '120px', '200px', '120px', '150px', '150px', '120px', '80px', '120px', '100px']}
          />
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr className="text-xs">
                    <th className="px-3 py-2 text-center font-medium text-gray-600 uppercase tracking-wider">SL No</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 uppercase tracking-wider">EMP ID</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 uppercase tracking-wider">NAME</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 uppercase tracking-wider">DOJ</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 uppercase tracking-wider">Branch</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 uppercase tracking-wider">Designation</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 uppercase tracking-wider">Job Band</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 uppercase tracking-wider">KRA</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {currentEmployees.map((employee, index) => (
                    <tr 
                      key={employee.id} 
                      className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-sm transition-all duration-200"
                    >
                      <td className="px-3 py-2 text-center whitespace-nowrap text-gray-900">{startIndex + index + 1}</td>
                      <td className="px-3 py-2 text-center whitespace-nowrap font-medium text-gray-900">{employee.employeeId}</td>
                      <td className="px-3 py-2 text-center whitespace-nowrap text-gray-900">{employee.name}</td>
                      <td className="px-3 py-2 text-center whitespace-nowrap text-gray-900">{employee.dateOfJoining}</td>
                      <td className="px-3 py-2 text-center whitespace-nowrap text-gray-900">{employee.branch}</td>
                      <td className="px-3 py-2 text-center whitespace-nowrap text-gray-900">{employee.designation}</td>
                      <td className="px-3 py-2 text-center whitespace-nowrap text-gray-900">{employee.jobBand}</td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex justify-center">
                          <button
                            onMouseEnter={(e) => handleKraMouseEnter(employee, e)}
                            onMouseLeave={handleKraMouseLeave}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded-full transition-colors"
                            title="View KRA"
                          >
                            <FileText size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center whitespace-nowrap">
                        <div className="flex justify-center">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(employee.status)}`}>
                            {employee.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center whitespace-nowrap">
                        <div className="flex justify-center">
                          <button
                            onClick={(e) => handleEditEmployee(employee, e)}
                            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-1 rounded-full transition-colors"
                            title="Edit Employee"
                          >
                            <Settings size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination />
          </div>
        )}

        {/* KRA Tooltip */}
        {kraTooltip.visible && kraTooltip.employee && (
          <KraTooltip employee={kraTooltip.employee} position={kraTooltip.position} />
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;