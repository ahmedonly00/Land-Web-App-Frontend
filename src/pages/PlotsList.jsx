import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { plotService } from '../services/plotService';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PlotCard from '../components/plot/PlotCard';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';

const PlotsList = () => {
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
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
        ...(filters.location && { location: filters.location }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.minSize && { minSize: filters.minSize }),
        ...(filters.maxSize && { maxSize: filters.maxSize }),
      };

      const response = await plotService.getAllPlots(params);
      setPlots(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to load plots', error);
      toast.error('Failed to load plots');
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
    e.preventDefault();
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Land Plots</h1>
            <p className="text-gray-600">Find your perfect plot from our available listings</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search */}
              <div className="flex-grow">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="location"
                    placeholder="Search by location..."
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Sort */}
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="createdAt">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="size">Size: Small to Large</option>
              </select>

              {/* Toggle Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center gap-2"
              >
                <SlidersHorizontal size={20} />
                Filters
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Results */}
          {loading ? (
            <Loading />
          ) : plots.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {plots.map((plot) => (
                  <PlotCard key={plot.id} plot={plot} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
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
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600 mb-4">No plots found matching your criteria</p>
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlotsList;
