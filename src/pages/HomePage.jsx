import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  Activity, 
  Car, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  PhoneCall
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  const activities = [
    {
      id: 1,
      title: 'Potential stolen vehicle match',
      details: 'AP37AB4567 detected near Main Road',
      actionText: 'REVIEW (Potential match)',
      icon: Car,
      iconBg: '#FFE3E3',
      iconColor: '#800000',
      linkTo: '/app/stolen'
    },
    {
      id: 2,
      title: 'Challan complaint received',
      details: 'CMP-2026-0012 for CHL-2026-00125',
      actionText: 'ASSIGN (Pending)',
      icon: FileText,
      iconBg: '#FFF3E0',
      iconColor: '#A86B00',
      linkTo: '/app/challans'
    },
    {
      id: 3,
      title: 'Vehicle registered as stolen',
      details: 'FIR-2026-00231 (AP37AB4567)',
      actionText: 'VIEW (Active)',
      icon: AlertTriangle,
      iconBg: '#EAF3F8',
      iconColor: '#075A9C',
      linkTo: '/app/stolen'
    },
    {
      id: 4,
      title: 'Verification completed',
      details: 'Challan dispute CMP-2026-0008 approved & cancelled',
      actionText: 'REPORT (Verified)',
      icon: CheckCircle2,
      iconBg: '#E8F5E9',
      iconColor: '#16803C',
      linkTo: '/app/challans'
    }
  ];

  return (
    <div className="home-page-container">
      {/* Officer Welcome Header Banner */}
      <div className="officer-welcome-banner">
        <div className="welcome-text-group">
          <div className="greeting-time">Good Morning,</div>
          <h1 className="officer-display-name">{user?.name || 'Officer Ravi Kumar'}</h1>
          <div className="officer-station-badge">
            <Shield size={14} color="#800000" />
            <span>Sub-Inspector (Traffic Enforcement) • {user?.station || 'Bhimavaram Traffic PS'}</span>
          </div>
        </div>

        {/* Faint Banner Chakra Watermark */}
        <div className="banner-watermark">
          <svg viewBox="0 0 100 100" width="120" height="120" opacity="0.08" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#800000" strokeWidth="3" />
            <circle cx="50" cy="50" r="8" fill="#800000" />
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 15 * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 45 * Math.cos(angle)}
                  y2={50 + 45 * Math.sin(angle)}
                  stroke="#800000"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* 24/7 Police & Traffic Emergency Helpline Banner */}
      <div className="home-helpline-card">
        <div className="helpline-left-group">
          <div className="helpline-badge-circle">
            <PhoneCall size={22} color="#061933" />
          </div>
          <div className="helpline-text-content">
            <div className="helpline-heading">POLICE CONTROL ROOM HELPLINE</div>
            <div className="helpline-subtext">24/7 Emergency Assistance & Traffic Enforcement Toll-Free Line</div>
          </div>
        </div>
        <a href="tel:1233" className="helpline-dial-btn" title="Dial 1233 Helpline">
          <PhoneCall size={16} />
          <span>HELPLINE 1233</span>
        </a>
      </div>

      {/* Recent Control Room Activity */}
      <section className="activity-section">
        <div className="section-header-row">
          <h2 className="section-title">
            <Activity size={18} color="#075A9C" style={{ display: 'inline', marginRight: '8px' }} />
            RECENT CONTROL ROOM ACTIVITY
          </h2>
        </div>

        <div className="activity-cards-list">
          {activities.map((item) => {
            const IconComp = item.icon;
            return (
              <div key={item.id} className="activity-card-row">
                <div className="activity-left-group">
                  <div className="activity-icon-badge" style={{ backgroundColor: item.iconBg, color: item.iconColor }}>
                    <IconComp size={20} />
                  </div>
                  <div className="activity-text-info">
                    <h3 className="activity-title">{item.title}</h3>
                    <p className="activity-details">{item.details}</p>
                  </div>
                </div>

                <div className="activity-right-action">
                  <Link to={item.linkTo} className="activity-action-link">
                    {item.actionText}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Government Footer */}
      <footer className="home-gov-footer">
        © 2026 TRAFFIC POLICE CONTROL ROOM (TPCR) • Academic Prototype • Government of Andhra Pradesh
      </footer>

      <style>{`
        .home-page-container {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-height: calc(100vh - 100px);
          padding-bottom: 20px;
        }

        /* Officer Welcome Banner */
        .officer-welcome-banner {
          position: relative;
          background: linear-gradient(180deg, #FAF8F5 0%, #FFFFFF 100%);
          border: 1px solid #D9E2EC;
          border-left: 5px solid #800000;
          border-radius: 8px;
          padding: 20px 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          z-index: 1;
        }

        .welcome-text-group {
          position: relative;
          z-index: 2;
        }

        .greeting-time {
          font-size: 0.85rem;
          color: #65727D;
          font-weight: 500;
        }

        .officer-display-name {
          font-size: 1.45rem;
          font-weight: 900;
          color: #1F2933;
          margin: 2px 0 8px;
          letter-spacing: 0.3px;
        }

        .officer-station-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #334E68;
          background: #EAF3F8;
          border: 1px solid #C4DCEB;
          padding: 5px 12px;
          border-radius: 4px;
        }

        .banner-watermark {
          position: absolute;
          right: -10px;
          top: -10px;
          pointer-events: none;
          z-index: 1;
        }

        /* 24/7 Emergency Helpline Banner */
        .home-helpline-card {
          background: linear-gradient(135deg, #061933 0%, #0B2545 100%);
          border: 1px solid #F0C342;
          border-radius: 8px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          box-shadow: 0 4px 14px rgba(6, 25, 51, 0.15);
          position: relative;
          z-index: 1;
        }

        .helpline-left-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .helpline-badge-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #F0C342;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(240, 195, 66, 0.3);
        }

        .helpline-heading {
          font-size: 0.9rem;
          font-weight: 900;
          color: #F0C342;
          letter-spacing: 0.5px;
        }

        .helpline-subtext {
          font-size: 0.78rem;
          color: #D5E5F2;
          font-weight: 500;
          margin-top: 2px;
        }

        .helpline-dial-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #F0C342;
          color: #061933;
          font-size: 0.85rem;
          font-weight: 900;
          letter-spacing: 0.5px;
          padding: 10px 18px;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.15s ease;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(240, 195, 66, 0.25);
        }

        .helpline-dial-btn:hover {
          background: #FFFFFF;
          color: #061933;
          transform: translateY(-1px);
        }

        /* Activity Section */
        .activity-section {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .section-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .section-title {
          font-size: 1.05rem;
          font-weight: 900;
          color: #102A43;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
        }

        .activity-cards-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .activity-card-row {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          border: 1px solid #D5DDE4;
          border-radius: 6px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .activity-card-row:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .activity-left-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .activity-icon-badge {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .activity-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: #1F2933;
          margin: 0;
        }

        .activity-details {
          font-size: 0.825rem;
          color: #65727D;
          margin-top: 3px;
        }

        .activity-right-action {
          flex-shrink: 0;
        }

        .activity-action-link {
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.3px;
          color: #1F2933;
          text-decoration: none;
          display: inline-block;
          padding: 4px 8px;
        }

        .activity-action-link:hover {
          color: #000000;
          text-decoration: underline;
        }

        /* Government Footer Banner */
        .home-gov-footer {
          margin-top: auto;
          text-align: center;
          font-size: 0.75rem;
          color: #65727D;
          font-weight: 600;
          padding-top: 16px;
          border-top: 1px solid #D5DDE4;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 600px) {
          .home-helpline-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }
          .helpline-dial-btn {
            align-self: flex-start;
            width: 100%;
            justify-content: center;
          }
          .activity-card-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .activity-right-action {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
}
