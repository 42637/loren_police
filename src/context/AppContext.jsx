import { createContext, useContext, useState, useEffect } from 'react';
import { initialChallanCases } from '../data/caseData';
import { initialStolenVehicles } from '../data/stolenVehicleData';
import { initialDetections } from '../data/detectionData';
import { initialCameras } from '../data/cameraData';
import { initialNotifications } from '../data/notificationData';
import { 
  fetchDisputedChallansFromSupabase, 
  verifyChallanInSupabaseDB, 
  rejectChallanInSupabaseDB 
} from '../services/policeChallanService';

const AppContext = createContext(null);

const initialActivities = [
  {
    id: "ACT-101",
    type: "MATCH",
    title: "Potential stolen vehicle match",
    description: "AP37AB4567 detected near Main Road",
    time: "10:32 AM",
    status: "POTENTIAL MATCH"
  },
  {
    id: "ACT-102",
    type: "COMPLAINT",
    title: "Challan complaint received",
    description: "CMP-2026-0012 for CHL-2026-00125",
    time: "09:45 AM",
    status: "PENDING REVIEW"
  },
  {
    id: "ACT-103",
    type: "STOLEN",
    title: "Vehicle registered as stolen",
    description: "FIR-2026-00231 (AP37AB4567)",
    time: "08:30 AM",
    status: "ACTIVE"
  },
  {
    id: "ACT-104",
    type: "VERIFIED",
    title: "Verification completed",
    description: "Challan dispute CMP-2026-0008 approved & cancelled",
    time: "08:15 AM",
    status: "VERIFIED"
  }
];

