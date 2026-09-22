import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ChevronDown,
  PhoneCall,
  Shield,
  Mail,
  Phone,
  Clock,
  Globe,
  Database,
  KeyRound,
  UserPlus,
  CheckCircle2,
  Building,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import headerLogo from '../assets/header_logo.png';

export default function RegisterPage() {
  const [regFullName, setRegFullName] = useState('');
  const [regPoliceId, setRegPoliceId] = useState('');
  const [regRank, setRegRank] = useState('Inspector of Police');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regStation, setRegStation] = useState('Bhimavaram Traffic PS');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [currentLang, setCurrentLang] = useState('en');

  // OTP Verification Modal State (Default OTP 123456 prefilled for current version)
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState(['1', '2', '3', '4', '5', '6']);
  const [otpError, setOtpError] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);

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

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  // OTP Countdown timer
  useEffect(() => {
    let interval = null;
    if (showOtpModal && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, otpTimer]);

  const isValidGmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test((email || '').trim());
  };

  const validatePasswordSecurity = (pwd) => {
    const p = pwd || '';
    const minLength = p.length >= 8;
    const hasUpper = /[A-Z]/.test(p);
    const hasLower = /[a-z]/.test(p);
    const hasNumber = /[0-9]/.test(p);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(p);
    const isValid = minLength && hasUpper && hasLower && hasNumber && hasSpecial;
    return { isValid, minLength, hasUpper, hasLower, hasNumber, hasSpecial };
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    if (!regFullName.trim() || !regPoliceId.trim() || !regEmail.trim() || !regMobile.trim() || !regPassword) {
      setRegError('Please fill in all registration fields including your Police ID, Gmail, and password.');
      return;
    }

    if (!isValidGmail(regEmail)) {
      setRegError('Official Registration requires a valid Gmail address (must end with @gmail.com).');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Password and Confirm Password do not match.');
      return;
    }

    const pwdSec = validatePasswordSecurity(regPassword);
    if (!pwdSec.isValid) {
      setRegError('Password violates security policy. Ensure it has 8+ characters, uppercase, lowercase, digit, and special character.');
      return;
    }

    // Trigger OTP Verification Modal with Default OTP 123456
    setOtpTimer(30);
    setOtpValue(['1', '2', '3', '4', '5', '6']);
    setOtpError('');
    setShowOtpModal(true);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValue];
    newOtp[index] = value;
    setOtpValue(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`police-reg-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValue[index] && index > 0) {
      const prevInput = document.getElementById(`police-reg-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const verifyOtpAndCompleteRegister = async () => {
    const entered = otpValue.join('');
    if (entered.length < 6) {
      setOtpError('Please enter full 6-digit verification code.');
      return;
    }

    setOtpError('');
    try {
      const officerData = {
        fullName: regFullName.trim(),
        policeId: regPoliceId.trim().toUpperCase(),
        badgeNumber: regPoliceId.trim().toUpperCase(),
        rank: regRank,
        email: regEmail.trim().toLowerCase(),
        mobile: regMobile.trim(),
        password: regPassword,
        station: regStation
      };

      await register(officerData);
      setShowOtpModal(false);
      navigate('/app');
    } catch (err) {
      setOtpError(err.message || 'Verification failed. Please try again.');
    }
  };

  const pwdChecks = validatePasswordSecurity(regPassword);

  return (
    <div className="ap-auth-page-bg">
      <div className="ap-auth-card-container">
        
        {/* TOP POLICE NAVY BLUE HEADER BANNER */}
        <div className="ap-navy-header-banner">
          
          {/* Top Status Bar: Clock, Language, Supabase Badge */}
          <div className="ap-top-status-bar">
            
            {/* Live Time & Date */}
            <div className="ap-status-clock-box">
              <Clock size={14} color="#F0C342" />
              <div className="ap-clock-text-wrap">
                <span className="ap-time-txt">{formattedTime}</span>
                <span className="ap-date-txt">{formattedDate}</span>
              </div>
            </div>

            {/* Language Selector Pill */}
            <div className="ap-language-pill-wrap">
              <Globe size={13} color="#F0C342" />
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
              <Database size={13} color="#34d399" />
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
              Register Police Officer Profile
            </h1>
            <p className="ap-header-subtitle">
              Saves to `registered_police` Table in Supabase
            </p>
          </div>

        </div>

        {/* CARD BODY CONTENT */}
        <div className="ap-card-body-padding">
          
          {/* Segmented Auth Mode Switcher Tabs */}
          <div className="ap-segmented-tabs-bar">
            <Link
              to="/login"
              className="ap-seg-tab-btn inactive"
            >
              <KeyRound size={16} color="#94a3b8" />
              <span>Log In</span>
            </Link>
            <button
              type="button"
              className="ap-seg-tab-btn active"
            >
              <UserPlus size={16} color="#0B4F8A" />
              <span>Register Officer</span>
            </button>
          </div>

          {/* Form Error Alert */}
          {regError && (
            <div className="ap-error-alert-box" role="alert">
              <AlertCircle size={16} />
              <span>{regError}</span>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit}>
            {/* Officer Full Name */}
            <div className="ap-input-group-row">
              <label className="ap-field-label-text" htmlFor="regFullName">
                Officer Full Name
              </label>
              <div className="ap-field-input-box">
                <User size={18} className="ap-field-left-icon" />
                <input
                  id="regFullName"
                  type="text"
                  className="ap-custom-text-input"
                  placeholder="e.g. Inspector K. V. Sharma"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Police ID & Rank Grid */}
            <div className="ap-2col-grid">
              <div className="ap-input-group-row">
                <label className="ap-field-label-text" htmlFor="regPoliceId">
                  Police ID
                </label>
                <div className="ap-field-input-box">
                  <Shield size={18} className="ap-field-left-icon" />
                  <input
                    id="regPoliceId"
                    type="text"
                    className="ap-custom-text-input"
                    placeholder="E.G. POLICE002"
                    value={regPoliceId}
                    onChange={(e) => setRegPoliceId(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>

              <div className="ap-input-group-row">
                <label className="ap-field-label-text" htmlFor="regRank">
                  Rank / Designation
                </label>
                <div className="ap-field-input-box">
                  <select
                    id="regRank"
                    className="ap-custom-select-input"
                    value={regRank}
                    onChange={(e) => setRegRank(e.target.value)}
                  >
                    <option value="Inspector of Police">Inspector of Police</option>
                    <option value="Sub-Inspector (SI)">Sub-Inspector (SI)</option>
                    <option value="Assistant Sub-Inspector (ASI)">Assistant Sub-Inspector (ASI)</option>
                    <option value="Head Constable (HC)">Head Constable (HC)</option>
                    <option value="Police Constable (PC)">Police Constable (PC)</option>
                  </select>
                  <ChevronDown size={16} className="ap-select-right-arrow" />
                </div>
              </div>
            </div>

            {/* Official Email & Mobile Number 2-col Grid */}
            <div className="ap-2col-grid">
              <div className="ap-input-group-row">
                <label className="ap-field-label-text" htmlFor="regEmail">
                  Official Gmail (@gmail.com)
                </label>
                <div className="ap-field-input-box">
                  <Mail size={15} className="ap-field-left-icon" />
                  <input
                    id="regEmail"
                    type="email"
                    className="ap-custom-text-input"
                    placeholder="officer@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="ap-input-group-row">
                <label className="ap-field-label-text" htmlFor="regMobile">
                  Mobile Number
                </label>
                <div className="ap-field-input-box">
                  <div className="ap-phone-prefix-badge">
                    <Phone size={13} color="#0B4F8A" />
                    <span>+91</span>
                  </div>
                  <input
                    id="regMobile"
                    type="tel"
                    className="ap-custom-text-input"
                    style={{ paddingLeft: '76px' }}
                    placeholder="10-digit mobile"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="ap-2col-grid">
              <div className="ap-input-group-row">
                <label className="ap-field-label-text" htmlFor="regPassword">
                  Create Password
                </label>
                <div className="ap-field-input-box">
                  <Lock size={15} className="ap-field-left-icon" />
                  <input
                    id="regPassword"
                    type={showRegPassword ? 'text' : 'password'}
                    className="ap-custom-text-input"
                    placeholder="Create password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="ap-pwd-visibility-toggle"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                  >
                    {showRegPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="ap-input-group-row">
                <label className="ap-field-label-text" htmlFor="regConfirmPassword">
                  Confirm Password
                </label>
                <div className="ap-field-input-box">
                  <Lock size={15} className="ap-field-left-icon" />
                  <input
                    id="regConfirmPassword"
                    type={showRegPassword ? 'text' : 'password'}
                    className="ap-custom-text-input"
                    placeholder="Confirm password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Policy Indicator */}
            {regPassword && (
              <div className="ap-policy-check-container">
                <div className="ap-policy-check-title">Password Security Policy Requirements:</div>
                <div className="ap-policy-check-grid">
                  <span className={pwdChecks.minLength ? 'valid' : 'invalid'}>
                    {pwdChecks.minLength ? '✓' : '•'} Min 8 characters
                  </span>
                  <span className={pwdChecks.hasUpper ? 'valid' : 'invalid'}>
                    {pwdChecks.hasUpper ? '✓' : '•'} Uppercase (A-Z)
                  </span>
                  <span className={pwdChecks.hasLower ? 'valid' : 'invalid'}>
                    {pwdChecks.hasLower ? '✓' : '•'} Lowercase (a-z)
                  </span>
                  <span className={pwdChecks.hasNumber ? 'valid' : 'invalid'}>
                    {pwdChecks.hasNumber ? '✓' : '•'} Number (0-9)
                  </span>
                  <span className={pwdChecks.hasSpecial ? 'valid' : 'invalid'}>
                    {pwdChecks.hasSpecial ? '✓' : '•'} Special char (@, #, $, %)
                  </span>
                </div>
              </div>
            )}

            {/* Division Select */}
            <div className="ap-input-group-row" style={{ marginTop: '4px' }}>
              <label className="ap-field-label-text" htmlFor="regStation">
                Assigned Police Station / Division
              </label>
              <div className="ap-field-input-box">
                <Building size={15} className="ap-field-left-icon" />
                <select
                  id="regStation"
                  className="ap-custom-select-input"
                  style={{ paddingLeft: '32px' }}
                  value={regStation}
                  onChange={(e) => setRegStation(e.target.value)}
                >
                  <option value="Bhimavaram Traffic PS">Bhimavaram Traffic PS</option>
                  <option value="Vijayawada Central PS">Vijayawada Central PS</option>
                  <option value="Visakhapatnam Traffic PS">Visakhapatnam Traffic PS</option>
                  <option value="Guntur Traffic Division">Guntur Traffic Division</option>
                  <option value="Tirupati Traffic PS">Tirupati Traffic PS</option>
                </select>
                <ChevronDown size={14} className="ap-select-right-arrow" />
              </div>
            </div>

            {/* Primary Navy Blue Submit Button */}
            <button 
              type="submit" 
              className="ap-navy-submit-btn" 
              style={{ marginTop: '6px' }}
              disabled={loading}
            >
              <KeyRound size={15} />
              <span>Proceed to OTP Verification</span>
            </button>
          </form>

        </div>

        {/* 24/7 Helpline Strip */}
        <div className="ap-card-footer-helpline">
          <a href="tel:1233" className="ap-helpline-link">
            <PhoneCall size={12} color="#0B4F8A" />
            <span>24/7 Police Emergency Helpline: <strong className="ap-helpline-num">1233</strong></span>
          </a>
        </div>

      </div>

      {/* 6-DIGIT OTP VERIFICATION MODAL */}
      {showOtpModal && (
        <div className="police-modal-overlay">
          <div className="police-modal-card">
            <button 
              type="button" 
              className="police-modal-close"
              onClick={() => setShowOtpModal(false)}
            >
              <X size={18} />
            </button>

            <div className="police-modal-header">
              <div className="police-modal-icon-wrap">
                <KeyRound size={22} color="#0B4F8A" />
              </div>
              <h3 className="police-modal-title">OFFICER VERIFICATION OTP</h3>
              <p className="police-modal-desc">
                Default verification code <strong>123456</strong> is auto-filled for testing. (Live SMS/Email OTP will be integrated in future release).
              </p>
            </div>

            {otpError && (
              <div className="ap-error-alert-box" style={{ marginBottom: '10px' }}>
                <AlertCircle size={14} />
                <span>{otpError}</span>
              </div>
            )}

            {/* OTP Input Boxes */}
            <div className="police-otp-box-row">
              {otpValue.map((digit, idx) => (
                <input
                  key={idx}
                  id={`police-reg-otp-${idx}`}
                  type="text"
                  maxLength={1}
                  className="police-otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            {/* Timer & Resend */}
            <div className="police-otp-timer-row">
              {otpTimer > 0 ? (
                <span className="police-timer-txt">Resend OTP available in <strong>{otpTimer}s</strong></span>
              ) : (
                <button 
                  type="button" 
                  className="police-resend-btn"
                  onClick={() => {
                    setOtpTimer(30);
                    setOtpValue(['1', '2', '3', '4', '5', '6']);
                  }}
                >
                  Resend Default OTP (123456)
                </button>
              )}
            </div>

            {/* Submit Verification */}
            <button
              type="button"
              className="ap-navy-submit-btn"
              onClick={verifyOtpAndCompleteRegister}
              disabled={loading}
            >
              <CheckCircle2 size={16} />
              <span>{loading ? 'VERIFYING...' : 'Verify & Complete Registration'}</span>
            </button>

            <div className="police-db-badge">
              <Database size={12} color="#34d399" />
              <span>Data will be securely saved to `registered_police` in Supabase</span>
            </div>
          </div>
        </div>
      )}

      {/* MATCHING USERNEW AUTHMODAL EXACT STYLES */}
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
          padding: 24px 16px;
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
          padding: 20px 20px 18px;
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
          background: rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(8px);
          padding: 8px 14px;
          border-radius: 16px;
          border: 1px solid rgba(240, 195, 66, 0.25);
          margin-bottom: 16px;
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
          gap: 4px;
        }

        .ap-state-emblem-img {
          height: 56px;
          width: auto;
          object-fit: contain;
          margin-bottom: 4px;
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
          padding: 24px;
        }

        .ap-2col-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* SEGMENTED TABS BAR */
        .ap-segmented-tabs-bar {
          display: flex;
          background: #f1f5f9;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 22px;
          border: 1px solid #e2e8f0;
        }

        .ap-seg-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
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

        .ap-custom-select-input {
          width: 100%;
          height: 48px;
          padding: 10px 36px 10px 14px;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #0f172a;
          background: #ffffff;
          appearance: none;
          cursor: pointer;
          box-sizing: border-box;
        }

        .ap-custom-select-input:focus {
          border-color: #0B4F8A;
          outline: none;
        }

        .ap-select-right-arrow {
          position: absolute;
          right: 14px;
          color: #64748b;
          pointer-events: none;
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

        .ap-policy-check-container {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 10px;
          margin-top: 2px;
        }

        .ap-policy-check-title {
          font-size: 0.725rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 4px;
        }

        .ap-policy-check-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          font-size: 0.7rem;
        }

        .ap-policy-check-grid .valid {
          color: #166534;
          font-weight: 700;
        }

        .ap-policy-check-grid .invalid {
          color: #94a3b8;
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
          gap: 10px;
          box-shadow: 0 4px 14px rgba(11, 37, 69, 0.25);
          transition: all 0.15s ease;
        }

        .ap-navy-submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #061933 0%, #030d1a 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(11, 37, 69, 0.35);
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

        /* OTP MODAL */
        .police-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          padding: 16px;
        }

        .police-modal-card {
          background: #FFFFFF;
          border-radius: 14px;
          width: 100%;
          max-width: 440px;
          padding: 28px 24px;
          position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .police-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          background: #F1F5F9;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          cursor: pointer;
        }

        .police-modal-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .police-modal-icon-wrap {
          width: 56px;
          height: 56px;
          background: #f0f7ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
        }

        .police-modal-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 6px;
        }

        .police-modal-desc {
          font-size: 0.825rem;
          color: #475569;
          line-height: 1.4;
          margin: 0;
        }

        .police-otp-box-row {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .police-otp-input {
          width: 46px;
          height: 52px;
          text-align: center;
          font-size: 1.3rem;
          font-weight: 800;
          color: #0F172A;
          border: 2px solid #CBD5E1;
          border-radius: 8px;
          background: #F8FAFC;
        }

        .police-otp-input:focus {
          border-color: #0B4F8A;
          background: #FFFFFF;
          outline: none;
          box-shadow: 0 0 0 3px rgba(11, 79, 138, 0.15);
        }

        .police-otp-timer-row {
          text-align: center;
          font-size: 0.8rem;
          color: #64748B;
          margin-bottom: 20px;
        }

        .police-resend-btn {
          background: none;
          border: none;
          color: #0B4F8A;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
        }

        .police-db-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.725rem;
          color: #64748B;
          margin-top: 14px;
          text-align: center;
        }

        @media (max-width: 480px) {
          .ap-2col-grid {
            grid-template-columns: 1fr;
          }
          .police-otp-input {
            width: 38px;
            height: 44px;
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}
