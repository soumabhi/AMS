import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle, AlertCircle, Send, Download } from 'lucide-react';

// Mock data that matches EmployeeManagement.js
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
  }
];

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Simulate API call with timeout
    const fetchEmployee = () => {
      setLoading(true);
      setTimeout(() => {
        const foundEmployee = mockEmployees.find(emp => emp.id === parseInt(id));
        if (foundEmployee) {
          setEmployee(foundEmployee);
        } else {
          setMessage({ type: 'error', text: 'Employee not found' });
        }
        setLoading(false);
      }, 500); // Simulate network delay
    };

    fetchEmployee();
  }, [id]);

  const handleSendToPayroll = () => {
    // In a real app, you would make an API call to update the status
    setMessage({ type: 'success', text: 'Employee sent to payroll successfully' });
    
    // Update the employee status locally for demo
    setEmployee(prev => ({
      ...prev,
      status: 'Payroll'
    }));
  };

  const handleDownloadCV = () => {
    // In a real app, this would download the actual file
    setMessage({ type: 'success', text: 'CV download started' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Employee not found</h2>
          <p className="text-gray-600 mt-2">The requested employee could not be found.</p>
          <button
            onClick={() => navigate('/EmployeeDetails')}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Back to Employee Management
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/EmployeeDetails')}
            className="flex items-center text-white hover:text-gray-200"
          >
            <ChevronLeft className="mr-1" size={20} />
            Back
          </button>
          <h1 className="text-xl font-bold">Employee Details</h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        {/* Employee Information */}
        <div className="p-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
              <div className="space-y-3">
                <p><span className="font-medium text-gray-700">Name:</span> {employee.name}</p>
                <p><span className="font-medium text-gray-700">Employee ID:</span> {employee.employeeId}</p>
                <p><span className="font-medium text-gray-700">Date of Joining:</span> {employee.dateOfJoining}</p>
                <p><span className="font-medium text-gray-700">Email:</span> {employee.email}</p>
                <p><span className="font-medium text-gray-700">Phone:</span> {employee.phone}</p>
                <p><span className="font-medium text-gray-700">Address:</span> {employee.address}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Employment Details</h2>
              <div className="space-y-3">
                <p><span className="font-medium text-gray-700">Branch:</span> {employee.branch}</p>
                <p><span className="font-medium text-gray-700">Designation:</span> {employee.designation}</p>
                <p><span className="font-medium text-gray-700">Job Band:</span> {employee.jobBand}</p>
                <p><span className="font-medium text-gray-700">Salary:</span> {employee.salary}</p>
                <p><span className="font-medium text-gray-700">Reporting Manager:</span> {employee.reportingManager}</p>
                <p>
                  <span className="font-medium text-gray-700">Status:</span> 
                  <span className={`ml-2 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                    employee.status === 'Verified' ? 'bg-green-100 text-green-800' :
                    employee.status === 'Payroll' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {employee.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* KRA Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Key Result Areas</h2>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="whitespace-pre-line">{employee.kra}</p>
            </div>
          </div>

          {/* CV Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Curriculum Vitae</h2>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded border border-gray-200">
              <div>
                <p className="font-medium">Current CV</p>
                <p className="text-sm text-gray-600">{employee.updatedCv.split('/').pop()}</p>
              </div>
              <button
                onClick={handleDownloadCV}
                className="flex items-center px-3 py-1.5 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors text-sm"
              >
                <Download className="mr-1" size={16} />
                Download CV
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            {employee.status !== 'Payroll' && (
              <button
                onClick={handleSendToPayroll}
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                <Send className="mr-2" size={16} />
                Send to Payroll Department
              </button>
            )}
            {employee.status === 'Payroll' && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2" size={16} />
                <span>Sent to Payroll Department</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {message.text && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg ${
          message.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;