export function AppProvider({ children }) {
  const [challans, setChallans] = useState([]);
  const [stolenVehicles, setStolenVehicles] = useState(initialStolenVehicles);
  const [detections, setDetections] = useState(initialDetections);
  const [cameras] = useState(initialCameras);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activities, setActivities] = useState(initialActivities);

  // Load Disputed Complaints from Supabase
  const refreshDisputedChallans = async () => {
    const liveData = await fetchDisputedChallansFromSupabase();
    if (Array.isArray(liveData)) {
      setChallans(liveData);
    }
  };

  useEffect(() => {
    refreshDisputedChallans();
    const interval = setInterval(refreshDisputedChallans, 3000); // Live sync every 3 seconds from Supabase
    return () => clearInterval(interval);
  }, []);

  // Helper to add activity log
  const addActivity = (item) => {
    setActivities((prev) => [
      { id: `ACT-${Date.now()}`, ...item },
      ...prev
    ]);
  };

  // 1. Verify Disputed Challan
  const verifyChallan = (id, remarks = '') => {
    const targetItem = challans.find(c => c.id === id || c.challanNo === id);
    const targetChallanNo = targetItem?.challanNo || id;

    verifyChallanInSupabaseDB(id, remarks, targetChallanNo);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    setChallans((prev) =>
      prev.map((item) => {
        if (item.id === id || item.challanNo === id) {
          const updatedTimeline = [
            {
              date: dateStr,
              time: timeStr,
              title: "Verification Completed",
              description: `Officer verified claim. Dispute accepted and penalty revoked. ${remarks ? `Remarks: ${remarks}` : ''}`
            },
            ...(item.timeline || [])
          ];
          return {
            ...item,
            status: "VERIFIED",
            officerReview: {
              ...item.officerReview,
              reviewDate: dateStr,
              reviewTime: timeStr,
              remarks: remarks || "Claim verified by reviewing officer."
            },
            timeline: updatedTimeline
          };
        }
        return item;
      })
    );

    addActivity({
      type: "VERIFIED",
      title: "Verification completed",
      description: `Challan dispute ${id} verified`,
      time: timeStr,
      status: "VERIFIED"
    });
  };

  // 2. Reject Disputed Challan
  const rejectChallan = (id, reason, remarks = '') => {
    const targetItem = challans.find(c => c.id === id || c.challanNo === id);
    const targetChallanNo = targetItem?.challanNo || id;

    rejectChallanInSupabaseDB(id, reason, remarks, targetChallanNo);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    setChallans((prev) =>
      prev.map((item) => {
        if (item.id === id || item.challanNo === id) {
          const updatedTimeline = [
            {
              date: dateStr,
              time: timeStr,
              title: "Complaint Rejected",
              description: `Officer rejected complaint due to: ${reason}. ${remarks ? `Remarks: ${remarks}` : ''}`
            },
            ...(item.timeline || [])
          ];
          return {
            ...item,
            status: "REJECTED",
            officerReview: {
              ...item.officerReview,
              reviewDate: dateStr,
              reviewTime: timeStr,
              rejectionReason: reason,
              remarks: remarks || `Rejected: ${reason}`
            },
            timeline: updatedTimeline
          };
        }
        return item;
      })
    );

    addActivity({
      type: "REJECTED",
      title: "Complaint rejected",
      description: `Challan dispute ${id} rejected (${reason})`,
      time: timeStr,
      status: "REJECTED"
    });
  };

  // 3. Register Stolen Vehicle
  const registerStolenVehicle = (formData) => {
    const newId = `STN-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newRecord = {
      id: newId,
      registrationNo: formData.registrationNo.toUpperCase(),
      make: formData.make,
      model: formData.model,
      variant: formData.variant || '',
      color: formData.color,
      fuelType: formData.fuelType || 'Petrol',
      firNumber: formData.firNumber,
      complaintId: formData.complaintId || `CMP-${Math.floor(100 + Math.random() * 900)}`,
      policeStation: formData.policeStation || 'Bhimavaram Traffic PS',
      district: formData.district || 'West Godavari',
      zone: formData.zone || 'Zone A',
      reportDate: dateStr,
      reportTime: timeStr,
      ownerName: formData.ownerName,
      ownerContact: formData.ownerContact,
      lastKnownLocation: formData.lastKnownLocation,
      identifyingFeatures: formData.identifyingFeatures || 'None specified',
      status: "ACTIVE",
      detections: []
    };

    setStolenVehicles((prev) => [newRecord, ...prev]);

    // Add alert notification
    setNotifications((prev) => [
      {
        id: `ALT-${Date.now()}`,
        title: "New Stolen Vehicle Registered",
        description: `Vehicle ${newRecord.registrationNo} (${newRecord.make} ${newRecord.model}) registered under ${newRecord.firNumber}`,
        timestamp: timeStr,
        priority: "HIGH",
        read: false,
        category: "Stolen",
        link: `/app/stolen/${newId}`
      },
      ...prev
    ]);

    addActivity({
      type: "STOLEN",
      title: "Vehicle registered as stolen",
      description: `${newRecord.registrationNo} (${newRecord.firNumber})`,
      time: timeStr,
      status: "ACTIVE"
    });

    return newId;
  };

  // 4. Update Stolen Vehicle Status
  const updateStolenStatus = (id, newStatus) => {
    setStolenVehicles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  // 5. Verify Detection Match
  const verifyDetection = (detectionId, isMatchConfirmed) => {
    setDetections((prev) =>
      prev.map((item) => {
        if (item.id === detectionId) {
          return {
            ...item,
            verificationStatus: isMatchConfirmed ? "VERIFIED MATCH" : "REJECTED MATCH",
            status: isMatchConfirmed ? "POTENTIAL MATCH" : "NORMAL"
          };
        }
        return item;
      })
    );
  };

  // 6. Notification actions
  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        challans,
        stolenVehicles,
        detections,
        cameras,
        notifications,
        activities,
        verifyChallan,
        rejectChallan,
        registerStolenVehicle,
        updateStolenStatus,
        verifyDetection,
        markNotificationAsRead,
        markAllNotificationsAsRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
