import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import InquiriesList from '../../components/admin/InquiriesList';

const AdminInquiries = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Inquiries</h1>
              <p className="text-sm text-gray-600">Manage all customer inquiries</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-gray-600 hover:text-primary-600 transition">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">All Inquiries</h2>
            <div className="flex items-center">
              <MessageSquare className="text-blue-600 mr-2" size={20} />
              <span className="text-sm text-gray-600">
                View and manage all customer inquiries
              </span>
            </div>
          </div>
          
          <InquiriesList />
        </div>
      </div>
    </div>
  );
};

export default AdminInquiries;
