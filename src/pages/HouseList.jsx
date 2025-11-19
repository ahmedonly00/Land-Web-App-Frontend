import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import houseService from '../services/houseService';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/button';
import HouseCard from '../components/house/HouseCard';

const HouseList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    sortBy: 'createdAt',
    sortDir: 'desc'
  });

  useEffect(() => {
    loadHouses();
  }, [page, filters]);

  const loadHouses = async () => {
    setLoading(true);
    try {
      const response = await houseService.getAllHouses({
        page,
        size: 12,
        location: filters.location,
        minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
        bedrooms: filters.bedrooms ? parseInt(filters.bedrooms) : undefined,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir
      });
      
      console.log('Houses API Response:', response);
      
      // The service now returns the correct structure
      if (response && response.content) {
        setHouses(response.content);
        setTotalPages(response.totalPages || 1);
      } else {
        console.error('Unexpected response format:', response);
        setHouses([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Failed to load houses:', error);
      toast.error('Failed to load houses');
      setHouses([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setPage(0);
    loadHouses();
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      sortBy: 'createdAt',
      sortDir: 'desc'
    });
    setPage(0);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Houses for Sale</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Browse our selection of houses in the best locations
          </p>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Search houses by location..."
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <select
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <select
                    name="bathrooms"
                    value={filters.bathrooms}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={handleSearch} className="bg-primary-600 hover:bg-primary-700">
                  Apply Filters
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loading />
          </div>
        ) : houses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {houses.map(house => (
                <HouseCard key={house.id} house={house} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="px-3 py-1 rounded-l-md"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i;
                    if (totalPages > 5) {
                      if (page < 3) {
                        pageNum = i;
                      } else if (page > totalPages - 4) {
                        pageNum = totalPages - 5 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 ${page === pageNum ? 'bg-primary-600 text-white' : ''}`}
                      >
                        {pageNum + 1}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && page < totalPages - 3 && (
                    <span className="px-2">...</span>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-3 py-1 rounded-r-md"
                  >
                    Next
                  </Button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-500 text-lg mb-4">
              No houses found matching your criteria.
            </div>
            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="mt-4"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HouseList;
