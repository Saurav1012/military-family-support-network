import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { FaUsers, FaSearch, FaPlus, FaMapMarkerAlt } from "react-icons/fa";
import "./Community.css";

const Community = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Search & Modal Form
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "Family Support",
  });

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const { data } = await API.get("/community");
      setCommunities(data.communities || []);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch communities");
    } finally {
      setLoading(false);
    }
  };

  // Create Community Function
  const createCommunity = async () => {
    if (!form.title || !form.description || !form.location) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await API.post("/community", form);
      toast.success("Community Created Successfully");
      setShowModal(false);
      setForm({
        title: "",
        description: "",
        location: "",
        category: "Family Support",
      });
      fetchCommunities();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating community");
    }
  };

  // Join Community Function
  const joinCommunity = async (id) => {
    try {
      await API.post(`/community/${id}/join`);
      toast.success("Joined Successfully");
      fetchCommunities();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not join community");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5 py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  // Filtered List based on Search input
  const filteredCommunities = communities.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Community Groups</h2>

      {/* Top Section: Search Bar & Create Button */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div className="input-group w-50" style={{ minWidth: "280px" }}>
          <span className="input-group-text bg-white">
            <FaSearch className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search Community..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="btn btn-success d-flex align-items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Create Community
        </button>
      </div>

      {/* Community Cards Grid */}
      <div className="row">
        {filteredCommunities.length > 0 ? (
          filteredCommunities.map((item) => (
            <div className="col-md-6 col-lg-4 mb-4" key={item._id}>
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-semibold mb-0">{item.title}</h5>
                    <span className="badge bg-success-subtle text-success border border-success">
                      {item.category}
                    </span>
                  </div>

                  <p className="card-text text-muted flex-grow-1">
                    {item.description}
                  </p>

                  <p className="card-text text-secondary mb-3">
                    <FaMapMarkerAlt className="me-1 text-danger" /> {item.location}
                  </p>

                  {/* Members count & Join Action */}
                  <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                    <span className="text-muted small d-flex align-items-center gap-1">
                      <FaUsers className="text-primary" /> {item.members?.length || 0} Members
                    </span>
                    <button
                      className="btn btn-outline-success btn-sm px-3"
                      onClick={() => joinCommunity(item._id)}
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No communities found matching your search.</p>
          </div>
        )}
      </div>

      {/* Bootstrap Modal for Creating Community */}
      {showModal && (
        <>
          <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Create Community</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                  <textarea
                    className="form-control mb-3"
                    placeholder="Description"
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="Family Support">Family Support</option>
                    <option value="Deployment Support">Deployment Support</option>
                    <option value="Education">Education</option>
                    <option value="Relocation">Relocation</option>
                    <option value="Counselling">Counselling</option>
                  </select>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-success" onClick={createCommunity}>
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Community;