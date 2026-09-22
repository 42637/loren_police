// src/services/policeChallanService.js
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialChallanCases } from '../data/caseData';

const FASTAPI_BASE_URL = (import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8000').replace(/\/$/, '');

/**
 * Fetch ONLY disputed complaints & under-review fines from Supabase dataset
 */
export async function fetchDisputedChallansFromSupabase() {
  if (!isSupabaseConfigured) {
    return initialChallanCases;
  }

  try {
    // 1. Fetch complaints table records from Supabase
    const { data: complaintsData, error: cmpErr } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    // 2. Fetch fined_data records with status UNDER_REVIEW, UNDER REVIEW, PENDING REVIEW, DISPUTED, VERIFIED, REJECTED
    const { data: finedData, error: finedErr } = await supabase
      .from('fined_data')
      .select('*')
      .or('status.ilike.%review%,status.ilike.%disputed%,status.ilike.%verified%,status.ilike.%rejected%')
      .order('created_at', { ascending: false });

    // Index fined_data by challan_number & detection_id for instant enrichment
    const finedMap = new Map();
    if (finedData && finedData.length > 0) {
      for (const f of finedData) {
        if (f.challan_number) finedMap.set(f.challan_number, f);
        if (f.detection_id) finedMap.set(f.detection_id, f);
        if (f.id) finedMap.set(String(f.id), f);
      }
    }

    const mergedList = [];
    const processedIds = new Set();

    // Format Complaints Records
    if (complaintsData && complaintsData.length > 0) {
      for (const cmp of complaintsData) {
        const trkId = cmp.tracking_id || cmp.complaint_id || `CMP-${cmp.id}`;
        processedIds.add(cmp.challan_id);
        processedIds.add(trkId);

        const matchingFine = finedMap.get(cmp.challan_id) || {};

        let dtStr = 'Just Now';
        if (cmp.created_at || cmp.date_submitted) {
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

        let currentStatus = 'UNDER REVIEW';
        const rawStatus = (cmp.challan_status || cmp.status || '').toUpperCase().trim();
        if (rawStatus.includes('VERIF') || rawStatus.includes('RESOLV')) {
          currentStatus = 'VERIFIED';
        } else if (rawStatus.includes('REJECT')) {
          currentStatus = 'REJECTED';
        } else if (rawStatus.includes('PENDING')) {
          currentStatus = 'PENDING REVIEW';
        }

        const vehMatch = (cmp.description || '').match(/(?:AP|TS|DL|MH|KA|TN|KL|GJ|RJ|UP|WB|HR|PB)\s*\d{2}\s*[A-Z]{1,3}\s*\d{4}/i) || (cmp.description || '').match(/\[Vehicle:\s*([^\]]+)\]/i);
        const extractedVeh = vehMatch ? (vehMatch[1] || vehMatch[0]).trim() : null;
        const vehNo = cmp.vehicle_number || matchingFine.vehicle_number || extractedVeh || 'AP37 BT 6797';
        const owner = cmp.user_name || cmp.citizen_name || matchingFine.owner_name || 'Rajesh Kumar Varma';
        const phone = cmp.contact_mobile ? `+91 ${cmp.contact_mobile}` : (matchingFine.owner_mobile ? `+91 ${matchingFine.owner_mobile}` : '+91 9848022334');
        const loc = cmp.location_name || cmp.violation_place || matchingFine.location_name || 'Janpath Intersection, Vijayawada';
        const img = cmp.camera_image_url || matchingFine.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80';

        mergedList.push({
          id: trkId,
          challanNo: cmp.challan_id || 'CHL-2026-8821',
          challanVehicle: vehNo,
          claimedVehicle: vehNo,
          violation: cmp.violation_tagged || cmp.violation_reason || matchingFine.violation_type || 'Traffic Violation Recorded',
          location: loc,
          reportedDate: dtStr,
          reportedTime: '10:15 AM',
          priority: 'HIGH',
          status: currentStatus,
          vehicleType: cmp.vehicle_details || matchingFine.vehicle_details || 'Vehicle / 2-Wheeler',
          ownerName: owner,
          ownerPhone: phone,
          description: cmp.description || cmp.claim_category || 'Dispute raised by citizen.',
          mismatchReason: cmp.description || cmp.claim_category || 'Dispute raised by citizen.',
          evidence: {
            cameraId: matchingFine.camera_id || 'CAM-VJW-09',
            cameraLocation: loc,
            timestamp: dtStr,
            detectedVehicleNumber: vehNo,
            ocrConfidence: 98,
            imagePlaceholder: img,
            plateCropUrl: matchingFine.plate_crop_url
          },
          officerReview: {
            assignedOfficer: 'Officer Ravi Kumar',
            policeId: 'POLICE001',
            reviewDate: currentStatus !== 'UNDER REVIEW' ? 'Today' : null,
            reviewTime: currentStatus !== 'UNDER REVIEW' ? 'Just Now' : null,
            remarks: cmp.officer_notes || '',
            rejectionReason: currentStatus === 'REJECTED' ? (cmp.officer_notes || 'False Dispute') : ''
          },
          timeline: [
            { date: dtStr, time: '10:15 AM', title: 'Dispute Complaint Submitted by Citizen', description: cmp.description || 'Citizen submitted complaint in User Portal.' },
            { date: dtStr, time: '10:20 AM', title: 'Assigned to Traffic Officer for Verification', description: 'Under review by assigned Traffic Inspector.' }
          ]
        });
      }
    }

    return mergedList;
  } catch (e) {
    console.error('[Supabase Disputed Challans Fetch Error]:', e);
    return [];
  }
}

/**
 * Verify / Accept Disputed Challan in Supabase
 */
export async function verifyChallanInSupabaseDB(id, remarks = '', challanNo = '') {
  if (!isSupabaseConfigured) return;

  try {
    const targetChallanNo = challanNo || id;
    const notes = remarks || 'Dispute verified and accepted by Police Officer. Penalty revoked.';
    const filterOr = `tracking_id.eq.${id},challan_id.eq.${id},tracking_id.eq.${targetChallanNo},challan_id.eq.${targetChallanNo}`;

    // 1. Update complaints table in Supabase using valid column 'challan_status'
    let { error: cmpErr } = await supabase
      .from('complaints')
      .update({
        challan_status: 'VERIFIED',
        current_stage: 3,
        officer_notes: notes
      })
      .or(filterOr);

    if (cmpErr) {
      console.warn('[Supabase Verify Complaints Error]:', cmpErr.message);
      await supabase
        .from('complaints')
        .update({
          challan_status: 'VERIFIED',
          current_stage: 3,
          officer_notes: notes
        })
        .eq('tracking_id', id);
    }

    // 2. Update fined_data table in Supabase
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

/**
 * Reject Disputed Challan in Supabase
 */
export async function rejectChallanInSupabaseDB(id, reason, remarks = '', challanNo = '') {
  if (!isSupabaseConfigured) return;

  try {
    const targetChallanNo = challanNo || id;
    const notes = `Rejected: ${reason || 'Claim Unfounded'}. ${remarks}`.trim();
    const filterOr = `tracking_id.eq.${id},challan_id.eq.${id},tracking_id.eq.${targetChallanNo},challan_id.eq.${targetChallanNo}`;

    // 1. Update complaints table in Supabase using valid column 'challan_status'
    let { error: cmpErr } = await supabase
      .from('complaints')
      .update({
        challan_status: 'REJECTED',
        current_stage: 3,
        officer_notes: notes
      })
      .or(filterOr);

    if (cmpErr) {
      console.warn('[Supabase Reject Complaints Error]:', cmpErr.message);
      await supabase
        .from('complaints')
        .update({
          challan_status: 'REJECTED',
          current_stage: 3,
          officer_notes: notes
        })
        .eq('tracking_id', id);
    }

    // 2. Update fined_data table in Supabase
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
