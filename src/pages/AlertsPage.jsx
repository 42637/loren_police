import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import FilterChips from '../components/FilterChips';
import EmptyState from '../components/EmptyState';
import { Bell, CheckCheck, ShieldAlert, FileText, Car, Camera, ArrowRight, Check } from 'lucide-react';

export default function AlertsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [filterCategory, setFilterCategory] = useState('ALL');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filterOptions = [
    { label: 'All Alerts', value: 'ALL', count: notifications.length },
    { label: 'Unread', value: 'UNREAD', count: unreadCount },
    { label: 'High Priority', value: 'HIGH', count: notifications.filter(n => n.priority === 'HIGH').length },
    { label: 'Vehicle Match', value: 'Vehicle Match', count: notifications.filter(n => n.category === 'Vehicle Match').length },
    { label: 'Challan', value: 'Challan', count: notifications.filter(n => n.category === 'Challan').length },
    { label: 'Camera', value: 'Camera', count: notifications.filter(n => n.category === 'Camera').length },
  ];

  const filteredNotifications = notifications.filter((n) => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'UNREAD') return !n.read;
    if (filterCategory === 'HIGH') return n.priority === 'HIGH';
    return n.category === filterCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Vehicle Match':
        return <ShieldAlert size={18} color="#E65100" />;
      case 'Challan':
        return <FileText size={18} color="var(--primary-blue)" />;
      case 'Stolen':
        return <Car size={18} color="var(--color-danger)" />;
      case 'Camera':
        return <Camera size={18} color="var(--color-warning)" />;
      default:
        return <Bell size={18} color="var(--primary-blue)" />;
    }
  };

  return (
    <div className="alerts-page">
      <div className="page-header-with-action">
        <div className="page-header">
          <div className="page-title">
            <Bell size={22} color="var(--primary-blue)" />
            <span>Control Room Alerts</span>
          </div>
          <div className="page-subtitle">
            Prioritized real-time alerts and officer assignment notifications.
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            className="btn-secondary btn-mark-all"
            onClick={markAllNotificationsAsRead}
          >
            <CheckCheck size={16} />
            <span>MARK ALL AS READ</span>
          </button>
        )}
      </div>

      <FilterChips
        options={filterOptions}
        activeFilter={filterCategory}
        onSelectFilter={setFilterCategory}
      />

      {filteredNotifications.length > 0 ? (
        <div className="alerts-list">
          {filteredNotifications.map((alert) => (
            <div key={alert.id} className={`alert-card ${!alert.read ? 'unread' : ''}`}>
              <div className="alert-icon-box">
                {getCategoryIcon(alert.category)}
              </div>

              <div className="alert-content">
                <div className="alert-header-line">
                  <span className={`priority-pill ${alert.priority.toLowerCase()}`}>
                    {alert.priority} PRIORITY
                  </span>
                  <span className="alert-timestamp">{alert.timestamp}</span>
                </div>
                <h3 className="alert-title">{alert.title}</h3>
                <p className="alert-desc">{alert.description}</p>
              </div>

              <div className="alert-actions-col">
                {!alert.read && (
                  <button
                    className="btn-mark-read"
                    onClick={() => markNotificationAsRead(alert.id)}
                    title="Mark as read"
                  >
                    <Check size={14} />
                  </button>
                )}
                {alert.link && (
                  <Link to={alert.link} className="btn-review-alert" onClick={() => markNotificationAsRead(alert.id)}>
                    <span>REVIEW</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No alerts found"
          description="There are no control room alerts matching your current filter selection."
          actionText="Show All Alerts"
          onAction={() => setFilterCategory('ALL')}
        />
      )}

      <style>{`
        .alerts-page {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .btn-mark-all {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          align-self: flex-start;
          font-size: 0.8rem;
          padding: 8px 12px;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .alert-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          box-shadow: var(--box-shadow);
          transition: background 0.15s ease;
        }

        .alert-card.unread {
          background: #F4F8FA;
          border-left: 4px solid var(--primary-blue);
        }

        .alert-icon-box {
          width: 40px;
          height: 40px;
          border-radius: var(--border-radius);
          background: var(--very-light-blue);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .alert-content {
          flex: 1;
          min-width: 0;
        }

        .alert-header-line {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .alert-timestamp {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .alert-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .alert-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .alert-actions-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          flex-shrink: 0;
        }

        .btn-mark-read {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background: #FFFFFF;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .btn-mark-read:hover {
          background: var(--color-success-bg);
          color: var(--color-success);
          border-color: var(--color-success-border);
        }

        .btn-review-alert {
          background-color: var(--primary-blue);
          color: #FFFFFF;
          font-size: 0.775rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .btn-review-alert:hover {
          background-color: var(--primary-blue-hover);
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
