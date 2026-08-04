import React, { useState, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api"; // Aapka Axios Instance
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaCamera,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaSave,
  FaEdit,
} from "react-icons/fa";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);

  // Active Tab State
  const [activeTab, setActiveTab] = useState("general"); // 'general' | 'security'
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || "System Administrator",
    email: user?.email || "admin@militarysupport.com",
    phone: user?.phone || "+91 9876543210",
    location: user?.location || "Delhi Cantt, New Delhi",
    role: user?.role || "admin",
    bio: user?.bio || "Dedicated to supporting military families and service members.",
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Image Upload State
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // Handle Input Changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Image Selection Handler
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setProfileImage(URL.createObjectURL(file)); // Local Preview
    }
  };

  // Save General Profile Info
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("location", formData.location);
      data.append("bio", formData.bio);
      if (imageFile) {
        data.append("profileImage", imageFile);
      }

      const res = await API.put("/user/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = res.data.user || res.data;
      toast.success("Profile updated successfully! 🎉");
      if (setUser) {
        setUser(updatedUser);
      }
      setFormData((prev) => ({
        ...prev,
        name: updatedUser?.name || prev.name,
        email: updatedUser?.email || prev.email,
        phone: updatedUser?.phone || prev.phone,
        location: updatedUser?.location || prev.location,
        role: updatedUser?.role || prev.role,
        bio: updatedUser?.bio || prev.bio,
      }));
      if (updatedUser?.profileImage) {
        setProfileImage(updatedUser.profileImage);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 UPDATED: Save Password Change (Bina logout kiye, usi page par rehne ke liye)
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New Passwords do not match!");
    }

    setLoading(true);
    try {
      await API.put("/user/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password updated successfully! 🔐");

      // Form fields clear kar do taaki input khali ho jaye
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid py-3 px-4"
      style={{ height: "calc(100vh - 75px)", overflowY: "auto" }}
    >
      {/* Header Banner */}
      <div className="card border-0 shadow-sm mb-4 rounded-3 overflow-hidden bg-white">
        <div
          className="p-4 text-white d-flex align-items-end"
          style={{
            background: "linear-gradient(135deg, #1b365d 0%, #2a5298 100%)",
            minHeight: "140px",
          }}
        >
          <div>
            <h4 className="fw-bold mb-1">Account Settings & Profile</h4>
            <p className="small mb-0 text-white-50">
              Manage your personal information, security, and military network preferences.
            </p>
          </div>
        </div>

        {/* User Quick Info Sub-Bar */}
        <div className="card-body p-3 px-4 d-flex flex-wrap justify-content-between align-items-center bg-white border-bottom">
          <div className="d-flex align-items-center gap-3" style={{ marginTop: "-40px" }}>
            {/* Profile Avatar with Camera Overlay */}
            <div className="position-relative">
              <div
                className="rounded-circle border border-4 border-white shadow bg-dark text-white d-flex align-items-center justify-content-center fw-bold fs-3"
                style={{ width: "90px", height: "90px", overflow: "hidden" }}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-100 h-100 object-fit-cover"
                  />
                ) : (
                  formData.name[0]?.toUpperCase()
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="d-none"
                accept="image/*"
                onChange={handleImageSelect}
              />
              <button
                type="button"
                className="btn btn-sm btn-success rounded-circle position-absolute bottom-0 end-0 p-1 d-flex align-items-center justify-content-center shadow"
                style={{ width: "28px", height: "28px" }}
                onClick={() => fileInputRef.current?.click()}
                title="Change Avatar"
              >
                <FaCamera size={12} />
              </button>
            </div>

            <div className="mt-3">
              <h5 className="fw-bold text-dark mb-0">{formData.name}</h5>
              <small className="text-muted d-block">{formData.email}</small>
            </div>
          </div>

          <div className="mt-2 mt-md-0">
            <span className="badge bg-success px-3 py-2 text-uppercase fw-semibold">
              🛡️ Role: {formData.role}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="row g-4">
        {/* Left Side Navigation Tabs */}
        <div className="col-12 col-md-4 col-lg-3">
          <div className="card border-0 shadow-sm p-2 bg-white">
            <div className="nav flex-column nav-pills gap-1">
              <button
                className={`nav-link text-start d-flex align-items-center gap-2 fw-semibold py-2.5 px-3 rounded-3 ${
                  activeTab === "general" ? "active bg-success text-white" : "text-secondary"
                }`}
                onClick={() => setActiveTab("general")}
              >
                <FaUser /> Personal Details
              </button>
              <button
                className={`nav-link text-start d-flex align-items-center gap-2 fw-semibold py-2.5 px-3 rounded-3 ${
                  activeTab === "security" ? "active bg-success text-white" : "text-secondary"
                }`}
                onClick={() => setActiveTab("security")}
              >
                <FaLock /> Security & Password
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Content Form */}
        <div className="col-12 col-md-8 col-lg-9">
          <div className="card border-0 shadow-sm p-4 bg-white">
            {activeTab === "general" ? (
              <form onSubmit={handleUpdateProfile}>
                <h5 className="fw-bold text-dark mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
                  <FaEdit className="text-success" /> Personal Details
                </h5>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <FaUser />
                      </span>
                      <input
                        type="text"
                        name="name"
                        className="form-control border-start-0"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        name="email"
                        className="form-control border-start-0 bg-light"
                        value={formData.email}
                        disabled
                        title="Email cannot be changed"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <FaPhone />
                      </span>
                      <input
                        type="text"
                        name="phone"
                        className="form-control border-start-0"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Location / Base</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <FaMapMarkerAlt />
                      </span>
                      <input
                        type="text"
                        name="location"
                        className="form-control border-start-0"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold small text-muted">Bio / About</label>
                    <textarea
                      name="bio"
                      rows="3"
                      className="form-control"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Write a brief introduction about yourself..."
                    ></textarea>
                  </div>
                </div>

                <div className="mt-4 text-end border-top pt-3">
                  <button type="submit" className="btn btn-success px-4 fw-semibold" disabled={loading}>
                    {loading ? "Saving..." : <><FaSave className="me-1" /> Save Changes</>}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleUpdatePassword}>
                <h5 className="fw-bold text-dark mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
                  <FaShieldAlt className="text-success" /> Change Password
                </h5>

                <div className="row g-3" style={{ maxWidth: "500px" }}>
                  <div className="col-12">
                    <label className="form-label fw-semibold small text-muted">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      className="form-control"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold small text-muted">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      className="form-control"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold small text-muted">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>

                <div className="mt-4 text-start border-top pt-3">
                  <button type="submit" className="btn btn-success px-4 fw-semibold" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;