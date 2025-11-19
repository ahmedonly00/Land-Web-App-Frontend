import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

// Public pages
import Home from './pages/Home';
import PropertyCategories from './pages/PropertyCategories';
import PlotsList from './pages/PlotsList';
import HouseList from './pages/HouseList';
import PlotDetail from './pages/PlotDetail';
import HouseDetail from './pages/HouseDetail';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPlots from './pages/admin/AdminPlots';
import AdminPlotForm from './pages/admin/AdminPlotForm';
import AdminHouses from './pages/admin/AdminHouses';
import AdminHouseForm from './pages/admin/AdminHouseForm';
import AdminSettings from './pages/admin/AdminSettings';
import AdminMedia from './pages/admin/AdminMedia';
import AdminInquiries from './pages/admin/AdminInquiries';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertyCategories />} />
            <Route path="/plots" element={<PlotsList />} />
            <Route path="/houses" element={<HouseList />} />
            <Route path="/plots/:id" element={<PlotDetail />} />
            <Route path="/houses/:id" element={<HouseDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Routes */}
            {/* Handle case-insensitive login route */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/Login" element={<Navigate to="/admin/login" replace />} />
            
            {/* Protected admin routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/plots" element={<ProtectedRoute><AdminPlots /></ProtectedRoute>} />
            <Route path="/admin/plots/new" element={<ProtectedRoute><AdminPlotForm /></ProtectedRoute>} />
            <Route path="/admin/plots/edit/:id" element={<ProtectedRoute><AdminPlotForm /></ProtectedRoute>} />
            <Route path="/admin/houses" element={<ProtectedRoute><AdminHouses /></ProtectedRoute>} />
            <Route path="/admin/houses/new" element={<ProtectedRoute><AdminHouseForm /></ProtectedRoute>} />
            <Route path="/admin/houses/edit/:id" element={<ProtectedRoute><AdminHouseForm /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
            <Route path="/admin/media" element={<ProtectedRoute><AdminMedia /></ProtectedRoute>} />
            <Route path="/admin/inquiries" element={<ProtectedRoute><AdminInquiries /></ProtectedRoute>} />
            
            {/* Catch-all route for 404s */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
    </AuthProvider>
  );
}

export default App;
