import React, { useState, useEffect } from 'react';
import {Search, FileText, ChevronRight, Home, X, ChevronLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock employee data (would normally come from API)
const mockEmployees = [
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
  name: 'David Lee',
  dateOfJoining: '2021-11-10',
  branch: 'Texas',
  designation: 'UI/UX Designer',
  designationId: 'UX001',
  role: 'Designer',
  shiftId: 'SHIFT003',
  jobBand: 'B1',
  salary: '$68,000',
  userPassword: '********',
  userId: 'david.lee',
  faceEmbedding: 'embedded_data_string',
  updatedCv: '/static/cv/david_lee.pdf',
  entityName: 'Principal',
  kra: 'UI design, Prototyping, User testing',
  email: 'david.lee@company.com',
  phone: '+1-234-567-8903',
  address: '789 Pine Rd, TX 73301',
  reportingManager: 'John Smith',
  status: 'Verified'
},
{
  id: 4,
  employeeId: 'EMP004',
  name: 'Emily Davis',
  dateOfJoining: '2020-07-01',
  branch: 'Florida',
  designation: 'QA Engineer',
  designationId: 'QA001',
  role: 'Tester',
  shiftId: 'SHIFT001',
  jobBand: 'B1',
  salary: '$62,000',
  userPassword: '********',
  userId: 'emily.davis',
  faceEmbedding: 'embedded_data_string',
  updatedCv: '/static/cv/emily_davis.pdf',
  entityName: 'Principal',
  kra: 'Manual testing, Test case preparation, Defect tracking',
  email: 'emily.davis@company.com',
  phone: '+1-234-567-8904',
  address: '234 Willow Ln, FL 33101',
  reportingManager: 'Sarah Johnson',
  status: 'Verified'
},
{
  id: 5,
  employeeId: 'EMP005',
  name: 'Michael Brown',
  dateOfJoining: '2023-05-15',
  branch: 'Illinois',
  designation: 'Backend Developer',
  designationId: 'BD001',
  role: 'Developer',
  shiftId: 'SHIFT002',
  jobBand: 'B2',
  salary: '$80,000',
  userPassword: '********',
  userId: 'michael.brown',
  faceEmbedding: 'embedded_data_string',
  updatedCv: '/static/cv/michael_brown.pdf',
  entityName: 'Principal',
  kra: 'API development, Database optimization, Integration',
  email: 'michael.brown@company.com',
  phone: '+1-234-567-8905',
  address: '321 Maple Dr, IL 60007',
  reportingManager: 'Jane Doe',
  status: 'Pending'
},
{
  id: 6,
  employeeId: 'EMP006',
  name: 'Laura Wilson',
  dateOfJoining: '2022-02-28',
  branch: 'Georgia',
  designation: 'HR Manager',
  designationId: 'HR001',
  role: 'HR',
  shiftId: 'SHIFT001',
  jobBand: 'B3',
  salary: '$88,000',
  userPassword: '********',
  userId: 'laura.wilson',
  faceEmbedding: 'embedded_data_string',
  updatedCv: '/static/cv/laura_wilson.pdf',
  entityName: 'Principal',
  kra: 'Recruitment, Employee engagement, Payroll management',
  email: 'laura.wilson@company.com',
  phone: '+1-234-567-8906',
  address: '987 River Rd, GA 30303',
  reportingManager: 'Mike Wilson',
  status: 'Verified'
},
{
  id: 7,
  employeeId: 'EMP007',
  name: 'Chris Evans',
  dateOfJoining: '2021-09-12',
  branch: 'Washington',
  designation: 'DevOps Engineer',
  designationId: 'DO001',
  role: 'Engineer',
  shiftId: 'SHIFT003',
  jobBand: 'B2',
  salary: '$92,000',
  userPassword: '********',
  userId: 'chris.evans',
  faceEmbedding: 'embedded_data_string',
  updatedCv: '/static/cv/chris_evans.pdf',
  entityName: 'Principal',
  kra: 'CI/CD, Cloud management, Infrastructure automation',
  email: 'chris.evans@company.com',
  phone: '+1-234-567-8907',
  address: '654 Cedar St, WA 98001',
  reportingManager: 'Sarah Johnson',
  status: 'Verified'
},
{
  id: 8,
  employeeId: 'EMP008',
  name: 'Anna Thomas',
  dateOfJoining: '2023-03-05',
  branch: 'Nevada',
  designation: 'Business Analyst',
  designationId: 'BA001',
  role: 'Analyst',
  shiftId: 'SHIFT002',
  jobBand: 'B2',
  salary: '$77,000',
  userPassword: '********',
  userId: 'anna.thomas',
  faceEmbedding: 'embedded_data_string',
  updatedCv: '/static/cv/anna_thomas.pdf',
  entityName: 'Principal',
  kra: 'Requirement gathering, Data analysis, Documentation',
  email: 'anna.thomas@company.com',
  phone: '+1-234-567-8908',
  address: '159 Sunset Blvd, NV 89101',
  reportingManager: 'Jane Doe',
  status: 'Pending'
},
{
  id: 9,
  employeeId: 'EMP009',
  name: 'James White',
  dateOfJoining: '2019-12-10',
  branch: 'Colorado',
  designation: 'Tech Lead',
  designationId: 'TL001',
  role: 'Lead',
  shiftId: 'SHIFT001',
  jobBand: 'B4',
  salary: '$110,000',
  userPassword: '********',
  userId: 'james.white',
  faceEmbedding: 'embedded_data_string',
  updatedCv: '/static/cv/james_white.pdf',
  entityName: 'Principal',
  kra: 'Project leadership, Architecture design, Client interaction',
  email: 'james.white@company.com',
  phone: '+1-234-567-8909',
  address: '753 Skyline Dr, CO 80202',
  reportingManager: 'Mike Wilson',
  status: 'Verified'
},
{
  id: 10,
  employeeId: 'EMP010',
  name: 'Olivia Martin',
  dateOfJoining: '2020-10-25',
  branch: 'Arizona',
  designation: 'Data Scientist',
  designationId: 'DS001',
  role: 'Scientist',
  shiftId: 'SHIFT003',
  jobBand: 'B3',
  salary: '$98,000',
  userPassword: '********',
  userId: 'olivia.martin',
  faceEmbedding: 'embedded_data_string',
  updatedCv: '/static/cv/olivia_martin.pdf',
  entityName: 'Principal',
  kra: 'Machine learning models, Data preprocessing, Insights generation',
  email: 'olivia.martin@company.com',
  phone: '+1-234-567-8910',
  address: '842 Canyon Rd, AZ 85001',
  reportingManager: 'John Smith',
  status: 'Verified'
},
{
  id: 11,
  employeeId: 'EMP011',
  name: 'Daniel Clark',
  dateOfJoining: '2023-06-18',
  branch: 'Oregon',
  designation: 'Mobile App Developer',
  designationId: 'MD001',
  role: 'Developer',
  shiftId: 'SHIFT001',
  jobBand: 'B2',
  salary: '$79,000',
  userPassword: '********',
  userId: 'daniel.clark',
  faceEmbedding: 'embedded_data_string',
  updatedCv: '/static/cv/daniel_clark.pdf',
  entityName: 'Principal',
  kra: 'App development, Performance tuning, Bug fixing',
  email: 'daniel.clark@company.com',
  phone: '+1-234-567-8911',
  address: '205 Greenhill St, OR 97201',
  reportingManager: 'Jane Doe',
  status: 'Pending'
},
{
  id: 12,
  employeeId: 'EMP012',
  name: 'Sophia Hall',
  dateOfJoining: '2021-04-09',
  branch: 'Michigan',
  designation: 'Cloud Architect',
  designationId: 'CA001',
  role: 'Architect',
  shiftId: 'SHIFT002',
  jobBand: 'B4',
  salary: '$115,000',
  userPassword: '********',
  userId: 'sophia.hall',
  faceEmbedding: 'embedded_data_string',
  updatedCv: '/static/cv/sophia_hall.pdf',
  entityName: 'Principal',
  kra: 'Cloud architecture, Security compliance, Cost optimization',
  email: 'sophia.hall@company.com',
  phone: '+1-234-567-8912',
  address: '314 Harbor Ln, MI 48104',
  reportingManager: 'Mike Wilson',
  status: 'Verified'
}

];

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
  const [employees, setEmployees] = useState(mockEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState(mockEmployees);
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
    navigate(`/EmployeeDetailssection`);
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

  const getStatusColor = (status) => {
    const colors = {
      'Verified': 'bg-gradient-to-r from-green-500 to-emerald-600',
      'Payroll': 'bg-gradient-to-r from-yellow-500 to-amber-600',
      'Pending': 'bg-gradient-to-r from-gray-500 to-slate-600'
    };
    return colors[status] || 'bg-gradient-to-r from-gray-500 to-slate-600';
  };

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
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"
        ></div>
      </div>
    );
  };

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
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 mb-6">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold bg-black bg-clip-text text-transparent">Employee Management</h2>
          </div>

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
                            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-1 rounded-full transition-colors"
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

        {kraTooltip.visible && kraTooltip.employee && (
          <KraTooltip employee={kraTooltip.employee} position={kraTooltip.position} />
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;