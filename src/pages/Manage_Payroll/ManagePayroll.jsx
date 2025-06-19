import React, { useState, useEffect } from 'react';
import { Edit, Eye, X, Download, AlertCircle, Calendar, User, FileText, ChevronLeft } from 'lucide-react';
import * as XLSX from 'xlsx';
import Toast from '../../components/Toast';

// Skeleton Loader Component
const TableSkeleton = () => {
  return (
    <tbody className="bg-white divide-y divide-gray-100">
      {[...Array(5)].map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-8 mx-auto"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
          </td>
          {[...Array(15)].map((_, i) => (
            <td key={i} className="px-6 py-4 whitespace-nowrap">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

// Input Component
const Input = ({ label, name, value, onChange, placeholder, error, type = "text", className = "", disabled = false, prefix }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">₹</span>
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${prefix ? 'pl-7' : 'pl-4'} pr-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 ${error ? 'border-gray-400 bg-gray-50/50' : 'hover:border-gray-300'} ${className}`}
        />
      </div>
      {error && (
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

// Select Component
const Select = ({ label, name, value, onChange, options, error, className = "", disabled = false }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
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

// API Service
const apiService = {
  baseURL: 'http://localhost:5000/api',
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request to ${url} failed:`, error);
      throw error;
    }
  },

  async getAllPayrolls() {
    return this.request('/payroll/all');
  },

  async getEmployees() {
    return this.request('/employees');
  },

  async updatePayroll(id, payrollData) {
    return this.request(`/payroll/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payrollData),
    });
  }
};

const PayrollManagement = () => {
  // For development/testing, you can initialize with mock data like this:
  const [payrolls, setPayrolls] = useState([
    {
      _id: "1",
      employeeId: "emp1",
      salaryStructureId: "SAL-001",
      basicSalary: 30000,
      houseRentAllowance: 12000,
      dearnessAllowance: 5000,
      conveyanceAllowance: 2000,
      medicalAllowance: 3000,
      otherAllowances: 1000,
      entertaintmentAllowance: 800,
      specialAllowance: 4000,
      performanceBonus: 5000,
      bonus: 3000,
      incentives: 2000,
      pfEmpContribution: 1800,
      tdsType: "10%",
      tdsAmount: 3000,
      proffesionalTax: 200,
      salaryAdvanceDeductions: 0,
      salaryLoanDeductions: 0,
      foodingDeductions: 0,
      accommodationDeductions: 0,
      grossSalary: 66300,
      netSalary: 61300,
      remarks: "Regular payroll for April 2023",
      createdAt: "2023-04-01T00:00:00.000Z",
      updatedAt: "2023-04-01T00:00:00.000Z"
    },
    {
      _id: "2",
      employeeId: "emp2",
      salaryStructureId: "SAL-002",
      basicSalary: 25000,
      houseRentAllowance: 10000,
      dearnessAllowance: 4000,
      conveyanceAllowance: 1500,
      medicalAllowance: 2000,
      otherAllowances: 800,
      entertaintmentAllowance: 600,
      specialAllowance: 3000,
      performanceBonus: 4000,
      bonus: 2000,
      incentives: 1500,
      pfEmpContribution: 1500,
      tdsType: "10%",
      tdsAmount: 2500,
      proffesionalTax: 200,
      salaryAdvanceDeductions: 1000,
      salaryLoanDeductions: 0,
      foodingDeductions: 500,
      accommodationDeductions: 0,
      grossSalary: 54400,
      netSalary: 49700,
      remarks: "Includes salary advance deduction",
      createdAt: "2023-04-01T00:00:00.000Z",
      updatedAt: "2023-04-01T00:00:00.000Z"
    }
  ]);

  const [employees, setEmployees] = useState([
    {
      _id: "emp1",
      employeeId: "EMP001",
      firstName: "Rahul",
      lastName: "Sharma",
      email: "rahul.sharma@example.com",
      department: "Engineering"
    },
    {
      _id: "emp2",
      employeeId: "EMP002",
      firstName: "Priya",
      lastName: "Patel",
      email: "priya.patel@example.com",
      department: "Marketing"
    }
  ]);

  const [editingPayroll, setEditingPayroll] = useState(null);
  const [viewingPayroll, setViewingPayroll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  const [formData, setFormData] = useState({
    employeeId: "",
    salaryStructureId: "",
    basicSalary: "",
    houseRentAllowance: "",
    dearnessAllowance: "",
    conveyanceAllowance: "",
    medicalAllowance: "",
    otherAllowances: "",
    entertaintmentAllowance: "",
    specialAllowance: "",
    performanceBonus: "",
    bonus: "",
    incentives: "",
    pfEmpContribution: "",
    tdsType: "",
    tdsAmount: "",
    proffesionalTax: "",
    salaryAdvanceDeductions: "",
    salaryLoanDeductions: "",
    foodingDeductions: "",
    accommodationDeductions: "",
    remarks: ""
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch data on component mount
  useEffect(() => {
    fetchPayrolls();
    fetchEmployees();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
    setTimeout(hideToast, 5000);
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const fetchPayrolls = async () => {
    setLoading(true);
    try {
      // For production, use the API call:
      // const response = await apiService.getAllPayrolls();
      // const payrollsData = Array.isArray(response) ? response : 
      //                    response.data ? response.data : 
      //                    response.result ? response.result : [];
      // setPayrolls(payrollsData);
      
      // For development, we're using mock data
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      showToast(`Failed to fetch payrolls: ${error.message}`, 'error');
      setPayrolls([]);
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      // For production, use the API call:
      // const response = await apiService.getEmployees();
      // const employeesData = Array.isArray(response) ? response : 
      //                   response.data ? response.data : 
      //                   response.result ? response.result : [];
      // setEmployees(employeesData);
      
      // For development, we're using mock data
    } catch (error) {
      console.error('Fetch error:', error);
      showToast(`Failed to fetch employees: ${error.message}`, 'error');
      setEmployees([]);
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: "",
      salaryStructureId: "",
      basicSalary: "",
      houseRentAllowance: "",
      dearnessAllowance: "",
      conveyanceAllowance: "",
      medicalAllowance: "",
      otherAllowances: "",
      entertaintmentAllowance: "",
      specialAllowance: "",
      performanceBonus: "",
      bonus: "",
      incentives: "",
      pfEmpContribution: "",
      tdsType: "",
      tdsAmount: "",
      proffesionalTax: "",
      salaryAdvanceDeductions: "",
      salaryLoanDeductions: "",
      foodingDeductions: "",
      accommodationDeductions: "",
      remarks: ""
    });
    setValidationErrors({});
    setEditingPayroll(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const calculateGrossSalary = () => {
    const {
      basicSalary = 0,
      houseRentAllowance = 0,
      dearnessAllowance = 0,
      conveyanceAllowance = 0,
      medicalAllowance = 0,
      otherAllowances = 0,
      entertaintmentAllowance = 0,
      specialAllowance = 0,
      performanceBonus = 0,
      bonus = 0,
      incentives = 0
    } = formData;

    return (
      parseFloat(basicSalary || 0) +
      parseFloat(houseRentAllowance || 0) +
      parseFloat(dearnessAllowance || 0) +
      parseFloat(conveyanceAllowance || 0) +
      parseFloat(medicalAllowance || 0) +
      parseFloat(otherAllowances || 0) +
      parseFloat(entertaintmentAllowance || 0) +
      parseFloat(specialAllowance || 0) +
      parseFloat(performanceBonus || 0) +
      parseFloat(bonus || 0) +
      parseFloat(incentives || 0)
    );
  };

  const calculateNetSalary = () => {
    const grossSalary = calculateGrossSalary();
    const {
      pfEmpContribution = 0,
      tdsAmount = 0,
      proffesionalTax = 0,
      salaryAdvanceDeductions = 0,
      salaryLoanDeductions = 0,
      foodingDeductions = 0,
      accommodationDeductions = 0
    } = formData;

    const totalDeductions = (
      parseFloat(pfEmpContribution || 0) +
      parseFloat(tdsAmount || 0) +
      parseFloat(proffesionalTax || 0) +
      parseFloat(salaryAdvanceDeductions || 0) +
      parseFloat(salaryLoanDeductions || 0) +
      parseFloat(foodingDeductions || 0) +
      parseFloat(accommodationDeductions || 0)
    );

    return grossSalary - totalDeductions;
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.employeeId) {
      errors.employeeId = 'Employee is required';
    }
    if (!formData.basicSalary) {
      errors.basicSalary = 'Basic salary is required';
    }
    if (!formData.salaryStructureId) {
      errors.salaryStructureId = 'Salary structure ID is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix all validation errors', 'error');
      return;
    }

    setSubmitLoading(true);
    try {
      const finalFormData = {
        ...formData,
        grossSalary: calculateGrossSalary(),
        netSalary: calculateNetSalary()
      };

      // For production, use the API call:
      // await apiService.updatePayroll(editingPayroll._id, finalFormData);
      
      // For development, update local state
      const updatedPayrolls = payrolls.map(p => 
        p._id === editingPayroll._id ? { ...p, ...finalFormData } : p
      );
      setPayrolls(updatedPayrolls);

      showToast('Payroll updated successfully');
      setEditingPayroll(null);
      setViewingPayroll(null);
      resetForm();
    } catch (error) {
      console.error('Submit error:', error);
      showToast(error.message || 'Failed to update payroll. Please try again.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleView = (payroll) => {
    setViewingPayroll(payroll);
  };

  const handleEdit = (payroll) => {
    setEditingPayroll(payroll);
    setFormData({
      employeeId: payroll.employeeId,
      salaryStructureId: payroll.salaryStructureId,
      basicSalary: payroll.basicSalary,
      houseRentAllowance: payroll.houseRentAllowance,
      dearnessAllowance: payroll.dearnessAllowance,
      conveyanceAllowance: payroll.conveyanceAllowance,
      medicalAllowance: payroll.medicalAllowance,
      otherAllowances: payroll.otherAllowances,
      entertaintmentAllowance: payroll.entertaintmentAllowance,
      specialAllowance: payroll.specialAllowance,
      performanceBonus: payroll.performanceBonus,
      bonus: payroll.bonus,
      incentives: payroll.incentives,
      pfEmpContribution: payroll.pfEmpContribution,
      tdsType: payroll.tdsType,
      tdsAmount: payroll.tdsAmount,
      proffesionalTax: payroll.proffesionalTax,
      salaryAdvanceDeductions: payroll.salaryAdvanceDeductions,
      salaryLoanDeductions: payroll.salaryLoanDeductions,
      foodingDeductions: payroll.foodingDeductions,
      accommodationDeductions: payroll.accommodationDeductions,
      remarks: payroll.remarks || ""
    });
    setValidationErrors({});
  };

  const handleCancel = () => {
    if (editingPayroll) {
      setEditingPayroll(null);
    } else {
      setViewingPayroll(null);
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp._id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0).replace('₹', '₹ ');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const exportToExcel = () => {
    const exportData = payrolls.map(payroll => {
      const employee = employees.find(emp => emp._id === payroll.employeeId) || {};
      return {
        'SL No': payrolls.indexOf(payroll) + 1,
        'Employee Name': `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'Unknown',
        'Employee ID': employee.employeeId || '',
        'Salary Structure ID': payroll.salaryStructureId,
        'Basic Salary': payroll.basicSalary,
        'HRA': payroll.houseRentAllowance,
        'Dearness Allowance': payroll.dearnessAllowance,
        'Conveyance Allowance': payroll.conveyanceAllowance,
        'Medical Allowance': payroll.medicalAllowance,
        'Other Allowances': payroll.otherAllowances,
        'Entertainment Allowance': payroll.entertaintmentAllowance,
        'Special Allowance': payroll.specialAllowance,
        'Performance Bonus': payroll.performanceBonus,
        'Bonus': payroll.bonus,
        'Incentives': payroll.incentives,
        'PF Contribution': payroll.pfEmpContribution,
        'TDS Type': payroll.tdsType,
        'TDS Amount': payroll.tdsAmount,
        'Professional Tax': payroll.proffesionalTax,
        'Salary Advance': payroll.salaryAdvanceDeductions,
        'Loan Deductions': payroll.salaryLoanDeductions,
        'Fooding Deductions': payroll.foodingDeductions,
        'Accommodation Deductions': payroll.accommodationDeductions,
        'Gross Salary': payroll.grossSalary,
        'Net Salary': payroll.netSalary,
        'Created At': formatDate(payroll.createdAt),
        'Updated At': formatDate(payroll.updatedAt)
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll Data");
    XLSX.writeFile(workbook, `Payroll_Data_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('Payroll data exported successfully');
  };

  const renderPayrollDetails = (payroll) => {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {getEmployeeName(payroll.employeeId)}
            </h2>
            <p className="text-gray-600">{payroll.salaryStructureId}</p>
          </div>
          {!editingPayroll && (
            <button
              onClick={() => handleEdit(payroll)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-lg hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Payroll
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Earnings</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Basic Salary</span>
                <span className="font-medium">{formatCurrency(payroll.basicSalary)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">House Rent Allowance</span>
                <span className="font-medium">{formatCurrency(payroll.houseRentAllowance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dearness Allowance</span>
                <span className="font-medium">{formatCurrency(payroll.dearnessAllowance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Conveyance Allowance</span>
                <span className="font-medium">{formatCurrency(payroll.conveyanceAllowance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Medical Allowance</span>
                <span className="font-medium">{formatCurrency(payroll.medicalAllowance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Other Allowances</span>
                <span className="font-medium">{formatCurrency(payroll.otherAllowances)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Entertainment Allowance</span>
                <span className="font-medium">{formatCurrency(payroll.entertaintmentAllowance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Special Allowance</span>
                <span className="font-medium">{formatCurrency(payroll.specialAllowance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Performance Bonus</span>
                <span className="font-medium">{formatCurrency(payroll.performanceBonus)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bonus</span>
                <span className="font-medium">{formatCurrency(payroll.bonus)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Incentives</span>
                <span className="font-medium">{formatCurrency(payroll.incentives)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Deductions</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">PF Contribution</span>
                <span className="font-medium text-red-600">-{formatCurrency(payroll.pfEmpContribution)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TDS ({payroll.tdsType})</span>
                <span className="font-medium text-red-600">-{formatCurrency(payroll.tdsAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Professional Tax</span>
                <span className="font-medium text-red-600">-{formatCurrency(payroll.proffesionalTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Salary Advance</span>
                <span className="font-medium text-red-600">-{formatCurrency(payroll.salaryAdvanceDeductions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Deductions</span>
                <span className="font-medium text-red-600">-{formatCurrency(payroll.salaryLoanDeductions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fooding Deductions</span>
                <span className="font-medium text-red-600">-{formatCurrency(payroll.foodingDeductions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accommodation Deductions</span>
                <span className="font-medium text-red-600">-{formatCurrency(payroll.accommodationDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  {/* Salary Box (left) - Improved with icons and better spacing */}
  <div className="grid grid-cols-2 gap-3">
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-green-50">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Gross Salary</h3>
          <p className="text-xl font-semibold text-gray-900">{formatCurrency(payroll.grossSalary)}</p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-50">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Net Salary</h3>
          <p className="text-xl font-semibold text-gray-900">{formatCurrency(payroll.netSalary)}</p>
        </div>
      </div>
    </div>
  </div>

  {/* Remarks Box (right) - Enhanced design */}
  {payroll.remarks && (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-purple-50">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Remarks</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{payroll.remarks}</p>
        </div>
      </div>
    </div>
  )}
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

      <div className="flex h-screen">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-8 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl h-10 font-bold bg-black bg-clip-text text-transparent">
                  Payroll Management
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  View and manage employee payroll records
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Records</p>
                  <p className="text-2xl font-bold text-gray-800">{payrolls.length}</p>
                </div>
                <button
                  onClick={exportToExcel}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 border border-gray-700 rounded-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 p-8 overflow-auto">
            {viewingPayroll || editingPayroll ? (
              <div className="space-y-6">
                <button
                  onClick={handleCancel}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Back to Payroll List
                </button>
                
                {editingPayroll ? (
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">Edit Payroll</h2>
                          <p className="text-sm text-gray-500 mt-1">
                            Update payroll details for {getEmployeeName(formData.employeeId)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 mb-4 text-xs">
  <div className="font-semibold text-gray-700 mb-1">Employee Information</div>
  <div className="flex items-center gap-2">
    <span className="text-gray-500">Employee:</span>
    <span className="font-medium">{getEmployeeName(formData.employeeId)}</span>
  </div>
  <div className="flex items-center gap-2 mt-1">
    <span className="text-gray-500">Structure ID:</span>
    <span className="font-medium">{formData.salaryStructureId}</span>
  </div>
</div>

<div className="grid grid-cols-5 gap-2">
  <div className="col-span-1 text-xs">
    <Input
      label="Basic Salary *"
      name="basicSalary"
      value={formData.basicSalary}
      onChange={handleInputChange}
      placeholder="0"
      error={validationErrors.basicSalary}
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"  // Increased padding and height
    />
  </div>

  <div className="col-span-1 text-xs">
    <Input
      label="HRA"
      name="houseRentAllowance"
      value={formData.houseRentAllowance}
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"
    />
  </div>

  <div className="col-span-1 text-xs">
    <Input
      label="Dearness Allowance"
      name="dearnessAllowance"
      value={formData.dearnessAllowance}
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"
    />
  </div>

  <div className="col-span-1 text-xs">
    <Input
      label="Conveyance Allowance"
      name="conveyanceAllowance"
      value={formData.conveyanceAllowance}
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"
    />
  </div>
  
  <div className="col-span-1 text-xs">
    <Input
      label="Medical Allowance"
      name="medicalAllowance"
      value={formData.medicalAllowance}
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"
    />
  </div>
</div>

<div className="grid grid-cols-5 gap-2 mt-1">
  <div className="col-span-1 text-xs">
    <Input
      label="Other Allowances"
      name="otherAllowances"
      value={formData.otherAllowances}
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"
    />
  </div>
  
  <div className="col-span-1 text-xs">
    <Input
      label="Entertainment Allowance"
      name="entertainmentAllowance"
      value={formData.entertainmentAllowance}
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"
    />
  </div>

  <div className="col-span-1 text-xs">
    <Input
      label="Special Allowance"
      name="specialAllowance"
      value={formData.specialAllowance}
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"
    />
  </div>

  <div className="col-span-1 text-xs">
    <Input
      label="Performance Bonus"
      name="performanceBonus"
      value={formData.performanceBonus}
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"
    />
  </div>

  <div className="col-span-1 text-xs">
    <Input
      label="Bonus"
      name="bonus"
      value={formData.bonus}
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"
    />
  </div>
</div>

<div className="grid grid-cols-5 gap-2 mt-1">
  <div className="col-span-1 text-xs">
    <Input
      label="Incentives"
      name="incentives"
      value={formData.incentives}
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"
    />
  </div>

  <div className="col-span-1 text-xs">
    <Input
      label="PF Contribution"
      name="pfEmpContribution"
      value={formData.pfEmpContribution}
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"
    />
  </div>

  <div className="col-span-1 text-xs relative">
    <Select
      label="TDS Type"
      name="tdsType"
      value={formData.tdsType}
      onChange={handleInputChange}
      options={[
        { value: "", label: "Select TDS Type" },
        { value: "10%", label: "10%" },
        { value: "20%", label: "20%" },
        { value: "30%", label: "30%" },
        { value: "Other", label: "Other" }
      ]}
      className="text-xs p-2 h-10 w-full"  // Increased padding and height
      menuClassName="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg"
    />
  </div>

  <div className="col-span-1 text-xs">
    <Input
      label="TDS Amount"
      name="tdsAmount"
      value={formData.tdsAmount}
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"
    />
  </div>

  <div className="col-span-1 text-xs">
    <Input
      label="Professional Tax"
      name="proffesionalTax"
      value={formData.proffesionalTax}
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"
    />
  </div>
</div>

<div className="grid grid-cols-5 gap-2 mt-1">
  <div className="col-span-1 text-xs">
    <Input
      label="Salary Advance Deductions"
      name="salaryAdvanceDeductions"
      value={formData.salaryAdvanceDeductions}
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"
    />
  </div>

  <div className="col-span-1 text-xs">
    <Input
      label="Loan Deductions"
      name="salaryLoanDeductions"
      value={formData.salaryLoanDeductions}
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"
    />
  </div>

  <div className="col-span-1 text-xs">
    <Input
      label="Fooding Deductions"
      name="foodingDeductions"
      value={formData.foodingDeductions}
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"
    />
  </div>

  <div className="col-span-1 text-xs">
    <Input
      label="Accommodation Deductions"
      name="accommodationDeductions"
      value={formData.accommodationDeductions}
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      prefix={true}
      className="text-xs p-2 h-10"
    />
  </div>

  <div className="col-span-1 text-xs">
    <Input
      label="Remarks"
      name="remarks"
      value={formData.remarks}
      onChange={handleInputChange}
      placeholder="Any additional notes"
      type="text"
      className="text-xs p-2 h-10"
    />
  </div>
</div>

      <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
  <div className="flex flex-wrap items-center justify-between gap-4">
    {/* Gross Salary */}
    <div className="flex-1 min-w-[200px]">
      <div className="bg-white rounded-md p-4 border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-green-50">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Gross Salary</h3>
            <p className="text-xl font-semibold text-gray-900">
              {formatCurrency(calculateGrossSalary())}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Net Salary */}
    <div className="flex-1 min-w-[200px]">
      <div className="bg-white rounded-md p-4 border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-50">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Net Salary</h3>
            <p className="text-xl font-semibold text-gray-900">
              {formatCurrency(calculateNetSalary())}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Optional: Add a separator */}
    <div className="hidden md:block h-12 w-px bg-gray-200"></div>

    {/* Optional: Add more salary metrics if needed */}
  </div>
</div>
                        <div className="flex justify-end gap-3 pt-6">
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submitLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg hover:from-blackhover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:opacity-70 transition-all duration-200"
                          >
                            {submitLoading ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : (
                  renderPayrollDetails(viewingPayroll)
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SL No
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Structure ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gross Salary
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Net Salary
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Updated At
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    {loading ? (
                      <TableSkeleton />
                    ) : (
                      <tbody className="bg-white divide-y divide-gray-200">
                        {payrolls.map((payroll, index) => (
                          <tr key={payroll._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {getEmployeeName(payroll.employeeId)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payroll.salaryStructureId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(payroll.grossSalary)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              {formatCurrency(payroll.netSalary)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(payroll.updatedAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleView(payroll)}
                                  className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                  title="View"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                                {/* <button
                                  onClick={() => handleEdit(payroll)}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-5 h-5" />
                                </button> */}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollManagement;