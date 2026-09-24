import { FASTAPI_BASE_URL } from '../config/apiConfig';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Sign In Police Officer via FastAPI Backend, Supabase, or Local Storage
 */
export async function signInOfficer(policeId, password) {
  const cleanId = policeId.trim();

  // 1. Try FastAPI Backend First
  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: cleanId, password })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success' && data.user) {
        return { user: data.user, source: 'FastAPI Backend' };
      }
    } else {
      const errData = await res.json().catch(() => ({}));
      if (errData.detail) {
        throw new Error(errData.detail);
      }
    }
  } catch (err) {
    if (err.message && !err.message.includes('Failed to fetch')) {
      throw err; // Re-throw security lockouts or invalid password errors
    }
    console.warn('[FastAPI Officer Login Warning]: Server unreachable, attempting Supabase fallback...', err);
  }

  // 2. Default Demo Credentials Fallback
  if (cleanId.toUpperCase() === 'POLICE001' && password === 'police123') {
    return {
      user: {
        name: 'K. V. R. Chowdhary',
        policeId: 'POLICE001',
        badgeNumber: 'AP-TP-0842',
        rank: 'Inspector of Police',
        station: 'Bhimavaram Traffic PS',
        mobile: '+91 9848022334',
        email: 'officer.chowdhary@appolice.gov.in'
      },
      source: 'Default Credentials'
    };
  }

  // 3. Check Local Storage Registered Officers
  try {
    const localOfficers = JSON.parse(localStorage.getItem('registered_police_officers_db') || '[]');
    const match = localOfficers.find(o => 
      (o.policeId && o.policeId.toUpperCase() === cleanId.toUpperCase()) ||
      (o.email && o.email.toLowerCase() === cleanId.toLowerCase()) ||
      (o.mobile && o.mobile.includes(cleanId))
    );
    if (match) {
      if (match.password && match.password !== password) {
        throw new Error('Incorrect password for police officer account.');
      }
      return { user: match, source: 'Local DB' };
    }
  } catch (e) {
    console.warn('[Local Storage Check Notice]:', e);
  }

  // 4. Try Supabase Direct Query on 'registered_police' table
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('registered_police')
        .select('*')
        .or(`police_id.ilike.%${cleanId}%,email.eq.${cleanId},mobile.eq.${cleanId}`)
        .limit(1);

      if (data && data.length > 0) {
        const record = data[0];
        if (record.password && record.password !== password) {
          throw new Error('Incorrect password for police officer account.');
        }
        const formattedMob = record.mobile 
          ? (record.mobile.startsWith('+91') ? record.mobile : `+91 ${record.mobile}`) 
          : '';

        return {
          user: {
            name: record.full_name || 'Officer',
            policeId: record.police_id || record.vehicle_number || cleanId,
            badgeNumber: record.badge_number || record.dl_number || 'AP-TP-0000',
            rank: record.rank || record.vehicle_class || 'Inspector of Police',
            station: record.station || record.address || 'Traffic Police PS',
            mobile: formattedMob,
            phone: formattedMob,
            email: record.email
          },
          source: 'Supabase registered_police'
        };
      }
    } catch (sbErr) {
      console.warn('[Supabase Direct Auth Warning]:', sbErr);
    }
  }

  throw new Error('Officer ID or registration record not found. Please verify details or register.');
}

/**
 * Register New Police Officer in FastAPI Backend, Supabase & Local Storage
 */
export async function signUpOfficer(officerData) {
  const cleanEmail = officerData.email.trim().toLowerCase ? officerData.email.trim().toLowerCase() : officerData.email.trim();
  const policeId = officerData.policeId.trim().toUpperCase();

  const policeRecord = {
    police_id: policeId,
    full_name: officerData.fullName || officerData.name,
    rank: officerData.rank || 'Inspector of Police',
    badge_number: officerData.badgeNumber || policeId,
    email: cleanEmail,
    mobile: officerData.mobile,
    password: officerData.password,
    station: officerData.station || 'Bhimavaram Traffic PS',
    address: officerData.station || 'Bhimavaram Traffic PS'
  };

  const formattedRegMob = policeRecord.mobile
    ? (policeRecord.mobile.startsWith('+91') ? policeRecord.mobile : `+91 ${policeRecord.mobile}`)
    : '';

  const clientUserObj = {
    name: policeRecord.full_name,
    policeId: policeRecord.police_id,
    badgeNumber: policeRecord.badge_number,
    rank: policeRecord.rank,
    station: policeRecord.station,
    mobile: formattedRegMob,
    phone: formattedRegMob,
    email: policeRecord.email,
    password: policeRecord.password
  };

  // 1. Save to Local Storage First
  try {
    const localOfficers = JSON.parse(localStorage.getItem('registered_police_officers_db') || '[]');
    const existingIndex = localOfficers.findIndex(o => o.policeId === policeId || o.email === cleanEmail);
    if (existingIndex >= 0) {
      localOfficers[existingIndex] = { ...localOfficers[existingIndex], ...clientUserObj };
    } else {
      localOfficers.push(clientUserObj);
    }
    localStorage.setItem('registered_police_officers_db', JSON.stringify(localOfficers));
  } catch (e) {
    console.warn('[Local Storage Save Warning]:', e);
  }

  // 2. Call FastAPI Backend API
  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policeRecord)
    });
    if (res.ok) {
      const apiRes = await res.json();
      console.log('[FastAPI Officer Register Success]:', apiRes);
    }
  } catch (err) {
    console.warn('[FastAPI Register Warning]: Server unreachable, proceeding with client DB sync...', err);
  }

  // 3. Direct Supabase DB Save into 'registered_police' table
  if (isSupabaseConfigured) {
    try {
      const { error: err1 } = await supabase.from('registered_police').insert([policeRecord]);
      if (err1) {
        await supabase.from('registered_police').update(policeRecord).eq('police_id', policeId);
      }
    } catch (sbErr) {
      console.warn('[Supabase Direct Register Warning]:', sbErr);
    }
  }

  return { success: true, user: clientUserObj };
}
