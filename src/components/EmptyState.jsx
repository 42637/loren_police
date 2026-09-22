import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = "No records found",
  description = "There are no entries matching your current search or filter criteria.",
  icon: Icon = Inbox,
  actionText,
  onAction
}) {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon">
        <Icon size={28} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionText && onAction && (
        <button className="btn-primary" onClick={onAction} style={{ marginTop: '16px' }}>
          {actionText}
        </button>
      )}
    </div>
  );
}
