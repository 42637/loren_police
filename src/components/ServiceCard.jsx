import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ServiceCard({
  title,
  icon: Icon,
  description,
  badgeText,
  badgeColor = 'var(--color-warning)',
  linkTo,
  actionText = 'VIEW'
}) {
  return (
    <div className="service-card">
      <div className="service-card-header">
        <div className="service-icon-box">
          <Icon size={24} />
        </div>
        <div className="service-card-title">{title}</div>
      </div>

      <p className="service-card-desc">{description}</p>

      <div className="service-card-footer">
        <div className="service-card-stat" style={{ color: badgeColor }}>
          {badgeText}
        </div>
        <Link to={linkTo} className="btn-service-action">
          <span>{actionText}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
