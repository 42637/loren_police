import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Radio, 
  AlertCircle 
} from 'lucide-react';

export default function StatusBadge({ status }) {
  if (!status) return null;

  const normalized = status.toUpperCase().trim();

  let className = 'status-badge ';
  let Icon = Clock;

  switch (normalized) {
    case 'VERIFIED':
    case 'RECOVERED':
    case 'ONLINE':
    case 'VERIFIED CLEAR':
    case 'VERIFIED MATCH':
      className += 'status-verified';
      Icon = CheckCircle;
      break;

    case 'PENDING REVIEW':
    case 'UNDER REVIEW':
    case 'REVIEW REQUIRED':
    case 'MAINTENANCE':
      className += 'status-pending';
      Icon = Clock;
      break;

    case 'REJECTED':
    case 'CRITICAL':
    case 'MISMATCH':
    case 'REJECTED MATCH':
      className += 'status-rejected';
      Icon = XCircle;
      break;

    case 'POTENTIAL MATCH':
    case 'OFFICER VERIFICATION REQUIRED':
      className += 'status-potential-match';
      Icon = AlertTriangle;
      break;

    case 'ACTIVE':
    case 'DETECTED':
    case 'NORMAL':
    case 'UNVERIFIED':
      className += 'status-active';
      Icon = Radio;
      break;

    case 'CLOSED':
    case 'OFFLINE':
    case 'INACTIVE':
      className += 'status-closed';
      Icon = AlertCircle;
      break;

    default:
      className += 'status-active';
      Icon = Clock;
  }

  return (
    <span className={className}>
      <Icon size={12} />
      <span>{status}</span>
    </span>
  );
}
