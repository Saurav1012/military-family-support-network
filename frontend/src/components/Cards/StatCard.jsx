const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="card shadow-sm border-0 h-100">

      <div className="card-body">

        <div className="d-flex justify-content-between align-items-center">

          <div>

            <h6 className="text-muted">
              {title}
            </h6>

            <h2>{value}</h2>

          </div>

          <div
            className={`fs-1 text-${color}`}
          >
            {icon}
          </div>

        </div>

      </div>

    </div>
  );
};

export default StatCard;