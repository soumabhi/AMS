import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Phone, Calendar, MapPin, User, Briefcase, Droplet, GraduationCap, Home, CreditCard, Shield, Edit, Check, X } from 'lucide-react';

const CandidateDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [candidate, setCandidate] = useState(state?.candidate);
  const [editingSection, setEditingSection] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Candidate not found</h2>
            <button
              onClick={() => navigate('/candidates')}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Candidates
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleEditClick = (section) => {
    setEditingSection(section);
    // Initialize form data with current candidate data for the section
    setEditFormData({
      ...candidate
    });
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleSave = (section) => {
    setCandidate({
      ...candidate,
      ...editFormData
    });
    setEditingSection(null);
    // Here you would typically also make an API call to save the changes
    // await updateCandidate(editFormData);
  };

  const renderEditableField = (fieldName, label, value, section) => {
    if (editingSection === section) {
      return (
        <div className="mb-2">
          <label className="text-sm text-gray-500 block">{label}</label>
          <input
            type={fieldName.includes('Date') || fieldName === 'dob' ? 'date' : 'text'}
            name={fieldName}
            value={editFormData[fieldName] || ''}
            onChange={handleInputChange}
            className="w-full p-1 border rounded"
          />
        </div>
      );
    }
    return (
      <div>
        <label className="text-sm text-gray-500">{label}</label>
        <p className="font-medium">{value || 'N/A'}</p>
      </div>
    );
  };

  const renderSectionActions = (section) => {
    if (editingSection === section) {
      return (
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={() => handleSave(section)}
            className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
            title="Save changes"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancelEdit}
            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }
    return (
      <button
        onClick={() => handleEditClick(section)}
        className="absolute top-2 right-2 p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 opacity-0 group-hover:opacity-100 transition-opacity"
        title={`Edit ${section} Information`}
      >
        <Edit className="w-4 h-4" />
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-black transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Candidates
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-black p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mr-4">
                  <span className="text-2xl font-bold text-gray-800">
                    {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div>
                  {editingSection === 'header' ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name || ''}
                        onChange={handleInputChange}
                        className="text-2xl font-bold bg-white bg-opacity-20 p-1 rounded"
                      />
                      <input
                        type="text"
                        name="applyingFor"
                        value={editFormData.applyingFor || ''}
                        onChange={handleInputChange}
                        className="text-gray-300 bg-white bg-opacity-20 p-1 rounded"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold">{candidate.name}</h1>
                      <p className="text-gray-300">{candidate.applyingFor}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-white bg-opacity-20 text-sm">
                  {candidate.status}
                </span>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Applied: {formatDate(candidate.appliedDate)}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
     <div className="bg-gray-50 p-4 rounded-lg relative group">
  {renderSectionActions('personal')}
  <h2 className="text-lg font-semibold mb-3 flex items-center">
    <User className="w-5 h-5 mr-2" />
    Personal Information
  </h2>
  <div className="space-y-2">
    {renderEditableField('firstName', 'First Name', candidate.firstName, 'personal')}
    {renderEditableField('middleName', 'Middle Name', candidate.middleName, 'personal')}
    {renderEditableField('lastName', 'Last Name', candidate.lastName, 'personal')}
    
    {renderEditableField(
      'gender',
      'Gender',
      candidate.gender,
      'personal',
      ['Male', 'Female', 'Other']
    )}
    
    {renderEditableField(
      'bloodGrp',
      'Blood Group',
      candidate.bloodGrp,
      'personal',
      ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    )}
    
    {renderEditableField('dob', 'Date of Birth', formatDate(candidate.dob), 'personal')}
  </div>
</div>



              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg relative group">
                {renderSectionActions('contact')}
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Information
                </h2>
                <div className="space-y-2">
                  {renderEditableField('contactNumber', 'Phone', candidate.contactNumber, 'contact')}
                  {renderEditableField('email', 'Email', candidate.email, 'contact')}
                  {renderEditableField('emergencyContactName', 'Emergency Contact Name', candidate.emergencyContactName, 'contact')}
                  {renderEditableField('emergencyContactRelationship', 'Relationship', candidate.emergencyContactRelationship, 'contact')}
                  {renderEditableField('emergencyContact', 'Emergency Contact', candidate.emergencyContact, 'contact')}
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gray-50 p-4 rounded-lg relative group">
                {renderSectionActions('address')}
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Address Information
                </h2>
                <div className="space-y-2">
                  {renderEditableField('address1', 'Address Line 1', candidate.address1, 'address')}
                  {renderEditableField('address2', 'Address Line 2', candidate.address2, 'address')}
                  {renderEditableField('dist', 'District', candidate.dist, 'address')}
                  {renderEditableField('block', 'Block', candidate.block, 'address')}
                  {renderEditableField('zipCode', 'ZIP Code', candidate.zipCode, 'address')}
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-gray-50 p-4 rounded-lg relative group">
                {renderSectionActions('professional')}
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Professional Information
                </h2>
                <div className="space-y-2">
                  {renderEditableField('currentEntity', 'Current Entity', candidate.currentEntity, 'professional')}
                  {renderEditableField('designation', 'Designation', candidate.designation, 'professional')}
                  {renderEditableField('dept', 'Department', candidate.dept, 'professional')}
                  {renderEditableField('doj', 'Date of Joining', formatDate(candidate.doj), 'professional')}
                  {renderEditableField('salary', 'Salary', candidate.salary, 'professional')}
                </div>
              </div>

              {/* Educational Information */}
              <div className="bg-gray-50 p-4 rounded-lg relative group">
                {renderSectionActions('education')}
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Educational Information
                </h2>
                <div className="space-y-2">
                  {renderEditableField('qualification', 'Qualification', candidate.qualification, 'education')}
                  {renderEditableField('branch', 'Branch', candidate.branch, 'education')}
                  {renderEditableField('passingYear', 'Passing Year', candidate.passingYear, 'education')}
                </div>
              </div>

              {/* Banking & Identification */}
              <div className="bg-gray-50 p-4 rounded-lg relative group">
                {renderSectionActions('banking')}
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Banking & Identification
                </h2>
                <div className="space-y-2">
                  {renderEditableField('adhaarNumber', 'Aadhaar Number', candidate.adhaarNumber, 'banking')}
                  {renderEditableField('panNumber', 'PAN Number', candidate.panNumber, 'banking')}
                  {renderEditableField('bankAccountHolderName', 'Account Holder Name', candidate.bankAccountHolderName, 'banking')}
                  {renderEditableField('bankName', 'Bank Name', candidate.bankName, 'banking')}
                  {renderEditableField('accountNo', 'Account Number', candidate.accountNo, 'banking')}
                  {renderEditableField('ifscCode', 'IFSC Code', candidate.ifscCode, 'banking')}
                  {renderEditableField('bankBranch', 'Bank Branch', candidate.bankBranch, 'banking')}
                  {renderEditableField('modeOfPayment', 'Mode of Payment', candidate.modeOfPayment, 'banking')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;