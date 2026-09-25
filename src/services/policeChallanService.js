import { FASTAPI_BASE_URL } from '../config/apiConfig';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialChallanCases } from '../data/caseData';

// Helper for persisting updated status overrides locally so updates survive periodic poll intervals
function getLocalStatusCache() {
  try {
    const raw = localStorage.getItem('police_challans_status_cache');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveLocalStatusCache(id, challanNo, status, remarks = '', reason = '') {
  try {
    const cache = getLocalStatusCache();
    const now = new Date();
    const entry = {
      status,
      remarks,
      reason,
      reviewDate: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      reviewTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    if (id) cache[id] = entry;
    if (challanNo) cache[challanNo] = entry;
    localStorage.setItem('police_challans_status_cache', JSON.stringify(cache));
  } catch (e) {
    console.warn('[Status Cache save error]:', e);
  }
}

/**
 * Fetch ONLY disputed complaints & under-review fines from Supabase dataset
 */
export async function fetchDisputedChallansFromSupabase() {
  let rawComplaints = [];

  // 1. Fetch from FastAPI backend /api/complaints
  try {
    const apiRes = await fetch(`${FASTAPI_BASE_URL}/api/complaints`);
    if (apiRes.ok) {
      const apiJson = await apiRes.json();
      if (apiJson && Array.isArray(apiJson.complaints) && apiJson.complaints.length > 0) {
        rawComplaints = apiJson.complaints;
      }
    }
  } catch (e) {
    console.warn('[Backend Complaints Fetch Warning]:', e);
  }

  // 2. Fetch from Supabase direct client if configured and backend returned nothing
  if ((!rawComplaints || rawComplaints.length === 0) && isSupabaseConfigured) {
    try {
      const { data: complaintsData } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });
      if (complaintsData && complaintsData.length > 0) {
        rawComplaints = complaintsData;
      }
    } catch (e) {
      console.warn('[Supabase Complaints Fetch Warning]:', e);
    }
  }

  let baseList = [];
  if (rawComplaints && rawComplaints.length > 0) {
    for (const cmp of rawComplaints) {
      const trkId = cmp.tracking_id || cmp.complaint_id || (cmp.id ? `CMP-${cmp.id}` : 'CMP-LIVE');
      const chlNo = cmp.challan_id || cmp.challan_number || trkId;

      let currentStatus = 'UNDER REVIEW';
      const rawStatus = (cmp.challan_status || cmp.status || '').toUpperCase().trim();
      if (rawStatus.includes('VERIF') || rawStatus.includes('RESOLV')) {
        currentStatus = 'VERIFIED';
      } else if (rawStatus.includes('REJECT')) {
        currentStatus = 'REJECTED';
      } else if (rawStatus.includes('PENDING')) {
        currentStatus = 'PENDING REVIEW';
      }

      let dtStr = 'Today';
      if (cmp.date_submitted || cmp.created_at) {
        try {
          const dt = new Date(cmp.created_at || cmp.date_submitted);
          if (!isNaN(dt.getTime())) {
            dtStr = dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
          } else {
            dtStr = String(cmp.date_submitted || cmp.created_at);
          }
        } catch (e) {
          dtStr = String(cmp.date_submitted || cmp.created_at);
        }
      }

      const vehMatch = (cmp.description || cmp.detailed_statement || '').match(/(?:AP|TS|DL|MH|KA|TN|KL|GJ|RJ|UP|WB|HR|PB)\s*\d{2}\s*[A-Z]{1,3}\s*\d{4}/i);
      const vehNo = cmp.vehicle_number || cmp.vehicle_no || cmp.vehicleNo || (vehMatch ? vehMatch[0].trim() : chlNo);
      const owner = cmp.user_name || cmp.citizen_name || cmp.owner_name || 'Vehicle Owner';
      const phone = cmp.contact_mobile ? `+91 ${cmp.contact_mobile}` : (cmp.phone || 'N/A');
      const loc = cmp.location_name || cmp.violation_place || 'Enforcement Zone';
      const statementText = cmp.description || cmp.detailed_statement || cmp.dispute_reason || cmp.violation_tagged || 'Dispute claim submitted in portal.';
      const violationText = cmp.violation_tagged || cmp.violation_reason || cmp.claim_category || 'Traffic Violation';

      baseList.push({
        id: trkId,
        challanNo: chlNo,
        challanVehicle: vehNo,
        claimedVehicle: vehNo,
        violation: violationText,
        location: loc,
        reportedDate: dtStr,
        reportedTime: 'Live',
        priority: cmp.priority || 'HIGH',
        status: currentStatus,
        vehicleType: cmp.vehicle_details || 'Vehicle Record',
        ownerName: owner,
        ownerPhone: phone,
        description: statementText,
        mismatchReason: cmp.claim_category || cmp.dispute_reason || statementText,
        evidence: {
          cameraId: cmp.camera_id || 'CCTV-CAM',
          cameraLocation: loc,
          timestamp: dtStr,
          detectedVehicleNumber: vehNo,
          ocrConfidence: 98,
          imagePlaceholder: cmp.camera_image_url || cmp.evidence_file_name || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
          plateCropUrl: cmp.plate_crop_url || null
        },
        officerReview: {
          assignedOfficer: 'K. V. R. Chowdhary',
          policeId: 'POLICE001',
          reviewDate: currentStatus !== 'UNDER REVIEW' ? 'Today' : null,
          reviewTime: currentStatus !== 'UNDER REVIEW' ? 'Just Now' : null,
          remarks: cmp.officer_notes || '',
          rejectionReason: currentStatus === 'REJECTED' ? (cmp.officer_notes || 'False Dispute') : ''
        },
        timeline: [
          { date: dtStr, time: 'Live', title: 'Dispute Complaint Submitted by Citizen', description: statementText }
        ]
      });
    }
  }

  if (!baseList || baseList.length === 0) {
    baseList = initialChallanCases;
  }

  // Apply local status cache overrides so verification/rejection status is retained across polls
  const statusCache = getLocalStatusCache();
  return baseList.map(item => {
    const override = statusCache[item.id] || statusCache[item.challanNo];
    if (override) {
      const isVer = override.status === 'VERIFIED';
      const isRej = override.status === 'REJECTED';
      const titleStr = isVer ? 'Verification Completed' : (isRej ? 'Complaint Rejected' : 'Status Updated');
      const descStr = isVer
        ? `Officer verified claim. Dispute accepted and penalty revoked. ${override.remarks ? `Remarks: ${override.remarks}` : ''}`
        : `Officer rejected complaint due to: ${override.reason || 'Invalid Claim'}. ${override.remarks ? `Remarks: ${override.remarks}` : ''}`;

      const existingTimeline = item.timeline || [];
      const hasActionRecorded = existingTimeline.some(t => t.title.includes('Verification') || t.title.includes('Rejected'));

      return {
        ...item,
        status: override.status,
        officerReview: {
          ...item.officerReview,
          reviewDate: override.reviewDate || 'Today',
          reviewTime: override.reviewTime || 'Just Now',
          remarks: override.remarks || item.officerReview?.remarks || '',
          rejectionReason: override.reason || item.officerReview?.rejectionReason || ''
        },
        timeline: hasActionRecorded ? existingTimeline : [
          {
            date: override.reviewDate || 'Today',
            time: override.reviewTime || 'Just Now',
            title: titleStr,
            description: descStr
          },
          ...existingTimeline
        ]
      };
    }
    return item;
  });
}

/**
 * Verify / Accept Disputed Challan in Supabase & Backend API
 */
export async function verifyChallanInSupabaseDB(id, remarks = '', challanNo = '') {
  const targetChallanNo = challanNo || id;
  const notes = remarks || 'Dispute verified and accepted by Police Officer. Penalty revoked.';

  // 1. Save to local persistent cache immediately
  saveLocalStatusCache(id, targetChallanNo, 'VERIFIED', notes);

  // 2. Post to FastAPI backend API
  try {
    await fetch(`${FASTAPI_BASE_URL}/api/complaints/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id || targetChallanNo, remarks: notes })
    });
  } catch (e) {
    console.warn('[FastAPI Verify Call Warning]:', e);
  }

  // 3. Direct Supabase update if configured
  if (isSupabaseConfigured) {
    try {
      const filterOr = `tracking_id.eq.${id},challan_id.eq.${id},tracking_id.eq.${targetChallanNo},challan_id.eq.${targetChallanNo}`;
      await supabase
        .from('complaints')
        .update({
          challan_status: 'VERIFIED',
          current_stage: 3,
          officer_notes: notes
        })
        .or(filterOr);

      await supabase
        .from('fined_data')
        .update({
          status: 'VERIFIED',
          payment_status: 'CANCELLED'
        })
        .or(`challan_number.eq.${targetChallanNo},detection_id.eq.${targetChallanNo},challan_number.eq.${id}`);
    } catch (e) {
      console.warn('[Supabase Verify Exception]:', e);
    }
  }
}

/**
 * Reject Disputed Challan in Supabase & Backend API
 */
export async function rejectChallanInSupabaseDB(id, reason, remarks = '', challanNo = '') {
  const targetChallanNo = challanNo || id;
  const notes = `Rejected: ${reason || 'Claim Unfounded'}. ${remarks}`.trim();

  // 1. Save to local persistent cache immediately
  saveLocalStatusCache(id, targetChallanNo, 'REJECTED', notes, reason);

  // 2. Post to FastAPI backend API
  try {
    await fetch(`${FASTAPI_BASE_URL}/api/complaints/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id || targetChallanNo, reason: reason, remarks: remarks })
    });
  } catch (e) {
    console.warn('[FastAPI Reject Call Warning]:', e);
  }

  // 3. Direct Supabase update if configured
  if (isSupabaseConfigured) {
    try {
      const filterOr = `tracking_id.eq.${id},challan_id.eq.${id},tracking_id.eq.${targetChallanNo},challan_id.eq.${targetChallanNo}`;
      await supabase
        .from('complaints')
        .update({
          challan_status: 'REJECTED',
          current_stage: 3,
          officer_notes: notes
        })
        .or(filterOr);

      await supabase
        .from('fined_data')
        .update({
          status: 'REJECTED'
        })
        .or(`challan_number.eq.${targetChallanNo},detection_id.eq.${targetChallanNo},challan_number.eq.${id}`);
    } catch (e) {
      console.warn('[Supabase Reject Exception]:', e);
    }
  }
}

