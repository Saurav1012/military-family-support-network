import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="container-fluid vh-100">

      <div className="row h-100">

        <div className="col-lg-6 d-none d-lg-flex bg-success text-white justify-content-center align-items-center">

          <div className="text-center">

            <h1 className="display-4 fw-bold">

              Military Family Support

            </h1>

            <p className="mt-3 fs-5">

              Together We Stay Strong

            </p>

          </div>

        </div>

        <div className="col-lg-6 d-flex justify-content-center align-items-center">

          <Outlet/>

        </div>

      </div>

    </div>
  );
};

export default AuthLayout;