import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Phone, Calendar, MapPin, User, Briefcase, Droplet, GraduationCap, Home, CreditCard, Shield } from 'lucide-react';

const CandidateDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const candidate = state?.candidate;

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

  // Format date function
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-4 text-gray-600 hover:text-black transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Candidates
        </button>

        {/* Main card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-black p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mr-4">
                  <span className="text-2xl font-bold text-gray-800">
                    {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{candidate.name}</h1>
                  <p className="text-gray-300">{candidate.applyingFor}</p>
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

          {/* Main content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h2>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <p className="font-medium">{candidate.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Gender</label>
                    <p className="font-medium">{candidate.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Date of Birth</label>
                    <p className="font-medium">{formatDate(candidate.dob)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Blood Group</label>
                    <p className="font-medium">{candidate.bloodGrp || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Information
                </h2>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="font-medium">{candidate.contactNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{candidate.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Emergency Contact</label>
                    <p className="font-medium">
                      {candidate.emergencyContactName} ({candidate.emergencyContactRelationship}): {candidate.emergencyContact}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Address Information
                </h2>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-gray-500">Address</label>
                    <p className="font-medium">
                      {candidate.address1}, {candidate.address2}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">District</label>
                    <p className="font-medium">{candidate.dist}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Block</label>
                    <p className="font-medium">{candidate.block}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">ZIP Code</label>
                    <p className="font-medium">{candidate.zipCode}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Professional Information
                </h2>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-gray-500">Current Entity</label>
                    <p className="font-medium">{candidate.currentEntity || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Designation</label>
                    <p className="font-medium">{candidate.designation || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Department</label>
                    <p className="font-medium">{candidate.dept || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Date of Joining</label>
                    <p className="font-medium">{formatDate(candidate.doj)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Salary</label>
                    <p className="font-medium">{candidate.salary || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Educational Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Educational Information
                </h2>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-gray-500">Qualification</label>
                    <p className="font-medium">{candidate.qualification || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Branch</label>
                    <p className="font-medium">{candidate.branch || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Passing Year</label>
                    <p className="font-medium">{candidate.passingYear || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Banking & Identification */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Banking & Identification
                </h2>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-gray-500">Aadhaar Number</label>
                    <p className="font-medium">{candidate.adhaarNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">PAN Number</label>
                    <p className="font-medium">{candidate.panNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Bank Details</label>
                    <p className="font-medium">
                      {candidate.bankAccountHolderName} - {candidate.bankName} ({candidate.accountNo})
                    </p>
                    <p className="text-sm">
                      IFSC: {candidate.ifscCode}, Branch: {candidate.bankBranch}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Mode of Payment</label>
                    <p className="font-medium">{candidate.modeOfPayment || 'N/A'}</p>
                  </div>
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