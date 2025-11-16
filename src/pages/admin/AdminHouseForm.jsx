import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Home, MapPin, DollarSign, Bed, Bath, Square, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import houseService from '../../services/houseService';

const AdminHouseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [house, setHouse] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (isEdit) {
      loadHouse();
    }
  }, [id]);

  const loadHouse = async () => {
    try {
      const houseData = await houseService.adminGetHouseById(id);
      console.log('House data loaded:', houseData);
      setHouse(houseData);
      
      // Transform features array of objects to comma-separated string
      let featuresString = '';
      if (houseData.features && Array.isArray(houseData.features)) {
        featuresString = houseData.features
          .map(feature => feature.name || feature)
          .join(', ');
      }
      
      reset({
        title: houseData.title,
        location: houseData.location,
        price: houseData.price,
        currency: houseData.currency,
        description: houseData.description,
        status: houseData.status,
        type: houseData.type,
        bedrooms: houseData.bedrooms,
        bathrooms: houseData.bathrooms,
        size: houseData.size,
        sizeUnit: houseData.sizeUnit,
        yearBuilt: houseData.yearBuilt,
        videoUrl: houseData.videoUrl,
        features: featuresString,
      });
    } catch (error) {
      console.error('Failed to load house', error);
      toast.error('Failed to load house');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log('House form submitted. Validation errors:', errors);
      
      // Transform features string to array of objects
      if (data.features && typeof data.features === 'string') {
        data.features = data.features
          .split(',')
          .map(feature => feature.trim())
          .filter(feature => feature.length > 0)
          .filter(feature => feature.length >= 2) // Filter out features shorter than 2 characters
          .map(feature => ({ name: feature }));
      } else if (!data.features) {
        data.features = [];
      }
      
      // Convert numeric fields to proper numbers
      data.price = parseFloat(data.price) || 0;
      data.bedrooms = parseInt(data.bedrooms) || 0;
      data.bathrooms = parseInt(data.bathrooms) || 0;
      data.size = parseFloat(data.size) || null;
      data.yearBuilt = parseInt(data.yearBuilt) || null;
      
      console.log('House data being sent:', JSON.stringify(data, null, 2));
      
      if (isEdit) {
        await houseService.updateHouse(id, data);
        toast.success('House updated successfully');
        
        // Upload image if one was selected (optional)
        if (imageFile) {
          try {
            const formData = new FormData();
            formData.append('file', imageFile);
            await houseService.uploadImage(id, formData);
            toast.success('Image uploaded successfully');
          } catch (imageError) {
            console.warn('Image upload failed, but house was updated:', imageError);
            toast.warning('House updated, but image upload failed');
          }
        }
      } else {
        await houseService.createHouse(data);
        toast.success('House created successfully');
      }
      navigate('/admin/houses');
    } catch (error) {
      console.error('Failed to save house', error);
      toast.error('Failed to save house');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md mb-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/houses" className="text-gray-600 hover:text-primary-600">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit House' : 'Add New House'}
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
                  placeholder="e.g., Modern 3-Bedroom House in Kicukiro"
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
                  Price *
                </label>
                <input
                  type="number"
                  {...register('price', { required: 'Price is required', min: 0 })}
                  className="input-field"
                  placeholder="e.g., 150000"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency *
                </label>
                <select
                  {...register('currency', { required: 'Currency is required' })}
                  className="input-field"
                >
                  <option value="RWF">RWF</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                {errors.currency && (
                  <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  House Type *
                </label>
                <select
                  {...register('type', { required: 'House type is required' })}
                  className="input-field"
                >
                  <option value="">Select type</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="VILLA">Villa</option>
                  <option value="TOWNHOUSE">Townhouse</option>
                  <option value="BUNGALOW">Bungalow</option>
                  <option value="PENTHOUSE">Penthouse</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className="input-field"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="SOLD">Sold</option>
                  <option value="PENDING">Pending</option>
                  <option value="RENTED">Rented</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  {...register('bedrooms', { required: 'Bedrooms is required', min: 0 })}
                  className="input-field"
                  placeholder="e.g., 3"
                />
                {errors.bedrooms && (
                  <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  {...register('bathrooms', { required: 'Bathrooms is required', min: 0 })}
                  className="input-field"
                  placeholder="e.g., 2"
                />
                {errors.bathrooms && (
                  <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    {...register('size', { min: 0 })}
                    className="input-field flex-1"
                    placeholder="e.g., 120"
                  />
                  <select
                    {...register('sizeUnit')}
                    className="input-field w-24"
                  >
                    <option value="sqm">m²</option>
                    <option value="sqft">ft²</option>
                  </select>
                </div>
                {errors.size && (
                  <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Built
                </label>
                <input
                  type="number"
                  {...register('yearBuilt', { 
                    min: 1900, 
                    max: new Date().getFullYear() + 1 
                  })}
                  className="input-field"
                  placeholder="e.g., 2020"
                />
                {errors.yearBuilt && (
                  <p className="mt-1 text-sm text-red-600">{errors.yearBuilt.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL
                </label>
                <input
                  type="url"
                  {...register('videoUrl')}
                  className="input-field"
                  placeholder="e.g., https://youtube.com/watch?v=..."
                />
                {errors.videoUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.videoUrl.message}</p>
                )}
              </div>

              {isEdit && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image (Optional)
                  </label>
                  {house?.imageUrl && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Current image:</p>
                      <img
                        src={`http://localhost:8080/uploads/${house.imageUrl}`}
                        alt="Current house image"
                        className="h-32 w-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="input-field"
                  />
                  {imageFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {imageFile.name}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={6}
                  className="input-field"
                  placeholder="Describe the house, its features, amenities, location advantages, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features (comma-separated)
                </label>
                <textarea
                  {...register('features')}
                  rows={3}
                  className="input-field"
                  placeholder="e.g., Swimming Pool, Garden, Garage, Security System, Solar Panels"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter features separated by commas
                </p>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <Link
                  to="/admin/houses"
                  className="btn-secondary"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : null}
                  {isEdit ? 'Update House' : 'Create House'}
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AdminHouseForm;
