import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, MapPin, DollarSign, TrendingUp, Plus, LogOut } from 'lucide-react';
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
      const response = await dashboardService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats', error);
      toast.error('Failed to load dashboard statistics');
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
              <h1 className="text-2xl font-bold text-gray-900">iwacu 250 Admin</h1>
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
                <h3 className="text-gray-600 font-medium">Available</h3>
              </div>

              {/* Sold Plots */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-red-600" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-red-600">{stats.soldPlots}</span>
                </div>
                <h3 className="text-gray-600 font-medium">Sold</h3>
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
                    <h3 className="font-medium text-gray-900">Customer Inquiries</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats.totalInquiries} total inquiries received
                      {stats.newInquiries > 0 && ` (${stats.newInquiries} new)`}
                    </p>
                  </div>
                  {stats.newInquiries > 0 && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {stats.newInquiries} New
                    </span>
                  )}
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
