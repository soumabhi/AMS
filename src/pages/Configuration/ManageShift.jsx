import React, { useState, useEffect } from 'react';
import { Plus, Edit, Clock, Calendar, AlertCircle, CheckCircle, X, Users, Timer } from 'lucide-react';
import Toast from '../../components/Toast';

// Toast notification component
// const Toast = ({ message, type, isVisible, onClose }) => {
//     useEffect(() => {
//         if (isVisible) {
//             const timer = setTimeout(() => {
//                 onClose();
//             }, 4000);
//             return () => clearTimeout(timer);
//         }
//     }, [isVisible, onClose]);

//     if (!isVisible) return null;

//     const bgColor = type === 'success'
//         ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
//         : 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-400';
//     const textColor = type === 'success' ? 'text-gray-800' : 'text-gray-900';
//     const IconComponent = type === 'success' ? CheckCircle : AlertCircle;

//     return (
//         <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
//             <div className={`max-w-sm w-full ${bgColor} border rounded-xl shadow-lg backdrop-blur-sm p-4`}>
//                 <div className="flex items-center">
//                     <div className="flex-shrink-0">
//                         <IconComponent className="h-5 w-5 text-gray-700" />
//                     </div>
//                     <div className="ml-3">
//                         <p className={`text-sm font-medium ${textColor}`}>
//                             {message}
//                         </p>
//                     </div>
//                     <div className="ml-auto pl-3">
//                         <button
//                             onClick={onClose}
//                             className="inline-flex rounded-lg p-1.5 text-gray-400 hover:bg-white/50 focus:outline-none transition-colors"
//                         >
//                             <X className="h-4 w-4" />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// Skeleton Loader Component with enhanced styling
const TableSkeleton = () => {
    return (
        <tbody className="bg-white divide-y divide-gray-100">
            {[...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-8 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-16"></div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

// Enhanced Input Component
const Input = ({ label, value, onChange, placeholder, error, type = "text", className = "", disabled = false }) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-semibold text-gray-700">
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 ${error ? 'border-gray-400 bg-gray-50/50' : 'hover:border-gray-300'} ${className}`}
            />
            {error && (
                <p className="text-sm text-gray-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}
        </div>
    );
};

// Enhanced Time Input Component
const TimeInput = ({ label, value, onChange, error, disabled = false }) => {
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');

    useEffect(() => {
        if (value) {
            const [h, m] = value.split(':');
            setHours(h || '');
            setMinutes(m || '');
        } else {
            setHours('');
            setMinutes('');
        }
    }, [value]);

    const handleHourChange = (e) => {
        const hour = Math.max(0, Math.min(23, parseInt(e.target.value) || 0));
        const formattedHour = hour.toString().padStart(2, '0');
        setHours(formattedHour);
        onChange(`${formattedHour}:${minutes || '00'}`);
    };

    const handleMinuteChange = (e) => {
        const minute = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
        const formattedMinute = minute.toString().padStart(2, '0');
        setMinutes(formattedMinute);
        onChange(`${hours || '00'}:${formattedMinute}`);
    };

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-semibold text-gray-700">
                    {label}
                </label>
            )}
            <div className="flex space-x-3">
                <div className="flex-1">
                    <input
                        type="number"
                        min="0"
                        max="23"
                        value={hours}
                        onChange={handleHourChange}
                        placeholder="HH"
                        disabled={disabled}
                        className={`w-full bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-center font-mono text-lg transition-all duration-200 ${error ? 'border-gray-400 bg-gray-50/50' : 'hover:border-gray-300'}`}
                    />
                    <p className="text-xs text-gray-500 text-center mt-1 font-medium">Hours</p>
                </div>
                <div className="flex items-top pt-1">
                    <span className="text-2xl font-bold text-gray-400">:</span>
                </div>
                <div className="flex-1">
                    <input
                        type="number"
                        min="0"
                        max="59"
                        step="15"
                        value={minutes}
                        onChange={handleMinuteChange}
                        placeholder="MM"
                        disabled={disabled}
                        className={`w-full bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-center font-mono text-lg transition-all duration-200 ${error ? 'border-gray-400 bg-gray-50/50' : 'hover:border-gray-300'}`}
                    />
                    <p className="text-xs text-gray-500 text-center mt-1 font-medium">Minutes</p>
                </div>
            </div>
            {error && (
                <p className="text-sm text-gray-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}
        </div>
    );
};

// Enhanced API Service
const apiService = {
    baseURL: 'http://localhost:5000/api/shift',

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        console.group(`🔄 API Request: ${options.method || 'GET'} ${endpoint}`);
        console.log('📤 Request URL:', url);
        console.log('📤 Request Config:', config);

        if (config.body) {
            console.log('📤 Request Body:', JSON.parse(config.body));
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            console.log(`📥 Response Status: ${response.status} ${response.statusText}`);
            console.log('📥 Response Data:', data);

            if (!response.ok) {
                console.error('❌ API Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    message: data.message,
                    data: data
                });
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            console.log('✅ Request successful');
            console.groupEnd();
            return data;
        } catch (error) {
            console.error('❌ Request failed:', {
                message: error.message,
                stack: error.stack,
                url: url,
                method: options.method || 'GET'
            });
            console.groupEnd();
            throw error;
        }
    },

    async getAllShifts() {
        return this.request('/all');
    },

    async createShift(shiftData) {
        console.log('🆕 Creating new shift:', shiftData);
        return this.request('/create', {
            method: 'POST',
            body: JSON.stringify(shiftData),
        });
    },

    async updateShift(id, shiftData) {
        console.log('✏️ Updating shift:', { id, shiftData });
        return this.request(`/${id}`, {
            method: 'PUT',
            body: JSON.stringify(shiftData),
        });
    },

    async deleteShift(id) {
        console.log('🗑️ Deleting shift:', id);
        return this.request(`/${id}`, {
            method: 'DELETE',
        });
    }
};

const ShiftManagement = () => {
    const [shifts, setShifts] = useState([]);
    const [editingShift, setEditingShift] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
    const [formData, setFormData] = useState({
        shiftName: "",
        shiftStart: "",
        shiftEnd: "",
        duration: { hours: 0, minutes: 0, formatted: '' }
    });
    const [validationErrors, setValidationErrors] = useState({});

    // Fetch shifts on component mount
    useEffect(() => {
        fetchShifts();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    const hideToast = () => {
        setToast({ ...toast, isVisible: false });
    };

    const fetchShifts = async () => {
        setLoading(true);
        console.log('🔍 Fetching shifts...');

        try {
            const response = await apiService.getAllShifts();
            const shiftsData = response.data || [];
            console.log('✅ Shifts fetched successfully:', shiftsData);
            setShifts(shiftsData);
        } catch (error) {
            console.error('❌ Error fetching shifts:', {
                message: error.message,
                stack: error.stack
            });
            showToast('Failed to fetch shifts. Please check your connection and try again.', 'error');
            setShifts([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateDuration = (startTime, endTime) => {
        if (!startTime || !endTime) return { hours: 0, minutes: 0, formatted: '' };

        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        let startMinutes = startHour * 60 + startMinute;
        let endMinutes = endHour * 60 + endMinute;

        if (endMinutes < startMinutes) {
            endMinutes += 24 * 60;
        }

        const durationMinutes = endMinutes - startMinutes;
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;

        return {
            hours,
            minutes,
            formatted: `${hours}h ${minutes}m`
        };
    };

    const resetForm = () => {
        setFormData({
            shiftName: "",
            shiftStart: "",
            shiftEnd: "",
            duration: { hours: 0, minutes: 0, formatted: '' }
        });
        setValidationErrors({});
        setEditingShift(null);
    };

    const handleTimeChange = (time, field) => {
        console.log(`⏰ Time changed - ${field}:`, time);
        const newFormData = {
            ...formData,
            [field]: time
        };

        setFormData(newFormData);
        setValidationErrors({
            ...validationErrors,
            [field]: ''
        });

        if (newFormData.shiftStart && newFormData.shiftEnd) {
            const duration = calculateDuration(newFormData.shiftStart, newFormData.shiftEnd);
            console.log('📊 Duration calculated:', duration);
            setFormData(prev => ({
                ...prev,
                duration
            }));
        }
    };

    const handleShiftNameChange = (e) => {
        const shiftName = e.target.value;
        console.log('📝 Shift name changed:', shiftName);
        setFormData({
            ...formData,
            shiftName: shiftName
        });
        setValidationErrors({
            ...validationErrors,
            shiftName: ''
        });
    };

    const validateForm = () => {
        console.log('🔍 Validating form...', formData);
        const errors = {};

        if (!formData.shiftName.trim()) {
            errors.shiftName = 'Shift name is required';
        }

        if (!formData.shiftStart) {
            errors.shiftStart = 'Start time is required';
        }

        if (!formData.shiftEnd) {
            errors.shiftEnd = 'End time is required';
        }

        if (formData.shiftName.toLowerCase() !== "night" && formData.shiftStart && formData.shiftEnd) {
            const [startHour, startMinute] = formData.shiftStart.split(':').map(Number);
            const [endHour, endMinute] = formData.shiftEnd.split(':').map(Number);

            const startMinutes = startHour * 60 + startMinute;
            const endMinutes = endHour * 60 + endMinute;

            if (endMinutes <= startMinutes) {
                errors.shiftEnd = 'End time must be after start time for this shift type';
            }
        }

        console.log('🔍 Validation errors:', errors);
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        console.log('💾 Attempting to submit form...');

        if (!validateForm()) {
            console.log('❌ Form validation failed');
            showToast('Please fix all validation errors', 'error');
            return;
        }

        setSubmitLoading(true);

        try {
            const finalFormData = {
                shiftName: formData.shiftName.trim(),
                shiftStart: formData.shiftStart + ':00',
                shiftEnd: formData.shiftEnd + ':00'
            };

            console.log('📤 Final form data:', finalFormData);

            if (editingShift) {
                console.log('✏️ Updating existing shift:', editingShift._id);
                await apiService.updateShift(editingShift._id, finalFormData);
                showToast('Shift updated successfully');
            } else {
                console.log('🆕 Creating new shift');
                await apiService.createShift(finalFormData);
                showToast('Shift created successfully');
            }

            resetForm();
            await fetchShifts();
        } catch (error) {
            console.error('❌ Error saving shift:', {
                message: error.message,
                stack: error.stack,
                formData: finalFormData
            });
            showToast(error.message || 'Failed to save shift. Please try again.', 'error');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEdit = (shift) => {
        console.log('✏️ Editing shift:', shift);
        setEditingShift(shift);
        setFormData({
            shiftName: shift.shiftName,
            shiftStart: shift.shiftStart ? shift.shiftStart.substring(0, 5) : '',
            shiftEnd: shift.shiftEnd ? shift.shiftEnd.substring(0, 5) : '',
            duration: calculateDuration(
                shift.shiftStart ? shift.shiftStart.substring(0, 5) : '',
                shift.shiftEnd ? shift.shiftEnd.substring(0, 5) : ''
            )
        });
        setValidationErrors({});
    };

    const handleCancel = () => {
        resetForm();
    };

    const getShiftColor = (shiftName) => {
        const name = shiftName.toLowerCase();
        if (name.includes('morning') || name.includes('day')) return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
        if (name.includes('evening') || name.includes('afternoon')) return 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 border-gray-400';
        if (name.includes('night')) return 'bg-gradient-to-r from-gray-800 to-black text-white border-gray-600';
        return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />

            <div className="flex h-screen">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                    {/* Enhanced Header */}
                    <div className="p-8 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl h-10 font-bold bg-black bg-clip-text text-transparent">
                                    Shift Management
                                </h1>
                                <p className="text-gray-600 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Manage your shift schedules and timings
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Shifts</p>
                                    <p className="text-2xl font-bold text-gray-800">{shifts.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-8 overflow-auto">
                        {/* Enhanced Table */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            #
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Shift Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Start Time
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            End Time
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Duration
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                {loading ? (
                                    <TableSkeleton />
                                ) : (
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {shifts.map((shift, index) => {
                                            const duration = calculateDuration(
                                                shift.shiftStart ? shift.shiftStart.substring(0, 5) : '',
                                                shift.shiftEnd ? shift.shiftEnd.substring(0, 5) : ''
                                            );

                                            return (
                                                <tr key={shift._id || index} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                            {index + 1}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${getShiftColor(shift.shiftName)}`}>
                                                            {shift.shiftName}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm font-mono text-gray-900">
                                                                {shift.shiftStart ? shift.shiftStart.substring(0, 5) : '-'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm font-mono text-gray-900">
                                                                {shift.shiftEnd ? shift.shiftEnd.substring(0, 5) : '-'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <Timer className="w-4 h-4 text-gray-600" />
                                                            <span className="text-sm font-semibold text-gray-700">
                                                                {duration.formatted || '-'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleEdit(shift)}
                                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                                                        >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                        {!loading && shifts.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-16 text-center">
                                                    <div className="text-center">
                                                        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                                            <Calendar className="w-12 h-12 text-gray-500" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No shifts available</h3>
                                                        <p className="text-gray-500">Get started by creating your first shift using the form on the right.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </div>
                </div>

                {/* Enhanced Right Sidebar Form */}
                <div className="w-96 bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 flex flex-col backdrop-blur-sm">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold bg-black bg-clip-text text-transparent">
                                    {editingShift ? 'Edit Shift' : 'Add New Shift'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {editingShift ? 'Update shift details' : 'Create a new shift schedule'}
                                </p>
                            </div>
                            {editingShift && (
                                <button
                                    onClick={handleCancel}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 p-6 overflow-auto">
                        <div className="space-y-6">
                            <Input
                                label="Shift Name *"
                                value={formData.shiftName}
                                onChange={handleShiftNameChange}
                                placeholder="Enter shift name (e.g., Morning, Evening, Night)"
                                error={validationErrors.shiftName}
                                className='bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200'
                            />

                            <TimeInput
                                label="Shift Start Time (24 hr Format) *"
                                value={formData.shiftStart}
                                onChange={(time) => handleTimeChange(time, 'shiftStart')}
                                error={validationErrors.shiftStart}
                            />

                            <TimeInput
                                label="Shift End Time (24 hr Format) *"
                                value={formData.shiftEnd}
                                onChange={(time) => handleTimeChange(time, 'shiftEnd')}
                                error={validationErrors.shiftEnd}
                            />

                            {formData.duration.formatted && (
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center mr-3">
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">Calculated Duration</p>
                                            <p className="text-xl font-bold text-gray-900">{formData.duration.formatted}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                                <span>Time format: 24-hour (HH:MM)</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                                                <span>Duration is calculated automatically</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex gap-3">
                            {editingShift && (
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                onClick={handleSubmit}
                                disabled={submitLoading}
                                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-xl hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <div className="flex items-center justify-center">
                                    {submitLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            {editingShift ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            {editingShift ? 'Update Shift' : 'Create Shift'}
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShiftManagement;