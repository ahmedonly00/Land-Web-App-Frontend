import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

// Public pages
import Home from './pages/Home';
import PlotsList from './pages/PlotsList';
import PlotDetail from './pages/PlotDetail';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPlots from './pages/admin/AdminPlots';
import AdminPlotForm from './pages/admin/AdminPlotForm';
import AdminSettings from './pages/admin/AdminSettings';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/plots" element={<PlotsList />} />
            <Route path="/plots/:id" element={<PlotDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/plots" element={<ProtectedRoute><AdminPlots /></ProtectedRoute>} />
            <Route path="/admin/plots/new" element={<ProtectedRoute><AdminPlotForm /></ProtectedRoute>} />
            <Route path="/admin/plots/edit/:id" element={<ProtectedRoute><AdminPlotForm /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
