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
import AddCandidate from "./pages/Onboarding/AddCandidate";
import PayrollDetails from "./pages/Onboarding/PayrollDetails";
import ActiveEmployees from "./pages/Manage Employee/ActiveEmployees";
import DisabledEmployee from "./pages/Manage Employee/DisabledEmplyee";
import ViewAttendance from "./pages/Manage_Attendance/View_Attendance";
import ApprooveAttendance from "./pages/Manage_Attendance/ApprooveAttendance";
import ViewLeaveRequest from "./pages/Manage_Leaves/ViewLeaveRequest";
import ApplyLeave from "./pages/Manage_Leaves/ApplyLeave ";
import ViewLeaveApplications from "./pages/Manage_Leaves/Leaveapplication";
import LeaveCredit from "./pages/Manage_Leaves/LeaveCredit";
import Calender from "./pages/Calender";
import DeputationTable from "./pages/Deputatin&Transfer/Deputation";
import Transfertable from "./pages/Deputatin&Transfer/Transfer";


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
          <Route path="/AddCandidate" element={<AddCandidate />} />
          <Route path="/PayrollDetails" element={<PayrollDetails />} />
          <Route path="/ActiveEmployees" element={<ActiveEmployees />} />
          <Route path="/DisabledEmployee" element={<DisabledEmployee />} />
          <Route path="/ViewAttendance" element={<ViewAttendance />} />
          <Route path="/ApprooveAttendance" element={<ApprooveAttendance />} />
          <Route path="/ViewLeaveRequest" element={<ViewLeaveRequest />} />
          <Route path="/ApplyLeave" element={<ApplyLeave />} />
          <Route path="/ViewLeaveApplications" element={<ViewLeaveApplications />} />
          <Route path="/LeaveCredit" element={<LeaveCredit />} />
          <Route path="/Calender" element={<Calender />} />
          <Route path="/DeputationTable" element={<DeputationTable />} />
          <Route path="/Transfertable" element={<Transfertable />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;