import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ChallansPage from './pages/ChallansPage';
import ChallanDetailPage from './pages/ChallanDetailPage';
import StolenVehiclesPage from './pages/StolenVehiclesPage';
import RegisterStolenPage from './pages/RegisterStolenPage';
import StolenVehicleDetailPage from './pages/StolenVehicleDetailPage';
import DetectedVehiclesPage from './pages/DetectedVehiclesPage';
import DetectedVehicleDetailPage from './pages/DetectedVehicleDetailPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <Routes>
            {/* Main Home Screen Landing - Police Login & Registration Portal */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected App Routes inside Shell Layout */}
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<HomePage />} />
              
              {/* Challans */}
              <Route path="challans" element={<ChallansPage />} />
              <Route path="challans/:id" element={<ChallanDetailPage />} />

              {/* Stolen Vehicles */}
              <Route path="stolen" element={<StolenVehiclesPage />} />
              <Route path="stolen/register" element={<RegisterStolenPage />} />
              <Route path="stolen/:id" element={<StolenVehicleDetailPage />} />

              {/* Detected Vehicles */}
              <Route path="detected" element={<DetectedVehiclesPage />} />
              <Route path="detected/:id" element={<DetectedVehicleDetailPage />} />

              {/* Profile */}
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Redirect fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AppProvider>
    </AuthProvider>
  );
}
