export default function PageHeader({ title, subtitle, icon }) {
  return (
    <div className="page-header">
      <div className="page-header-content">
        {icon && <div className="page-icon">{icon}</div>}
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
