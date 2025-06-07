import React, { useState, useEffect } from 'react';
import { Plus, Edit, Clock, Calendar, AlertCircle, CheckCircle, X, Users, CreditCard, Banknote, User, Percent, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Toast from '../../components/Toast';

const TableSkeleton = () => {
    return (
        <tbody className="bg-white divide-y divide-gray-100">
            {[...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-16"></div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

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
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 ${error ? 'border-gray-400 bg-gray-50/50' : 'hover:border-gray-300'} ${className}`}
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

const PayrollTable = () => {
    const [employees, setEmployees] = useState([
        { 
            id: 1, 
            name: 'John Smith', 
            gender: 'Male', 
            dept: 'Engineering',
            branch: 'Bangalore',
            desg: 'Senior Developer',
            doj: '2022-01-15',
            jobband: 'L4',
            email: 'john.smith@company.com',
            contact: '+91 9876543210',
            location: 'Koramangala'
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            gender: 'Female',
            dept: 'Design',
            branch: 'Mumbai',
            desg: 'UI/UX Designer',
            doj: '2022-02-20',
            jobband: 'L3',
            email: 'sarah.j@company.com',
            contact: '+91 9876543211',
            location: 'Bandra'
        },
        {
            id: 3,
            name: 'Michael Chen',
            gender: 'Male',
            dept: 'Product',
            branch: 'Delhi',
            desg: 'Product Manager',
            doj: '2022-03-10',
            jobband: 'L5',
            email: 'michael.c@company.com',
            contact: '+91 9876543212',
            location: 'Gurgaon'
        },
        {
            id: 4,
            name: 'Emma Davis',
            gender: 'Female',
            dept: 'Engineering',
            branch: 'Bangalore',
            desg: 'Frontend Developer',
            doj: '2022-04-05',
            jobband: 'L3',
            email: 'emma.d@company.com',
            contact: '+91 9876543213',
            location: 'Indiranagar'
        },
        {
            id: 5,
            name: 'Raj Patel',
            gender: 'Male',
            dept: 'Sales',
            branch: 'Mumbai',
            desg: 'Sales Manager',
            doj: '2022-05-15',
            jobband: 'L4',
            email: 'raj.p@company.com',
            contact: '+91 9876543214',
            location: 'Powai'
        },
        {
            id: 6,
            name: 'Priya Sharma',
            gender: 'Female',
            dept: 'HR',
            branch: 'Delhi',
            desg: 'HR Manager',
            doj: '2022-06-20',
            jobband: 'L4',
            email: 'priya.s@company.com',
            contact: '+91 9876543215',
            location: 'Noida'
        },
        {
            id: 7,
            name: 'Alex Wong',
            gender: 'Male',
            dept: 'Engineering',
            branch: 'Bangalore',
            desg: 'Backend Developer',
            doj: '2022-07-10',
            jobband: 'L3',
            email: 'alex.w@company.com',
            contact: '+91 9876543216',
            location: 'Whitefield'
        },
        {
            id: 8,
            name: 'Lisa Anderson',
            gender: 'Female',
            dept: 'Marketing',
            branch: 'Mumbai',
            desg: 'Marketing Lead',
            doj: '2022-08-15',
            jobband: 'L4',
            email: 'lisa.a@company.com',
            contact: '+91 9876543217',
            location: 'Andheri'
        },
        {
            id: 9,
            name: 'David Kim',
            gender: 'Male',
            dept: 'Finance',
            branch: 'Delhi',
            desg: 'Financial Analyst',
            doj: '2022-09-20',
            jobband: 'L3',
            email: 'david.k@company.com',
            contact: '+91 9876543218',
            location: 'Dwarka'
        },
        {
            id: 10,
            name: 'Sophia Lee',
            gender: 'Female',
            dept: 'Engineering',
            branch: 'Bangalore',
            desg: 'QA Engineer',
            doj: '2022-10-05',
            jobband: 'L3',
            email: 'sophia.l@company.com',
            contact: '+91 9876543219',
            location: 'HSR Layout'
        },
        {
            id: 11,
            name: 'Rahul Verma',
            gender: 'Male',
            dept: 'Operations',
            branch: 'Mumbai',
            desg: 'Operations Manager',
            doj: '2022-11-10',
            jobband: 'L4',
            email: 'rahul.v@company.com',
            contact: '+91 9876543220',
            location: 'Worli'
        },
        {
            id: 12,
            name: 'Anna Martinez',
            gender: 'Female',
            dept: 'Design',
            branch: 'Delhi',
            desg: 'Graphic Designer',
            doj: '2022-12-15',
            jobband: 'L3',
            email: 'anna.m@company.com',
            contact: '+91 9876543221',
            location: 'Vasant Kunj'
        },
        {
            id: 13,
            name: 'James Wilson',
            gender: 'Male',
            dept: 'Engineering',
            branch: 'Bangalore',
            desg: 'DevOps Engineer',
            doj: '2023-01-10',
            jobband: 'L4',
            email: 'james.w@company.com',
            contact: '+91 9876543222',
            location: 'Electronic City'
        },
        {
            id: 14,
            name: 'Maria Garcia',
            gender: 'Female',
            dept: 'Sales',
            branch: 'Mumbai',
            desg: 'Sales Executive',
            doj: '2023-02-15',
            jobband: 'L3',
            email: 'maria.g@company.com',
            contact: '+91 9876543223',
            location: 'Thane'
        },
        {
            id: 15,
            name: 'Arjun Singh',
            gender: 'Male',
            dept: 'Product',
            branch: 'Delhi',
            desg: 'Product Analyst',
            doj: '2023-03-20',
            jobband: 'L3',
            email: 'arjun.s@company.com',
            contact: '+91 9876543224',
            location: 'Saket'
        },
        {
            id: 16,
            name: 'Olivia Brown',
            gender: 'Female',
            dept: 'Engineering',
            branch: 'Bangalore',
            desg: 'Full Stack Developer',
            doj: '2023-04-25',
            jobband: 'L4',
            email: 'olivia.b@company.com',
            contact: '+91 9876543225',
            location: 'Bellandur'
        },
        {
            id: 17,
            name: 'Vikram Malhotra',
            gender: 'Male',
            dept: 'Finance',
            branch: 'Mumbai',
            desg: 'Finance Manager',
            doj: '2023-05-30',
            jobband: 'L5',
            email: 'vikram.m@company.com',
            contact: '+91 9876543226',
            location: 'BKC'
        },
        {
            id: 18,
            name: 'Isabella Clark',
            gender: 'Female',
            dept: 'HR',
            branch: 'Delhi',
            desg: 'HR Executive',
            doj: '2023-06-05',
            jobband: 'L3',
            email: 'isabella.c@company.com',
            contact: '+91 9876543227',
            location: 'Connaught Place'
        },
        {
            id: 19,
            name: 'Rohan Gupta',
            gender: 'Male',
            dept: 'Engineering',
            branch: 'Bangalore',
            desg: 'Mobile Developer',
            doj: '2023-07-10',
            jobband: 'L3',
            email: 'rohan.g@company.com',
            contact: '+91 9876543228',
            location: 'Marathahalli'
        },
        {
            id: 20,
            name: 'Sophie Taylor',
            gender: 'Female',
            dept: 'Marketing',
            branch: 'Mumbai',
            desg: 'Digital Marketing Specialist',
            doj: '2023-08-15',
            jobband: 'L3',
            email: 'sophie.t@company.com',
            contact: '+91 9876543229',
            location: 'Lower Parel'
        },
        {
            id: 21,
            name: 'Aditya Kumar',
            gender: 'Male',
            dept: 'Engineering',
            branch: 'Delhi',
            desg: 'System Architect',
            doj: '2023-09-20',
            jobband: 'L5',
            email: 'aditya.k@company.com',
            contact: '+91 9876543230',
            location: 'Cyber City'
        },
        {
            id: 22,
            name: 'Emma Wilson',
            gender: 'Female',
            dept: 'Design',
            branch: 'Bangalore',
            desg: 'UI Designer',
            doj: '2023-10-25',
            jobband: 'L3',
            email: 'emma.w@company.com',
            contact: '+91 9876543231',
            location: 'JP Nagar'
        },
        {
            id: 23,
            name: 'Rahul Sharma',
            gender: 'Male',
            dept: 'Sales',
            branch: 'Mumbai',
            desg: 'Business Development Manager',
            doj: '2023-11-30',
            jobband: 'L4',
            email: 'rahul.s@company.com',
            contact: '+91 9876543232',
            location: 'Andheri East'
        },
        {
            id: 24,
            name: 'Priya Patel',
            gender: 'Female',
            dept: 'Product',
            branch: 'Delhi',
            desg: 'Product Owner',
            doj: '2023-12-05',
            jobband: 'L4',
            email: 'priya.p@company.com',
            contact: '+91 9876543233',
            location: 'Greater Noida'
        },
        {
            id: 25,
            name: 'Aryan Singh',
            gender: 'Male',
            dept: 'Engineering',
            branch: 'Bangalore',
            desg: 'Data Engineer',
            doj: '2024-01-10',
            jobband: 'L4',
            email: 'aryan.s@company.com',
            contact: '+91 9876543234',
            location: 'Sarjapur'
        },
        {
            id: 26,
            name: 'Zara Khan',
            gender: 'Female',
            dept: 'Finance',
            branch: 'Mumbai',
            desg: 'Investment Analyst',
            doj: '2024-02-15',
            jobband: 'L3',
            email: 'zara.k@company.com',
            contact: '+91 9876543235',
            location: 'Colaba'
        },
        {
            id: 27,
            name: 'Vihaan Reddy',
            gender: 'Male',
            dept: 'HR',
            branch: 'Delhi',
            desg: 'Talent Acquisition Specialist',
            doj: '2024-03-20',
            jobband: 'L3',
            email: 'vihaan.r@company.com',
            contact: '+91 9876543236',
            location: 'Rohini'
        },
        {
            id: 28,
            name: 'Ananya Gupta',
            gender: 'Female',
            dept: 'Engineering',
            branch: 'Bangalore',
            desg: 'Cloud Engineer',
            doj: '2024-04-25',
            jobband: 'L4',
            email: 'ananya.g@company.com',
            contact: '+91 9876543237',
            location: 'Hebbal'
        },
        {
            id: 29,
            name: 'Karthik Nair',
            gender: 'Male',
            dept: 'Marketing',
            branch: 'Mumbai',
            desg: 'Brand Manager',
            doj: '2024-05-30',
            jobband: 'L4',
            email: 'karthik.n@company.com',
            contact: '+91 9876543238',
            location: 'Bandra West'
        },
        {
            id: 30,
            name: 'Meera Joshi',
            gender: 'Female',
            dept: 'Engineering',
            branch: 'Delhi',
            desg: 'Security Engineer',
            doj: '2024-06-05',
            jobband: 'L4',
            email: 'meera.j@company.com',
            contact: '+91 9876543239',
            location: 'Vasant Vihar'
        },
        {
            id: 31,
            name: 'Rohan Mehta',
            gender: 'Male',
            dept: 'Design',
            branch: 'Bangalore',
            desg: 'UX Researcher',
            doj: '2024-07-10',
            jobband: 'L3',
            email: 'rohan.m@company.com',
            contact: '+91 9876543240',
            location: 'Indiranagar'
        },
        {
            id: 32,
            name: 'Sneha Iyer',
            gender: 'Female',
            dept: 'Sales',
            branch: 'Mumbai',
            desg: 'Sales Operations Manager',
            doj: '2024-08-15',
            jobband: 'L4',
            email: 'sneha.i@company.com',
            contact: '+91 9876543241',
            location: 'Powai'
        },
        {
            id: 33,
            name: 'Arnav Kapoor',
            gender: 'Male',
            dept: 'Product',
            branch: 'Delhi',
            desg: 'Product Marketing Manager',
            doj: '2024-09-20',
            jobband: 'L4',
            email: 'arnav.k@company.com',
            contact: '+91 9876543242',
            location: 'Saket'
        },
        {
            id: 34,
            name: 'Diya Sharma',
            gender: 'Female',
            dept: 'Engineering',
            branch: 'Bangalore',
            desg: 'ML Engineer',
            doj: '2024-10-25',
            jobband: 'L4',
            email: 'diya.s@company.com',
            contact: '+91 9876543243',
            location: 'Koramangala'
        },
        {
            id: 35,
            name: 'Vedant Patel',
            gender: 'Male',
            dept: 'Finance',
            branch: 'Mumbai',
            desg: 'Financial Controller',
            doj: '2024-11-30',
            jobband: 'L5',
            email: 'vedant.p@company.com',
            contact: '+91 9876543244',
            location: 'BKC'
        },
        {
            id: 36,
            name: 'Anvi Reddy',
            gender: 'Female',
            dept: 'HR',
            branch: 'Delhi',
            desg: 'HR Business Partner',
            doj: '2024-12-05',
            jobband: 'L4',
            email: 'anvi.r@company.com',
            contact: '+91 9876543245',
            location: 'Gurgaon'
        },
        {
            id: 37,
            name: 'Reyansh Kumar',
            gender: 'Male',
            dept: 'Engineering',
            branch: 'Bangalore',
            desg: 'Blockchain Developer',
            doj: '2025-01-10',
            jobband: 'L4',
            email: 'reyansh.k@company.com',
            contact: '+91 9876543246',
            location: 'Whitefield'
        },
        {
            id: 38,
            name: 'Myra Singh',
            gender: 'Female',
            dept: 'Marketing',
            branch: 'Mumbai',
            desg: 'Content Strategist',
            doj: '2025-02-15',
            jobband: 'L3',
            email: 'myra.s@company.com',
            contact: '+91 9876543247',
            location: 'Andheri'
        },
        {
            id: 39,
            name: 'Aarav Gupta',
            gender: 'Male',
            dept: 'Engineering',
            branch: 'Delhi',
            desg: 'Game Developer',
            doj: '2025-03-20',
            jobband: 'L3',
            email: 'aarav.g@company.com',
            contact: '+91 9876543248',
            location: 'Dwarka'
        },
        {
            id: 40,
            name: 'Riya Sharma',
            gender: 'Female',
            dept: 'Design',
            branch: 'Bangalore',
            desg: 'Motion Designer',
            doj: '2025-04-25',
            jobband: 'L3',
            email: 'riya.s@company.com',
            contact: '+91 9876543249',
            location: 'HSR Layout'
        },
        {
            id: 41,
            name: 'Vivaan Patel',
            gender: 'Male',
            dept: 'Sales',
            branch: 'Mumbai',
            desg: 'Enterprise Sales Manager',
            doj: '2025-05-30',
            jobband: 'L4',
            email: 'vivaan.p@company.com',
            contact: '+91 9876543250',
            location: 'Worli'
        },
        {
            id: 42,
            name: 'Aisha Khan',
            gender: 'Female',
            dept: 'Product',
            branch: 'Delhi',
            desg: 'Product Strategy Lead',
            doj: '2025-06-05',
            jobband: 'L5',
            email: 'aisha.k@company.com',
            contact: '+91 9876543251',
            location: 'Vasant Kunj'
        },
        {
            id: 43,
            name: 'Ishaan Nair',
            gender: 'Male',
            dept: 'Engineering',
            branch: 'Bangalore',
            desg: 'AR/VR Developer',
            doj: '2025-07-10',
            jobband: 'L4',
            email: 'ishaan.n@company.com',
            contact: '+91 9876543252',
            location: 'Electronic City'
        },
        {
            id: 44,
            name: 'Zara Joshi',
            gender: 'Female',
            dept: 'Finance',
            branch: 'Mumbai',
            desg: 'Risk Analyst',
            doj: '2025-08-15',
            jobband: 'L3',
            email: 'zara.j@company.com',
            contact: '+91 9876543253',
            location: 'Thane'
        },
        {
            id: 45,
            name: 'Rudra Mehta',
            gender: 'Male',
            dept: 'HR',
            branch: 'Delhi',
            desg: 'Learning & Development Manager',
            doj: '2025-09-20',
            jobband: 'L4',
            email: 'rudra.m@company.com',
            contact: '+91 9876543254',
            location: 'Saket'
        },
        {
            id: 46,
            name: 'Anaya Iyer',
            gender: 'Female',
            dept: 'Engineering',
            branch: 'Bangalore',
            desg: 'IoT Engineer',
            doj: '2025-10-25',
            jobband: 'L4',
            email: 'anaya.i@company.com',
            contact: '+91 9876543255',
            location: 'Bellandur'
        },
        {
            id: 47,
            name: 'Vihaan Kapoor',
            gender: 'Male',
            dept: 'Marketing',
            branch: 'Mumbai',
            desg: 'Growth Marketing Manager',
            doj: '2025-11-30',
            jobband: 'L4',
            email: 'vihaan.k@company.com',
            contact: '+91 9876543256',
            location: 'BKC'
        },
        {
            id: 48,
            name: 'Riya Sharma',
            gender: 'Female',
            dept: 'Engineering',
            branch: 'Delhi',
            desg: 'Performance Engineer',
            doj: '2025-12-05',
            jobband: 'L4',
            email: 'riya.s@company.com',
            contact: '+91 9876543257',
            location: 'Connaught Place'
        },
        {
            id: 49,
            name: 'Aryan Patel',
            gender: 'Male',
            dept: 'Design',
            branch: 'Bangalore',
            desg: '3D Designer',
            doj: '2026-01-10',
            jobband: 'L3',
            email: 'aryan.p@company.com',
            contact: '+91 9876543258',
            location: 'Marathahalli'
        },
        {
            id: 50,
            name: 'Myra Reddy',
            gender: 'Female',
            dept: 'Sales',
            branch: 'Mumbai',
            desg: 'Channel Sales Manager',
            doj: '2026-02-15',
            jobband: 'L4',
            email: 'myra.r@company.com',
            contact: '+91 9876543259',
            location: 'Lower Parel'
        }
    ]);

    const [editingEmployee, setEditingEmployee] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
    const [activeTab, setActiveTab] = useState('payment');
    const [formData, setFormData] = useState({
        paymentMethod: "bank",
        accountHolderName: "",
        bankName: "",
        branchName: "",
        accountNumber: "",
        ifscCode: "",
        tdsEnabled: false,
        pfEnabled: false,
        esiEnabled: false,
        tdsPercentage: 0,
        pfPercentage: 0,
        esiPercentage: 0,
        panNumber: "",
        uanNumber: "",
        epicNumber: ""
    });
    const [validationErrors, setValidationErrors] = useState({});

    // Add new state for items per page
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);

    useEffect(() => {
        // Select the first employee by default when the page loads
        if (employees.length > 0 && !editingEmployee) {
            handleEdit(employees[0]);
        }
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    const hideToast = () => {
        setToast({ ...toast, isVisible: false });
    };

    const resetForm = () => {
        setFormData({
            paymentMethod: "bank",
            accountHolderName: "",
            bankName: "",
            branchName: "",
            accountNumber: "",
            ifscCode: "",
            tdsEnabled: false,
            pfEnabled: false,
            esiEnabled: false,
            tdsPercentage: 0,
            pfPercentage: 0,
            esiPercentage: 0,
            panNumber: "",
            uanNumber: "",
            epicNumber: ""
        });
        setValidationErrors({});
        setEditingEmployee(null);
        setActiveTab('payment');
    };

    const validateForm = () => {
        const errors = {};
        if (activeTab === 'payment' && formData.paymentMethod === 'bank') {
            if (!formData.accountNumber) {
                errors.accountNumber = 'Account number is required';
            }
            if (!formData.ifscCode) {
                errors.ifscCode = 'IFSC code is required';
            }
        }
        if (activeTab === 'deductions') {
            if (formData.tdsEnabled) {
                if (!formData.tdsPercentage) {
                    errors.tdsPercentage = 'TDS percentage is required';
                }
                if (!formData.panNumber) {
                    errors.panNumber = 'PAN number is required';
                } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
                    errors.panNumber = 'Invalid PAN number format';
                }
            }
            if (formData.pfEnabled) {
                if (!formData.pfPercentage) {
                    errors.pfPercentage = 'PF percentage is required';
                }
                if (!formData.uanNumber) {
                    errors.uanNumber = 'UAN number is required';
                } else if (!/^\d{12}$/.test(formData.uanNumber)) {
                    errors.uanNumber = 'UAN should be 12 digits';
                }
            }
            if (formData.esiEnabled) {
                if (!formData.esiPercentage) {
                    errors.esiPercentage = 'ESI percentage is required';
                }
                if (!formData.esicNumber) {
                    errors.esicNumber = 'ESIC number is required';
                } else if (!/^\d{17}$/.test(formData.esicNumber)) {
                    errors.esicNumber = 'ESIC should be 17 digits';
                }
            }
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            showToast('Please fix all validation errors', 'error');
            return;
        }

        setSubmitLoading(true);
        try {
            // Here you would typically make an API call to save the data
            const updatedEmployee = {
                ...editingEmployee,
                ...formData
            };
            
            setEmployees(employees.map(emp => 
                emp.id === editingEmployee.id ? updatedEmployee : emp
            ));
            
            showToast('Employee details updated successfully');
            resetForm();
        } catch (error) {
            showToast(error.message || 'Failed to save changes', 'error');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEdit = (employee) => {
        console.log('✏️ Editing employee:', employee);
        setEditingEmployee(employee);
        setActiveTab('payment');
        setFormData({
            paymentMethod: employee.paymentMethod || 'bank',
            accountHolderName: employee.accountHolderName || '',
            bankName: employee.bankName || '',
            branchName: employee.branchName || '',
            accountNumber: employee.accountNumber || '',
            ifscCode: employee.ifscCode || '',
            tdsEnabled: employee.tdsEnabled || false,
            pfEnabled: employee.pfEnabled || false,
            esiEnabled: employee.esiEnabled || false,
            tdsPercentage: employee.tdsPercentage || 0,
            pfPercentage: employee.pfPercentage || 0,
            esiPercentage: employee.esiPercentage || 0,
            panNumber: employee.panNumber || '',
            uanNumber: employee.uanNumber || '',
            epicNumber: employee.epicNumber || ''
        });
        setValidationErrors({});
    };

    const handleCancel = () => {
        resetForm();
        if (employees.length > 0) {
            handleEdit(employees[0]);
        }
    };

    // Filter employees based on search query
    const filteredEmployees = employees.filter(employee => {
        const searchTerm = searchQuery.toLowerCase();
        const matchesSearch = employee.name.toLowerCase().includes(searchTerm) ||
                            employee.email.toLowerCase().includes(searchTerm) ||
                            employee.dept.toLowerCase().includes(searchTerm) ||
                            employee.branch.toLowerCase().includes(searchTerm) ||
                            employee.desg.toLowerCase().includes(searchTerm) ||
                            `EMP${employee.id.toString().padStart(4, '0')}`.toLowerCase().includes(searchTerm);
        const matchesDepartment = !selectedDepartment || employee.dept === selectedDepartment;
        const matchesBranch = !selectedBranch || employee.branch === selectedBranch;
        return matchesSearch && matchesDepartment && matchesBranch;
    });

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    // Get current page employees
    const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

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
                    {/* Enhanced Header */}
                    <div className="p-8 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl h-10 font-bold bg-black bg-clip-text text-transparent">
                                    Payroll Management
                                </h1>
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Configure employee payroll and deduction details
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Employees</p>
                                    <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1); // Reset to first page on search
                                }}
                                placeholder="Search by name, email, department, branch..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="flex-1 p-8 overflow-auto">
                        {/* Enhanced Table */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Emp ID
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Branch
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Position
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                {loading ? (
                                    <TableSkeleton />
                                ) : (
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {currentEmployees.map((employee) => (
                                            <tr key={employee.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="text-xs font-medium text-gray-900">
                                                        EMP{employee.id.toString().padStart(4, '0')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="text-xs font-medium text-gray-900">{employee.name}</div>
                                                    <div className="text-xs text-gray-500">{employee.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200">
                                                        {employee.branch}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex flex-col items-center">
                                                        <div className="text-xs text-gray-900">{employee.desg}</div>
                                                        <div className="text-xs text-gray-500">Band: {employee.jobband}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <button
                                                        onClick={() => handleEdit(employee)}
                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-xl hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                                                    >
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {!loading && filteredEmployees.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-16 text-center">
                                                    <div className="text-center">
                                                        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                                            {searchQuery ? (
                                                                <Search className="w-12 h-12 text-gray-500" />
                                                            ) : (
                                                                <CreditCard className="w-12 h-12 text-gray-500" />
                                                            )}
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                            {searchQuery ? 'No matching results' : 'No payroll details available'}
                                                        </h3>
                                                        <p className="text-gray-500">
                                                            {searchQuery ? 'Try adjusting your search terms' : 'Get started by adding payroll details for your employees.'}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                )}
                            </table>

                            {/* Updated Pagination Controls */}
                            {filteredEmployees.length > 0 && (
                                <div className="px-6 py-4 bg-white border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm text-gray-600">
                                                Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} results
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">Show</span>
                                                <select
                                                    value={itemsPerPage}
                                                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                                    className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500"
                                                >
                                                    <option value={5}>5</option>
                                                    <option value={10}>10</option>
                                                    <option value={15}>15</option>
                                                    <option value={20}>20</option>
                                                </select>
                                                <span className="text-sm text-gray-600">entries</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Previous Page"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            
                                            {/* Dynamic Page Numbers */}
                                            <div className="flex items-center gap-1">
                                                {[...Array(totalPages)].map((_, index) => {
                                                    const pageNumber = index + 1;
                                                    // Show first page, last page, current page, and pages around current page
                                                    if (
                                                        pageNumber === 1 ||
                                                        pageNumber === totalPages ||
                                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                                    ) {
                                                        return (
                                                            <button
                                                                key={pageNumber}
                                                                onClick={() => handlePageChange(pageNumber)}
                                                                className={`min-w-[2.5rem] h-10 px-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                                    currentPage === pageNumber
                                                                        ? 'bg-black text-white shadow-lg'
                                                                        : 'text-gray-600 hover:bg-gray-100'
                                                                }`}
                                                            >
                                                                {pageNumber}
                                                            </button>
                                                        );
                                                    } else if (
                                                        pageNumber === currentPage - 2 ||
                                                        pageNumber === currentPage + 2
                                                    ) {
                                                        // Show ellipsis
                                                        return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                                                    }
                                                    return null;
                                                })}
                                            </div>

                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Next Page"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Enhanced Right Sidebar Form */}
                <div className="w-96 bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 flex flex-col backdrop-blur-sm">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold bg-black bg-clip-text text-transparent">
                                    {editingEmployee ? 'Edit Payroll Details' : 'Add Payroll Details'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {editingEmployee ? 'Update employee payment information' : 'Configure new payment details'}
                                </p>
                            </div>
                            {editingEmployee && (
                                <button
                                    onClick={handleCancel}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Enhanced Tabs */}
                        <div className="flex space-x-2 mt-6">
                            <button
                                onClick={() => setActiveTab('payment')}
                                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                                    activeTab === 'payment'
                                        ? 'bg-black text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                <CreditCard className="w-4 h-4" />
                                Payment
                            </button>
                            <button
                                onClick={() => setActiveTab('deductions')}
                                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                                    activeTab === 'deductions'
                                        ? 'bg-black text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                <Percent className="w-4 h-4" />
                                Deductions
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-6 overflow-auto">
                        <div className="space-y-6">
                            {activeTab === 'payment' && (
                                <div className="space-y-6">
                                    {/* Employee Info Card */}
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-inner">
                                                {editingEmployee?.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900">{editingEmployee?.name}</h3>
                                                <p className="text-xs text-gray-500">{editingEmployee?.email}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                                                        EMP{editingEmployee?.id.toString().padStart(4, '0')}
                                                    </span>
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                                                        {editingEmployee?.dept}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Payment Method</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => setFormData({...formData, paymentMethod: 'bank'})}
                                                className={`p-4 border rounded-xl flex items-center justify-center space-x-3 transition-all ${
                                                    formData.paymentMethod === 'bank'
                                                        ? 'border-black bg-black text-white shadow-lg'
                                                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                                }`}
                                            >
                                                <CreditCard className="h-5 w-5" />
                                                <span className="font-medium">Bank Transfer</span>
                                            </button>
                                            <button
                                                onClick={() => setFormData({...formData, paymentMethod: 'cash'})}
                                                className={`p-4 border rounded-xl flex items-center justify-center space-x-3 transition-all ${
                                                    formData.paymentMethod === 'cash'
                                                        ? 'border-black bg-black text-white shadow-lg'
                                                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                                }`}
                                            >
                                                <Banknote className="h-5 w-5" />
                                                <span className="font-medium">Cash Payment</span>
                                            </button>
                                        </div>
                                    </div>

                                    {formData.paymentMethod === 'bank' && (
                                        <div className="space-y-4">
                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-4">
                                                <div className="space-y-4">
                                                    <Input
                                                        label="Account Holder Name *"
                                                        value={formData.accountHolderName}
                                                        onChange={(e) => setFormData({...formData, accountHolderName: e.target.value})}
                                                        placeholder="Enter account holder name"
                                                        error={validationErrors.accountHolderName}
                                                        className="bg-white"
                                                    />
                                                    <Input
                                                        label="Bank Name *"
                                                        value={formData.bankName}
                                                        onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                                                        placeholder="Enter bank name"
                                                        error={validationErrors.bankName}
                                                        className="bg-white"
                                                    />
                                                    <Input
                                                        label="Branch Name *"
                                                        value={formData.branchName}
                                                        onChange={(e) => setFormData({...formData, branchName: e.target.value})}
                                                        placeholder="Enter branch name"
                                                        error={validationErrors.branchName}
                                                        className="bg-white"
                                                    />
                                                    <Input
                                                        label="Account Number *"
                                                        value={formData.accountNumber}
                                                        onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                                                        placeholder="Enter account number"
                                                        error={validationErrors.accountNumber}
                                                        className="bg-white"
                                                    />
                                                    <Input
                                                        label="IFSC Code *"
                                                        value={formData.ifscCode}
                                                        onChange={(e) => setFormData({...formData, ifscCode: e.target.value.toUpperCase()})}
                                                        placeholder="Enter IFSC code"
                                                        error={validationErrors.ifscCode}
                                                        className="bg-white"
                                                    />
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                                                <div className="flex items-start">
                                                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 mt-0.5 shadow-lg">
                                                        <AlertCircle className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-gray-900 mb-2">Bank Details Guidelines:</p>
                                                        <ul className="space-y-2">
                                                            <li className="flex items-center gap-2 text-sm text-gray-600">
                                                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                                                <span>Enter account holder name as per bank records</span>
                                                            </li>
                                                            <li className="flex items-center gap-2 text-sm text-gray-600">
                                                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                                                <span>Double check account number before saving</span>
                                                            </li>
                                                            <li className="flex items-center gap-2 text-sm text-gray-600">
                                                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                                                <span>IFSC code should be 11 characters</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'deductions' && (
                                <div className="space-y-6">
                                    {/* Employee Info Card */}
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-inner">
                                                {editingEmployee?.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900">{editingEmployee?.name}</h3>
                                                <p className="text-xs text-gray-500">{editingEmployee?.email}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                                                        EMP{editingEmployee?.id.toString().padStart(4, '0')}
                                                    </span>
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                                                        {editingEmployee?.dept}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TDS Section */}
                                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                                                        <Percent className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-gray-900">Tax Deducted at Source (TDS)</h3>
                                                        <p className="text-xs text-gray-500">Enable TDS deduction for this employee</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.tdsEnabled}
                                                        onChange={(e) => setFormData({...formData, tdsEnabled: e.target.checked})}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                                </label>
                                            </div>
                                        </div>
                                        {formData.tdsEnabled && (
                                            <div className="p-4 space-y-4 bg-gradient-to-br from-gray-50 to-gray-100">
                                                <Input
                                                    type="text"
                                                    label="PAN Number *"
                                                    value={formData.panNumber}
                                                    onChange={(e) => setFormData({...formData, panNumber: e.target.value.toUpperCase()})}
                                                    placeholder="Enter PAN number"
                                                    error={validationErrors.panNumber}
                                                    className="bg-white"
                                                />
                                                <Input
                                                    type="number"
                                                    label="TDS Percentage *"
                                                    value={formData.tdsPercentage}
                                                    onChange={(e) => setFormData({...formData, tdsPercentage: parseFloat(e.target.value)})}
                                                    placeholder="Enter TDS %"
                                                    error={validationErrors.tdsPercentage}
                                                    className="bg-white"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* PF Section */}
                                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                                                        <Percent className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-gray-900">Provident Fund (PF)</h3>
                                                        <p className="text-xs text-gray-500">Enable PF deduction for this employee</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.pfEnabled}
                                                        onChange={(e) => setFormData({...formData, pfEnabled: e.target.checked})}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                                </label>
                                            </div>
                                        </div>
                                        {formData.pfEnabled && (
                                            <div className="p-4 space-y-4 bg-gradient-to-br from-gray-50 to-gray-100">
                                                <Input
                                                    type="text"
                                                    label="UAN Number *"
                                                    value={formData.uanNumber}
                                                    onChange={(e) => setFormData({...formData, uanNumber: e.target.value})}
                                                    placeholder="Enter UAN number"
                                                    error={validationErrors.uanNumber}
                                                    className="bg-white"
                                                />
                                                <Input
                                                    type="number"
                                                    label="PF Percentage *"
                                                    value={formData.pfPercentage}
                                                    onChange={(e) => setFormData({...formData, pfPercentage: parseFloat(e.target.value)})}
                                                    placeholder="Enter PF %"
                                                    error={validationErrors.pfPercentage}
                                                    className="bg-white"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* ESI Section */}
                                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                                                        <Percent className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-gray-900">Employee State Insurance (ESI)</h3>
                                                        <p className="text-xs text-gray-500">Enable ESI deduction for this employee</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.esiEnabled}
                                                        onChange={(e) => setFormData({...formData, esiEnabled: e.target.checked})}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                                </label>
                                            </div>
                                        </div>
                                        {formData.esiEnabled && (
                                            <div className="p-4 space-y-4 bg-gradient-to-br from-gray-50 to-gray-100">
                                                <Input
                                                    type="text"
                                                    label="EPIC Number *"
                                                    value={formData.epicNumber}
                                                    onChange={(e) => setFormData({...formData, epicNumber: e.target.value})}
                                                    placeholder="Enter EPIC number"
                                                    error={validationErrors.epicNumber}
                                                    className="bg-white"
                                                />
                                                <Input
                                                    type="number"
                                                    label="ESI Percentage *"
                                                    value={formData.esiPercentage}
                                                    onChange={(e) => setFormData({...formData, esiPercentage: parseFloat(e.target.value)})}
                                                    placeholder="Enter ESI %"
                                                    error={validationErrors.esiPercentage}
                                                    className="bg-white"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="flex-1 px-4 py-3 text-sm font-medium text-black bg-white border border-black rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitLoading}
                                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <div className="flex items-center justify-center">
                                    {submitLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            {editingEmployee ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            {editingEmployee ? 'Update Employee' : 'Create Employee'}
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayrollTable;