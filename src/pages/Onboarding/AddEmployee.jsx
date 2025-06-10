import React, { useState } from 'react';
import { 
  User, Mail, Phone, Calendar, Home, 
  BookOpen, Briefcase, Banknote, FileText, 
  Plus, X, Trash2, Eye, Heart, Globe, 
  CreditCard, ClipboardCheck, Stethoscope 
} from 'lucide-react';

const AddEmployee = () => {
  const [activeSection, setActiveSection] = useState('personal');
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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center">
            <User className="w-5 h-5 mr-2 text-gray-700" />
            Add New Employee
          </h1>
          <p className="text-gray-600 text-sm mt-1">Fill in all required details</p>
        </div>
        <button 
          onClick={() => window.history.back()} 
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center"
        >
          <X className="w-4 h-4 mr-1" /> Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sidebar Navigation - Compact Version */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <div className="mb-4">
              <div className="bg-gray-100 border border-gray-300 rounded-lg w-20 h-20 mx-auto flex items-center justify-center">
                {formData.documents.photo ? (
                  <img 
                    src={URL.createObjectURL(formData.documents.photo)} 
                    alt="Employee" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="mt-2 text-center">
                <button 
                  onClick={() => document.getElementById('photo-upload').click()}
                  className="text-xs text-blue-600 hover:text-blue-800"
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

            <nav className="space-y-1">
              {[
                {id: 'personal', icon: <User className="w-4 h-4" />},
                {id: 'contact', icon: <Home className="w-4 h-4" />},
                {id: 'emergency', icon: <Phone className="w-4 h-4" />},
                {id: 'education', icon: <BookOpen className="w-4 h-4" />},
                {id: 'experience', icon: <Briefcase className="w-4 h-4" />},
                {id: 'payroll', icon: <Banknote className="w-4 h-4" />},
                {id: 'documents', icon: <FileText className="w-4 h-4" />},
                {id: 'medical', icon: <Stethoscope className="w-4 h-4" />},
                {id: 'vaccination', icon: <ClipboardCheck className="w-4 h-4" />}
              ].map(({id, icon}) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center text-sm transition-colors ${
                    activeSection === id
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{icon}</span>
                  <span className="capitalize">{id}</span>
                </button>
              ))}
            </nav>

            <div className="mt-6 text-xs bg-blue-50 border border-blue-100 rounded-lg p-3">
              <div className="flex items-start">
                <div className="mt-0.5">
                  <span className="font-medium">All fields marked with * are required</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Content - Compact Version */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <form onSubmit={handleSubmit}>
              {/* Personal Details - Compact */}
              {activeSection === 'personal' && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-700" />
                      Personal Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Salutation */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Salutation *</label>
                      <select
                        value={formData.personal.salutation}
                        onChange={(e) => handleInputChange('personal', 'salutation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                      >
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Miss">Miss</option>
                      </select>
                    </div>
                    
                    {/* First Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        value={formData.personal.firstName}
                        onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                        placeholder="John"
                        required
                      />
                    </div>
                    
                    {/* Middle Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Middle Name</label>
                      <input
                        type="text"
                        value={formData.personal.middleName}
                        onChange={(e) => handleInputChange('personal', 'middleName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                        placeholder="Middle"
                      />
                    </div>
                    
                    {/* Last Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        value={formData.personal.lastName}
                        onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                        placeholder="Doe"
                        required
                      />
                    </div>
                    
                    {/* Gender */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Gender *</label>
                      <select
                        value={formData.personal.gender}
                        onChange={(e) => handleInputChange('personal', 'gender', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
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
                      <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth *</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.personal.dob}
                          onChange={(e) => handleInputChange('personal', 'dob', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm pl-9"
                          required
                        />
                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Age */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="text"
                        value={formData.personal.age}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                      />
                    </div>
                    
                    {/* Blood Group */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Blood Group *</label>
                      <div className="relative">
                        <select
                          value={formData.personal.bloodGroup}
                          onChange={(e) => handleInputChange('personal', 'bloodGroup', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm pl-9"
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
                        <Heart className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Contact Number */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Contact Number *</label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={formData.personal.contactNumber}
                          onChange={(e) => handleInputChange('personal', 'contactNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm pl-9"
                          placeholder="1234567890"
                          required
                        />
                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Alternate Number */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Alternate Number</label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={formData.personal.alternateNumber}
                          onChange={(e) => handleInputChange('personal', 'alternateNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm pl-9"
                          placeholder="0987654321"
                        />
                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={formData.personal.userEmail}
                          onChange={(e) => handleInputChange('personal', 'userEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm pl-9"
                          placeholder="john.doe@example.com"
                          required
                        />
                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* PAN Number */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">PAN Number *</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.personal.panNumber}
                          onChange={(e) => handleInputChange('personal', 'panNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm pl-9"
                          placeholder="ABCDE1234F"
                          required
                        />
                        <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Aadhar Number */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Aadhar Number *</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.personal.aadharNumber}
                          onChange={(e) => handleInputChange('personal', 'aadharNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm pl-9"
                          placeholder="1234 5678 9012"
                          required
                        />
                        <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information - Compact */}
              {activeSection === 'contact' && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Home className="w-4 h-4 mr-2 text-gray-700" />
                      Contact Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Area */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Area/Locality *</label>
                      <input
                        type="text"
                        value={formData.contact.area}
                        onChange={(e) => handleInputChange('contact', 'area', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                        placeholder="Main Street"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* City */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                        <input
                          type="text"
                          value={formData.contact.city}
                          onChange={(e) => handleInputChange('contact', 'city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                          placeholder="New York"
                          required
                        />
                      </div>
                      
                      {/* Block */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Block</label>
                        <input
                          type="text"
                          value={formData.contact.block}
                          onChange={(e) => handleInputChange('contact', 'block', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                          placeholder="Block Name"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* District */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">District *</label>
                        <input
                          type="text"
                          value={formData.contact.district}
                          onChange={(e) => handleInputChange('contact', 'district', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                          placeholder="Manhattan"
                          required
                        />
                      </div>
                      
                      {/* State */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">State *</label>
                        <input
                          type="text"
                          value={formData.contact.state}
                          onChange={(e) => handleInputChange('contact', 'state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                          placeholder="New York"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* PIN Code */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">PIN Code *</label>
                        <input
                          type="text"
                          value={formData.contact.pinCode}
                          onChange={(e) => handleInputChange('contact', 'pinCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                          placeholder="10001"
                          required
                        />
                      </div>
                      
                      {/* Country */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Country *</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.contact.country}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm pl-9"
                          />
                          <Globe className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Emergency Contact - Compact */}
              {activeSection === 'emergency' && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-700" />
                      Emergency Contact
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={formData.emergency.name}
                        onChange={(e) => handleInputChange('emergency', 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                        placeholder="Jane Smith"
                        required
                      />
                    </div>
                    
                    {/* Relationship */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Relationship *</label>
                      <select
                        value={formData.emergency.relationship}
                        onChange={(e) => handleInputChange('emergency', 'relationship', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                        required
                      >
                        <option value="">Select Relationship</option>
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="sibling">Sibling</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={formData.emergency.phone}
                          onChange={(e) => handleInputChange('emergency', 'phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm pl-9"
                          placeholder="+1 (555) 987-6543"
                          required
                        />
                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Education - Compact */}
              {activeSection === 'education' && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-gray-700" />
                      Education
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {formData.education.map((edu, index) => (
                      <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium text-gray-700 text-sm">Qualification #{index + 1}</h3>
                          {formData.education.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem('education', index)}
                              className="text-gray-500 hover:text-gray-700 text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Qualification *</label>
                            <input
                              type="text"
                              value={edu.qualification}
                              onChange={(e) => handleArrayChange('education', index, 'qualification', e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                              placeholder="Bachelor's Degree"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Institution *</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                              placeholder="University Name"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Year *</label>
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                              placeholder="2015-2019"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Marks/Grade *</label>
                            <input
                              type="text"
                              value={edu.marks}
                              onChange={(e) => handleArrayChange('education', index, 'marks', e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                              placeholder="3.8 GPA / 85%"
                              required
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs text-gray-600 mb-1">Documents</label>
                            <div className="flex items-center">
                              <input 
                                type="file" 
                                className="text-xs"
                                onChange={(e) => handleArrayChange('education', index, 'documents', e.target.files[0])}
                              />
                              {edu.documents && (
                                <button 
                                  type="button"
                                  className="ml-2 text-blue-600 hover:text-blue-800 text-xs flex items-center"
                                  onClick={() => window.open(URL.createObjectURL(edu.documents))}
                                >
                                  <Eye className="w-4 h-4 mr-1" /> View
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
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Qualification
                    </button>
                  </div>
                </div>
              )}

              {/* Experience - Compact */}
              {activeSection === 'experience' && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-700" />
                      Work Experience
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {formData.experience.map((exp, index) => (
                      <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium text-gray-700 text-sm">Experience #{index + 1}</h3>
                          {formData.experience.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem('experience', index)}
                              className="text-gray-500 hover:text-gray-700 text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Company *</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                              placeholder="Company Name"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Position *</label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                              placeholder="Job Title"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Start Date *</label>
                            <input
                              type="date"
                              value={exp.startDate}
                              onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">End Date *</label>
                            <input
                              type="date"
                              value={exp.endDate}
                              onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                              required
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs text-gray-600 mb-1">Responsibilities</label>
                            <textarea
                              value={exp.responsibilities}
                              onChange={(e) => handleArrayChange('experience', index, 'responsibilities', e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                              rows="2"
                            ></textarea>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs text-gray-600 mb-1">Offer Letter</label>
                            <div className="flex items-center">
                              <input 
                                type="file" 
                                className="text-xs"
                                onChange={(e) => handleArrayChange('experience', index, 'offerLetter', e.target.files[0])}
                              />
                              {exp.offerLetter && (
                                <button 
                                  type="button"
                                  className="ml-2 text-blue-600 hover:text-blue-800 text-xs flex items-center"
                                  onClick={() => window.open(URL.createObjectURL(exp.offerLetter))}
                                >
                                  <Eye className="w-4 h-4 mr-1" /> View
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addArrayItem('experience')}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Experience
                    </button>
                  </div>
                </div>
              )}

              {/* Payroll - Compact */}
              {activeSection === 'payroll' && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Banknote className="w-4 h-4 mr-2 text-gray-700" />
                      Payroll Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Payment Mode *</label>
                      <select
                        value={formData.payroll.paymentMode}
                        onChange={(e) => handleInputChange('payroll', 'paymentMode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                      >
                        <option value="bankaccount">Bank Account</option>
                        <option value="cash">Cash</option>
                      </select>
                    </div>

                    {formData.payroll.paymentMode === 'bankaccount' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Account Holder *</label>
                            <input
                              type="text"
                              value={formData.payroll.accountHolder}
                              onChange={(e) => handleInputChange('payroll', 'accountHolder', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="John Doe"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Bank Name *</label>
                            <input
                              type="text"
                              value={formData.payroll.bankName}
                              onChange={(e) => handleInputChange('payroll', 'bankName', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Bank of America"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Account Number *</label>
                            <input
                              type="text"
                              value={formData.payroll.accountNumber}
                              onChange={(e) => handleInputChange('payroll', 'accountNumber', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="XXXX XXXX XXXX XXXX"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">IFSC Code *</label>
                            <input
                              type="text"
                              value={formData.payroll.ifsc}
                              onChange={(e) => handleInputChange('payroll', 'ifsc', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="ABCD0123456"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Bank Branch *</label>
                          <input
                            type="text"
                            value={formData.payroll.bankBranch}
                            onChange={(e) => handleInputChange('payroll', 'bankBranch', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Branch Name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Bank Passbook</label>
                          <div className="flex items-center">
                            <input 
                              type="file" 
                              className="text-xs"
                              onChange={(e) => handleFileUpload('documents', 'bankPassbook', e.target.files[0])}
                            />
                            {formData.documents.bankPassbook && (
                              <button 
                                type="button"
                                className="ml-2 text-blue-600 hover:text-blue-800 text-xs flex items-center"
                                onClick={() => window.open(URL.createObjectURL(formData.documents.bankPassbook))}
                              >
                                <Eye className="w-4 h-4 mr-1" /> View
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                        <ClipboardCheck className="w-4 h-4 mr-2 text-gray-700" />
                        PF & ESI Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.payroll.pfEnabled}
                            onChange={(e) => handleInputChange('payroll', 'pfEnabled', e.target.checked)}
                            className="mr-2"
                          />
                          <label className="text-sm text-gray-700">PF Enabled</label>
                        </div>
                        
                        {formData.payroll.pfEnabled && (
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">UAN Number</label>
                            <input
                              type="text"
                              value={formData.payroll.uanNumber}
                              onChange={(e) => handleInputChange('payroll', 'uanNumber', e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                              placeholder="Enter UAN"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.payroll.esiEnabled}
                            onChange={(e) => handleInputChange('payroll', 'esiEnabled', e.target.checked)}
                            className="mr-2"
                          />
                          <label className="text-sm text-gray-700">ESI Enabled</label>
                        </div>
                        
                        {formData.payroll.esiEnabled && (
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">ESIC Number</label>
                            <input
                              type="text"
                              value={formData.payroll.esicNumber}
                              onChange={(e) => handleInputChange('payroll', 'esicNumber', e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                              placeholder="Enter ESIC"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents - Compact */}
              {activeSection === 'documents' && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-700" />
                      Documents
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Resume */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-700 text-sm">Resume/CV</h3>
                        {formData.documents.resume && (
                          <button
                            type="button"
                            onClick={() => handleFileUpload('documents', 'resume', null)}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <FileText className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-600 mb-2">Upload resume (PDF/DOC)</p>
                        <label className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-xs cursor-pointer">
                          Select File
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileUpload('documents', 'resume', e.target.files[0])}
                          />
                        </label>
                        {formData.documents.resume && (
                          <p className="text-xs text-gray-700 mt-2 truncate max-w-full">
                            {formData.documents.resume.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Aadhar */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-700 text-sm">Aadhar Card</h3>
                        {formData.documents.aadhar && (
                          <button
                            type="button"
                            onClick={() => handleFileUpload('documents', 'aadhar', null)}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <CreditCard className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-600 mb-2">Upload Aadhar (PDF/Image)</p>
                        <label className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-xs cursor-pointer">
                          Select File
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('documents', 'aadhar', e.target.files[0])}
                          />
                        </label>
                        {formData.documents.aadhar && (
                          <p className="text-xs text-gray-700 mt-2 truncate max-w-full">
                            {formData.documents.aadhar.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* PAN */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-700 text-sm">PAN Card</h3>
                        {formData.documents.pan && (
                          <button
                            type="button"
                            onClick={() => handleFileUpload('documents', 'pan', null)}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <CreditCard className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-600 mb-2">Upload PAN (PDF/Image)</p>
                        <label className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-xs cursor-pointer">
                          Select File
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('documents', 'pan', e.target.files[0])}
                          />
                        </label>
                        {formData.documents.pan && (
                          <p className="text-xs text-gray-700 mt-2 truncate max-w-full">
                            {formData.documents.pan.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Medical - Compact */}
              {activeSection === 'medical' && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Stethoscope className="w-4 h-4 mr-2 text-gray-700" />
                      Medical Documents
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Hepatitis B */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-700 text-sm">Hepatitis B Report</h3>
                        {formData.medical.hepatitis && (
                          <button
                            type="button"
                            onClick={() => handleFileUpload('medical', 'hepatitis', null)}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <FileText className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-600 mb-2">Upload Hepatitis B report</p>
                        <label className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-xs cursor-pointer">
                          Select File
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('medical', 'hepatitis', e.target.files[0])}
                          />
                        </label>
                        {formData.medical.hepatitis && (
                          <p className="text-xs text-gray-700 mt-2 truncate max-w-full">
                            {formData.medical.hepatitis.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Tetanus */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-700 text-sm">Tetanus Vaccination</h3>
                        {formData.medical.tetanus && (
                          <button
                            type="button"
                            onClick={() => handleFileUpload('medical', 'tetanus', null)}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <FileText className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-600 mb-2">Upload Tetanus vaccination record</p>
                        <label className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-xs cursor-pointer">
                          Select File
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('medical', 'tetanus', e.target.files[0])}
                          />
                        </label>
                        {formData.medical.tetanus && (
                          <p className="text-xs text-gray-700 mt-2 truncate max-w-full">
                            {formData.medical.tetanus.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* CBC */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-700 text-sm">CBC Report</h3>
                        {formData.medical.cbc && (
                          <button
                            type="button"
                            onClick={() => handleFileUpload('medical', 'cbc', null)}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <FileText className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-600 mb-2">Upload CBC report</p>
                        <label className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-xs cursor-pointer">
                          Select File
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('medical', 'cbc', e.target.files[0])}
                          />
                        </label>
                        {formData.medical.cbc && (
                          <p className="text-xs text-gray-700 mt-2 truncate max-w-full">
                            {formData.medical.cbc.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Urine Test */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-700 text-sm">Urine Test Report</h3>
                        {formData.medical.urine && (
                          <button
                            type="button"
                            onClick={() => handleFileUpload('medical', 'urine', null)}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <FileText className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-600 mb-2">Upload Urine test report</p>
                        <label className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-xs cursor-pointer">
                          Select File
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('medical', 'urine', e.target.files[0])}
                          />
                        </label>
                        {formData.medical.urine && (
                          <p className="text-xs text-gray-700 mt-2 truncate max-w-full">
                            {formData.medical.urine.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Chest X-ray */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-700 text-sm">Chest X-ray Report</h3>
                        {formData.medical.chestXray && (
                          <button
                            type="button"
                            onClick={() => handleFileUpload('medical', 'chestXray', null)}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <FileText className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-600 mb-2">Upload Chest X-ray report</p>
                        <label className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-xs cursor-pointer">
                          Select File
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('medical', 'chestXray', e.target.files[0])}
                          />
                        </label>
                        {formData.medical.chestXray && (
                          <p className="text-xs text-gray-700 mt-2 truncate max-w-full">
                            {formData.medical.chestXray.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions - Compact */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  className="ml-3 px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm shadow"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;