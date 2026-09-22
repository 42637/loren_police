import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  FileCheck, 
  Car, 
  Camera, 
  User, 
  LogOut,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isSidebarOpen, closeSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/app', label: 'Home', icon: Home },
    { path: '/app/challans', label: 'Challan Verification', icon: FileCheck },
    { path: '/app/stolen', label: 'Stolen Vehicles', icon: Car },
    { path: '/app/detected', label: 'Detected Vehicles', icon: Camera },
    { path: '/app/profile', label: 'Officer Profile', icon: User },
  ];

  return (
    <>
      {/* Backdrop overlay when sidebar is open */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={closeSidebar} />
      )}

      {/* Floating Menu Sidebar (Appears ONLY when 3 dots is clicked) */}
      <aside className={`app-sidebar-floating ${isSidebarOpen ? 'is-open' : 'is-closed'}`}>
        <nav className="floating-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app'}
                onClick={closeSidebar}
                className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Helpline & Officer Card & Logout */}
        <div className="floating-footer-group">
          {/* Emergency Helpline Box */}
          <a href="tel:1233" className="sidebar-helpline-box" title="Call Emergency Helpline 1233">
            <div className="sidebar-helpline-icon">
              <PhoneCall size={16} color="#0B1D3A" />
            </div>
            <div className="sidebar-helpline-text">
              <div className="sidebar-helpline-sub">24/7 HELPLINE</div>
              <div className="sidebar-helpline-num">1233</div>
            </div>
          </a>

          {user && (
            <div className="officer-dark-card">
              <div className="officer-name-text">{user.name || 'Officer Ravi Kumar'}</div>
              <div className="officer-rank-text">{user.department || 'Traffic Police'}</div>
            </div>
          )}

          {user && (
            <button className="btn-logout-link" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          )}
        </div>

        <style>{`
          .sidebar-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.25);
            backdrop-filter: blur(2px);
            z-index: 89;
          }

          .app-sidebar-floating {
            width: 255px;
            background: #FFFDF8;
            border: 1px solid rgba(217, 226, 236, 0.85);
            border-top-left-radius: 24px;
            border-top-right-radius: 14px;
            border-bottom-left-radius: 16px;
            border-bottom-right-radius: 16px;
            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.14);
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 70px;
            left: 16px;
            z-index: 95;
            overflow: hidden;
            padding: 20px 14px 14px;
            gap: 20px;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
            pointer-events: none;
          }

          .app-sidebar-floating.is-open {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
          }

          .floating-nav-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .floating-nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 11px 16px;
            border-radius: 8px;
            color: #0B1D3A;
            font-size: 0.9rem;
            font-weight: 800;
            text-decoration: none;
            transition: all 0.15s ease;
          }

          .floating-nav-item:hover {
            background-color: rgba(11, 29, 58, 0.06);
            color: #0B1D3A;
          }

          .floating-nav-item.active {
            background-color: #0B1D3A;
            color: #FFFFFF;
            font-weight: 800;
            box-shadow: 0 4px 12px rgba(11, 29, 58, 0.25);
          }

          .floating-nav-item.active .nav-icon {
            color: #FFFFFF;
          }

          .floating-footer-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: auto;
          }

          .sidebar-helpline-box {
            display: flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, #FFF9E6 0%, #FFF3CC 100%);
            border: 1.5px solid #F0C342;
            border-radius: 10px;
            padding: 10px 14px;
            text-decoration: none;
            transition: all 0.15s ease;
            box-shadow: 0 2px 8px rgba(240, 195, 66, 0.2);
          }

          .sidebar-helpline-box:hover {
            background: #F0C342;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(240, 195, 66, 0.4);
          }

          .sidebar-helpline-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(11, 29, 58, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .sidebar-helpline-sub {
            font-size: 0.68rem;
            font-weight: 800;
            color: #554000;
            letter-spacing: 0.5px;
          }

          .sidebar-helpline-num {
            font-size: 1.1rem;
            font-weight: 900;
            color: #0B1D3A;
            line-height: 1;
            letter-spacing: 0.5px;
          }

          .officer-dark-card {
            background-color: #0B1D3A;
            border-radius: 12px;
            padding: 14px 16px;
            color: #FFFFFF;
            box-shadow: 0 4px 12px rgba(11, 29, 58, 0.2);
          }

          .officer-name-text {
            font-size: 0.9rem;
            font-weight: 900;
            color: #FFFFFF;
            line-height: 1.2;
          }

          .officer-rank-text {
            font-size: 0.75rem;
            color: #C4DCEB;
            margin-top: 2px;
          }

          .btn-logout-link {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #0B1D3A;
            font-size: 0.875rem;
            font-weight: 800;
            padding: 6px 8px;
            background: none;
            border: none;
            cursor: pointer;
            border-radius: 6px;
          }

          .btn-logout-link:hover {
            background: rgba(11, 29, 58, 0.06);
            text-decoration: underline;
          }
        `}</style>
      </aside>
    </>
  );
}
