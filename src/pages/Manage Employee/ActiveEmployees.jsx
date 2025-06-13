import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { 
  Plus, Edit, Clock, Calendar, AlertCircle, CheckCircle, X, Users, Timer,
  User, Eye, Ban, Search, Filter, FileText, Download, ChevronDown, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Upload
} from 'lucide-react';
import Toast from '../../components/Toast';
import * as XLSX from 'xlsx';

// API BASE URL
const API_BASE_URL = "http://localhost:5000/api";

// Skeleton Loader Component
const TableSkeleton = () => {
  return (
    <tbody className="bg-white divide-y divide-gray-100">
      {[...Array(5)].map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-32"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24"></div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-28"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
              <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

// Enhanced Input Component
const Input = ({ label, value, onChange, placeholder, error, type = "text", className = "", disabled = false }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 ${error ? 'border-gray-400 bg-gray-50/50' : 'hover:border-gray-300'} ${className}`}
      />
      {error && (
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

// Enhanced Select Component
const Select = ({ label, value, onChange, options, error, className = "", disabled = false }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 ${error ? 'border-gray-400 bg-gray-50/50' : 'hover:border-gray-300'} ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

const ActiveEmployees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentTab, setCurrentTab] = useState("1");
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [employeeToDisable, setEmployeeToDisable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [departments, setDepartments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);
  const [showDisableModal, setShowDisableModal] = useState(false);

  // Debounced search text
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchText]);

  // Memoized filtered employees
  const filteredEmployees = useMemo(() => {
    let filtered = employees;

    // Apply search filter
    if (debouncedSearchText) {
      const searchLower = debouncedSearchText.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.emp_id?.toLowerCase().includes(searchLower) ||
          emp.name?.toLowerCase().includes(searchLower) ||
          emp.email?.toLowerCase().includes(searchLower) ||
          emp.phone?.toLowerCase().includes(searchLower) ||
          emp.department?.toLowerCase().includes(searchLower) ||
          emp.position?.toLowerCase().includes(searchLower)
      );
    }

    // Apply branch filter
    if (selectedBranch !== "all") {
      filtered = filtered.filter((emp) => emp.branch === selectedBranch);
    }

    // Apply department filter
    if (selectedDepartment !== "all") {
      filtered = filtered.filter((emp) => emp.department === selectedDepartment);
    }

    return filtered;
  }, [employees, debouncedSearchText, selectedBranch, selectedDepartment]);

  // Memoized pagination calculations
  const paginationData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const totalPages = Math.ceil(filteredEmployees.length / pageSize);
    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

    return {
      startIndex,
      endIndex,
      totalPages,
      paginatedEmployees
    };
  }, [filteredEmployees, currentPage, pageSize]);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback((newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  // Helper function to format employee name
  const formatEmployeeName = (emp) => {
    if (!emp) return "N/A";
    
    const { salutation = "", firstName = "", middleName = "", lastName = "" } = emp;
    return (
      [salutation, firstName, middleName, lastName]
        .filter((part) => part && part.trim() !== "")
        .join(" ")
        .trim() || "N/A"
    );
  };

  // Fetch employees from API
  const fetchEmployees = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/employee/all?page=${page}&limit=${limit}`
      );

      console.log('API Response:', response.data);

      if (response.data) {
        const formattedEmployees = response.data.employees.map((emp) => ({
          _id: emp._id,
          name: formatEmployeeName(emp.userName),
          firstName: emp?.userName?.firstName,
          lastName: emp?.userName?.lastName,
          middleName: emp?.userName?.middleName,
          salutation: emp?.userName?.salutation,
          emp_id: emp.userId,
          email: emp.userEmail,
          phone: emp.phoneNo || "N/A", 
          dob: emp.dob ? moment(emp.dateOfBirth).format("DD-MM-YYYY") : "N/A",
          age: emp.dob ? Math.floor((new Date() - new Date(emp.dob)) / (1000 * 60 * 60 * 24 * 365.25)) : "N/A",
          gender: emp.gender || "N/A",
          department: emp.designationId?.departmentId?.departmentName || "N/A",
          branch: emp.branch?.branchName || "N/A",
          position: emp.designationId?.designationName || "N/A",
          status: emp.status === 1 ? "Active" : "Inactive",
          emergencyContact: emp.emergencyContact || "N/A",
          address: emp.address || "N/A",
          panNumber: emp.panNumber || "N/A",
          aadharNumber: emp.aadharNumber || "N/A",
          joiningDate: emp.joiningDate ? moment(emp.joiningDate).format("DD-MM-YYYY") : "N/A",
          shift: emp.shift || "N/A",
          shiftTiming: emp.shiftTiming || "N/A"
        }));

        setEmployees(formattedEmployees);
        setTotalEmployees(response.data.totalEmployees);

        // Extract unique branches and departments
        const uniqueBranches = [
          ...new Set(
            formattedEmployees
              .map((emp) => emp.branch)
              .filter((branch) => branch && branch !== "N/A")
          ),
        ];
        setBranches(uniqueBranches);

        // Extract unique departments
        const uniqueDepartments = [
          ...new Set(
            formattedEmployees
              .map((emp) => emp.department)
              .filter((dept) => dept && dept !== "N/A")
          ),
        ];
        setDepartments(uniqueDepartments);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      showToast(
        "Failed to fetch employees: " + (error.response?.data?.message || "Unknown error"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchEmployees(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Calculate statistics
  const stats = {
    total: filteredEmployees.length,
    male: filteredEmployees.filter((e) => e.gender === "Male").length,
    female: filteredEmployees.filter((e) => e.gender === "Female").length,
    other: filteredEmployees.filter((e) => e.gender === "Other").length,
  };

  // Toast notifications
  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  // Disable employee
  const disableEmployee = async (id) => {
    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/employee/update/${id}`, { status: 0 });
      showToast("Employee disabled successfully");
      fetchEmployees(currentPage, pageSize);
    } catch (error) {
      console.error("Error disabling employee:", error);
      showToast(
        "Failed to disable employee: " + (error.response?.data?.message || "Unknown error"),
        "error"
      );
      setLoading(false);
    }
  };

  // Show employee details modal
  const showEmployeeModal = (employee) => {
    setSelectedEmployee(employee);
    setIsModalVisible(true);
    setEditMode(false);
  };

  // Export to Excel with all fields
  const exportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = employees.map(emp => ({
        'Employee ID': emp.emp_id,
        'Name': emp.name,
        'First Name': emp.firstName,
        'Middle Name': emp.middleName,
        'Last Name': emp.lastName,
        'Salutation': emp.salutation,
        'Email': emp.email,
        'Phone': emp.phone,
        'Date of Birth': emp.dob,
        'Age': emp.age,
        'Gender': emp.gender,
        'Department': emp.department,
        'Branch': emp.branch,
        'Position': emp.position,
        'Status': emp.status,
        'Emergency Contact': emp.emergencyContact,
        'Address': emp.address,
        'PAN Number': emp.panNumber,
        'Aadhar Number': emp.aadharNumber,
        'Joining Date': emp.joiningDate,
        'Shift': emp.shift,
        'Shift Timing': emp.shiftTiming
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const columnWidths = [
        { wch: 15 }, // Employee ID
        { wch: 25 }, // Name
        { wch: 15 }, // First Name
        { wch: 15 }, // Middle Name
        { wch: 15 }, // Last Name
        { wch: 10 }, // Salutation
        { wch: 25 }, // Email
        { wch: 15 }, // Phone
        { wch: 15 }, // Date of Birth
        { wch: 8 },  // Age
        { wch: 10 }, // Gender
        { wch: 20 }, // Department
        { wch: 20 }, // Branch
        { wch: 20 }, // Position
        { wch: 10 }, // Status
        { wch: 15 }, // Emergency Contact
        { wch: 40 }, // Address
        { wch: 15 }, // PAN Number
        { wch: 15 }, // Aadhar Number
        { wch: 15 }, // Joining Date
        { wch: 15 }, // Shift
        { wch: 15 }  // Shift Timing
      ];
      worksheet['!cols'] = columnWidths;

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Active Employees");

      // Generate filename with current date
      const date = new Date();
      const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      const filename = `Active_Employees_${formattedDate}.xlsx`;

      // Save file
      XLSX.writeFile(workbook, filename);
      showToast("Employee data exported successfully");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      showToast("Failed to export employee data", "error");
    }
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditMode(false);
  };

  // Handle add new employee
  const handleAddEmployee = () => {
    navigate("/AddEmployee");
  };

  // Get color based on status
  const getStatusColor = (status) => {
    return status === "Active" 
      ? "bg-gradient-to-r from-gray-700 to-black text-white" 
      : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800";
  };

  // Table columns
  const columns = [
    { header: "#", accessor: "index" },
    { header: "Employee", accessor: "employee" },
    { header: "Department", accessor: "department" },
    { header: "Designation", accessor: "position" },
    { header: "Branch", accessor: "branch" },
    { header: "Contact", accessor: "phone" },
    { header: "Actions", accessor: "actions" }
  ];

  // Handle disable confirmation
  const handleDisableClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDisableModal(true);
  };

  const handleDisableConfirm = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/employees/${selectedEmployee._id}/disable`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        showToast("Employee disabled successfully", "success");
        setShowDisableModal(false);
        setSelectedEmployee(null);
        fetchEmployees();
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to disable employee", "error");
    }
  };

  // Handle view employee
  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  // Add this function to handle field changes
  const handleFieldChange = (field, value) => {
    setEditedEmployee(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add this function to handle edit mode toggle
  const handleEditToggle = () => {
    if (!isEditing) {
      setEditedEmployee(selectedEmployee);
    }
    setIsEditing(!isEditing);
  };

  // Add this function to handle save
  const handleSave = async () => {
    try {
      // TODO: Implement API call to save changes
      await axios.put(`${API_BASE_URL}/employee/update/${selectedEmployee._id}`, editedEmployee);
      showToast("Employee details updated successfully");
      setIsEditing(false);
      fetchEmployees(currentPage, pageSize); // Refresh the list
    } catch (error) {
      console.error("Error updating employee:", error);
      showToast("Failed to update employee details", "error");
    }
  };

  // Add this function to handle cancel
  const handleCancel = () => {
    setEditedEmployee(null);
    setIsEditing(false);
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        dateOfBirth: "1990-01-01",
        gender: "Male",
        department: "IT",
        branch: "Main Branch",
        position: "Software Engineer",
        emergencyContact: "9876543210",
        address: "123 Main St",
        panNumber: "ABCDE1234F",
        aadharNumber: "123456789012"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "employee_upload_template.xlsx");
  };

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.xlsx')) {
      toast.error('Please upload an Excel file (.xlsx)');
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validate data
      const errors = validateEmployeeData(jsonData);
      if (errors.length > 0) {
        setValidationErrors(errors);
        setPreviewData(jsonData);
        setShowPreview(true);
        return;
      }

      // If no errors, show preview
      setPreviewData(jsonData);
      setShowPreview(true);
      setValidationErrors([]);
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Error reading the Excel file');
    }
  };

  const validateEmployeeData = (data) => {
    const errors = [];
    const requiredFields = ['name', 'email', 'phone', 'dateOfBirth', 'gender', 'department', 'branch', 'position'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const aadharRegex = /^\d{12}$/;

    data.forEach((row, index) => {
      // Check required fields
      requiredFields.forEach(field => {
        if (!row[field]) {
          errors.push(`Row ${index + 1}: ${field} is required`);
        }
      });

      // Validate email format
      if (row.email && !emailRegex.test(row.email)) {
        errors.push(`Row ${index + 1}: Invalid email format`);
      }

      // Validate phone number
      if (row.phone && !phoneRegex.test(row.phone)) {
        errors.push(`Row ${index + 1}: Phone number must be 10 digits`);
      }

      // Validate PAN number if provided
      if (row.panNumber && !panRegex.test(row.panNumber)) {
        errors.push(`Row ${index + 1}: Invalid PAN number format`);
      }

      // Validate Aadhar number if provided
      if (row.aadharNumber && !aadharRegex.test(row.aadharNumber)) {
        errors.push(`Row ${index + 1}: Aadhar number must be 12 digits`);
      }

      // Validate date format
      if (row.dateOfBirth) {
        const date = new Date(row.dateOfBirth);
        if (isNaN(date.getTime())) {
          errors.push(`Row ${index + 1}: Invalid date format for dateOfBirth`);
        }
      }
    });

    return errors;
  };

  const handleConfirmUpload = async () => {
    if (!previewData) return;

    try {
      setUploadLoading(true);
      const response = await axios.post('http://localhost:5000/api/employees/bulk', previewData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        toast.success('Employees uploaded successfully');
        setShowPreview(false);
        setPreviewData(null);
        setValidationErrors([]);
        fetchEmployees();
      } else {
        toast.error(response.data.message || 'Failed to upload employees');
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response) {
        toast.error(error.response.data.message || 'Failed to upload employees');
      } else if (error.request) {
        toast.error('No response from server. Please check your connection.');
      } else {
        toast.error('An error occurred while uploading employees');
      }
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8 text-left">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl shadow-xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 text-left">
              <h1 className="text-2xl font-bold text-gray-900">Active Employees</h1>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search employees..."
                    className="w-64 px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                </div>

                {/* Bulk Upload Section */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={downloadTemplate}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:from-gray-100 hover:to-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Download Template
                  </button>

                  <div className="relative">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleBulkUpload}
                      accept=".xlsx,.xls"
                      className="hidden"
                      id="bulk-upload"
                    />
                    <label
                      htmlFor="bulk-upload"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:from-gray-100 hover:to-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200 cursor-pointer"
                    >
                      {uploadLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800 mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Bulk Upload
                        </>
                      )}
                    </label>
                  </div>

                  <button
                    onClick={exportToExcel}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:from-gray-100 hover:to-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
              >
                <option value="all">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 hover:border-gray-300 transition-all duration-200"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index} className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                
                {loading ? (
                  <TableSkeleton />
                ) : paginationData.paginatedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-16 text-center">
                      <div className="text-center">
                        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                          <User className="w-12 h-12 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
                        <p className="text-gray-500">Try adjusting your search criteria or add new employees.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginationData.paginatedEmployees.map((employee, index) => (
                    <tr key={employee._id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="w-6 h-6 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{employee.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span>ID: {employee.emp_id}</span>
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded-full text-xs">
                              {employee.gender} / {employee.age}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap  text-sm text-gray-900">
                        {employee.department}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {employee.position}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {employee.branch}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex flex-col">
                          <span>{employee.phone}</span>
                          <span className="text-xs text-gray-500">{employee.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleViewEmployee(employee)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDisableClick(employee)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Disable Employee"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
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
                  <ChevronsLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-5 h-5" />
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
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handlePageChange(paginationData.totalPages)}
                  disabled={currentPage === paginationData.totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Last Page"
                >
                  <ChevronsRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Details Modal */}
        {showModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-black rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-xl font-semibold text-white">
                        {selectedEmployee.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-black bg-clip-text text-transparent">
                        {selectedEmployee.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {selectedEmployee.position} • {selectedEmployee.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-xl hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleEditToggle}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-xl hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Edit Details
                      </button>
                    )}
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        value={isEditing ? editedEmployee?.name : selectedEmployee.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={isEditing ? editedEmployee?.email : selectedEmployee.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
                      />
                      <Input
                        label="Phone"
                        type="tel"
                        value={isEditing ? editedEmployee?.phone : selectedEmployee.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
                      />
                      <Input
                        label="Date of Birth"
                        type="date"
                        value={isEditing ? editedEmployee?.dob : selectedEmployee.dob}
                        onChange={(e) => handleFieldChange('dob', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
                      />
                      <Select
                        label="Gender"
                        value={isEditing ? editedEmployee?.gender : selectedEmployee.gender}
                        onChange={(e) => handleFieldChange('gender', e.target.value)}
                        disabled={!isEditing}
                        options={[
                          { value: 'Male', label: 'Male' },
                          { value: 'Female', label: 'Female' },
                          { value: 'Other', label: 'Other' }
                        ]}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Employment Details */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Employment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Employee ID</p>
                        <p className="text-gray-900">{selectedEmployee.emp_id}</p>
                      </div>
                      <Select
                        label="Department"
                        value={isEditing ? editedEmployee?.department : selectedEmployee.department}
                        onChange={(e) => handleFieldChange('department', e.target.value)}
                        disabled={!isEditing}
                        options={departments.map(dept => ({ value: dept, label: dept }))}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
                      />
                      <Input
                        label="Designation"
                        value={isEditing ? editedEmployee?.position : selectedEmployee.position}
                        onChange={(e) => handleFieldChange('position', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
                      />
                      <Select
                        label="Branch"
                        value={isEditing ? editedEmployee?.branch : selectedEmployee.branch}
                        onChange={(e) => handleFieldChange('branch', e.target.value)}
                        disabled={!isEditing}
                        options={branches.map(branch => ({ value: branch, label: branch }))}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
                      />
                      <Input
                        label="Joining Date"
                        type="date"
                        value={isEditing ? editedEmployee?.joiningDate : selectedEmployee.joiningDate}
                        onChange={(e) => handleFieldChange('joiningDate', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Emergency Contact"
                        type="tel"
                        value={isEditing ? editedEmployee?.emergencyContact : selectedEmployee.emergencyContact}
                        onChange={(e) => handleFieldChange('emergencyContact', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">Address</label>
                        <textarea
                          value={isEditing ? editedEmployee?.address : selectedEmployee.address}
                          onChange={(e) => handleFieldChange('address', e.target.value)}
                          disabled={!isEditing}
                          rows="3"
                          className="w-full px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200"
                        />
                      </div>
                      <Input
                        label="PAN Number"
                        value={isEditing ? editedEmployee?.panNumber : selectedEmployee.panNumber}
                        onChange={(e) => handleFieldChange('panNumber', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
                      />
                      <Input
                        label="Aadhar Number"
                        value={isEditing ? editedEmployee?.aadharNumber : selectedEmployee.aadharNumber}
                        onChange={(e) => handleFieldChange('aadharNumber', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Shift Information */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Shift Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Select
                        label="Current Shift"
                        value={isEditing ? editedEmployee?.shift : selectedEmployee.shift}
                        onChange={(e) => handleFieldChange('shift', e.target.value)}
                        disabled={!isEditing}
                        options={[
                          { value: 'Morning', label: 'Morning' },
                          { value: 'Evening', label: 'Evening' },
                          { value: 'Night', label: 'Night' }
                        ]}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
                      />
                      <Input
                        label="Shift Timing"
                        value={isEditing ? editedEmployee?.shiftTiming : selectedEmployee.shiftTiming}
                        onChange={(e) => handleFieldChange('shiftTiming', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Disable Confirmation Modal */}
      {showDisableModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg">
                  <Ban className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Disable Employee</h3>
                  <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-lg font-semibold text-white">
                      {selectedEmployee.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedEmployee.name}</p>
                    <p className="text-sm text-gray-500">{selectedEmployee.position} • {selectedEmployee.department}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Are you sure you want to disable this employee? This will:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          Remove their access to the system
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          Archive their records
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          Require admin approval to reactivate
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDisableModal(false);
                    setSelectedEmployee(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisableConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-xl hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Disable Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-5xl flex flex-col max-h-[90vh]">
            {/* Header - Fixed */}
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold bg-black bg-clip-text text-transparent">
                    Preview Upload Data
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Review the data before confirming the upload
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setPreviewData(null);
                    setValidationErrors([]);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Validation Errors:</h4>
                      <div className="max-h-[200px] overflow-y-auto pr-2">
                        <ul className="space-y-1">
                          {validationErrors.map((error, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full flex-shrink-0"></div>
                              <span>{error}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Table Container */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <h4 className="text-sm font-semibold text-gray-700">Employee Data Preview</h4>
                    </div>
                    <span className="text-xs text-gray-500">
                      Showing {Math.min(5, previewData.length)} of {previewData.length} rows
                    </span>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        {Object.keys(previewData[0]).map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {previewData.slice(0, 5).map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                          {Object.entries(row).map(([key, value], colIndex) => (
                            <td key={colIndex} className="px-6 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {key === 'dateOfBirth' ? moment(value).format('DD MMM YYYY') : value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="p-6 border-t border-gray-200 bg-white">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setPreviewData(null);
                    setValidationErrors([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmUpload}
                  disabled={validationErrors.length > 0 || uploadLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-xl hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {uploadLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      Confirm Upload
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveEmployees;