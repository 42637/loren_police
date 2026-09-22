import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FileCheck, 
  Car, 
  Camera, 
  User 
} from 'lucide-react';

export default function BottomNavigation() {
  const navItems = [
    { path: '/app', label: 'Home', icon: Home },
    { path: '/app/challans', label: 'Challans', icon: FileCheck },
    { path: '/app/stolen', label: 'Stolen', icon: Car },
    { path: '/app/detected', label: 'Detected', icon: Camera },
    { path: '/app/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="bottom-icon-wrap">
              <Icon size={18} />
              {item.badge > 0 && <span className="bottom-badge">{item.badge}</span>}
            </div>
            <span className="bottom-label">{item.label}</span>
          </NavLink>
        );
      })}

      <style>{`
        .mobile-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--bottom-nav-height);
          background-color: #FFFFFF;
          border-top: 1px solid var(--border-color);
          box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-around;
          z-index: 100;
          padding: 0 4px;
        }

        @media (min-width: 769px) {
          .mobile-bottom-nav {
            display: none;
          }
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 100%;
          color: var(--text-secondary);
          text-decoration: none;
          gap: 2px;
          min-width: 0;
        }

        .bottom-nav-item:hover {
          text-decoration: none;
        }

        .bottom-nav-item.active {
          color: var(--primary-blue);
        }

        .bottom-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bottom-badge {
          position: absolute;
          top: -4px;
          right: -8px;
          background: var(--color-danger);
          color: #FFFFFF;
          font-size: 0.6rem;
          font-weight: 700;
          height: 14px;
          min-width: 14px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 2px;
        }

        .bottom-label {
          font-size: 0.7rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .bottom-nav-item.active .bottom-label {
          font-weight: 700;
        }

        @media (max-width: 350px) {
          .bottom-label {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </nav>
  );
}
