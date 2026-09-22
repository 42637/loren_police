import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppHeader from '../components/AppHeader';
import Sidebar from '../components/Sidebar';
import BottomNavigation from '../components/BottomNavigation';

export default function AppLayout() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      <div className="main-content">
        <AppHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Universal Application Background Container */}
        <div className="app-global-bg-container">
          <div className="global-chakra-watermark">
            <svg viewBox="0 0 100 100" className="global-chakra-svg" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#102A43" strokeWidth="2" />
              <circle cx="50" cy="50" r="41" fill="none" stroke="#102A43" strokeWidth="1" />
              <circle cx="50" cy="50" r="8" fill="#102A43" />
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 15 * Math.PI) / 180;
                const x2 = 50 + 41 * Math.cos(angle);
                const y2 = 50 + 41 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={x2}
                    y2={y2}
                    stroke="#102A43"
                    strokeWidth="1.2"
                  />
                );
              })}
            </svg>
          </div>

          <main className="page-wrapper">
            <Outlet />
          </main>

          {/* Tricolor Footer Strip */}
          <footer className="global-tricolor-footer">
            <div className="footer-content-wrap">
              <div className="footer-text-info">
                © 2026 TRAFFIC POLICE CONTROL ROOM (TPCR) • Academic Prototype • Government of Andhra Pradesh
              </div>
              <div className="footer-seals-group">
                <div className="mini-seal-badge">
                  <svg viewBox="0 0 40 40" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#061933" stroke="#F0C342" strokeWidth="1.5" />
                    <circle cx="20" cy="20" r="12" fill="none" stroke="#F0C342" strokeWidth="0.8" strokeDasharray="1 1" />
                    <circle cx="20" cy="20" r="4" fill="#F0C342" />
                  </svg>
                </div>
                <div className="mini-seal-badge">
                  <svg viewBox="0 0 40 40" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#16803C" stroke="#FFFFFF" strokeWidth="1" />
                    <path d="M12 20 L18 26 L28 14" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
      <BottomNavigation />

      <style>{`
        .main-content {
          margin-left: 0 !important;
        }

        .app-global-bg-container {
          position: relative;
          min-height: calc(100vh - 60px);
          width: 100%;
          background: linear-gradient(180deg, #F0F4F8 0%, #E6EDF5 100%);
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .global-chakra-watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 580px;
          height: 580px;
          opacity: 0.06;
          pointer-events: none;
          z-index: 0;
        }

        @media (max-width: 768px) {
          .global-chakra-watermark {
            width: 440px;
            height: 440px;
          }
        }

        .global-chakra-svg {
          width: 100%;
          height: 100%;
        }

        .page-wrapper {
          position: relative;
          z-index: 1;
          flex: 1;
        }

        /* Tricolor Footer Strip */
        .global-tricolor-footer {
          position: relative;
          z-index: 1;
          background: linear-gradient(90deg, 
            #FFE6D5 0%, 
            #FFFFFF 45%, 
            #E4F5E6 100%
          );
          border-top: 1px solid #D5DDE4;
          padding: 10px 20px;
          margin-top: auto;
        }

        .footer-content-wrap {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .footer-text-info {
          font-size: 0.75rem;
          color: #1F2933;
          font-weight: 700;
          letter-spacing: 0.2px;
        }

        .footer-seals-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mini-seal-badge {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 600px) {
          .footer-content-wrap {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
