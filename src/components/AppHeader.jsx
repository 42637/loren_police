import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, MoreVertical, PhoneCall, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import headerLogo from '../assets/header_logo.png';

export default function AppHeader({ toggleSidebar, isSidebarOpen }) {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <header className="top-app-header">
      <div className="header-brand">
        {/* 3 Dots Toggle Button on Top Left Corner */}
        <button
          type="button"
          className={`three-dots-btn ${isSidebarOpen ? 'active' : ''}`}
          onClick={toggleSidebar}
          aria-label="Toggle Navigation Sidebar"
          title="Toggle Navigation Menu"
        >
          <MoreVertical size={20} color="#F0C342" />
        </button>

        {/* Header Logo Image */}
        <div className="gov-lion-emblem-box">
          <img src={headerLogo} alt="Traffic Police Emblem" className="header-emblem-img" />
        </div>

        <div className="brand-titles">
          <div className="brand-name">TRAFFIC POLICE CONTROL ROOM</div>
          <div className="brand-sub">AP STATE GOVERNMENT • e-PRAGATI PORTAL</div>
        </div>
      </div>

      <div className="header-actions">
        {/* Live Date & Time Display next to Helpline */}
        <div className="header-datetime-pill" title="Live Control Room Date & Time">
          <Clock size={14} color="#F0C342" />
          <span className="live-date-val">{formattedDate}</span>
          <span className="live-time-sep">•</span>
          <span className="live-time-val">{formattedTime}</span>
        </div>

        {/* 24/7 Emergency Helpline Pill */}
        <a href="tel:1233" className="header-helpline-pill" title="Call Police Helpline 1233">
          <PhoneCall size={14} color="#F0C342" />
          <span className="helpline-text">HELPLINE: <strong className="helpline-num">1233</strong></span>
        </a>

        {user && (
          <div className="header-officer-pill">
            <div className="flag-badge-box">
              <span className="india-flag">🇮🇳</span>
            </div>

            <div className="header-officer-text">
              <div className="officer-name">{user.name || 'Officer Ravi Kumar'} •</div>
              <div className="officer-dept">{user.station || 'Bhimavaram Traffic PS'}</div>
            </div>

            <Link to="/app/profile" className="header-shield-link" title="Officer Profile">
              <div className="shield-icon-badge">
                <Shield size={16} color="#FFD700" />
              </div>
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .top-app-header {
          height: 60px;
          background-color: #061933;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 2px solid #F0C342;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* 3 Dots Button Styling */
        .three-dots-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(240, 195, 66, 0.4);
          cursor: pointer;
          transition: all 0.15s ease;
          margin-right: 2px;
        }

        .three-dots-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: #F0C342;
          transform: scale(1.05);
        }

        .three-dots-btn.active {
          background: #F0C342;
        }

        .three-dots-btn.active svg {
          stroke: #061933;
        }

        .gov-lion-emblem-box {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-emblem-img {
          height: 40px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
        }

        .brand-name {
          font-size: 1.05rem;
          font-weight: 900;
          letter-spacing: 0.5px;
          line-height: 1.1;
          color: #F0C342;
        }

        .brand-sub {
          font-size: 0.68rem;
          color: #D5E5F2;
          font-weight: 600;
          letter-spacing: 0.4px;
          margin-top: 1px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-datetime-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(240, 195, 66, 0.4);
          padding: 5px 12px;
          border-radius: 4px;
          color: #FFFFFF;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.3px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .live-date-val {
          color: #D5E5F2;
          font-weight: 600;
        }

        .live-time-sep {
          color: #F0C342;
        }

        .live-time-val {
          color: #F0C342;
          font-weight: 900;
          letter-spacing: 0.5px;
        }

        .header-helpline-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(240, 195, 66, 0.15);
          border: 1px solid #F0C342;
          padding: 5px 12px;
          border-radius: 4px;
          color: #FFFFFF;
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 700;
          transition: all 0.15s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .header-helpline-pill:hover {
          background: #F0C342;
          color: #061933;
        }

        .header-helpline-pill:hover svg {
          stroke: #061933;
        }

        .header-helpline-pill:hover .helpline-num {
          color: #061933;
        }

        .helpline-text {
          letter-spacing: 0.3px;
        }

        .helpline-num {
          color: #F0C342;
          font-size: 0.88rem;
          font-weight: 900;
          margin-left: 2px;
        }

        .header-officer-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(240, 195, 66, 0.35);
          padding: 5px 12px;
          border-radius: 4px;
        }

        .flag-badge-box {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        .header-officer-text {
          text-align: left;
        }

        .officer-name {
          font-size: 0.85rem;
          font-weight: 800;
          line-height: 1.2;
          color: #FFFFFF;
        }

        .officer-dept {
          font-size: 0.68rem;
          color: #D5E5F2;
        }

        .header-shield-link {
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .shield-icon-badge {
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #4A121A 0%, #29080E 100%);
          border: 1px solid #F0C342;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 600px) {
          .brand-name {
            font-size: 0.85rem;
          }
          .brand-sub {
            display: none;
          }
          .header-officer-text {
            display: none;
          }
          .live-date-val, .live-time-sep {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
