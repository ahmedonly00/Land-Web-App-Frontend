import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, MapPin, DollarSign, TrendingUp, Plus, LogOut, Home, MessageSquare } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import InquiriesList from '../../components/admin/InquiriesList';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Check if user is authenticated before making request
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('❌ No auth token found - user not authenticated');
        toast.error('Please login to access dashboard');
        return;
      }
      
      console.log('🔍 Loading dashboard stats...');
      const response = await dashboardService.getStats();
      setStats(response.data);
      console.log('✅ Dashboard stats loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load stats', error);
      
      // Handle authentication errors specifically
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired. Please login again.');
        // Optionally redirect to login
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        toast.error('Failed to load dashboard statistics');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
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
              <h1 className="text-2xl font-bold text-gray-900">Iwacu 250 Admin</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.username}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-600 hover:text-primary-600 transition">
                View Website
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
        {/* Stats Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Plots */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <LayoutDashboard className="text-primary-600" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{stats.totalPlots}</span>
                </div>
                <h3 className="text-gray-600 font-medium">Total Plots</h3>
              </div>

              {/* Available Plots */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="text-green-600" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-green-600">{stats.availablePlots}</span>
                </div>
                <h3 className="text-gray-600 font-medium">Available Plots</h3>
              </div>

              {/* Sold Plots */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-red-600" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-red-600">{stats.soldPlots}</span>
                </div>
                <h3 className="text-gray-600 font-medium">Sold Plots</h3>
              </div>

              {/* Total Inquiries */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-blue-600" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-blue-600">{stats.totalInquiries}</span>
                </div>
                <h3 className="text-gray-600 font-medium">Total Inquiries</h3>
                {stats.newInquiries > 0 && (
                  <p className="text-sm text-blue-600 mt-2">
                    {stats.newInquiries} new
                  </p>
                )}
              </div>
            </div>

            {/* House Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Houses */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Home className="text-purple-600" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{stats.totalHouses || 0}</span>
                </div>
                <h3 className="text-gray-600 font-medium">Total Houses</h3>
              </div>

              {/* Available Houses */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Home className="text-green-600" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-green-600">{stats.availableHouses || 0}</span>
                </div>
                <h3 className="text-gray-600 font-medium">Available Houses</h3>
              </div>

              {/* Sold Houses */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Home className="text-red-600" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-red-600">{stats.soldHouses || 0}</span>
                </div>
                <h3 className="text-gray-600 font-medium">Sold Houses</h3>
              </div>

              {/* Rented Houses */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Home className="text-orange-600" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-orange-600">{stats.rentedHouses || 0}</span>
                </div>
                <h3 className="text-gray-600 font-medium">Rented Houses</h3>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/admin/plots/new"
                  className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition"
                >
                  <Plus className="text-primary-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Add New Plot</h3>
                    <p className="text-sm text-gray-600">Create a new plot listing</p>
                  </div>
                </Link>

                <Link
                  to="/admin/plots"
                  className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition"
                >
                  <MapPin className="text-primary-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Manage Plots</h3>
                    <p className="text-sm text-gray-600">View and edit all plots</p>
                  </div>
                </Link>

                <Link
                  to="/admin/houses/new"
                  className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition"
                >
                  <Home className="text-primary-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Add New House</h3>
                    <p className="text-sm text-gray-600">Create a new house listing</p>
                  </div>
                </Link>

                <Link
                  to="/admin/houses"
                  className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition"
                >
                  <Home className="text-primary-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Manage Houses</h3>
                    <p className="text-sm text-gray-600">View and edit all houses</p>
                  </div>
                </Link>

                <Link
                  to="/admin/settings"
                  className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition"
                >
                  <LayoutDashboard className="text-primary-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Settings</h3>
                    <p className="text-sm text-gray-600">Update company info</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Plot Status Distribution</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats.availablePlots} Available • {stats.soldPlots} Sold • {stats.reservedPlots} Reserved
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">House Status Distribution</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats.availableHouses || 0} Available • {stats.soldHouses || 0} Sold • {stats.pendingHouses || 0} Pending • {stats.rentedHouses || 0} Rented
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Customer Inquiries</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats.totalInquiries} total inquiries received
                      {stats.newInquiries > 0 && ` (${stats.newInquiries} new)`}
                    </p>
                  </div>
                  <Link 
                    to="/admin/inquiries" 
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                    View All
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Failed to load dashboard data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
