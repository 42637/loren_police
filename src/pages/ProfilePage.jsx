import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DetailRow from '../components/DetailRow';
import { User, Shield, LogOut, Settings } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <div className="page-title">
          <User size={22} color="var(--primary-blue)" />
          <span>Officer Profile</span>
        </div>
        <div className="page-subtitle">
          Authorized personnel credentials and station assignment information.
        </div>
      </div>

      {/* Main Profile Header Banner */}
      <div className="card profile-header-card">
        <div className="profile-avatar-box">
          <Shield size={36} color="#FFFFFF" />
        </div>
        <div className="profile-header-info">
          <div className="officer-badge-no">{user?.badgeNumber || 'TP-8942'}</div>
          <h1 className="officer-name-title">{user?.name || 'Officer Ravi Kumar'}</h1>
          <div className="officer-rank-sub">{user?.rank || 'Sub-Inspector (Traffic Enforcement)'}</div>
          <div className="officer-ps-tag">{user?.station || 'Bhimavaram Traffic PS'} • {user?.district || 'West Godavari'}</div>
        </div>
      </div>

      {/* TWO COLUMN GRID FOR DETAILS */}
      <div className="grid-2">
        {/* SECTION 1: OFFICER INFORMATION */}
        <div className="card">
          <div className="form-section-title">OFFICER INFORMATION</div>
          <div className="detail-grid">
            <DetailRow label="Police ID" value={user?.policeId || 'POLICE001'} highlight={true} />
            <DetailRow label="Full Name" value={user?.name || 'Officer Ravi Kumar'} />
            <DetailRow label="Official Rank" value={user?.rank || 'Sub-Inspector'} />
            <DetailRow label="Badge Number" value={user?.badgeNumber || 'TP-8942'} />
            <DetailRow label="Department" value={user?.department || 'Traffic Police'} />
            <DetailRow label="Official Email" value={user?.email || 'ravi.kumar@trafficpolice.gov.in'} />
            <DetailRow 
              label="Contact Phone" 
              value={
                user?.mobile 
                  ? (user.mobile.startsWith('+91') ? user.mobile : `+91 ${user.mobile}`) 
                  : (user?.phone 
                      ? (user.phone.startsWith('+91') ? user.phone : `+91 ${user.phone}`) 
                      : '+91 9848022334')
              } 
            />
            <DetailRow label="Service Commission" value={user?.joinDate || '12 May 2018'} />
          </div>
        </div>

        {/* SECTION 2: ASSIGNMENT INFORMATION */}
        <div className="card">
          <div className="form-section-title">ASSIGNMENT INFORMATION</div>
          <div className="detail-grid">
            <DetailRow label="Police Station" value={user?.station || 'Bhimavaram Traffic PS'} />
            <DetailRow label="District" value={user?.district || 'West Godavari'} />
            <DetailRow label="Assigned Zone" value={user?.zone || 'Zone A'} />
            <DetailRow label="State Jurisdiction" value={user?.state || 'Andhra Pradesh'} />
            <DetailRow label="Active Cases Assigned" value={user?.activeCasesAssigned || 11} highlight={true} />
            <DetailRow label="Emergency Helpline" value="1233 (24/7 Control Room)" highlight={true} />
            <DetailRow label="Access Clearance" value="LEVEL-3 HIGH COMMAND DISPATCH" />
          </div>
        </div>
      </div>

      {/* SECTION 3: ACCOUNT & SYSTEM SETTINGS */}
      <div className="card profile-actions-card">
        <div className="form-section-title">ACCOUNT ACTIONS</div>
        <div className="profile-btn-row">
          <button
            className="btn-secondary"
            onClick={() => alert('Account Settings modal: Station security key is currently synchronized.')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Settings size={16} />
            <span>Account Settings</span>
          </button>

          <button
            className="btn-danger"
            onClick={handleLogout}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <LogOut size={16} />
            <span>SIGN OUT OF CONTROL ROOM</span>
          </button>
        </div>
      </div>

      <style>{`
        .profile-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .profile-header-card {
          display: flex;
          align-items: center;
          gap: 20px;
          border-left: 5px solid var(--primary-blue);
        }

        .profile-avatar-box {
          width: 64px;
          height: 64px;
          background: var(--primary-blue);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: var(--box-shadow);
        }

        .officer-badge-no {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .officer-name-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--primary-blue);
        }

        .officer-rank-sub {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .officer-ps-tag {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .profile-btn-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (min-width: 600px) {
          .profile-btn-row {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
}
