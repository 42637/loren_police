import { createContext, useContext, useState } from 'react';
import { initialOfficerProfile } from '../data/policeData';
import { signInOfficer, signUpOfficer } from '../services/policeAuthService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tpcr_user');
    return saved ? JSON.parse(saved) : initialOfficerProfile;
  });

  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (policeId, password, rememberMe = true) => {
    setAuthError('');
    setLoading(true);
    try {
      const { user: officerUser } = await signInOfficer(policeId, password);
      const mob = officerUser.mobile || officerUser.phone || officerUser.contact_phone;
      const formattedMob = mob ? (mob.startsWith('+91') ? mob : `+91 ${mob}`) : '';

      const fullOfficer = { 
        ...initialOfficerProfile, 
        ...officerUser,
        phone: formattedMob || officerUser.phone || initialOfficerProfile.phone,
        mobile: formattedMob || officerUser.mobile || initialOfficerProfile.phone
      };
      setUser(fullOfficer);
      if (rememberMe) {
        localStorage.setItem('tpcr_user', JSON.stringify(fullOfficer));
      }
      setLoading(false);
      return fullOfficer;
    } catch (err) {
      setLoading(false);
      const msg = err.message || 'Invalid Police ID or Password.';
      setAuthError(msg);
      throw err;
    }
  };

  const register = async (officerData) => {
    setAuthError('');
    setLoading(true);
    try {
      const { user: newOfficer } = await signUpOfficer(officerData);
      const mob = newOfficer.mobile || newOfficer.phone || officerData.mobile;
      const formattedMob = mob ? (mob.startsWith('+91') ? mob : `+91 ${mob}`) : '';

      const fullOfficer = { 
        ...initialOfficerProfile, 
        ...newOfficer,
        phone: formattedMob || newOfficer.phone || initialOfficerProfile.phone,
        mobile: formattedMob || newOfficer.mobile || initialOfficerProfile.phone
      };
      setUser(fullOfficer);
      localStorage.setItem('tpcr_user', JSON.stringify(fullOfficer));
      setLoading(false);
      return fullOfficer;
    } catch (err) {
      setLoading(false);
      const msg = err.message || 'Officer registration failed. Please try again.';
      setAuthError(msg);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tpcr_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, authError, setAuthError, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
