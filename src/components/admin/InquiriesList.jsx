import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { toast } from 'react-toastify';
import { format, parseISO, isValid } from 'date-fns';

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
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      console.log('Fetching inquiries...');
      const response = await dashboardService.getInquiries();
      console.log('Inquiries API response:', response);
      
      // Handle the response from dashboardService with more robust checks
      let inquiriesData = [];
      
      if (Array.isArray(response)) {
        // If response is already an array
        inquiriesData = response;
      } else if (response && typeof response === 'object') {
        // Check common response formats
        if (Array.isArray(response.data)) {
          inquiriesData = response.data;
        } else if (Array.isArray(response.inquiries)) {
          inquiriesData = response.inquiries;
        } else if (response.data && Array.isArray(response.data.inquiries)) {
          inquiriesData = response.data.inquiries;
        } else if (response.data && typeof response.data === 'object') {
          // If data is an object, convert it to an array
          inquiriesData = Object.values(response.data);
        }
      }
      
      console.log('Processed inquiries data:', inquiriesData);
      
      // Ensure we always set an array
      setInquiries(Array.isArray(inquiriesData) ? inquiriesData : []);
    } catch (error) {
      console.error('Failed to load inquiries', error);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Inquiries</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className={!inquiry.isRead ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {inquiry.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inquiry.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inquiry.phone || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(inquiry.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {inquiry.status === 'new' ? 'New' : 'Read'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewInquiry(inquiry)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      View
                    </button>
                    {!inquiry.isRead && (
                      <button
                        onClick={() => markAsRead(inquiry.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Mark as Read
                      </button>
                    )}
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
};

export default InquiriesList;
