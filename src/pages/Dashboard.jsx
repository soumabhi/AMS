import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { Users, UserCheck, UserX, Clock, Calendar, TrendingUp, TrendingDown, AlertTriangle, Building, Activity, Star, Zap, Target, Award } from 'lucide-react';

const Dashboard = () => {
    const [branch, setBranch] = useState('');
    const [timeRange, setTimeRange] = useState('week');

    // Enhanced sample data with unauthorized leave
    const employeeStats = [
        {
            title: 'Total Employees',
            value: 120,
            icon: Users,
            change: '+5%',
            trend: 'up',
            description: 'Active workforce',
            gradient: 'from-purple-600 via-purple-500 to-pink-500'
        },
        {
            title: 'Present Today',
            value: 98,
            icon: UserCheck,
            change: '+2%',
            trend: 'up',
            description: 'Currently working',
            gradient: 'from-emerald-600 via-emerald-500 to-teal-500'
        },
        {
            title: 'Authorized Leave',
            value: 15,
            icon: Calendar,
            change: '0%',
            trend: 'neutral',
            description: 'Approved absences',
            gradient: 'from-amber-600 via-amber-500 to-orange-500'
        },
        {
            title: 'Unauthorized leave',
            value: 4,
            icon: AlertTriangle,
            change: '-25%',
            trend: 'down',
            description: 'Unplanned absences',
            gradient: 'from-red-600 via-red-500 to-rose-500'
        },
        {
            title: 'Late Arrivals',
            value: 3,
            icon: Clock,
            change: '-40%',
            trend: 'down',
            description: 'Arrived after 9:00 AM',
            gradient: 'from-indigo-600 via-indigo-500 to-blue-500'
        }
    ];

    // Enhanced attendance summary data with gradients
    const attendanceSummaryData = [
        { name: 'Present', value: 98, color: '#10b981', gradient: 'from-emerald-400 to-emerald-600' },
        { name: 'Authorized Leave', value: 15, color: '#f59e0b', gradient: 'from-amber-400 to-amber-600' },
        { name: 'Unauthorized Leave', value: 4, color: '#ef4444', gradient: 'from-red-400 to-red-600' },
        { name: 'Late', value: 3, color: '#8b5cf6', gradient: 'from-purple-400 to-purple-600' }
    ];

    // Enhanced day-wise data
    const dayWiseData = [
        { day: 'Mon', present: 95, late: 3, authorized: 12, unauthorized: 2 },
        { day: 'Tue', present: 102, late: 2, authorized: 8, unauthorized: 1 },
        { day: 'Wed', present: 88, late: 5, authorized: 15, unauthorized: 3 },
        { day: 'Thu', present: 96, late: 4, authorized: 10, unauthorized: 2 },
        { day: 'Fri', present: 98, late: 3, authorized: 12, unauthorized: 1 },
        { day: 'Sat', present: 85, late: 2, authorized: 18, unauthorized: 5 }
    ];

    // Attendance trend data
    const trendData = [
        { week: 'W1', attendance: 92, target: 95 },
        { week: 'W2', attendance: 94, target: 95 },
        { week: 'W3', attendance: 89, target: 95 },
        { week: 'W4', attendance: 96, target: 95 },
        { week: 'W5', attendance: 91, target: 95 },
        { week: 'W6', attendance: 93, target: 95 }
    ];

    // Enhanced recent activities
    const recentActivities = [
        {
            id: 1,
            employee: 'John Doe',
            action: 'Checked in',
            time: '08:45 AM',
            status: 'present',
            department: 'Engineering',
            avatar: 'JD'
        },
        {
            id: 2,
            employee: 'Jane Smith',
            action: 'Applied for leave',
            time: 'Yesterday',
            status: 'leave',
            department: 'Marketing',
            avatar: 'JS'
        },
        {
            id: 3,
            employee: 'Robert Johnson',
            action: 'Late arrival',
            time: '09:30 AM',
            status: 'late',
            department: 'HR',
            avatar: 'RJ'
        },
        {
            id: 4,
            employee: 'Emily Davis',
            action: 'Unauthorized absence',
            time: 'Today',
            status: 'unauthorized',
            department: 'Finance',
            avatar: 'ED'
        },
        {
            id: 5,
            employee: 'Michael Wilson',
            action: 'On business trip',
            time: '2 days ago',
            status: 'travel',
            department: 'Operations',
            avatar: 'MW'
        },
        {
            id: 6,
            employee: 'Sarah Brown',
            action: 'Checked in',
            time: '08:30 AM',
            status: 'present',
            department: 'Design',
            avatar: 'SB'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 border border-emerald-200/50 backdrop-blur-xl';
            case 'leave': return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 border border-amber-200/50 backdrop-blur-xl';
            case 'late': return 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-700 border border-purple-200/50 backdrop-blur-xl';
            case 'unauthorized': return 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-700 border border-red-200/50 backdrop-blur-xl';
            case 'travel': return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 border border-blue-200/50 backdrop-blur-xl';
            default: return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-700 border border-gray-200/50 backdrop-blur-xl';
        }
    };

    const getTrendIcon = (trend) => {
        if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-600" />;
        if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
        return <Activity className="w-4 h-4 text-gray-500" />;
    };

    const getTrendColor = (trend) => {
        if (trend === 'up') return 'text-emerald-600';
        if (trend === 'down') return 'text-red-600';
        return 'text-gray-500';
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-xl p-4 border border-gray-200/50 rounded-xl shadow-2xl">
                    <p className="font-semibold text-gray-900 text-sm mb-2">{`${label}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
                            {`${entry.dataKey}: ${entry.value}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen rounded-lg bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 space-y-8">
            {/* Animated Background Elements */}
            {/* <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div> */}

            {/* Header */}
            <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-black bg-clip-text text-transparent">
                                    Dashboard Overview
                                </h1>
                                <p className="text-gray-600 font-medium">Monitor employee attendance and performance metrics</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <select
                            className="px-4 py-3 text-sm font-medium border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            onChange={(e) => setBranch(e.target.value)}
                            value={branch}
                        >
                            <option value="">All Branches</option>
                            <option value="bhubaneswar">Bhubaneswar</option>
                            <option value="dhenkanal">Dhenkanal</option>
                            <option value="bhadrak">Bhadrak</option>
                            <option value="jajpur">Jajpur</option>
                            <option value="khordha">Khordha</option>
                            <option value="cuttack">Cuttack</option>
                        </select>

                        <select
                            className="px-4 py-3 text-sm font-medium border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            onChange={(e) => setTimeRange(e.target.value)}
                            value={timeRange}
                        >
                            <option value="day">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {employeeStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div key={index} className="group relative overflow-hidden min-h-[250px]">
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-100 transition-opacity duration-500 rounded-2xl`}></div>

                            {/* Card Content */}
                            <div className="relative bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:transform group-hover:scale-105">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                        <IconComponent className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getTrendIcon(stat.trend)}
                                        <span className={`text-sm font-bold ${getTrendColor(stat.trend)}`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="min-h-[40px] text-sm font-bold text-black uppercase tracking-wider">{stat.title}</h3>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-gray-600 font-medium">{stat.description}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* Attendance Summary - Enhanced Pie Chart */}
                <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Attendance Summary</h3>
                            <p className="text-sm text-gray-600 font-medium mt-1">Current status overview</p>
                        </div>
                        <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 text-sm font-bold rounded-full border border-purple-200/50">
                            Today
                        </div>
                    </div>

                    <div className="h-56 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={attendanceSummaryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {attendanceSummaryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white/95 backdrop-blur-xl p-4 border border-gray-200/50 rounded-xl shadow-2xl">
                                                    {payload.map((entry, index) => (
                                                        <div key={index} className="text-sm font-medium text-gray-800">
                                                            <span className="block font-semibold text-gray-900">{entry.name}</span>
                                                            <span className="block">{`Value: ${entry.value}`}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-3">
                        {attendanceSummaryData.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.gradient} shadow-sm`}></div>
                                    <span className="font-semibold text-gray-700">{item.name}</span>
                                </div>
                                <span className="text-lg font-bold text-gray-900">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Daily Attendance - Enhanced Bar Chart */}
                <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Daily Attendance</h3>
                            <p className="text-sm text-gray-600 font-medium mt-1">Weekly breakdown</p>
                        </div>
                        <div className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 text-sm font-bold rounded-full border border-blue-200/50">
                            This Week
                        </div>
                    </div>

                    <div className="h-56 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dayWiseData} barGap={6}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="day" stroke="#64748b" fontSize={12} fontWeight="600" />
                                <YAxis stroke="#64748b" fontSize={12} fontWeight="600" />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="present" fill="url(#presentGradient)" radius={[3, 3, 0, 0]} />
                                <Bar dataKey="late" fill="url(#lateGradient)" radius={[3, 3, 0, 0]} />
                                <Bar dataKey="authorized" fill="url(#authorizedGradient)" radius={[3, 3, 0, 0]} />
                                <Bar dataKey="unauthorized" fill="url(#unauthorizedGradient)" radius={[3, 3, 0, 0]} />
                                <defs>
                                    <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#059669" />
                                    </linearGradient>
                                    <linearGradient id="lateGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#7c3aed" />
                                    </linearGradient>
                                    <linearGradient id="authorizedGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f59e0b" />
                                        <stop offset="100%" stopColor="#d97706" />
                                    </linearGradient>
                                    <linearGradient id="unauthorizedGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ef4444" />
                                        <stop offset="100%" stopColor="#dc2626" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Present', color: 'from-emerald-500 to-emerald-600' },
                            { label: 'Late', color: 'from-purple-500 to-purple-600' },
                            { label: 'Auth. Leave', color: 'from-amber-500 to-amber-600' },
                            { label: 'Unauth. Leave', color: 'from-red-500 to-red-600' }
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm font-semibold">
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color} shadow-sm`}></div>
                                <span className="text-gray-700">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activities - Compact Card with Scrollable Content */}
                <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 h-[632px] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Recent Activities</h3>
                            <p className="text-sm text-gray-600 font-medium mt-1">Latest employee updates</p>
                        </div>
                        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                    </div>

                    {/* Scrollable Activity Feed */}
                    <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3">
                        {recentActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className="group flex items-start gap-4 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                            >
                                {/* Avatar */}
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    {activity.avatar}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-bold text-gray-900 truncate">{activity.employee}</h4>
                                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(activity.status)}`}>
                                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-700 font-medium truncate">{activity.action}</p>

                                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                                        <span className="bg-gray-100 px-2 py-1 rounded-full border border-gray-200 font-semibold">
                                            {activity.department}
                                        </span>
                                        <span>{activity.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Bottom Section */}
            <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Department Overview - Enhanced */}
                <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Department Overview</h3>
                            <p className="text-sm text-gray-600 font-medium mt-1">Attendance by department</p>
                        </div>
                        <Building className="w-6 h-6 text-gray-400" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            { department: 'Engineering', present: 45, total: 50, gradient: 'from-blue-500 to-blue-600' },
                            { department: 'Marketing', present: 22, total: 25, gradient: 'from-green-500 to-green-600' },
                            { department: 'HR', present: 12, total: 15, gradient: 'from-purple-500 to-purple-600' },
                            { department: 'Finance', present: 18, total: 20, gradient: 'from-yellow-500 to-yellow-600' },
                            { department: 'Operations', present: 23, total: 25, gradient: 'from-red-500 to-red-600' },
                            { department: 'Design', present: 14, total: 16, gradient: 'from-indigo-500 to-indigo-600' }
                        ].map((dept, index) => (
                            <div key={index} className="p-5 border border-gray-100/50 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-50/50 to-white/50 backdrop-blur-sm group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${dept.gradient} shadow-sm group-hover:shadow-md transition-shadow`}></div>
                                        <h4 className="font-bold text-gray-900">{dept.department}</h4>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">
                                        {Math.round((dept.present / dept.total) * 100)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm text-gray-600 font-semibold">{dept.present}/{dept.total} present</span>
                                    <Star className="w-4 h-4 text-yellow-500" />
                                </div>
                                <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-2 bg-gradient-to-r ${dept.gradient} rounded-full transition-all duration-1000 shadow-sm`}
                                        style={{ width: `${(dept.present / dept.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Attendance Trend - Enhanced */}
                <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Attendance Trend</h3>
                            <p className="text-sm text-gray-600 font-medium mt-1">6-week performance analysis</p>
                        </div>
                        <TrendingUp className="w-6 h-6 text-emerald-500" />
                    </div>

                    <div className="h-56 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="week" stroke="#64748b" fontSize={12} fontWeight="600" />
                                <YAxis stroke="#64748b" fontSize={12} fontWeight="600" domain={[85, 100]} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="attendance"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fill="url(#attendanceGradient)"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="target"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-br from-blue-50/80 to-blue-100/50 rounded-xl border border-blue-200/30">
                            <div className="flex items-center gap-3 mb-2">
                                <Target className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-bold text-blue-900">Current Trend</span>
                            </div>
                            <p className="text-xs text-blue-700 font-semibold">Positive Growth</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-emerald-50/80 to-emerald-100/50 rounded-xl border border-emerald-200/30">
                            <div className="flex items-center gap-3 mb-2">
                                <Award className="w-5 h-5 text-emerald-600" />
                                <span className="text-sm font-bold text-emerald-900">Average Rate</span>
                            </div>
                            <p className="text-xs text-emerald-700 font-semibold">93.2%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;