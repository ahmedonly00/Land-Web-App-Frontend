import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsService.getAllSettings();
      reset(response.data);
    } catch (error) {
      console.error('Failed to load settings', error);
      toast.error('Failed to load settings');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await settingsService.updateSettings(data);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update settings', error);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md mb-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-gray-600 hover:text-primary-600">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Company Information</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  {...register('company_name')}
                  className="input-field"
                  placeholder="iwacu 250"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  {...register('whatsapp_number', { required: 'WhatsApp number is required' })}
                  className="input-field"
                  placeholder="+250788000000"
                />
                {errors.whatsapp_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.whatsapp_number.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Include country code (e.g., +250788000000)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Email
                </label>
                <input
                  type="email"
                  {...register('company_email')}
                  className="input-field"
                  placeholder="info@iwacu250.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Phone
                </label>
                <input
                  type="tel"
                  {...register('company_phone')}
                  className="input-field"
                  placeholder="+250788000000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Address
                </label>
                <input
                  type="text"
                  {...register('company_address')}
                  className="input-field"
                  placeholder="Kigali, Rwanda"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
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
                    Save Settings
                  </>
                )}
              </button>
              <Link to="/admin" className="btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Important Notes:</h3>
          <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
            <li>WhatsApp number will be used for all inquiry buttons on the website</li>
            <li>Make sure to include the country code (e.g., +250 for Rwanda)</li>
            <li>Changes will be reflected immediately on the public website</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
