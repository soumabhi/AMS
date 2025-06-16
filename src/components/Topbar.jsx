// src/components/Topbar.jsx
import React, { useState, useEffect } from "react";
import { User, LogOut, Calendar, Clock, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const toggleProfileCard = () => {
    setShowProfileCard(!showProfileCard);
  };

  const closeProfileCard = () => {
    setShowProfileCard(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setShowProfileCard(false);
  };

  const confirmLogout = () => {
    // Here you would typically also clear any user session/tokens
    navigate('/login'); // Redirect to login page
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time (HH:MM:SS AM/PM)
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // Format date (Day, Month Date Year)
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex justify-between items-center px-8 py-3 bg-gray-100">
      {/* Left - Branch Name */}
      <div className="flex items-center space-x-3">
        <Building2 className="w-6 h-6 text-gray-600" />
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Branch</span>
          <span className="text-xl font-bold text-black tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Main Office
          </span>
        </div>
      </div>

      {/* Center - Date and Time */}
      <div className="flex items-center space-x-6">
        <div className="bg-white px-4 py-2 rounded-xl flex items-center space-x-3 border border-gray-200 shadow-sm">
          <Calendar className="w-4 h-4 text-black" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase font-medium">Date</span>
            <span className="font-semibold text-black text-sm">{formattedDate}</span>
          </div>
        </div>
        
        <div className="bg-black px-4 py-2 rounded-xl flex items-center space-x-3 shadow-sm">
          <Clock className="w-4 h-4 text-white" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-300 uppercase font-medium">Time</span>
            <span className="font-semibold text-white text-sm">{formattedTime}</span>
          </div>
        </div>
      </div>

      {/* Right - Profile Section */}
      <div className="flex items-center">
        <div className="relative">
          {/* Profile Avatar */}
          <div 
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all duration-200 shadow-sm border border-gray-300"
            onClick={toggleProfileCard}
          >
            <User className="w-6 h-6 text-black" />
          </div>
          
          {/* Profile Click Card */}
          {showProfileCard && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40"
                onClick={closeProfileCard}
              ></div>
              
              {/* Profile Card */}
              <div className="absolute top-14 right-0 bg-white border border-gray-200 rounded-xl shadow-xl py-4 px-6 z-50 min-w-72 transform transition-all duration-200">
                {/* Profile Header */}
                <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-100">
                  <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-lg text-black">Ram Kumar Verma</h3>
                    <p className="text-sm text-gray-600">Employee ID: EMP001</p>
                  </div>
                </div>
                
                {/* Profile Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 uppercase font-medium">Role</span>
                    <span className="font-semibold text-black">Administrator</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 uppercase font-medium">Department</span>
                    <span className="font-semibold text-black">IT Department</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 uppercase font-medium">Branch</span>
                    <span className="font-semibold text-black">Main Office</span>
                  </div>
                </div>
                
                {/* Logout Button */}
                <div className="pt-3 border-t border-gray-100">
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center justify-center space-x-2 w-full bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
                
                {/* Arrow pointer */}
                <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50"></div>
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-xl font-bold mb-4">Confirm Logout</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to logout from the system?</p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelLogout}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Topbar;