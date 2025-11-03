import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { plotService } from '../../services/plotService';
import { toast } from 'react-toastify';

const AdminPlotForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (isEdit) {
      loadPlot();
    }
  }, [id]);

  const loadPlot = async () => {
    try {
      const response = await plotService.getPlotById(id);
      const plot = response.data;
      reset({
        title: plot.title,
        location: plot.location,
        size: plot.size,
        sizeUnit: plot.sizeUnit,
        price: plot.price,
        currency: plot.currency,
        description: plot.description,
        status: plot.status,
        videoUrl: plot.videoUrl,
        latitude: plot.latitude,
        longitude: plot.longitude,
      });
    } catch (error) {
      console.error('Failed to load plot', error);
      toast.error('Failed to load plot');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await plotService.updatePlot(id, data);
        toast.success('Plot updated successfully');
      } else {
        await plotService.createPlot(data);
        toast.success('Plot created successfully');
      }
      navigate('/admin/plots');
    } catch (error) {
      console.error('Failed to save plot', error);
      toast.error('Failed to save plot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md mb-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/plots" className="text-gray-600 hover:text-primary-600">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Plot' : 'Add New Plot'}
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="input-field"
                  placeholder="e.g., Prime Residential Plot in Kicukiro"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  {...register('location', { required: 'Location is required' })}
                  className="input-field"
                  placeholder="e.g., Kicukiro, Kigali"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('size', { required: 'Size is required', min: 0 })}
                  className="input-field"
                  placeholder="500"
                />
                {errors.size && (
                  <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size Unit *
                </label>
                <select
                  {...register('sizeUnit', { required: 'Size unit is required' })}
                  className="input-field"
                >
                  <option value="sqm">Square Meters (sqm)</option>
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { required: 'Price is required', min: 0 })}
                  className="input-field"
                  placeholder="25000000"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select {...register('currency')} className="input-field">
                  <option value="RWF">RWF</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select {...register('status')} className="input-field">
                  <option value="AVAILABLE">Available</option>
                  <option value="SOLD">Sold</option>
                  <option value="RESERVED">Reserved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  {...register('videoUrl')}
                  className="input-field"
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude (Optional)
                </label>
                <input
                  type="number"
                  step="0.000001"
                  {...register('latitude')}
                  className="input-field"
                  placeholder="-1.9706"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude (Optional)
                </label>
                <input
                  type="number"
                  step="0.000001"
                  {...register('longitude')}
                  className="input-field"
                  placeholder="30.1044"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows="6"
                className="input-field resize-none"
                placeholder="Detailed description of the plot..."
              ></textarea>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    {isEdit ? 'Update Plot' : 'Create Plot'}
                  </>
                )}
              </button>
              <Link to="/admin/plots" className="btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPlotForm;
