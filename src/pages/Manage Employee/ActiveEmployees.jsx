import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import {
  Plus, Edit, Clock, Calendar, AlertCircle, CheckCircle, X, Users, Timer,
  User, Eye, Ban, Search, Filter, FileText, Download, ChevronDown, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Upload,
  Briefcase
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

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
    if (response.data) {
      const formattedEmployees = response.data.employees.map((emp) => ({
        _id: emp._id,
        name: `${emp.userName?.salutation || ''} ${emp.userName?.firstName || ''} ${emp.userName?.middleName || ''} ${emp.userName?.lastName || ''}`.trim(),
        firstName: emp.userName?.firstName,
        lastName: emp.userName?.lastName,
        middleName: emp.userName?.middleName,
        salutation: emp.userName?.salutation,
        emp_id: emp.userId,
        email: emp.userEmail,
        phone: emp.contactNo?.toString() || "N/A",
        dob: emp.dob ? moment(emp.dob).format("YYYY-MM-DD") : "N/A",
        age: emp.dob ? Math.floor((new Date() - new Date(emp.dob)) / (1000 * 60 * 60 * 24 * 365.25)) : "N/A",
        gender: emp.gender === 0 ? "Male" : emp.gender === 1 ? "Female" : "Other",
        department: emp.designationId?.departmentId?.departmentName || "N/A",
        branch: emp.branch?.branchName || "N/A",
        position: emp.designationId?.designationName || "N/A",
        status: emp.status === 1 ? "Active" : "Inactive",
        emergencyContact: emp.emergencyContact?.emergencyContactPhone?.toString() || "N/A",
        address: emp.address?.address1 || "N/A",
        panNumber: emp.panNo || "N/A",
        aadharNumber: emp.aadharNo || "N/A",
        joiningDate: emp.doj ? moment(emp.doj).format("DD-MM-YYYY") : "N/A",
        shift: emp.shift || "N/A",
        shiftTiming: emp.shiftTiming || "N/A",
        // Additional fields from your data
        bloodGroup: emp.bloodGroup,
        alternateNo: emp.alternateNo?.toString() || "N/A",
        emergencyContactName: emp.emergencyContact?.emergencyContactName || "N/A",
        emergencyContactRelation: emp.emergencyContact?.emergencyContactRelation || "N/A",
        education: emp.education || [],
        payroll: emp.payroll || []
      }));
      
      setEmployees(formattedEmployees);
      setTotalEmployees(response.data.totalEmployees);
      setCurrentPage(page);
      
      // Update branches and departments
      const uniqueBranches = [
        "all",
        ...new Set(
          formattedEmployees
            .map((emp) => emp.branch)
            .filter((branch) => branch && branch !== "N/A")
        ),
      ];
      setBranches(uniqueBranches);
      
      const uniqueDepartments = [
        "all",
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

  // Toast notifications
  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => hideToast(), 5000);
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

  // Export to Excel
  const exportToExcel = () => {
    try {
      const exportData = employees.map(emp => ({
        'Employee ID': emp.emp_id,
        'Name': emp.name,
        'Gender': emp.gender,
        'Department': emp.department,
        'Designation': emp.position,
        'Branch': emp.branch,
        'Email': emp.email,
        'Phone': emp.phone,
        'DOB': emp.dob,
        'Joining Date': emp.joiningDate,
        'Status': emp.status
      }));
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Active Employees");
      const filename = `Active_Employees_${moment().format('DD-MM-YYYY')}.xlsx`;
      XLSX.writeFile(workbook, filename);
      showToast("Employee data exported successfully");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      showToast("Failed to export employee data", "error");
    }
  };

  // Download template
  const downloadTemplate = () => {
    const template = [
      {
        bmCode: "BM001",
        salutation: "Mr.",
        fname: "Amit",
        mname: "Kumar",
        lname: "Sharma",
        gender: "Male",
        currentEntity: "Main Office",
        designation: "Manager",
        bloodGrp: "O+",
        qualification: "MBA",
        passingYear: "2015",
        branch: "Main",
        dept: "HR",
        doj: "2016-07-01",
        dob: "1990-05-15",
        contactNumber: "9876543210",
        mailId: "amit.sharma@example.com",
        salary: "50000",
        address1: "123 Park St",
        address2: "Apt 4B",
        block: "Block A",
        dist: "Kolkata",
        zipCode: "700001",
        adhaarNumber: "123456789012",
        panNumber: "ABCDE1234F",
        emergencyContact: "9123456789",
        emergencyContactName: "Sunita Sharma",
        emergencyContactRelationship: "Mother",
        bankAccountHolderName: "Amit Kumar Sharma",
        bankName: "State Bank of India",
        accountNo: "12345678901",
        ifscCode: "SBIN0001234",
        bankBranch: "Kolkata Main",
        modeOfPayment: "Bank Transfer"
      }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "employee_upload_template.xlsx");
  };

  // Handle bulk upload
  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset states
    setUploadProgress(0);
    setUploadStatus(null);
    setUploadResult(null);
    setValidationErrors([]);
    setPreviewData(null);

    try {
      // Check file type
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        showToast('Please upload an Excel file (.xlsx or .xls)', 'error');
        return;
      }

      // Create FormData and append the file
      const formData = new FormData();
      formData.append('file', file);

      // Show preview of the data (optional)
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setPreviewData(jsonData);

      // Validate data (client-side validation is optional)
      const errors = validateEmployeeData(jsonData);
      if (errors.length > 0) {
        setValidationErrors(errors);
        setShowPreview(true);
        return;
      }

      setShowPreview(true);
    } catch (error) {
      console.error('Error reading file:', error);
      showToast('Error reading the Excel file', 'error');
    }
  };

  // Confirm bulk upload
 const handleConfirmUpload = async () => {
  if (!fileInputRef.current?.files?.[0]) return;

  try {
    setUploadLoading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);

    const response = await axios.post(
      `${API_BASE_URL}/employee/uploadBulk`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      }
    );

    if (response.data.success) {
      setUploadStatus('success');
      setUploadResult(response.data);
      showToast(`${response.data.createdCount} employees created successfully`, 'success');

      // Refresh employee data
      fetchEmployees(1, pageSize); // Reset to first page with new data
      
      // Close modal and reset after delay
      setTimeout(() => {
        setShowPreview(false);
        setPreviewData(null);
        setValidationErrors([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1500);
    } else {
      setUploadStatus('error');
      showToast(response.data.message || 'Upload completed with some errors', 'warning');
    }
  } catch (error) {
    console.error('Upload error:', error);
    setUploadStatus('error');
    let errorMessage = 'Failed to upload employees';
    if (error.response) {
      if (error.response.data?.errors) {
        const serverErrors = error.response.data.errors.map(err =>
          `Row ${err.row + 1}: ${err.message}`
        );
        setValidationErrors([...validationErrors, ...serverErrors]);
        errorMessage = 'Please fix the validation errors';
      } else {
        errorMessage = error.response.data?.message || errorMessage;
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Please check your connection.';
    }
    showToast(errorMessage, 'error');
  } finally {
    setUploadLoading(false);
  }
};

  // Validate employee data
  const validateEmployeeData = (data) => {
    const errors = [];
    const requiredFields = [
      "bmCode", "salutation", "fname", "lname", "gender", "currentEntity",
      "designation", "branch", "dept", "doj", "contactNumber", "mailId", "dob", "panNumber", "adhaarNumber"
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const aadharRegex = /^\d{12}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    data.forEach((row, index) => {
      // Check required fields
      requiredFields.forEach(field => {
        if (!row[field] && row[field] !== 0) {
          errors.push(`Row ${index + 1}: ${field} is required`);
        }
      });

      // Validate email format
      if (row.mailId && !emailRegex.test(row.mailId)) {
        errors.push(`Row ${index + 1}: Invalid email format`);
      }

      // Validate phone number
      if (row.contactNumber && !phoneRegex.test(row.contactNumber)) {
        errors.push(`Row ${index + 1}: Phone number must be 10 digits`);
      }

      // Validate Aadhar number
      if (row.adhaarNumber && !aadharRegex.test(row.adhaarNumber)) {
        errors.push(`Row ${index + 1}: Aadhar number must be 12 digits`);
      }

      // Validate PAN number
      if (row.panNumber && !panRegex.test(row.panNumber)) {
        errors.push(`Row ${index + 1}: Invalid PAN number format`);
      }

      // Validate date formats
      if (row.doj && isNaN(new Date(row.doj).getTime())) {
        errors.push(`Row ${index + 1}: Invalid joining date format (expected YYYY-MM-DD)`);
      }

      if (row.dob && isNaN(new Date(row.dob).getTime())) {
        errors.push(`Row ${index + 1}: Invalid birth date format (expected YYYY-MM-DD)`);
      }

      // Validate future dates
      if (row.doj && new Date(row.doj) > new Date()) {
        errors.push(`Row ${index + 1}: Joining date cannot be in the future`);
      }

      if (row.dob && new Date(row.dob) > new Date()) {
        errors.push(`Row ${index + 1}: Birth date cannot be in the future`);
      }

      // Validate age (at least 18 years old)
      if (row.dob) {
        const dob = new Date(row.dob);
        const ageDiff = Date.now() - dob.getTime();
        const ageDate = new Date(ageDiff);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        if (age < 18) {
          errors.push(`Row ${index + 1}: Employee must be at least 18 years old`);
        }
      }
    });

    return errors;
  };

  // Other handlers...
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const handleDisableClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDisableModal(true);
  };

  const handleDisableConfirm = async () => {
    try {
      await disableEmployee(selectedEmployee._id);
      setShowDisableModal(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error disabling employee:", error);
    }
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleFieldChange = (field, value) => {
    setEditedEmployee(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditedEmployee(selectedEmployee);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_BASE_URL}/employee/update/${selectedEmployee._id}`, editedEmployee);
      showToast("Employee details updated successfully");
      setIsEditing(false);
      fetchEmployees(currentPage, pageSize);
    } catch (error) {
      console.error("Error updating employee:", error);
      showToast("Failed to update employee details", "error");
    }
  };

  const handleCancel = () => {
    setEditedEmployee(null);
    setIsEditing(false);
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
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Designation</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Branch</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                
                {loading ? (
                  <TableSkeleton />
                ) : paginationData.paginatedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
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
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginationData.paginatedEmployees.map((employee, index) => (
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
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
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
                    ))}
                  </tbody>
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
      </div>

      {/* Employee Details Modal */}
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 bg-white/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Employee Details
                </h2>
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleEditToggle}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Close"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    {isEditing ? (
                      <>
                        <Input
                          label="First Name"
                          value={editedEmployee?.firstName || ''}
                          onChange={(e) => handleFieldChange('firstName', e.target.value)}
                        />
                        <Input
                          label="Middle Name"
                          value={editedEmployee?.middleName || ''}
                          onChange={(e) => handleFieldChange('middleName', e.target.value)}
                        />
                        <Input
                          label="Last Name"
                          value={editedEmployee?.lastName || ''}
                          onChange={(e) => handleFieldChange('lastName', e.target.value)}
                        />
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="text-sm text-gray-500">Full Name</label>
                          <p className="font-medium">{selectedEmployee.name}</p>
                        </div>
                      </>
                    )}
                    <div>
                      <label className="text-sm text-gray-500">Employee ID</label>
                      <p className="font-medium">{selectedEmployee.emp_id}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Gender</label>
                      <p className="font-medium">{selectedEmployee.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Date of Birth</label>
                      <p className="font-medium">{selectedEmployee.dob}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Age</label>
                      <p className="font-medium">{selectedEmployee.age}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    {isEditing ? (
                      <>
                        <Input
                          label="Email"
                          value={editedEmployee?.email || ''}
                          onChange={(e) => handleFieldChange('email', e.target.value)}
                          type="email"
                        />
                        <Input
                          label="Phone"
                          value={editedEmployee?.phone || ''}
                          onChange={(e) => handleFieldChange('phone', e.target.value)}
                          type="tel"
                        />
                        <Input
                          label="Emergency Contact"
                          value={editedEmployee?.emergencyContact || ''}
                          onChange={(e) => handleFieldChange('emergencyContact', e.target.value)}
                          type="tel"
                        />
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="text-sm text-gray-500">Email</label>
                          <p className="font-medium">{selectedEmployee.email}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Phone</label>
                          <p className="font-medium">{selectedEmployee.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Emergency Contact</label>
                          <p className="font-medium">{selectedEmployee.emergencyContact}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Employment Details */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Employment Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Department</label>
                      <p className="font-medium">{selectedEmployee.department}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Designation</label>
                      <p className="font-medium">{selectedEmployee.position}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Branch</label>
                      <p className="font-medium">{selectedEmployee.branch}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Joining Date</label>
                      <p className="font-medium">{selectedEmployee.joiningDate}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Status</label>
                      <p className="font-medium">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedEmployee.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedEmployee.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">PAN Number</label>
                      <p className="font-medium">{selectedEmployee.panNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Aadhar Number</label>
                      <p className="font-medium">{selectedEmployee.aadharNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Shift</label>
                      <p className="font-medium">{selectedEmployee.shift || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Shift Timing</label>
                      <p className="font-medium">{selectedEmployee.shiftTiming || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disable Confirmation Modal */}
      {showDisableModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <Ban className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Disable Employee</h2>
                </div>
                <button
                  onClick={() => setShowDisableModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to disable {selectedEmployee.name}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDisableModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisableConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Disable Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black/45 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Bulk Upload Preview
                </h2>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setPreviewData(null);
                    setValidationErrors([]);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {validationErrors.length > 0 && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <h3 className="font-semibold text-red-800">Validation Errors</h3>
                  </div>
                  <ul className="list-disc pl-5 text-red-700 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {uploadStatus === 'uploading' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Uploading...</span>
                    <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {uploadStatus === 'success' && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-green-800">
                      Upload Successful! {uploadResult?.createdCount} employees created.
                    </h3>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(previewData[0]).map((key) => (
                        <th 
                          key={key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.slice(0, 10).map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {value === null || value === undefined ? 'N/A' : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setPreviewData(null);
                    setValidationErrors([]);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmUpload}
                  disabled={validationErrors.length > 0 || uploadLoading}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    validationErrors.length > 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  {uploadLoading ? 'Uploading...' : 'Confirm Upload'}
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