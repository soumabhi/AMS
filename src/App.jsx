// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import DashboardLayout from "./layouts/DashboardLayout";


// Pages
import Dashboard from "./pages/Dashboard";
import ManageShift from "./pages/Configuration/ManageShift";
import ManageRole from "./pages/Configuration/ManageRole";
import LeaveType from "./pages/Configuration/LeaveType";
import AttendanceStatus from "./pages/Configuration/AttendanceStatus";
import DepartmentManagement from "./pages/Configuration/Department";
import DesignationManagement from "./pages/Configuration/Designation";
import BranchManagement from "./pages/Configuration/Branch";
import CandidateProfile from "./pages/Onboarding/CandidateProfile";
import EmployeeDetails from "./pages/Onboarding/EmployeeDetails";
import AddEmployee from "./pages/Onboarding/AddEmployee";

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ManageShift" element={<ManageShift />} />
          <Route path="/ManageRole" element={<ManageRole />} />
          <Route path="/LeaveType" element={<LeaveType />} />
          <Route path="/AttendanceStatus" element={<AttendanceStatus />} />
          <Route path="/Department" element={<DepartmentManagement />} />
          <Route path="/Designation" element={<DesignationManagement />} />
          <Route path="/Branch" element={<BranchManagement />} />
          <Route path="/CandidateProfile" element={<CandidateProfile />} />
          <Route path="/EmployeeDetails" element={<EmployeeDetails />} />
          <Route path="/AddEmployee" element={<AddEmployee />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
