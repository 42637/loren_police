import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  PhoneCall, 
  Shield, 
  Phone, 
  Clock, 
  Globe, 
  Database, 
  KeyRound, 
  UserPlus 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import headerLogo from '../assets/header_logo.png';

export default function LoginPage() {
  const [policeId, setPoliceId] = useState('POLICE001');
  const [mobile, setMobile] = useState('9848022334');
  const [password, setPassword] = useState('police123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState('');
  const [currentLang, setCurrentLang] = useState('en');

  // Live Digital Clock State
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  const hStr = String(h12).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const formattedTime = `${hStr}:${mStr}:${sStr} ${ampm}`;
  const formattedDate = `${days[time.getDay()]}, ${months[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}`;

  const { user, login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!policeId.trim()) {
      setFormError('Please enter a valid Police ID or Badge Number.');
      return;
    }
    if (!password) {
      setFormError('Please enter your account password.');
      return;
    }

    try {
      await login(policeId.trim(), password, rememberMe);
      navigate('/app');
    } catch (err) {
      setFormError(err.message || 'Invalid Police ID or Password.');
    }
  };

  return (
    <div className="ap-auth-page-bg">
      <div className="ap-auth-card-container">
        
        {/* TOP POLICE NAVY BLUE HEADER BANNER */}
        <div className="ap-navy-header-banner">
          
          {/* Top Status Bar: Clock, Language, Supabase Badge */}
          <div className="ap-top-status-bar">
            
            {/* Live Time & Date */}
            <div className="ap-status-clock-box">
              <Clock size={13} color="#F0C342" />
              <div className="ap-clock-text-wrap">
                <span className="ap-time-txt">{formattedTime}</span>
                <span className="ap-date-txt">{formattedDate}</span>
              </div>
            </div>

            {/* Language Selector Pill */}
            <div className="ap-language-pill-wrap">
              <Globe size={12} color="#F0C342" />
              <select 
                value={currentLang} 
                onChange={(e) => setCurrentLang(e.target.value)}
                className="ap-lang-select"
              >
                <option value="en">English</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>

            {/* Supabase Database Status Badge */}
            <div className="ap-db-status-pill">
              <span className="ap-db-dot-indicator" />
              <Database size={12} color="#34d399" />
              <span>Supabase Connected</span>
            </div>

          </div>

          {/* Center State Emblem & Header Title */}
          <div className="ap-emblem-center-box">
            <img 
              src={headerLogo} 
              alt="State Emblem of India" 
              className="ap-state-emblem-img"
            />
            <h1 className="ap-header-title-main">
              e-Challan Police Officer Portal Login
            </h1>
            <p className="ap-header-subtitle">
              Government of Andhra Pradesh • Traffic Police Department
            </p>
          </div>

        </div>

        {/* CARD BODY CONTENT */}
        <div className="ap-card-body-padding">
          
          {user && (
            <div className="ap-session-banner-box">
              <span>Active Officer Session: <strong>{user.name || user.policeId}</strong></span>
              <button 
                type="button" 
                onClick={() => navigate('/app')}
                className="ap-session-go-btn"
              >
                Go to Dashboard →
              </button>
            </div>
          )}

          {/* Segmented Auth Mode Switcher Tabs */}
          <div className="ap-segmented-tabs-bar">
            <button
              type="button"
              className="ap-seg-tab-btn active"
            >
              <KeyRound size={15} color="#0B4F8A" />
              <span>Log In</span>
            </button>
            <Link
              to="/register"
              className="ap-seg-tab-btn inactive"
            >
              <UserPlus size={15} color="#94a3b8" />
              <span>Register Officer</span>
            </Link>
          </div>

          {/* Form Error Alert */}
          {formError && (
            <div className="ap-error-alert-box" role="alert">
              <AlertCircle size={15} />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            {/* 1. Police ID / Badge Number */}
            <div className="ap-input-group-row">
              <label className="ap-field-label-text" htmlFor="policeId">
                Police ID / Badge Number
              </label>
              <div className="ap-field-input-box">
                <Shield size={16} className="ap-field-left-icon" />
                <input
                  id="policeId"
                  type="text"
                  className="ap-custom-text-input"
                  placeholder="E.G. POLICE001 OR APTP0842"
                  value={policeId}
                  onChange={(e) => setPoliceId(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* 2. Registered Mobile Number with +91 Badge */}
            <div className="ap-input-group-row">
              <label className="ap-field-label-text" htmlFor="mobile">
                Registered Mobile Number
              </label>
              <div className="ap-field-input-box">
                <div className="ap-phone-prefix-badge">
                  <Phone size={13} color="#0B4F8A" />
                  <span>+91</span>
                </div>
                <input
                  id="mobile"
                  type="tel"
                  className="ap-custom-text-input"
                  style={{ paddingLeft: '76px' }}
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                />
              </div>
            </div>

            {/* 3. Account Password */}
            <div className="ap-input-group-row">
              <label className="ap-field-label-text" htmlFor="password">
                Account Password
              </label>
              <div className="ap-field-input-box">
                <Lock size={16} className="ap-field-left-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="ap-custom-text-input"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="ap-pwd-visibility-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              
              {/* Subtext & Forgot Password Row */}
              <div className="ap-password-bottom-row">
                <span className="ap-pwd-hint-txt">ⓘ Enter your officer account password.</span>
                <button
                  type="button"
                  className="ap-forgot-link-btn"
                  onClick={() => alert('Password Reset Notice: Contact Systems Admin or call 1233.')}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Remember Credentials Checkbox */}
            <div className="ap-remember-option-row">
              <label className="ap-checkbox-custom-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="ap-checkbox-input"
                />
                <span>Remember Credentials</span>
              </label>
            </div>

            {/* Primary Navy Blue Submit Button */}
            <button 
              type="submit" 
              className="ap-navy-submit-btn" 
              disabled={loading}
            >
              <KeyRound size={16} />
              <span>{loading ? 'AUTHENTICATING...' : 'Log In to Police Control Room'}</span>
            </button>
          </form>

        </div>

        {/* 24/7 Helpline Strip */}
        <div className="ap-card-footer-helpline">
          <a href="tel:1233" className="ap-helpline-link">
            <PhoneCall size={13} color="#0B4F8A" />
            <span>24/7 Police Emergency Helpline: <strong className="ap-helpline-num">1233</strong></span>
          </a>
        </div>

      </div>

      {/* REDUCED FIELD GAPS WITHOUT TOUCHING FONT SIZES OR CHARACTER STYLES */}
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          min-height: 100vh;
        }

        .ap-auth-page-bg {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(180deg, #F0F4F8 0%, #E6EDF5 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 16px;
          box-sizing: border-box;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .ap-auth-card-container {
          width: 100%;
          max-width: 500px;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(11, 37, 69, 0.15);
          border: 1px solid #d9e2ec;
        }

        /* POLICE NAVY BLUE HEADER BANNER */
        .ap-navy-header-banner {
          padding: 12px 16px 10px;
          background: linear-gradient(135deg, #0B2545 0%, #061933 100%);
          border-bottom: 2.5px solid #F0C342;
          text-align: center;
          color: #ffffff;
        }

        .ap-top-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
          background: rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(8px);
          padding: 6px 12px;
          border-radius: 14px;
          border: 1px solid rgba(240, 195, 66, 0.25);
          margin-bottom: 8px;
        }

        @media (max-width: 480px) {
          .ap-top-status-bar {
            justify-content: center;
            gap: 6px;
            padding: 6px 8px;
          }
          .ap-card-body-padding {
            padding: 14px 12px;
          }
          .ap-header-title-main {
            font-size: 1.15rem;
          }
        }

        .ap-status-clock-box {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #ffffff;
          white-space: nowrap;
        }

        .ap-clock-text-wrap {
          display: flex;
          flex-direction: column;
          text-align: left;
          line-height: 1.1;
        }

        .ap-time-txt {
          font-size: 0.775rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.02em;
        }

        .ap-date-txt {
          font-size: 0.65rem;
          font-weight: 600;
          color: #F0C342;
        }

        .ap-language-pill-wrap {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.12);
          padding: 4px 8px;
          border-radius: 20px;
          border: 1px solid rgba(240, 195, 66, 0.3);
          white-space: nowrap;
        }

        .ap-lang-select {
          background: #ffffff;
          color: #0B2545;
          border: none;
          border-radius: 12px;
          padding: 3px 8px;
          font-size: 0.725rem;
          font-weight: 800;
          cursor: pointer;
          outline: none;
        }

        .ap-db-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.15);
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid #34d399;
          font-size: 0.725rem;
          font-weight: 800;
          color: #ffffff;
          white-space: nowrap;
        }

        .ap-db-dot-indicator {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 6px #34d399;
        }

        .ap-emblem-center-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .ap-state-emblem-img {
          height: 52px;
          width: auto;
          object-fit: contain;
          margin-bottom: 2px;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
        }

        .ap-header-title-main {
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          letter-spacing: 0.3px;
        }

        .ap-header-subtitle {
          font-size: 0.8rem;
          color: #F0C342;
          font-weight: 700;
          margin: 2px 0 0;
        }

        /* CARD BODY */
        .ap-card-body-padding {
          padding: 14px 20px;
        }

        .ap-session-banner-box {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          padding: 6px 10px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #0369a1;
        }

        .ap-session-go-btn {
          background: #0284c7;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 4px 10px;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.75rem;
        }

        /* SEGMENTED TABS BAR */
        .ap-segmented-tabs-bar {
          display: flex;
          background: #f1f5f9;
          border-radius: 12px;
          padding: 3px;
          margin-bottom: 10px;
          border: 1px solid #e2e8f0;
        }

        .ap-seg-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .ap-seg-tab-btn.active {
          background: #ffffff;
          color: #0B2545;
          box-shadow: 0 2px 8px rgba(11, 37, 69, 0.1);
        }

        .ap-seg-tab-btn.inactive {
          background: transparent;
          color: #64748b;
        }

        .ap-error-alert-box {
          background: #fef2f2;
          border: 1px solid #fca5a5;
          color: #b91c1c;
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 0.825rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        /* REDUCED FIELD GAP - MARGIN BOTTOM 8px & LABEL MARGIN 3px */
        .ap-input-group-row {
          margin-bottom: 8px;
        }

        .ap-field-label-text {
          display: block;
          font-size: 0.875rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 3px;
        }

        .ap-field-input-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .ap-field-left-icon {
          position: absolute;
          left: 14px;
          color: #64748b;
          pointer-events: none;
        }

        .ap-phone-prefix-badge {
          position: absolute;
          left: 10px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.875rem;
          font-weight: 800;
          color: #0B4F8A;
          background: #f0f7ff;
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid #d0e3ff;
          pointer-events: none;
        }

        .ap-custom-text-input {
          width: 100%;
          height: 48px;
          padding: 10px 42px 10px 42px;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #0f172a;
          background: #ffffff;
          transition: all 0.15s ease;
          box-sizing: border-box;
        }

        .ap-custom-text-input:focus {
          border-color: #0B4F8A;
          outline: none;
          box-shadow: 0 0 0 3.5px rgba(11, 79, 138, 0.15);
        }

        .ap-pwd-visibility-toggle {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
        }

        .ap-password-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2px;
        }

        .ap-pwd-hint-txt {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
        }

        .ap-forgot-link-btn {
          background: none;
          border: none;
          color: #0B4F8A;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
        }

        .ap-remember-option-row {
          margin-bottom: 8px;
        }

        .ap-checkbox-custom-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.825rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
        }

        .ap-checkbox-input {
          accent-color: #0B4F8A;
          width: 16px;
          height: 16px;
        }

        /* POLICE NAVY SUBMIT BUTTON */
        .ap-navy-submit-btn {
          width: 100%;
          height: 48px;
          background: linear-gradient(135deg, #0B4F8A 0%, #061933 100%);
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.3px;
          border: 1px solid #F0C342;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(11, 37, 69, 0.25);
          transition: all 0.15s ease;
        }

        .ap-navy-submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #061933 0%, #030d1a 100%);
          transform: translateY(-1px);
        }

        .ap-card-footer-helpline {
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          padding: 8px;
          text-align: center;
        }

        .ap-helpline-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #334155;
          font-weight: 600;
          text-decoration: none;
        }

        .ap-helpline-num {
          color: #0B4F8A;
          font-weight: 800;
        }
      `}</style>
    </div>
  );
}