/**
 * Fetch Camera Vehicle Detections live from Supabase
 */
export async function fetchDetectionsFromSupabase(fallbackDetections = []) {
  if (!isSupabaseConfigured) {
    return fallbackDetections;
  }

  try {
    const { data: finedData, error } = await supabase
      .from('fined_data')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !finedData || finedData.length === 0) {
      return fallbackDetections;
    }

    const mapped = finedData.map((row, index) => {
      const vehNo = row.vehicle_number || row.vehicle_no || 'AP37AB4567';
      const statusRaw = (row.status || '').toUpperCase();
      let status = 'NORMAL';
      if (statusRaw.includes('MATCH') || statusRaw.includes('REVIEW') || statusRaw.includes('STOLEN') || statusRaw.includes('POTENTIAL')) {
        status = 'POTENTIAL MATCH';
      } else if (statusRaw.includes('PENDING')) {
        status = 'REVIEW REQUIRED';
      }

      return {
        id: row.detection_id || `DET-2026-${String(row.id || index + 400).padStart(5, '0')}`,
        vehicleNo: vehNo,
        cameraId: row.camera_id || `CAM${102 + (index % 5)}`,
        cameraName: row.camera_name || 'Main Road Traffic Camera',
        location: row.location_name || row.location || 'Main Road, Bhimavaram',
        timestamp: row.created_at ? new Date(row.created_at).toLocaleString('en-IN') : '21 Aug 2026, 10:32 AM',
        ocrConfidence: row.ocr_confidence || (90 + (index % 10)),
        status: status,
        matchedStolenId: status === 'POTENTIAL MATCH' ? 'STN-2026-008' : null,
        stolenVehicleNo: status === 'POTENTIAL MATCH' ? vehNo : null,
        matchedModel: row.vehicle_details || 'Hyundai Creta (White)',
        verificationStatus: row.verification_status || (status === 'POTENTIAL MATCH' ? 'OFFICER VERIFICATION REQUIRED' : 'VERIFIED CLEAR'),
        cameraLat: parseFloat(row.latitude) || (16.5449 + (index * 0.002)),
        cameraLng: parseFloat(row.longitude) || (81.5212 + (index * 0.003)),
        imageUrl: row.image_url || row.camera_image_url || null,
        imagePlaceholder: row.image_url || row.camera_image_url || null
      };
    });

    return mapped.length > 0 ? mapped : fallbackDetections;
  } catch (err) {
    console.warn('[Supabase Detections Fetch Error]:', err);
    return fallbackDetections;
  }
}
