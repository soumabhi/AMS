import React, { useState } from 'react';
import { 
  User, Mail, Phone, Calendar, Home, 
  BookOpen, Briefcase, Banknote, FileText, 
  Plus, X, Trash2, Eye, Heart, Globe, 
  CreditCard, ClipboardCheck, Stethoscope, ChevronRight, ChevronLeft
} from 'lucide-react';
import Toast from '../../components/Toast';

const AddEmployee = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
      personal: {
        salutation: 'Mr.',
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        dob: '',
        age: '',
        bloodGroup: '',
        contactNumber: '',
        alternateNumber: '',
        userEmail: '',
        panNumber: '',
        aadharNumber: '',
      },
      contact: {
        area: '',
        city: '',
        block: '',
        district: '',
        state: '',
        pinCode: '',
        country: 'India',
      },
      emergency: {
        name: '',
        relationship: '',
        phone: '',
      },
      education: [{ 
        id: 1, 
        qualification: '', 
        institution: '', 
        year: '', 
        marks: '',
        documents: [] 
      }],
      experience: [{ 
        id: 1, 
        company: '', 
        position: '', 
        startDate: '', 
        endDate: '',
        responsibilities: '',
        offerLetter: []
      }],
      payroll: {
        paymentMode: 'bankaccount',
        accountHolder: '',
        bankName: '',
        accountNumber: '',
        ifsc: '',
        bankBranch: '',
        pfEnabled: false,
        uanNumber: '',
        esiEnabled: false,
        esicNumber: ''
      },
      documents: {
        resume: null,
        photo: null,
        aadhar: null,
        pan: null,
        bankPassbook: null
      },
      medical: {
        hepatitis: null,
        tetanus: null,
        cbc: null,
        urine: null,
        chestXray: null
      },
      vaccination: [{
        id: 1,
        name: '',
        doses: [{
          date: '',
          certificate: null
        }]
      }]
    });

     // Input component for consistent styling
  const Input = ({ label, value, onChange, placeholder, type = "text", required = false, icon, className = "" }) => (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-gray-300 ${icon ? 'pl-10' : ''} ${className}`}
        />
      </div>
    </div>
  );

  const Select = ({ label, value, onChange, options, required = false, icon, className = "" }) => (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-gray-300 appearance-none ${icon ? 'pl-10' : ''} ${className}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 4000);
  };

  const handleInputChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };

  const handleArrayChange = (section, index, field, value) => {
    const updatedArray = [...formData[section]];
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    setFormData({
      ...formData,
      [section]: updatedArray
    });
  };

  const addArrayItem = (section) => {
    const newId = formData[section].length + 1;
    setFormData({
      ...formData,
      [section]: [...formData[section], { id: newId }]
    });
  };

  const removeArrayItem = (section, index) => {
    const updatedArray = formData[section].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [section]: updatedArray
    });
  };

  const handleFileUpload = (section, fileType, file) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [fileType]: file
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Employee added successfully');
    // Here you would normally submit the form data to your backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6">
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation - Enhanced Design */}
          <div className="w-full md:w-64">
            <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="mb-6">
                <div className="relative">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl w-24 h-24 mx-auto flex items-center justify-center">
                    {formData.documents.photo ? (
                      <img 
                        src={URL.createObjectURL(formData.documents.photo)} 
                        alt="Employee" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <button 
                      onClick={() => document.getElementById('photo-upload').click()}
                      className="text-sm text-blue-600 hover:text-blue-800 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg px-3 py-1.5 transition-all duration-200"
                    >
                      Upload Photo
                    </button>
                    <input 
                      type="file" 
                      id="photo-upload" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload('documents', 'photo', e.target.files[0])}
                    />
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {[
                  {id: 'personal', icon: <User className="w-5 h-5" />, label: 'Personal Info'},
                  {id: 'contact', icon: <Home className="w-5 h-5" />, label: 'Contact Info'},
                  {id: 'emergency', icon: <Phone className="w-5 h-5" />, label: 'Emergency Contact'},
                  {id: 'education', icon: <BookOpen className="w-5 h-5" />, label: 'Education'},
                  {id: 'experience', icon: <Briefcase className="w-5 h-5" />, label: 'Experience'},
                  {id: 'payroll', icon: <Banknote className="w-5 h-5" />, label: 'Payroll'},
                  {id: 'documents', icon: <FileText className="w-5 h-5" />, label: 'Documents'},
                  {id: 'medical', icon: <Stethoscope className="w-5 h-5" />, label: 'Medical'},
                  {id: 'vaccination', icon: <ClipboardCheck className="w-5 h-5" />, label: 'Vaccination'}
                ].map(({id, icon, label}) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-sm transition-all duration-200 ${
                      activeSection === id
                        ? 'bg-gradient-to-r from-gray-800 to-black text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{icon}</span>
                      <span>{label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
              </nav>

              <div className="mt-6 text-xs bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-3">
                <div className="flex items-start">
                  <div className="mt-0.5">
                    <span className="font-medium text-blue-800">All fields marked with * are required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form Content - Enhanced Design */}
          <div className="flex-1">
            <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Form Header */}
              <div className="p-6 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                      <User className="w-6 h-6 mr-2 text-gray-700" />
                      Add New Employee
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">Fill in all required details</p>
                  </div>
                  <button 
                    onClick={() => window.history.back()} 
                    className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-xl hover:from-gray-100 hover:to-gray-200 text-sm flex items-center shadow-sm transition-all duration-200"
                  >
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  {/* Personal Details - Enhanced */}
                  {activeSection === 'personal' && (
                    <div className="space-y-6">
                      <div className="pb-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                          <User className="w-5 h-5 mr-2 text-gray-700" />
                          Personal Information
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Salutation */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Salutation *</label>
                          <select
                            value={formData.personal.salutation}
                            onChange={(e) => handleInputChange('personal', 'salutation', e.target.value)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                          >
                            <option value="Mr.">Mr.</option>
                            <option value="Mrs.">Mrs.</option>
                            <option value="Miss">Miss</option>
                          </select>
                        </div>
                        
                        {/* First Name */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                          <input
                            type="text"
                            value={formData.personal.firstName}
                            onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                            placeholder="John"
                            required
                          />
                        </div>
                        
                        {/* Middle Name */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Name</label>
                          <input
                            type="text"
                            value={formData.personal.middleName}
                            onChange={(e) => handleInputChange('personal', 'middleName', e.target.value)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                            placeholder="Middle"
                          />
                        </div>
                        
                        {/* Last Name */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                          <input
                            type="text"
                            value={formData.personal.lastName}
                            onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                            placeholder="Doe"
                            required
                          />
                        </div>
                        
                        {/* Gender */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                          <select
                            value={formData.personal.gender}
                            onChange={(e) => handleInputChange('personal', 'gender', e.target.value)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                            required
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        {/* DOB */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
                          <div className="relative">
                            <input
                              type="date"
                              value={formData.personal.dob}
                              onChange={(e) => handleInputChange('personal', 'dob', e.target.value)}
                              className="w-full px-4 py-3 pl-12 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                              required
                            />
                            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        
                        {/* Age */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                          <input
                            type="text"
                            value={formData.personal.age}
                            readOnly
                            className="w-full px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-200 rounded-xl shadow-sm text-sm"
                          />
                        </div>
                        
                        {/* Blood Group */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group *</label>
                          <div className="relative">
                            <select
                              value={formData.personal.bloodGroup}
                              onChange={(e) => handleInputChange('personal', 'bloodGroup', e.target.value)}
                              className="w-full px-4 py-3 pl-12 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                              required
                            >
                              <option value="">Select Blood Group</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                            </select>
                            <Heart className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        
                        {/* Contact Number */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number *</label>
                          <div className="relative">
                            <input
                              type="tel"
                              value={formData.personal.contactNumber}
                              onChange={(e) => handleInputChange('personal', 'contactNumber', e.target.value)}
                              className="w-full px-4 py-3 pl-12 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                              placeholder="1234567890"
                              required
                            />
                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        
                        {/* Alternate Number */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Alternate Number</label>
                          <div className="relative">
                            <input
                              type="tel"
                              value={formData.personal.alternateNumber}
                              onChange={(e) => handleInputChange('personal', 'alternateNumber', e.target.value)}
                              className="w-full px-4 py-3 pl-12 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                              placeholder="0987654321"
                            />
                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        
                        {/* Email */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                          <div className="relative">
                            <input
                              type="email"
                              value={formData.personal.userEmail}
                              onChange={(e) => handleInputChange('personal', 'userEmail', e.target.value)}
                              className="w-full px-4 py-3 pl-12 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                              placeholder="john.doe@example.com"
                              required
                            />
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        
                        {/* PAN Number */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Number *</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.personal.panNumber}
                              onChange={(e) => handleInputChange('personal', 'panNumber', e.target.value)}
                              className="w-full px-4 py-3 pl-12 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                              placeholder="ABCDE1234F"
                              required
                            />
                            <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        
                        {/* Aadhar Number */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhar Number *</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.personal.aadharNumber}
                              onChange={(e) => handleInputChange('personal', 'aadharNumber', e.target.value)}
                              className="w-full px-4 py-3 pl-12 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                              placeholder="1234 5678 9012"
                              required
                            />
                            <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Information - Enhanced */}
                  {activeSection === 'contact' && (
                    <div className="space-y-6">
                      <div className="pb-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                          <Home className="w-5 h-5 mr-2 text-gray-700" />
                          Contact Information
                        </h2>
                      </div>

                      <div className="space-y-5">
                        {/* Area */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Area/Locality *</label>
                          <input
                            type="text"
                            value={formData.contact.area}
                            onChange={(e) => handleInputChange('contact', 'area', e.target.value)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                            placeholder="Main Street"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* City */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                            <input
                              type="text"
                              value={formData.contact.city}
                              onChange={(e) => handleInputChange('contact', 'city', e.target.value)}
                              className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                              placeholder="New York"
                              required
                            />
                          </div>
                          
                          {/* Block */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Block</label>
                            <input
                              type="text"
                              value={formData.contact.block}
                              onChange={(e) => handleInputChange('contact', 'block', e.target.value)}
                              className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                              placeholder="Block Name"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* District */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">District *</label>
                            <input
                              type="text"
                              value={formData.contact.district}
                              onChange={(e) => handleInputChange('contact', 'district', e.target.value)}
                              className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                              placeholder="Manhattan"
                              required
                            />
                          </div>
                          
                          {/* State */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                            <input
                              type="text"
                              value={formData.contact.state}
                              onChange={(e) => handleInputChange('contact', 'state', e.target.value)}
                              className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                              placeholder="New York"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* PIN Code */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">PIN Code *</label>
                            <input
                              type="text"
                              value={formData.contact.pinCode}
                              onChange={(e) => handleInputChange('contact', 'pinCode', e.target.value)}
                              className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 text-sm transition-all duration-200"
                              placeholder="10001"
                              required
                            />
                          </div>
                          
                          {/* Country */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                            <div className="relative">
                              <input
                                type="text"
                                value={formData.contact.country}
                                readOnly
                                className="w-full px-4 py-3 pl-12 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-200 rounded-xl shadow-sm text-sm"
                              />
                              <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Education - Enhanced */}
                  {activeSection === 'education' && (
                    <div className="space-y-6">
                      <div className="pb-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                          <BookOpen className="w-5 h-5 mr-2 text-gray-700" />
                          Education
                        </h2>
                      </div>

                      <div className="space-y-5">
                        {formData.education.map((edu, index) => (
                          <div key={edu.id} className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-bold text-gray-800">Qualification #{index + 1}</h3>
                              {formData.education.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem('education', index)}
                                  className="text-gray-500 hover:text-gray-700 text-sm p-1.5 bg-white rounded-lg border border-gray-200 shadow-sm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm text-gray-600 mb-2">Qualification *</label>
                                <input
                                  type="text"
                                  value={edu.qualification}
                                  onChange={(e) => handleArrayChange('education', index, 'qualification', e.target.value)}
                                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm transition-all duration-200"
                                  placeholder="Bachelor's Degree"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-gray-600 mb-2">Institution *</label>
                                <input
                                  type="text"
                                  value={edu.institution}
                                  onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm transition-all duration-200"
                                  placeholder="University Name"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-gray-600 mb-2">Year *</label>
                                <input
                                  type="text"
                                  value={edu.year}
                                  onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm transition-all duration-200"
                                  placeholder="2015-2019"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-gray-600 mb-2">Marks/Grade *</label>
                                <input
                                  type="text"
                                  value={edu.marks}
                                  onChange={(e) => handleArrayChange('education', index, 'marks', e.target.value)}
                                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm transition-all duration-200"
                                  placeholder="3.8 GPA / 85%"
                                  required
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm text-gray-600 mb-2">Documents</label>
                                <div className="flex items-center">
                                  <label className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl text-sm cursor-pointer shadow-sm hover:shadow-md transition-all duration-200">
                                    <span>Select File</span>
                                    <input 
                                      type="file" 
                                      className="hidden" 
                                      onChange={(e) => handleArrayChange('education', index, 'documents', e.target.files[0])}
                                    />
                                  </label>
                                  {edu.documents && (
                                    <button 
                                      type="button"
                                      className="ml-3 text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                      onClick={() => window.open(URL.createObjectURL(edu.documents))}
                                    >
                                      <Eye className="w-4 h-4 mr-1" /> View Document
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addArrayItem('education')}
                          className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-semibold"
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add Qualification
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Documents - Enhanced */}
                  {activeSection === 'documents' && (
                    <div className="space-y-6">
                      <div className="pb-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-gray-700" />
                          Documents
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Resume */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800">Resume/CV</h3>
                            {formData.documents.resume && (
                              <button
                                type="button"
                                onClick={() => handleFileUpload('documents', 'resume', null)}
                                className="text-gray-500 hover:text-gray-700 text-sm p-1.5 bg-white rounded-lg border border-gray-200 shadow-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-5 text-center">
                            <FileText className="w-10 h-10 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-600 mb-3">Upload resume (PDF/DOC)</p>
                            <label className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl hover:from-gray-900 hover:to-gray-800 text-sm cursor-pointer shadow-md transition-all duration-200">
                              Select File
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleFileUpload('documents', 'resume', e.target.files[0])}
                              />
                            </label>
                            {formData.documents.resume && (
                              <p className="text-sm text-gray-700 mt-3 truncate max-w-full">
                                {formData.documents.resume.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Aadhar */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800">Aadhar Card</h3>
                            {formData.documents.aadhar && (
                              <button
                                type="button"
                                onClick={() => handleFileUpload('documents', 'aadhar', null)}
                                className="text-gray-500 hover:text-gray-700 text-sm p-1.5 bg-white rounded-lg border border-gray-200 shadow-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-5 text-center">
                            <CreditCard className="w-10 h-10 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-600 mb-3">Upload Aadhar (PDF/Image)</p>
                            <label className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl hover:from-gray-900 hover:to-gray-800 text-sm cursor-pointer shadow-md transition-all duration-200">
                              Select File
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileUpload('documents', 'aadhar', e.target.files[0])}
                              />
                            </label>
                            {formData.documents.aadhar && (
                              <p className="text-sm text-gray-700 mt-3 truncate max-w-full">
                                {formData.documents.aadhar.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* PAN */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800">PAN Card</h3>
                            {formData.documents.pan && (
                              <button
                                type="button"
                                onClick={() => handleFileUpload('documents', 'pan', null)}
                                className="text-gray-500 hover:text-gray-700 text-sm p-1.5 bg-white rounded-lg border border-gray-200 shadow-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-5 text-center">
                            <CreditCard className="w-10 h-10 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-600 mb-3">Upload PAN (PDF/Image)</p>
                            <label className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl hover:from-gray-900 hover:to-gray-800 text-sm cursor-pointer shadow-md transition-all duration-200">
                              Select File
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileUpload('documents', 'pan', e.target.files[0])}
                              />
                            </label>
                            {formData.documents.pan && (
                              <p className="text-sm text-gray-700 mt-3 truncate max-w-full">
                                {formData.documents.pan.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form Actions - Enhanced */}
                  <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                    <button
                      type="button"
                      className="px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-xl hover:from-gray-100 hover:to-gray-200 text-sm shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      Reset Form
                    </button>
                    <button
                      type="submit"
                      className="ml-4 px-6 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl hover:from-gray-900 hover:to-gray-800 text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Add Employee
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;