import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar as CalendarIcon, Search, X } from 'lucide-react';
import dayjs from 'dayjs';
import axios from 'axios';
import Toast from '../components/Toast';

const HolidayCalendar = () => {
  const [holidays, setHolidays] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentHoliday, setCurrentHoliday] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });

  const holidayTypes = ['All', 'National', 'Festival', 'Religious', 'Observance'];
  const API_BASE_URL = 'http://localhost:5000/api/date';

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
    setTimeout(hideToast, 5000);
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/all`);
      console.log('API Response Data:', response.data);
      
      const holidaysData = response.data.dates || response.data;
      
      if (!Array.isArray(holidaysData)) {
        throw new Error('Invalid data format received from API');
      }
      
      const validHolidays = holidaysData.filter(d => 
        d.name && d.date && d.type && (d._id || d.id)
      ).map(holiday => ({
        ...holiday,
        id: holiday._id || holiday.id // Normalize to use id consistently
      }));
      
      setHolidays(validHolidays);
    } catch (error) {
      console.error('Failed to fetch holidays:', error);
      showToast(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch holidays. Please try again later.',
        'error'
      );
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (holiday = null) => {
    setCurrentHoliday(holiday || { 
      name: '', 
      date: dayjs().format('YYYY-MM-DD'), 
      type: 'National',
      day: dayjs().format('dddd')
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentHoliday(null);
  };

  const handleSubmit = async () => {
    if (!currentHoliday?.name?.trim()) {
      showToast('Holiday name is required', 'error');
      return;
    }

    if (!currentHoliday?.date) {
      showToast('Date is required', 'error');
      return;
    }

    if (!currentHoliday?.type) {
      showToast('Holiday type is required', 'error');
      return;
    }

    setSubmitLoading(true);
    
    try {
      const holidayData = {
        name: currentHoliday.name.trim(),
        date: currentHoliday.date,
        type: currentHoliday.type,
        day: currentHoliday.day || dayjs(currentHoliday.date).format('dddd')
      };

      let response;
      if (currentHoliday.id) {
        response = await axios.put(
          `${API_BASE_URL}/${currentHoliday.id}`,
          holidayData
        );
        showToast('Holiday updated successfully');
      } else {
        response = await axios.post(
          `${API_BASE_URL}/create`,
          holidayData
        );
        showToast('Holiday added successfully');
      }

      await fetchHolidays();
      setIsModalVisible(false);
      setCurrentHoliday(null);
      
    } catch (error) {
      console.error('Error saving holiday:', error);
      let errorMessage = 'Failed to save holiday. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      JSON.stringify(error.response.data);
      } else if (error.request) {
        errorMessage = 'No response from server. Check your connection.';
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const deleteHoliday = async (id) => {
    if (!window.confirm('Are you sure you want to delete this holiday?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      showToast('Holiday deleted successfully');
      await fetchHolidays();
    } catch (error) {
      console.error('Error deleting holiday:', error);
      showToast(
        error.response?.data?.message || 
        'Failed to delete holiday. Please try again.',
        'error'
      );
    }
  };

  const filteredHolidays = holidays.filter(holiday => {
    const matchesFilter = filter === 'All' || holiday.type === filter;
    const matchesSearch = holiday.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeColor = (type) => {
    switch(type) {
      case 'National': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'Festival': return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'Religious': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 'Observance': return 'bg-gradient-to-r from-orange-500 to-orange-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getTypeTextColor = (type) => {
    switch(type) {
      case 'National': return 'text-blue-100';
      case 'Festival': return 'text-green-100';
      case 'Religious': return 'text-purple-100';
      case 'Observance': return 'text-orange-100';
      default: return 'text-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl h-10 font-bold bg-black bg-clip-text text-transparent">
              Holiday Calendar
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Manage your organization's holidays and observances
            </p>
          </div>
          <button
            onClick={() => showModal()}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-xl hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Holiday
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search holidays..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 hover:border-gray-300 transition-all duration-200"
                />
              </div>
            </div>
            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 hover:border-gray-300 transition-all duration-200"
              >
                {holidayTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All Holiday Types' : `${type} Holidays`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Holiday Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-200 rounded-lg w-16 h-16"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredHolidays.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredHolidays.map(holiday => (
              <div key={holiday.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-3 min-w-[64px]">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        {dayjs(holiday.date).format('MMM')}
                      </span>
                      <span className="text-2xl font-bold text-gray-800">
                        {dayjs(holiday.date).format('D')}
                      </span>
                      <span className="text-xs font-medium text-gray-500">
                        {holiday.day?.substring(0, 3) || dayjs(holiday.date).format('ddd')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                        {holiday.name}
                      </h3>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(holiday.type)} ${getTypeTextColor(holiday.type)}`}>
                        {holiday.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
                  <button
                    onClick={() => showModal(holiday)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteHoliday(holiday.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <CalendarIcon className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No holidays found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'No holidays match your search criteria'
                : filter === 'All'
                  ? 'Get started by adding your first holiday'
                  : `No ${filter.toLowerCase()} holidays found`}
            </p>
            <button
              onClick={() => showModal()}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-lg hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Holiday
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Holiday Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black/50" onClick={handleCancel}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-2xl shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold bg-black bg-clip-text text-transparent">
                    {currentHoliday?.id ? 'Edit Holiday' : 'Add Holiday'}
                  </h3>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="px-6 py-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Holiday Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter holiday name"
                    value={currentHoliday?.name || ''}
                    onChange={(e) => setCurrentHoliday({...currentHoliday, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 hover:border-gray-300 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={currentHoliday?.date || ''}
                    onChange={(e) => {
                      const date = e.target.value;
                      setCurrentHoliday({
                        ...currentHoliday, 
                        date,
                        day: dayjs(date).format('dddd')
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 hover:border-gray-300 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={currentHoliday?.type || 'National'}
                    onChange={(e) => setCurrentHoliday({...currentHoliday, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 hover:border-gray-300 transition-all duration-200"
                  >
                    {holidayTypes.filter(t => t !== 'All').map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-lg hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {submitLoading ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      {currentHoliday?.id ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      {currentHoliday?.id ? 'Update Holiday' : 'Add Holiday'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayCalendar;