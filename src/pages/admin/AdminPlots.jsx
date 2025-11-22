import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, MapPin } from 'lucide-react';
import { plotService } from '../../services/plotService';
import { formatPrice, formatSize, getStatusBadgeColor } from '../../utils/formatters';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const AdminPlots = () => {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlots();
  }, []);

  const loadPlots = async () => {
    try {
      const response = await plotService.adminGetAllPlots();
      console.log('Plots API response:', response);
      // Handle both paginated and non-paginated responses
      let plotsData = response.content || response.data?.content || response.data || response;
      // Ensure we always have an array
      plotsData = Array.isArray(plotsData) ? plotsData : [];
      console.log('Plots data after processing:', plotsData);
      setPlots(plotsData);
    } catch (error) {
      console.error('Failed to load plots', error);
      toast.error('Failed to load plots');
      setPlots([]); // Ensure plots is always an array even on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plot?')) return;

    try {
      await plotService.deletePlot(id);
      toast.success('Plot deleted successfully');
      loadPlots();
    } catch (error) {
      console.error('Failed to delete plot', error);
      toast.error('Failed to delete plot');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md mb-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Manage Plots</h1>
            <div className="flex gap-4">
              <Link to="/admin" className="text-gray-600 hover:text-primary-600">
                Dashboard
              </Link>
              <Link to="/admin/plots/new" className="btn-primary flex items-center gap-2">
                <Plus size={20} />
                Add New Plot
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plots.map((plot) => (
                  <tr key={plot.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {plot.imageUrl ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={getImageUrl(plot.imageUrl)}
                              alt={plot.title}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder-image.jpg';
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <MapPin className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{plot.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{plot.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatSize(plot.size, plot.sizeUnit)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatPrice(plot.price, plot.currency)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(plot.status)}`}>
                        {plot.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Link
                          to={`/plots/${plot.id}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/admin/plots/edit/${plot.id}`}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(plot.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {plots.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No plots found</p>
                <Link to="/admin/plots/new" className="btn-primary inline-flex items-center gap-2">
                  <Plus size={20} />
                  Add Your First Plot
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPlots;
