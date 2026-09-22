export const initialNotifications = [
  {
    id: "ALT-001",
    title: "Potential Stolen Vehicle Detected",
    description: "Vehicle AP37AB4567 detected at Main Road by CAM102. Match confidence 96%. Verification required.",
    timestamp: "10:32 AM",
    priority: "HIGH",
    read: false,
    category: "Vehicle Match",
    link: "/app/detected/DET-2026-00421"
  },
  {
    id: "ALT-002",
    title: "Challan Complaint Received",
    description: "New dispute complaint CMP-2026-0012 received for Challan CHL-2026-00125.",
    timestamp: "09:45 AM",
    priority: "MEDIUM",
    read: false,
    category: "Challan",
    link: "/app/challans/CMP-2026-0012"
  },
  {
    id: "ALT-003",
    title: "Vehicle Registered as Stolen",
    description: "FIR-2026-00231 registered for Hyundai Creta (AP37AB4567) at Bhimavaram PS.",
    timestamp: "08:30 AM",
    priority: "MEDIUM",
    read: true,
    category: "Stolen",
    link: "/app/stolen/STN-2026-008"
  },
  {
    id: "ALT-004",
    title: "Camera Sensor Offline Alert",
    description: "CAM108 Railway Station Approach sensor entered maintenance mode.",
    timestamp: "08:15 AM",
    priority: "LOW",
    read: true,
    category: "Camera",
    link: "/app/alerts"
  }
];
