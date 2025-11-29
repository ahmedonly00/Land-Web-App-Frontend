import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { toast } from 'react-toastify';
import { format, parseISO, isValid, startOfDay, endOfDay } from 'date-fns';
import { Search, Filter, X, Download, RefreshCw, Mail, Phone, Clock, Check, Trash2, Archive, Reply } from 'lucide-react';
import Pagination from '../common/Pagination';
import InquiryFilters from './InquiryFilters';

// Helper function to safely format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return isValid(date) ? format(date, 'MMM d, yyyy h:mm a') : 'Invalid date';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

const InquiriesList = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [stats, setStats] = useState({});
  const [isExporting, setIsExporting] = useState(false);

  const loadInquiryStats = useCallback(async () => {
    try {
      const statsData = await dashboardService.getInquiryStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load inquiry stats:', error);
    }
  }, []);

  const loadInquiries = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      
      // Prepare query params
      const queryParams = {
        page,
        limit: pagination.limit,
        search: searchQuery,
        ...filters
      };

      // Convert date strings to ISO format if they exist
      if (filters.dateFrom) {
        queryParams.dateFrom = startOfDay(new Date(filters.dateFrom)).toISOString();
      }
      if (filters.dateTo) {
        queryParams.dateTo = endOfDay(new Date(filters.dateTo)).toISOString();
      }

      const response = await dashboardService.getInquiries(queryParams);
      
      // Handle different response formats
      let data = [];
      let total = 0;
      
      if (Array.isArray(response)) {
        data = response;
        total = response.length;
      } else if (response && typeof response === 'object') {
        data = response.data || response.inquiries || [];
        total = response.total || response.totalCount || data.length;
      }

      setInquiries(data);
      setPagination(prev => ({
        ...prev,
        page,
        total,
        totalPages: Math.ceil(total / pagination.limit) || 1
      }));
      
    } catch (error) {
      console.error('Error loading inquiries:', error);
      toast.error('Failed to load inquiries. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, pagination.limit]);

  // Initial load and when dependencies change
  useEffect(() => {
    loadInquiryStats();
    loadInquiries(1);
  }, [loadInquiryStats, loadInquiries]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle page change
  const handlePageChange = (page) => {
    loadInquiries(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle refresh
  const handleRefresh = () => {
    loadInquiryStats();
    loadInquiries(pagination.page);
  };

  // Handle export
  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await dashboardService.exportInquiries({
        ...filters,
        search: searchQuery
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inquiries-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Export completed successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export inquiries');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle status update
  const updateInquiryStatus = async (id, status) => {
    try {
      await dashboardService.updateInquiryStatus(id, status);
      toast.success(`Inquiry marked as ${status}`);
      loadInquiries(pagination.page);
      loadInquiryStats();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update inquiry status');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
      try {
        await dashboardService.deleteInquiry(id);
        toast.success('Inquiry deleted successfully');
        loadInquiries(pagination.page);
        loadInquiryStats();
      } catch (error) {
        console.error('Failed to delete inquiry:', error);
        toast.error('Failed to delete inquiry');
      }
    }
  };

  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    
    // Mark as read if it's a new inquiry
    if (inquiry.status === 'new' || !inquiry.status) {
      updateInquiryStatus(inquiry.id, 'read');
    }
    
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInquiry(null);
  };

  const markAsRead = async (id) => {
    try {
      // Add your API call to mark inquiry as read
      // await contactService.markAsRead(id);
      await loadInquiries();
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const statusMap = {
      new: { bg: 'bg-blue-100 text-blue-800', text: 'New' },
      read: { bg: 'bg-yellow-100 text-yellow-800', text: 'Read' },
      replied: { bg: 'bg-green-100 text-green-800', text: 'Replied' },
      archived: { bg: 'bg-gray-100 text-gray-800', text: 'Archived' },
    };
    
    const statusInfo = statusMap[status] || { bg: 'bg-gray-100 text-gray-800', text: 'Unknown' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg}`}>
        {statusInfo.text}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Customer Inquiries</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading || isExporting}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="px-6 py-4 border-b border-gray-200">
        <InquiryFilters
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onRefresh={handleRefresh}
          onExport={handleExport}
          statusFilter={filters.status}
          searchQuery={searchQuery}
          isLoading={loading || isExporting}
          stats={stats}
        />
      </div>
      
      {/* Inquiries Table */}
      <div className="overflow-x-auto">
        {loading && inquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600">Loading inquiries...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No inquiries found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || Object.values(filters).some(Boolean) 
                ? 'Try adjusting your search or filter criteria' 
                : 'No customer inquiries have been submitted yet.'}
            </p>
            {(searchQuery || Object.values(filters).some(Boolean)) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    status: '',
                    dateFrom: '',
                    dateTo: '',
                    sortBy: 'createdAt',
                    sortOrder: 'desc'
                  });
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <X className="h-4 w-4 mr-2" />
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <span>Customer</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <span>Property</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Date</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inquiries.map((inquiry) => (
                  <tr 
                    key={inquiry.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${inquiry.status === 'new' ? 'bg-blue-50' : ''}`}
                    onClick={() => handleViewInquiry(inquiry)}
                  >
                    {/* Customer Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary-100 text-primary-700">
                          {inquiry.name ? inquiry.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {inquiry.name || 'No Name'}
                            {inquiry.status === 'new' && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                New
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                            <a href={`mailto:${inquiry.email}`} className="hover:text-primary-600" onClick={e => e.stopPropagation()}>
                              {inquiry.email}
                            </a>
                          </div>
                          {inquiry.phone && (
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                              <a href={`tel:${inquiry.phone}`} className="hover:text-primary-600" onClick={e => e.stopPropagation()}>
                                {inquiry.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Property Info */}
                    <td className="px-6 py-4">
                      {inquiry.property ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {inquiry.property.title || 'Property'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {inquiry.property.reference || ''}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No property linked</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(inquiry.createdAt, 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(inquiry.createdAt, 'h:mm a')}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(inquiry.status || 'new')}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {inquiry.status !== 'replied' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateInquiryStatus(inquiry.id, 'replied');
                            }}
                            className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                            title="Mark as Replied"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {inquiry.status !== 'archived' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateInquiryStatus(inquiry.id, 'archived');
                            }}
                            className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
                            title="Archive"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateInquiryStatus(inquiry.id, 'new');
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                            title="Restore"
                          >
                            <Reply className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(inquiry.id);
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>  
                  </tr>
                ))}
                {inquiries.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No inquiries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
          </div>
        )}

      {/* Inquiry Detail Modal */}
      {isModalOpen && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Inquiry Details</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedInquiry.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedInquiry.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(selectedInquiry.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Subject</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedInquiry.subject || 'No subject'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Message</p>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-900 whitespace-pre-line">{selectedInquiry.message}</p>
                  </div>
                </div>
                
                {selectedInquiry.propertyId && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-500">Related Property</p>
                    <p className="mt-1 text-sm text-gray-900">
                      Property ID: {selectedInquiry.propertyId}
                      {/* You can add a link to the property here */}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                {!selectedInquiry.isRead && (
                  <button
                    type="button"
                    onClick={() => {
                      markAsRead(selectedInquiry.id);
                      handleCloseModal();
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InquiriesList;
