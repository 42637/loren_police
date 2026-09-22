import { ShieldAlert, FileText, Car, CheckCircle2, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ActivityItem({ activity }) {
  const getIcon = (type) => {
    switch (type) {
      case 'MATCH':
        return <ShieldAlert size={16} color="#E65100" />;
      case 'COMPLAINT':
        return <FileText size={16} color="var(--primary-blue)" />;
      case 'STOLEN':
        return <Car size={16} color="var(--color-danger)" />;
      case 'VERIFIED':
        return <CheckCircle2 size={16} color="var(--color-success)" />;
      default:
        return <Clock size={16} color="var(--text-secondary)" />;
    }
  };

  return (
    <div className="activity-item-row">
      <div className="activity-icon-container">
        {getIcon(activity.type)}
      </div>

      <div className="activity-details">
        <div className="activity-title-line">
          <span className="activity-title">{activity.title}</span>
          <span className="activity-time">{activity.time}</span>
        </div>
        <div className="activity-desc">{activity.description}</div>
      </div>

      <div className="activity-badge">
        <StatusBadge status={activity.status} />
      </div>

      <style>{`
        .activity-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--border-radius);
          margin-bottom: 8px;
        }

        .activity-icon-container {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--color-neutral-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-details {
          flex: 1;
          min-width: 0;
        }

        .activity-title-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .activity-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .activity-time {
          font-size: 0.725rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .activity-desc {
          font-size: 0.785rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 2px;
        }

        .activity-badge {
          display: none;
        }

        @media (min-width: 600px) {
          .activity-badge {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
