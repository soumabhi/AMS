import React, { useState } from 'react';
import { 
  User, Mail, Phone, Calendar, Home, 
  BookOpen, Briefcase, Banknote, FileText, 
  Plus, X, Trash2, Eye, Heart, Globe, 
  CreditCard, ClipboardCheck, AlertCircle,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Style constants
const styles = {
  input: {
    base: "w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200",
    default: "bg-gradient-to-r from-gray-50 to-gray-100 hover:border-gray-300",
    disabled: "bg-gray-100 text-gray-500 cursor-not-allowed",
    error: "border-gray-400 bg-gray-50/50",
    icon: "pl-10"
  },
  button: {
    primary: "px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-xl hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2",
    secondary: "px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2",
    icon: "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
  },
  card: {
    base: "bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200",
    header: "p-6 border-b border-gray-200",
    body: "p-6",
    footer: "p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white"
  },
  label: "block text-sm font-semibold text-gray-700 mb-2",
  section: {
    container: "space-y-6",
    header: "pb-4 border-b border-gray-200",
    title: "text-xl font-bold bg-black bg-clip-text text-transparent flex items-center gap-2",
    description: "mt-1 text-sm text-gray-500",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-6",
    card: "bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-all duration-200"
  }
};

const AddCandidate = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
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
      responsibilities: ''
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
      esicNumber: '',
      tdsApplicable: false
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
    }
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 4000);
  };

  const handleInputChange = (section, field, value) => {
    if (section === 'personal' && field === 'dob') {
      // Calculate age when DOB changes
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData({
        ...formData,
        personal: {
          ...formData.personal,
          [field]: value,
          age: age.toString()
        }
      });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value
        }
      });
    }
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
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size should be less than 10MB', 'error');
      return;
    }

    // Check file type for images
    if (fileType === 'photo') {
      if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file', 'error');
        return;
      }
    }

    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [fileType]: file
      }
    });
    showToast(`${fileType} uploaded successfully`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData instance to handle file uploads
      const formDataPayload = new FormData();

      // Add personal details
      const personalData = {
        salutation: formData.personal.salutation,
        firstName: formData.personal.firstName,
        middleName: formData.personal.middleName,
        lastName: formData.personal.lastName,
        gender: formData.personal.gender,
        dateOfBirth: formData.personal.dob,
        age: formData.personal.age,
        bloodGroup: formData.personal.bloodGroup,
        contactNumber: formData.personal.contactNumber,
        alternateNumber: formData.personal.alternateNumber,
        email: formData.personal.userEmail,
        panNumber: formData.personal.panNumber,
        aadharNumber: formData.personal.aadharNumber,
      };
      formDataPayload.append('personal', JSON.stringify(personalData));

      // Add contact/address details
      const addressData = {
        area: formData.contact.area,
        city: formData.contact.city,
        block: formData.contact.block,
        district: formData.contact.district,
        state: formData.contact.state,
        pinCode: formData.contact.pinCode,
        country: formData.contact.country,
      };
      formDataPayload.append('address', JSON.stringify(addressData));

      // Add emergency contact
      const emergencyData = {
        name: formData.emergency.name,
        relationship: formData.emergency.relationship,
        phone: formData.emergency.phone,
      };
      formDataPayload.append('emergency', JSON.stringify(emergencyData));

      // Add educational qualifications
      const educationData = formData.education.map(edu => ({
        qualification: edu.qualification,
        institution: edu.institution,
        year: edu.year,
        marks: edu.marks,
        documents: edu.documents ? edu.documents.map(doc => doc.name) : []
      }));
      formDataPayload.append('education', JSON.stringify(educationData));

      // Update experience data without offer letter
      const experienceData = formData.experience.map(exp => ({
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate,
        responsibilities: exp.responsibilities
      }));
      formDataPayload.append('experience', JSON.stringify(experienceData));

      // Add payroll details
      const payrollData = {
        paymentMode: formData.payroll.paymentMode,
        accountHolder: formData.payroll.accountHolder,
        bankName: formData.payroll.bankName,
        accountNumber: formData.payroll.accountNumber,
        ifsc: formData.payroll.ifsc,
        bankBranch: formData.payroll.bankBranch,
        pfEnabled: formData.payroll.pfEnabled,
        uanNumber: formData.payroll.uanNumber,
        esiEnabled: formData.payroll.esiEnabled,
        esicNumber: formData.payroll.esicNumber,
        tdsApplicable: formData.payroll.tdsApplicable
      };
      formDataPayload.append('payroll', JSON.stringify(payrollData));

      // Add medical information
      const medicalData = {
        hepatitis: formData.medical.hepatitis?.name,
        tetanus: formData.medical.tetanus?.name,
        cbc: formData.medical.cbc?.name,
        urine: formData.medical.urine?.name,
        chestXray: formData.medical.chestXray?.name
      };
      formDataPayload.append('medical', JSON.stringify(medicalData));

      // Append all files
      // Documents
      if (formData.documents.resume) formDataPayload.append('resume', formData.documents.resume);
      if (formData.documents.photo) formDataPayload.append('photo', formData.documents.photo);
      if (formData.documents.aadhar) formDataPayload.append('aadhar', formData.documents.aadhar);
      if (formData.documents.pan) formDataPayload.append('pan', formData.documents.pan);
      if (formData.documents.bankPassbook) formDataPayload.append('bankPassbook', formData.documents.bankPassbook);

      // Medical documents
      if (formData.medical.hepatitis) formDataPayload.append('hepatitis', formData.medical.hepatitis);
      if (formData.medical.tetanus) formDataPayload.append('tetanus', formData.medical.tetanus);
      if (formData.medical.cbc) formDataPayload.append('cbc', formData.medical.cbc);
      if (formData.medical.urine) formDataPayload.append('urine', formData.medical.urine);
      if (formData.medical.chestXray) formDataPayload.append('chestXray', formData.medical.chestXray);

      // Education documents
      formData.education.forEach((edu, index) => {
        if (edu.documents) {
          edu.documents.forEach((doc, docIndex) => {
            formDataPayload.append(`education_${index}_doc_${docIndex}`, doc);
          });
        }
      });

      // Experience documents
      formData.experience.forEach((exp, index) => {
        if (exp.responsibilities) {
          formDataPayload.append(`experience_${index}_responsibilities`, exp.responsibilities);
        }
      });

      // Submit the form data
      const response = await fetch('/api/employee/create', {
        method: 'POST',
        body: formDataPayload
      });

      if (!response.ok) {
        throw new Error('Failed to create employee');
      }

      showToast('Employee added successfully', 'success');
      
      // Wait for the toast to be visible before navigating
      setTimeout(() => {
        navigate('/CandidateProfile');
      }, 1500);

    } catch (error) {
      console.error('Error creating employee:', error);
      showToast(error.message || 'Failed to create employee', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 rounded-lg">
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Breadcrumb */}
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <button onClick={() => navigate('/')} className={styles.button.icon}>
                <Home className="w-4 h-4" />
              </button>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <li>
              <button onClick={() => navigate('/CandidateProfile')} className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Candidate Profile
              </button>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <li>
              <span className="text-sm font-medium text-gray-900">Add Candidate</span>
            </li>
          </ol>
        </nav>

        {/* Main Content */}
        <form onSubmit={handleSubmit} className={styles.card.base}>
          {/* Enhanced Header */}
          <div className="p-8 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-black bg-clip-text text-transparent">
                  Add New Candidate
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Create a new candidate profile with complete details
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 p-4 bg-gradient-to-b from-white to-gray-50">
              <div className="space-y-1">
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl w-24 h-24 mx-auto flex items-center justify-center">
                    {formData.documents?.photo ? (
                      <img 
                        src={URL.createObjectURL(formData.documents.photo)} 
                        alt="Employee" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="mt-5 flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => document.getElementById('photo-upload').click()}
                      className={styles.button.secondary}
                    >
                      <Plus className="w-4 h-4" />
                      Upload Photo
                    </button>
                    <input 
                      type="file" 
                      id="photo-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload('documents', 'photo', e.target.files[0])}
                    />
                  </div>
                </div>

                <nav className="space-y-1">
                  {[
                    {id: 'personal', icon: <User className="w-4 h-4" />, label: 'Personal Details'},
                    {id: 'contact', icon: <Home className="w-4 h-4" />, label: 'Contact Information'},
                    {id: 'emergency', icon: <Heart className="w-4 h-4" />, label: 'Emergency Contact'},
                    {id: 'education', icon: <BookOpen className="w-4 h-4" />, label: 'Education'},
                    {id: 'experience', icon: <Briefcase className="w-4 h-4" />, label: 'Experience'},
                    {id: 'payroll', icon: <Banknote className="w-4 h-4" />, label: 'Payroll Details'},
                    {id: 'documents', icon: <FileText className="w-4 h-4" />, label: 'Documents'},
                    {id: 'medical', icon: <Heart className="w-4 h-4" />, label: 'Medical Information'}
                  ].map(section => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-black text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {section.icon}
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Form Area */}
            <div className="lg:col-span-4 p-6">
              <div className="max-w-3xl mx-auto space-y-8">
                {/* Guidelines Card */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm text-gray-800">
                      <p className="font-semibold mb-2">Guidelines:</p>
                      <ul className="space-y-1">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                          <span>All fields marked with * are required</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                          <span>Upload clear, recent photographs</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                          <span>Ensure all document copies are legible</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Form Sections */}
                {activeSection === 'personal' && (
                  <div className={styles.section.container}>
                    <div className={styles.section.header}>
                      <h2 className={styles.section.title}>
                        <User className="w-5 h-5" />
                        Personal Information
                      </h2>
                      <p className={styles.section.description}>
                        Enter the basic personal information of the employee
                      </p>
                    </div>

                    <div className={styles.section.grid}>
                      {/* Form fields with updated styles */}
                      <div>
                        <label className={styles.label}>First Name *</label>
                        <input
                          type="text"
                          value={formData.personal.firstName}
                          onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                          className={`${styles.input.base} ${styles.input.default}`}
                          placeholder="John"
                          required
                        />
                      </div>

                      {/* Middle Name */}
                      <div>
                        <label className={styles.label}>Middle Name</label>
                        <input
                          type="text"
                          value={formData.personal.middleName}
                          onChange={(e) => handleInputChange('personal', 'middleName', e.target.value)}
                          className={`${styles.input.base} ${styles.input.default}`}
                          placeholder="Middle"
                        />
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className={styles.label}>Last Name *</label>
                        <input
                          type="text"
                          value={formData.personal.lastName}
                          onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                          className={`${styles.input.base} ${styles.input.default}`}
                          placeholder="Doe"
                          required
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label className={styles.label}>Gender *</label>
                        <select
                          value={formData.personal.gender}
                          onChange={(e) => handleInputChange('personal', 'gender', e.target.value)}
                          className={`${styles.input.base} ${styles.input.default}`}
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
                        <label className={styles.label}>Date of Birth *</label>
                        <div className="relative">
                          <input
                            type="date"
                            value={formData.personal.dob}
                            onChange={(e) => handleInputChange('personal', 'dob', e.target.value)}
                            className={`${styles.input.base} ${styles.input.default} ${styles.input.icon}`}
                            required
                          />
                          <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      {/* Age */}
                      <div>
                        <label className={styles.label}>Age</label>
                        <input
                          type="text"
                          value={formData.personal.age}
                          readOnly
                          className={`${styles.input.base} ${styles.input.disabled}`}
                        />
                      </div>

                      {/* Blood Group */}
                      <div>
                        <label className={styles.label}>Blood Group *</label>
                        <div className="relative">
                          <select
                            value={formData.personal.bloodGroup}
                            onChange={(e) => handleInputChange('personal', 'bloodGroup', e.target.value)}
                            className={`${styles.input.base} ${styles.input.default} ${styles.input.icon}`}
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
                        <label className={styles.label}>Contact Number *</label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={formData.personal.contactNumber}
                            onChange={(e) => handleInputChange('personal', 'contactNumber', e.target.value)}
                            className={`${styles.input.base} ${styles.input.default} ${styles.input.icon}`}
                            placeholder="1234567890"
                            required
                          />
                          <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      {/* Alternate Number */}
                      <div>
                        <label className={styles.label}>Alternate Number</label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={formData.personal.alternateNumber}
                            onChange={(e) => handleInputChange('personal', 'alternateNumber', e.target.value)}
                            className={`${styles.input.base} ${styles.input.default} ${styles.input.icon}`}
                            placeholder="0987654321"
                          />
                          <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className={styles.label}>Email *</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={formData.personal.userEmail}
                            onChange={(e) => handleInputChange('personal', 'userEmail', e.target.value)}
                            className={`${styles.input.base} ${styles.input.default} ${styles.input.icon}`}
                            placeholder="john.doe@example.com"
                            required
                          />
                          <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      {/* PAN Number */}
                      <div>
                        <label className={styles.label}>PAN Number {formData.payroll.tdsApplicable ? '*' : ''}</label>
                        <input
                          type="text"
                          value={formData.personal.panNumber}
                          onChange={(e) => handleInputChange('personal', 'panNumber', e.target.value)}
                          className={`${styles.input.base} ${styles.input.default}`}
                          placeholder="ABCDE1234F"
                          pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                          title="Enter valid PAN number (e.g., AAAAA9999A)"
                          required={formData.payroll.tdsApplicable}
                        />
                      </div>

                      {/* Aadhar Number */}
                      <div>
                        <label className={styles.label}>Aadhar Number *</label>
                        <input
                          type="text"
                          value={formData.personal.aadharNumber}
                          onChange={(e) => handleInputChange('personal', 'aadharNumber', e.target.value)}
                          className={`${styles.input.base} ${styles.input.default}`}
                          placeholder="1234 5678 9012"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
                {activeSection === 'contact' && (
                  <div className={styles.section.container}>
                    <div className={styles.section.header}>
                      <h3 className={styles.section.title}>
                        <Home className="w-5 h-5" />
                        Contact Information
                      </h3>
                      <p className={styles.section.description}>
                        Enter the employee's contact details
                      </p>
                    </div>

                    <div className={styles.section.grid}>
                      <div>
                        <label className={styles.label}>Area/Street *</label>
                        <input
                          type="text"
                          value={formData.contact.area}
                          onChange={(e) => handleInputChange('contact', 'area', e.target.value)}
                          placeholder="Enter area/street"
                          className={`${styles.input.base} ${styles.input.default}`}
                          required
                        />
                      </div>

                      <div>
                        <label className={styles.label}>City *</label>
                        <input
                          type="text"
                          value={formData.contact.city}
                          onChange={(e) => handleInputChange('contact', 'city', e.target.value)}
                          placeholder="Enter city"
                          className={`${styles.input.base} ${styles.input.default}`}
                          required
                        />
                      </div>

                      <div>
                        <label className={styles.label}>Block/Locality</label>
                        <input
                          type="text"
                          value={formData.contact.block}
                          onChange={(e) => handleInputChange('contact', 'block', e.target.value)}
                          placeholder="Enter block/locality"
                          className={`${styles.input.base} ${styles.input.default}`}
                        />
                      </div>

                      <div>
                        <label className={styles.label}>District *</label>
                        <input
                          type="text"
                          value={formData.contact.district}
                          onChange={(e) => handleInputChange('contact', 'district', e.target.value)}
                          placeholder="Enter district"
                          className={`${styles.input.base} ${styles.input.default}`}
                          required
                        />
                      </div>

                      <div>
                        <label className={styles.label}>State *</label>
                        <input
                          type="text"
                          value={formData.contact.state}
                          onChange={(e) => handleInputChange('contact', 'state', e.target.value)}
                          placeholder="Enter state"
                          className={`${styles.input.base} ${styles.input.default}`}
                          required
                        />
                      </div>

                      <div>
                        <label className={styles.label}>PIN Code *</label>
                        <input
                          type="text"
                          value={formData.contact.pinCode}
                          onChange={(e) => handleInputChange('contact', 'pinCode', e.target.value)}
                          placeholder="Enter PIN code"
                          className={`${styles.input.base} ${styles.input.default}`}
                          required
                        />
                      </div>

                      <div>
                        <label className={styles.label}>Country *</label>
                        <input
                          type="text"
                          value={formData.contact.country}
                          onChange={(e) => handleInputChange('contact', 'country', e.target.value)}
                          placeholder="Enter country"
                          className={`${styles.input.base} ${styles.input.default}`}
                          defaultValue="India"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
                {activeSection === 'emergency' && (
                  <div className={styles.section.container}>
                    <div className={styles.section.header}>
                      <h3 className={styles.section.title}>
                        <AlertCircle className="w-5 h-5" />
                        Emergency Contact
                      </h3>
                      <p className={styles.section.description}>
                        Add emergency contact details
                      </p>
                    </div>

                    <div className={styles.section.grid}>
                      <div>
                        <label className={styles.label}>Full Name *</label>
                        <input
                          type="text"
                          value={formData.emergency.name}
                          onChange={(e) => handleInputChange('emergency', 'name', e.target.value)}
                          placeholder="Enter emergency contact name"
                          className={`${styles.input.base} ${styles.input.default}`}
                          required
                        />
                      </div>

                      <div>
                        <label className={styles.label}>Relationship *</label>
                        <input
                          type="text"
                          value={formData.emergency.relationship}
                          onChange={(e) => handleInputChange('emergency', 'relationship', e.target.value)}
                          placeholder="Enter relationship"
                          className={`${styles.input.base} ${styles.input.default}`}
                          required
                        />
                      </div>

                      <div>
                        <label className={styles.label}>Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            value={formData.emergency.phone}
                            onChange={(e) => handleInputChange('emergency', 'phone', e.target.value)}
                            placeholder="Enter phone number"
                            className={`${styles.input.base} ${styles.input.default} ${styles.input.icon}`}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeSection === 'education' && (
                  <div className={styles.section.container}>
                    <div className={styles.section.header}>
                      <h3 className={styles.section.title}>
                        <BookOpen className="w-5 h-5" />
                        Education
                      </h3>
                      <p className={styles.section.description}>
                        Add educational qualifications and documents
                      </p>
                    </div>

                    {formData.education.map((edu, index) => (
                      <div key={edu.id} className={styles.section.card}>
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">
                            Education {index + 1}
                          </h4>
                          {index > 0 && (
                            <button
                              onClick={() => removeArrayItem('education', index)}
                              className={styles.button.icon}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className={styles.section.grid}>
                          <div>
                            <label className={styles.label}>Qualification *</label>
                            <input
                              type="text"
                              value={edu.qualification}
                              onChange={(e) => handleArrayChange('education', index, 'qualification', e.target.value)}
                              placeholder="Enter qualification"
                              className={`${styles.input.base} ${styles.input.default}`}
                            />
                          </div>

                          <div>
                            <label className={styles.label}>Institution *</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                              placeholder="Enter institution"
                              className={`${styles.input.base} ${styles.input.default}`}
                            />
                          </div>

                          <div>
                            <label className={styles.label}>Year *</label>
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                              placeholder="Enter year"
                              className={`${styles.input.base} ${styles.input.default}`}
                            />
                          </div>

                          <div>
                            <label className={styles.label}>Marks *</label>
                            <input
                              type="text"
                              value={edu.marks}
                              onChange={(e) => handleArrayChange('education', index, 'marks', e.target.value)}
                              placeholder="Enter marks"
                              className={`${styles.input.base} ${styles.input.default}`}
                            />
                          </div>

                          <div className="col-span-2">
                            <label className={styles.label}>Upload Documents</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
                              <div className="space-y-1 text-center">
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor={`documents-upload-${index}`}
                                    className="relative cursor-pointer rounded-md font-medium text-gray-900 hover:text-gray-700"
                                  >
                                    <span>Upload a file</span>
                                    <input
                                      id={`documents-upload-${index}`}
                                      type="file"
                                      className="sr-only"
                                      onChange={(e) => {
                                        const files = Array.from(e.target.files);
                                        handleArrayChange('education', index, 'documents', files);
                                      }}
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF files up to 10MB</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => addArrayItem('education')}
                        className={styles.button.secondary}
                      >
                        <Plus className="w-4 h-4" />
                        Add Another Education
                      </button>
                    </div>
                  </div>
                )}
                {activeSection === 'experience' && (
                  <div className={styles.section.container}>
                    <div className={styles.section.header}>
                      <h3 className={styles.section.title}>
                        <Briefcase className="w-5 h-5" />
                        Work Experience
                      </h3>
                      <p className={styles.section.description}>
                        Add previous work experience details
                      </p>
                    </div>

                    {formData.experience.map((exp, index) => (
                      <div key={exp.id} className={styles.section.card}>
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">
                            Experience {index + 1}
                          </h4>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem('experience', index)}
                              className={styles.button.icon}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className={styles.label}>Company Name *</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                              placeholder="Enter company name"
                              className={`${styles.input.base} ${styles.input.default}`}
                              required
                            />
                          </div>

                          <div>
                            <label className={styles.label}>Position *</label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                              placeholder="Enter position"
                              className={`${styles.input.base} ${styles.input.default}`}
                              required
                            />
                          </div>

                          <div>
                            <label className={styles.label}>Start Date *</label>
                            <input
                              type="date"
                              value={exp.startDate}
                              onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
                              className={`${styles.input.base} ${styles.input.default}`}
                              required
                            />
                          </div>

                          <div>
                            <label className={styles.label}>End Date *</label>
                            <input
                              type="date"
                              value={exp.endDate}
                              onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
                              className={`${styles.input.base} ${styles.input.default}`}
                              required
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className={styles.label}>Responsibilities</label>
                            <textarea
                              value={exp.responsibilities}
                              onChange={(e) => handleArrayChange('experience', index, 'responsibilities', e.target.value)}
                              placeholder="Enter key responsibilities"
                              className={`${styles.input.base} ${styles.input.default} min-h-[100px]`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => addArrayItem('experience')}
                        className={styles.button.secondary}
                      >
                        <Plus className="w-4 h-4" />
                        Add Another Experience
                      </button>
                    </div>
                  </div>
                )}
                {activeSection === 'documents' && (
                  <div className={styles.section.container}>
                    <div className={styles.section.header}>
                      <h3 className={styles.section.title}>
                        <FileText className="w-5 h-5" />
                        Documents
                      </h3>
                      <p className={styles.section.description}>
                        Upload required documents (Max size: 10MB per file)
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={styles.section.card}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">Resume/CV *</h4>
                            <p className="text-sm text-gray-500">Upload your latest resume</p>
                          </div>
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload('documents', 'resume', e.target.files[0])}
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            id="resume"
                            required
                          />
                          <label
                            htmlFor="resume"
                            className={styles.button.secondary}
                          >
                            <Plus className="w-4 h-4" />
                            Upload
                          </label>
                        </div>
                        {formData.documents.resume && (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600 truncate">
                              {formData.documents.resume.name}
                            </span>
                            <button
                              onClick={() => handleInputChange('documents', 'resume', null)}
                              className={styles.button.icon}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <div className={styles.section.card}>
                          <div className="flex flex-col items-center justify-center w-full p-6">
                            <div className="text-center mb-6">
                              <h4 className="text-lg font-semibold text-gray-900">Photo *</h4>
                              <p className="text-sm text-gray-500 mt-1">Upload a recent passport size photo</p>
                            </div>
                            
                            {formData.documents.photo ? (
                              <div className="flex flex-col items-center gap-4">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                                  <img 
                                    src={URL.createObjectURL(formData.documents.photo)} 
                                    alt="Employee" 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">
                                    {formData.documents.photo.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleInputChange('documents', 'photo', null)}
                                    className={styles.button.icon}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                                  <User className="w-12 h-12 text-gray-400" />
                                </div>
                                <input
                                  type="file"
                                  onChange={(e) => handleFileUpload('documents', 'photo', e.target.files[0])}
                                  accept="image/*"
                                  className="hidden"
                                  id="photo"
                                  required
                                />
                                <label
                                  htmlFor="photo"
                                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Upload Photo
                                </label>
                                <p className="mt-2 text-xs text-gray-500">PNG, JPG up to 10MB</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.section.card}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">Aadhar Card *</h4>
                            <p className="text-sm text-gray-500">Upload both sides in a single file</p>
                          </div>
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload('documents', 'aadhar', e.target.files[0])}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            id="aadhar"
                            required
                          />
                          <label
                            htmlFor="aadhar"
                            className={styles.button.secondary}
                          >
                            <Plus className="w-4 h-4" />
                            Upload
                          </label>
                        </div>
                        {formData.documents.aadhar && (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600 truncate">
                              {formData.documents.aadhar.name}
                            </span>
                            <button
                              onClick={() => handleInputChange('documents', 'aadhar', null)}
                              className={styles.button.icon}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className={styles.section.card}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">PAN Card *</h4>
                            <p className="text-sm text-gray-500">Upload a clear scan/photo</p>
                          </div>
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload('documents', 'pan', e.target.files[0])}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            id="pan"
                            required
                          />
                          <label
                            htmlFor="pan"
                            className={styles.button.secondary}
                          >
                            <Plus className="w-4 h-4" />
                            Upload
                          </label>
                        </div>
                        {formData.documents.pan && (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600 truncate">
                              {formData.documents.pan.name}
                            </span>
                            <button
                              onClick={() => handleInputChange('documents', 'pan', null)}
                              className={styles.button.icon}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className={styles.section.card}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">Bank Passbook/Cancelled Cheque *</h4>
                            <p className="text-sm text-gray-500">First page with account details</p>
                          </div>
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload('documents', 'bankPassbook', e.target.files[0])}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            id="bankPassbook"
                            required
                          />
                          <label
                            htmlFor="bankPassbook"
                            className={styles.button.secondary}
                          >
                            <Plus className="w-4 h-4" />
                            Upload
                          </label>
                        </div>
                        {formData.documents.bankPassbook && (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600 truncate">
                              {formData.documents.bankPassbook.name}
                            </span>
                            <button
                              onClick={() => handleInputChange('documents', 'bankPassbook', null)}
                              className={styles.button.icon}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'payroll' && (
                  <div className={styles.section.container}>
                    <div className={styles.section.header}>
                      <h3 className={styles.section.title}>
                        <Banknote className="w-5 h-5" />
                        Payroll Information
                      </h3>
                      <p className={styles.section.description}>
                        Enter employee's salary and bank account details
                      </p>
                    </div>

                    <div className={styles.section.grid}>
                      <div>
                        <label className={styles.label}>Payment Mode *</label>
                        <select
                          value={formData.payroll.paymentMode}
                          onChange={(e) => handleInputChange('payroll', 'paymentMode', e.target.value)}
                          className={`${styles.input.base} ${styles.input.default}`}
                          required
                        >
                          <option value="bankaccount">Bank Account</option>
                          <option value="cash">Cash</option>
                          <option value="cheque">Cheque</option>
                        </select>
                      </div>

                      {formData.payroll.paymentMode === 'bankaccount' && (
                        <>
                          <div>
                            <label className={styles.label}>Account Holder Name *</label>
                            <input
                              type="text"
                              value={formData.payroll.accountHolder}
                              onChange={(e) => handleInputChange('payroll', 'accountHolder', e.target.value)}
                              placeholder="Enter account holder name"
                              className={`${styles.input.base} ${styles.input.default}`}
                              required
                            />
                          </div>

                          <div>
                            <label className={styles.label}>Bank Name *</label>
                            <input
                              type="text"
                              value={formData.payroll.bankName}
                              onChange={(e) => handleInputChange('payroll', 'bankName', e.target.value)}
                              placeholder="Enter bank name"
                              className={`${styles.input.base} ${styles.input.default}`}
                              required
                            />
                          </div>

                          <div>
                            <label className={styles.label}>Account Number *</label>
                            <input
                              type="text"
                              value={formData.payroll.accountNumber}
                              onChange={(e) => handleInputChange('payroll', 'accountNumber', e.target.value)}
                              placeholder="Enter account number"
                              className={`${styles.input.base} ${styles.input.default}`}
                              required
                            />
                          </div>

                          <div>
                            <label className={styles.label}>IFSC Code *</label>
                            <input
                              type="text"
                              value={formData.payroll.ifsc}
                              onChange={(e) => handleInputChange('payroll', 'ifsc', e.target.value)}
                              placeholder="Enter IFSC code"
                              className={`${styles.input.base} ${styles.input.default}`}
                              required
                            />
                          </div>

                          <div>
                            <label className={styles.label}>Bank Branch *</label>
                            <input
                              type="text"
                              value={formData.payroll.bankBranch}
                              onChange={(e) => handleInputChange('payroll', 'bankBranch', e.target.value)}
                              placeholder="Enter bank branch"
                              className={`${styles.input.base} ${styles.input.default}`}
                              required
                            />
                          </div>
                        </>
                      )}

                      <div className="col-span-2 space-y-4">
                        {/* TDS Section */}
                        <div className="flex items-center">
                          <div className="w-1/3">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="tdsApplicable"
                                checked={formData.payroll.tdsApplicable}
                                onChange={(e) => handleInputChange('payroll', 'tdsApplicable', e.target.checked)}
                                className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                              />
                              <label htmlFor="tdsApplicable" className="text-sm text-gray-700">TDS Applicable</label>
                            </div>
                          </div>

                          {formData.payroll.tdsApplicable && (
                            <div className="w-2/3">
                              <input
                                type="text"
                                value={formData.personal.panNumber}
                                onChange={(e) => handleInputChange('personal', 'panNumber', e.target.value)}
                                placeholder="Enter PAN number"
                                className={`${styles.input.base} ${styles.input.default} h-10 text-sm`}
                                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                                title="Enter valid PAN number (e.g., AAAAA9999A)"
                                required
                              />
                            </div>
                          )}
                        </div>

                        {/* PF Section */}
                        <div className="flex items-center">
                          <div className="w-1/3">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="pfEnabled"
                                checked={formData.payroll.pfEnabled}
                                onChange={(e) => handleInputChange('payroll', 'pfEnabled', e.target.checked)}
                                className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                              />
                              <label htmlFor="pfEnabled" className="text-sm text-gray-700">Enable PF</label>
                            </div>
                          </div>

                          {formData.payroll.pfEnabled && (
                            <div className="w-2/3">
                              <input
                                type="text"
                                value={formData.payroll.uanNumber}
                                onChange={(e) => handleInputChange('payroll', 'uanNumber', e.target.value)}
                                placeholder="Enter UAN number"
                                className={`${styles.input.base} ${styles.input.default} h-10 text-sm`}
                              />
                            </div>
                          )}
                        </div>

                        {/* ESI Section */}
                        <div className="flex items-center">
                          <div className="w-1/3">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="esiEnabled"
                                checked={formData.payroll.esiEnabled}
                                onChange={(e) => handleInputChange('payroll', 'esiEnabled', e.target.checked)}
                                className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                              />
                              <label htmlFor="esiEnabled" className="text-sm text-gray-700">Enable ESI</label>
                            </div>
                          </div>

                          {formData.payroll.esiEnabled && (
                            <div className="w-2/3">
                              <input
                                type="text"
                                value={formData.payroll.esicNumber}
                                onChange={(e) => handleInputChange('payroll', 'esicNumber', e.target.value)}
                                placeholder="Enter ESIC number"
                                className={`${styles.input.base} ${styles.input.default} h-10 text-sm`}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'medical' && (
                  <div className={styles.section.container}>
                    <div className={styles.section.header}>
                      <h3 className={styles.section.title}>
                        <Heart className="w-5 h-5" />
                        Medical Information
                      </h3>
                      <p className={styles.section.description}>
                        Upload medical test reports and vaccination records
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className={styles.section.card}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">Hepatitis B Vaccination</h4>
                            <p className="text-sm text-gray-500">Upload vaccination certificate</p>
                          </div>
                          {formData.medical.hepatitis && (
                            <button
                              onClick={() => handleInputChange('medical', 'hepatitis', null)}
                              className={styles.button.icon}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
                          <div className="space-y-1 text-center">
                            {formData.medical.hepatitis ? (
                              <div className="flex items-center justify-center">
                                <FileText className="h-12 w-12 text-gray-400" />
                                <span className="ml-2 text-sm text-gray-600">{formData.medical.hepatitis.name}</span>
                              </div>
                            ) : (
                              <>
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="hepatitis-upload"
                                    className="relative cursor-pointer rounded-md font-medium text-gray-900 hover:text-gray-700"
                                  >
                                    <span>Upload a file</span>
                                    <input
                                      id="hepatitis-upload"
                                      type="file"
                                      className="sr-only"
                                      onChange={(e) => handleFileUpload('medical', 'hepatitis', e.target.files[0])}
                                      accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.section.card}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">Tetanus Vaccination</h4>
                            <p className="text-sm text-gray-500">Upload vaccination certificate</p>
                          </div>
                          {formData.medical.tetanus && (
                            <button
                              onClick={() => handleInputChange('medical', 'tetanus', null)}
                              className={styles.button.icon}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
                          <div className="space-y-1 text-center">
                            {formData.medical.tetanus ? (
                              <div className="flex items-center justify-center">
                                <FileText className="h-12 w-12 text-gray-400" />
                                <span className="ml-2 text-sm text-gray-600">{formData.medical.tetanus.name}</span>
                              </div>
                            ) : (
                              <>
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="tetanus-upload"
                                    className="relative cursor-pointer rounded-md font-medium text-gray-900 hover:text-gray-700"
                                  >
                                    <span>Upload a file</span>
                                    <input
                                      id="tetanus-upload"
                                      type="file"
                                      className="sr-only"
                                      onChange={(e) => handleFileUpload('medical', 'tetanus', e.target.files[0])}
                                      accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.section.card}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">CBC Test Report</h4>
                            <p className="text-sm text-gray-500">Upload Complete Blood Count test report</p>
                          </div>
                          {formData.medical.cbc && (
                            <button
                              onClick={() => handleInputChange('medical', 'cbc', null)}
                              className={styles.button.icon}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
                          <div className="space-y-1 text-center">
                            {formData.medical.cbc ? (
                              <div className="flex items-center justify-center">
                                <FileText className="h-12 w-12 text-gray-400" />
                                <span className="ml-2 text-sm text-gray-600">{formData.medical.cbc.name}</span>
                              </div>
                            ) : (
                              <>
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="cbc-upload"
                                    className="relative cursor-pointer rounded-md font-medium text-gray-900 hover:text-gray-700"
                                  >
                                    <span>Upload a file</span>
                                    <input
                                      id="cbc-upload"
                                      type="file"
                                      className="sr-only"
                                      onChange={(e) => handleFileUpload('medical', 'cbc', e.target.files[0])}
                                      accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.section.card}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">Urine Test Report</h4>
                            <p className="text-sm text-gray-500">Upload urine test report</p>
                          </div>
                          {formData.medical.urine && (
                            <button
                              onClick={() => handleInputChange('medical', 'urine', null)}
                              className={styles.button.icon}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
                          <div className="space-y-1 text-center">
                            {formData.medical.urine ? (
                              <div className="flex items-center justify-center">
                                <FileText className="h-12 w-12 text-gray-400" />
                                <span className="ml-2 text-sm text-gray-600">{formData.medical.urine.name}</span>
                              </div>
                            ) : (
                              <>
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="urine-upload"
                                    className="relative cursor-pointer rounded-md font-medium text-gray-900 hover:text-gray-700"
                                  >
                                    <span>Upload a file</span>
                                    <input
                                      id="urine-upload"
                                      type="file"
                                      className="sr-only"
                                      onChange={(e) => handleFileUpload('medical', 'urine', e.target.files[0])}
                                      accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.section.card}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">Chest X-Ray</h4>
                            <p className="text-sm text-gray-500">Upload chest X-ray report</p>
                          </div>
                          {formData.medical.chestXray && (
                            <button
                              onClick={() => handleInputChange('medical', 'chestXray', null)}
                              className={styles.button.icon}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
                          <div className="space-y-1 text-center">
                            {formData.medical.chestXray ? (
                              <div className="flex items-center justify-center">
                                <FileText className="h-12 w-12 text-gray-400" />
                                <span className="ml-2 text-sm text-gray-600">{formData.medical.chestXray.name}</span>
                              </div>
                            ) : (
                              <>
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="chestXray-upload"
                                    className="relative cursor-pointer rounded-md font-medium text-gray-900 hover:text-gray-700"
                                  >
                                    <span>Upload a file</span>
                                    <input
                                      id="chestXray-upload"
                                      type="file"
                                      className="sr-only"
                                      onChange={(e) => handleFileUpload('medical', 'chestXray', e.target.files[0])}
                                      accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={styles.card.footer}>
            <div className="flex justify-end gap-4">
              <button type="button" className={styles.button.secondary}>
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button type="submit" className={styles.button.primary}>
                <Plus className="w-4 h-4" />
                Add Candidate
              </button>
            </div>
          </div>
        </form>

        {/* Toast Message */}
        {toast.show && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-xl shadow-lg ${
            toast.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCandidate;