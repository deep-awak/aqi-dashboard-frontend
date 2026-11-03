export function Card({ id, className = '', children }) {
  return (
    <section id={id} className={`card ${className}`}>
      {children}
    </section>
  );
}

export function CardHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="card-header">
      <div className="card-title">
        {Icon && (
          <span className="icon-bubble">
            <Icon size={18} />
          </span>
        )}
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function Notice({ tone = 'info', children }) {
  return <div className={`notice notice-${tone}`}>{children}</div>;
}

export function EmptyState({ children }) {
  return <div className="empty">{children}</div>;
}
