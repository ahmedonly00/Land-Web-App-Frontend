import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, MapPin, DollarSign, TrendingUp, Plus, LogOut, Home, MessageSquare, Inbox, Mail, Clock } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

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
      // Clear all authentication data from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      // Clear any API authorization header
      if (api && api.defaults && api.defaults.headers) {
        delete api.defaults.headers.common['Authorization'];
      }
      
      // Update the auth context
      if (logout) {
        await logout();
      }
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse h-32"></div>
            ))}
          </div>
        ) : stats ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Inquiries */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <Inbox className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Inquiries</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalInquiries || 0}</p>
                  </div>
                </div>
              </div>

              {/* New Inquiries */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">New Inquiries</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.newInquiries || 0}</p>
                  </div>
                </div>
              </div>

              {/* Total Properties */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <Home className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Properties</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {(stats.totalPlots || 0) + (stats.totalHouses || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      ${(stats.totalRevenue || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Plots Revenue */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Plots Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      ${(stats.plotsRevenue || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Houses Revenue */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <Home className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Houses Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      ${(stats.housesRevenue || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Available Plots */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="text-blue-600" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-blue-600">{stats.availablePlots || 0}</span>
                </div>
                <h3 className="text-gray-600 font-medium">Available Plots</h3>
              </div>

              {/* Sold Plots */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="text-purple-600" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-purple-600">{stats.soldPlots || 0}</span>
                </div>
                <h3 className="text-gray-600 font-medium">Sold Plots</h3>
              </div>

              {/* Reserved Plots */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <MapPin className="text-yellow-600" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-yellow-600">{stats.reservedPlots || 0}</span>
                </div>
                <h3 className="text-gray-600 font-medium">Reserved Plots</h3>
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

              {/* Recent Inquiries */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Inquiries</h3>
                <div className="space-y-4">
                  {stats.recentInquiries && stats.recentInquiries.length > 0 ? (
                    stats.recentInquiries.slice(0, 5).map((inquiry) => (
                      <div key={inquiry.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {inquiry.name || 'No Name'}
                              <span className="ml-2 text-xs font-normal text-gray-500">
                                {inquiry.email}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {inquiry.message || 'No message'}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {new Date(inquiry.createdAt).toLocaleDateString()}
                            </span>
                            <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {inquiry.status || 'new'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Inbox className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">No recent inquiries</p>
                    </div>
                  )}
                </div>
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

            {/* Overview Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Plot Status Distribution</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats.availablePlots || 0} Available • {stats.soldPlots || 0} Sold • {stats.reservedPlots || 0} Reserved
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
              </div>
            </div>
          </div>
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
