import "./Dashboard.css";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <div className="dashboard-banner">

        <h2>

          Welcome,

          {user?.name}

        </h2>

        <p>

          Stay Connected.
          Stay Strong.

        </p>

      </div>

      <div className="row mt-4">

        <div className="col-lg-3">

          <div className="dashboard-card">

            <h3>12</h3>

            <p>Community Groups</p>

          </div>

        </div>

        <div className="col-lg-3">

          <div className="dashboard-card">

            <h3>35</h3>

            <p>Resources</p>

          </div>

        </div>

        <div className="col-lg-3">

          <div className="dashboard-card">

            <h3>8</h3>

            <p>Upcoming Events</p>

          </div>

        </div>

        <div className="col-lg-3">

          <div className="dashboard-card">

            <h3>24</h3>

            <p>Forum Discussions</p>

          </div>

        </div>

      </div>
    </>
  );
};

export default Dashboard;