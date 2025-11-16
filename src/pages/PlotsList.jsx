import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Landmark } from 'lucide-react';
import { plotService } from '../services/plotService';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PlotCard from '../components/plot/PlotCard';
import Loading from '../components/common/Loading';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { toast } from 'react-toastify';

const PlotsList = () => {
  const navigate = useNavigate();
  
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    minSize: '',
    maxSize: '',
    sortBy: 'createdAt',
    sortDir: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadPlots();
  }, [page, filters]);

  const loadPlots = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 12,
        type: 'land', // Always filter for land plots
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
        ...(filters.location && { location: filters.location }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.minSize && { minSize: filters.minSize }),
        ...(filters.maxSize && { maxSize: filters.maxSize }),
      };

      const response = await plotService.getAllPlots(params);
      
      if (response && Array.isArray(response.content)) {
        setPlots(response.content);
        setTotalPages(response.totalPages || 1);
      } else if (response && response.data && Array.isArray(response.data.content)) {
        setPlots(response.data.content);
        setTotalPages(response.data.totalPages || 1);
      } else if (Array.isArray(response)) {
        setPlots(response);
        setTotalPages(1);
      } else {
        console.error('Unexpected response format:', response);
        setPlots([]);
        setTotalPages(0);
        toast.error('Unexpected response format from server');
      }
    } catch (error) {
      console.error('Failed to load plots', error);
      // Check if it's a 404 (not found) error
      if (error.response && error.response.status === 404) {
        setPlots([]);
        setTotalPages(0);
        toast.info('No plots found. Add some plots to get started!');
      } else {
        toast.error('Failed to load plots. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(0); // Reset to first page when filters change
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    setPage(0);
    loadPlots();
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      minSize: '',
      maxSize: '',
      sortBy: 'createdAt',
      sortDir: 'desc'
    });
    setPage(0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="text-base px-4 py-2">
                <Landmark className="mr-2" size={18} />
                Land Plots
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Search plots by location..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
                
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal size={18} />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (RWF)</label>
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="0"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (RWF)</label>
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="No limit"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Size (sqm)</label>
                    <input
                      type="number"
                      name="minSize"
                      value={filters.minSize}
                      onChange={handleFilterChange}
                      placeholder="0"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Size (sqm)</label>
                    <input
                      type="number"
                      name="maxSize"
                      value={filters.maxSize}
                      onChange={handleFilterChange}
                      placeholder="No limit"
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={handleSearch} className="btn-primary">
                    Apply Filters
                  </button>
                  <button onClick={clearFilters} className="btn-secondary">
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Plots Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : plots.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {plots.map(plot => (
                  <PlotCard key={plot.id} plot={plot} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-4">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Landmark size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Plots Found</h3>
              <p className="text-gray-500 mb-6">
                {filters.location || filters.minPrice || filters.maxPrice || filters.minSize || filters.maxSize
                  ? 'No plots match your current filters. Try adjusting your search criteria.'
                  : 'There are no plots available at the moment. Please check back later or contact us for more information.'}
              </p>
              {(filters.location || filters.minPrice || filters.maxPrice || filters.minSize || filters.maxSize) && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlotsList;
