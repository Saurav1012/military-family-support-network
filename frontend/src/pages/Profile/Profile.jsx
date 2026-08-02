import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {

  const { user } = useContext(AuthContext);

  return (

    <div className="container py-5">

      <div className="card shadow p-4">

        <div className="text-center">

          <img
            src={
              user.profileImage ||
              "https://via.placeholder.com/150"
            }
            alt=""
            className="rounded-circle"
            width="150"
            height="150"
          />

          <h3 className="mt-3">
            {user.name}
          </h3>

          <p>{user.email}</p>

          <p>{user.role}</p>

        </div>

      </div>

    </div>

  );

};

export default Profile;