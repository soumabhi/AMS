import React, { useState } from "react";
import {
  LayoutDashboard,
  Settings,
  UserPlus,
  Users,
  Clock,
  Calendar,
  Briefcase,
  CreditCard,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  GitBranch,
  UserCheck,
  FileText,
  Building,
  Award,
  Eye,
  CheckCircle,
  Send,
  Plus,
  Coins,
  BarChart3,
  Handshake
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    path: "/",
    type: "single"
  },
  {
    id: "configuration",
    label: "Configuration",
    icon: Settings,
    type: "accordion",
    subItems: [
      { label: "Manage Shifts", icon: Clock, path: "/ManageShift" },
      { label: "Manage Role", icon: GitBranch, path: "/ManageRole" },
      { label: "Leave Type", icon: FileText, path: "/LeaveType" },
      { label: "Attendance Status", icon: UserCheck, path: "/AttendanceStatus" },
      { label: "Branch", icon: Building, path: "/Branch" },
      { label: "Department", icon: Building, path: "/Department" },
      { label: "Designation", icon: Award, path: "/Designation" }
    ]
  },
  {
    id: "recruitment",
    label: "Recruitment",
    icon: Handshake,
    path: "/recruitment",
    type: "single"
  },
  {
    id: "onboarding",
    label: "Onboarding",
    icon: UserPlus,
    type: "accordion",
    subItems: [
      { label: "Candidate Profile", icon: Users, path: "/CandidateProfile" },
      { label: "Employee Details", icon: FileText, path: "/EmployeeDetails" },
      { label: "Payroll MS", icon: CreditCard, path: "/PayrollDetails" }
    ]
  },
  {
    id: "manage-employee",
    label: "Manage Employee",
    icon: Users,
    type: "accordion",
    subItems: [
      { label: "Active Employees", icon: UserCheck, path: "/ActiveEmployees" },
      { label: "Disabled Employees", icon: Users, path: "/employees/disabled" }
    ]
  },
  {
    id: "manage-attendance",
    label: "Manage Attendance",
    icon: Clock,
    type: "accordion",
    subItems: [
      { label: "View Attendance", icon: Eye, path: "/attendance/view" },
      { label: "Approve Attendance", icon: CheckCircle, path: "/attendance/approve" }
    ]
  },
  {
    id: "manage-leaves",
    label: "Manage Leaves",
    icon: Briefcase,
    type: "accordion",
    subItems: [
      { label: "Leave Request", icon: Send, path: "/leaves/request" },
      { label: "Leave Application", icon: FileText, path: "/leaves/application" },
      { label: "Leave Credit", icon: Plus, path: "/leaves/credit" }
    ]
  },
  {
    id: "deputation-transfer",
    label: "Deputation & Transfer",
    icon: ArrowRightLeft,
    path: "/deputation-transfer",
    type: "single"
  },
  {
    id: "manage-payroll",
    label: "Manage Payroll",
    icon: CreditCard,
    path: "/payroll",
    type: "single"
  },
  {
    id: "holiday-calendar",
    label: "Holiday Calendar",
    icon: Calendar,
    path: "/holiday-calendar",
    type: "single"
  }
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeAccordions, setActiveAccordions] = useState(new Set());
  const [activeItem, setActiveItem] = useState("dashboard");
  const navigate = useNavigate();

  const toggleAccordion = (id) => {
    const newAccordions = new Set(activeAccordions);
    if (newAccordions.has(id)) {
      newAccordions.delete(id);
    } else {
      newAccordions.add(id);
    }
    setActiveAccordions(newAccordions);
  };

  const handleItemClick = (id, path) => {
    setActiveItem(id);
    navigate(path);
  };

  const renderMenuItem = (item) => {
    const isActive = activeItem === item.id;
    const isAccordionOpen = activeAccordions.has(item.id);

    if (item.type === "single") {
      return (
        <div
          key={item.id}
          onClick={() => handleItemClick(item.id, item.path)}
          className={`
            flex items-center px-4 py-4 mx-2 rounded-lg cursor-pointer
            transition-all duration-200 ease-out group relative
            ${collapsed ? 'justify-center' : 'justify-start'}
            ${isActive
              ? "bg-black text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100 hover:text-black"
            }
          `}
        >
          <item.icon
            className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-black"
              }`}
          />
          {!collapsed && (
            <span className="ml-3 font-medium text-sm">{item.label}</span>
          )}
          {collapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-black text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
              {item.label}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-black rotate-45"></div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.id} className="mx-2">
        <button
          onClick={() => {
            toggleAccordion(item.id);
            if (!collapsed) {
              handleItemClick(item.id);
            }
          }}
          className={`
            w-full flex items-center px-4 py-4 rounded-lg
            transition-all duration-200 ease-out group relative
            ${collapsed ? 'justify-center' : 'justify-between'}
            ${isActive && isAccordionOpen
              ? "bg-black text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100 hover:text-black"
            }
          `}
        >
          <div className="flex items-center">
            <item.icon
              className={`w-5 h-5 flex-shrink-0 ${isActive && isAccordionOpen
                ? "text-white"
                : "text-black"
                }`}
            />
            {!collapsed && (
              <span className="ml-3 font-medium text-sm">{item.label}</span>
            )}
          </div>
          {!collapsed && (
            <div className="ml-2 flex-shrink-0">
              {isAccordionOpen ? (
                <ChevronUp className={`w-4 h-4 ${isActive && isAccordionOpen ? 'text-white' : 'text-black'
                  }`} />
              ) : (
                <ChevronDown className={`w-4 h-4 ${isActive && isAccordionOpen ? 'text-white' : 'text-black'
                  }`} />
              )}
            </div>
          )}
          {collapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-black text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
              {item.label}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-black rotate-45"></div>
            </div>
          )}
        </button>

        {!collapsed && isAccordionOpen && (
          <div className="mt-2 space-y-1 pl-4">
            {item.subItems.map((subItem) => (
              <div
                key={subItem.path}
                onClick={() => handleItemClick(item.id, subItem.path)}
                className="flex items-center px-4 py-3 rounded-md text-sm text-gray-600 hover:text-black hover:bg-gray-200/80 transition-all duration-150 group cursor-pointer ml-4 border-l-2 border-gray-200"
              >
                <subItem.icon className="w-4 h-4 text-black transition-colors duration-150 flex-shrink-0" />
                <span className="ml-3 font-medium">{subItem.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
        bg-gray-100 h-screen flex flex-col
        transition-all duration-300 ease-out
        ${collapsed ? "w-16" : "w-72"}
      `}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-black">AMS</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg text-black hover:text-black hover:bg-gray-200 transition-all duration-200 flex-shrink-0 ${collapsed ? 'ml-0' : ''}`}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-hidden">
        <div className="space-y-2 h-full overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {menuItems.map(renderMenuItem)}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;