import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Home, MapPin, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import houseService from '../../services/houseService';
import { getImageUrl } from '../../utils/imageUtils';

const AdminHouses = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHouses();
  }, []);

  const loadHouses = async () => {
    try {
      const response = await houseService.adminGetAllHouses();
      console.log('Houses API response:', response);
      // Handle both paginated and non-paginated responses
      let housesData = response.content || response.data?.content || response.data || response;
      // Ensure we always have an array
      housesData = Array.isArray(housesData) ? housesData : [];
      console.log('Houses data after processing:', housesData);
      setHouses(housesData);
    } catch (error) {
      console.error('Failed to load houses', error);
      toast.error('Failed to load houses');
      setHouses([]); // Ensure houses is always an array even on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this house?')) return;

    try {
      await houseService.deleteHouse(id);
      toast.success('House deleted successfully');
      loadHouses();
    } catch (error) {
      console.error('Failed to delete house', error);
      toast.error('Failed to delete house');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await houseService.updateHouseStatus(id, newStatus);
      toast.success('House status updated successfully');
      loadHouses();
    } catch (error) {
      console.error('Failed to update house status', error);
      toast.error('Failed to update house status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading houses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md mb-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Manage Houses</h1>
            <div className="flex gap-4">
              <Link to="/admin" className="text-gray-600 hover:text-primary-600">
                Dashboard
              </Link>
              <Link to="/admin/houses/new" className="btn-primary flex items-center gap-2">
                <Plus size={20} />
                Add New House
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4">
        {houses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Home className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No houses found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first house.</p>
            <Link to="/admin/houses/new" className="btn-primary inline-flex items-center gap-2">
              <Plus size={20} />
              Add New House
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      House
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bedrooms
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {houses.map((house) => (
                    <tr key={house.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {house.imageUrl ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={getImageUrl(house.imageUrl)}
                                alt={house.title}
                                onError={(e) => {
                                  e.target.src = '/placeholder-house.jpg';
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <Home className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {house.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {house.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          {house.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                          {house.price.toLocaleString()} {house.currency || 'RWF'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {house.bedrooms || '-'} bed / {house.bathrooms || '-'} bath
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={house.status}
                          onChange={(e) => handleStatusChange(house.id, e.target.value)}
                          className={`text-sm rounded-md px-2 py-1 font-medium ${
                            house.status === 'AVAILABLE'
                              ? 'bg-green-100 text-green-800'
                              : house.status === 'SOLD'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <option value="AVAILABLE">Available</option>
                          <option value="SOLD">Sold</option>
                          <option value="PENDING">Pending</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(house.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/houses/${house.id}`}
                            className="text-gray-400 hover:text-gray-600"
                            target="_blank"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          <Link
                            to={`/admin/houses/edit/${house.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(house.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminHouses;
