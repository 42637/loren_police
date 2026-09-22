import { ShieldAlert, X } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDanger = false
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} color={isDanger ? 'var(--color-danger)' : 'var(--primary-blue)'} />
            <span>{title}</span>
          </div>
          <button onClick={onCancel} aria-label="Close dialog" style={{ cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ margin: '16px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <p>{message}</p>
          <div style={{ marginTop: '12px', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            This action will be recorded against your authorized officer account.
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={isDanger ? 'btn-danger' : 'btn-primary'}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
