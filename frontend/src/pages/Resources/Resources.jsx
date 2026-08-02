import { useEffect, useState, useContext } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

import "./Resources.css";

const emptyForm = {
  title: "",
  description: "",
  category: "Government Scheme",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  website: "",
};

const Resources = () => {
  const { user } = useContext(AuthContext);

  // Check if current user is Admin (case-insensitive)
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);

  // Search, Filter & Sort States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [loading, setLoading] = useState(true);

  // Modal & Form States
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // File Upload States
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterAndSortResources();
  }, [search, category, sortBy, resources]);

  const fetchResources = async () => {
    try {
      const { data } = await API.get("/resources");
      setResources(data.resources || []);
      setFilteredResources(data.resources || []);
    } catch (err) {
      toast.error("Unable to load resources");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortResources = () => {
    let data = [...resources];

    // Category Filter
    if (category !== "All") {
      data = data.filter((item) => item.category === category);
    }

    // Search Filter
    if (search.trim() !== "") {
      const keyword = search.toLowerCase();
      data = data.filter((item) => {
        return (
          item.title?.toLowerCase().includes(keyword) ||
          item.description?.toLowerCase().includes(keyword) ||
          item.category?.toLowerCase().includes(keyword) ||
          item.contactName?.toLowerCase().includes(keyword)
        );
      });
    }

    // Sort Logic
    if (sortBy === "newest") {
      data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === "oldest") {
      data.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortBy === "title") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredResources(data);
  };

  // Upload Attachment Helper
  const uploadFiles = async (id) => {
    if (!image && !pdf) return;

    const formData = new FormData();
    if (image) formData.append("image", image);
    if (pdf) formData.append("pdf", pdf);

    try {
      await API.post(`/resources/${id}/upload`, formData);
      toast.success("Files uploaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "File upload failed");
    }
  };

  // Save / Update Resource Handler (Admin Only)
  const saveResource = async () => {
    if (!form.title || !form.description) {
      toast.error("Please fill required fields (*)");
      return;
    }

    try {
      let response;
      if (editingId) {
        response = await API.put(`/resources/${editingId}`, form);
        toast.success("Resource updated successfully");
        if (image || pdf) await uploadFiles(editingId);
      } else {
        response = await API.post("/resources", form);
        toast.success("Resource added successfully");
        const newResourceId = response.data.resource?._id || response.data._id;
        if (newResourceId && (image || pdf)) await uploadFiles(newResourceId);
      }

      closeModal();
      fetchResources();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving resource");
    }
  };

  // Delete Resource Handler (Admin Only)
  const deleteResource = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await API.delete(`/resources/${id}`);
        toast.success("Resource deleted");
        fetchResources();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting resource");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setImage(null);
    setPdf(null);
  };

  return (
    <div className="container-fluid px-4 py-4 resources-wrapper">
      {/* ------------------ Header Section ------------------ */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="fs-3">📚</span>
            <h2 className="resource-header-title mb-0">Resource Library</h2>
          </div>
          <p className="text-muted mb-0">
            Manage government schemes, NGOs, healthcare and support resources for military families.
          </p>
        </div>

        {/* 👤 ADMIN ONLY: Add New Resource Button */}
        {isAdmin && (
          <button
            className="btn btn-custom-add"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
              setImage(null);
              setPdf(null);
              setShowModal(true);
            }}
          >
            + Add New Resource
          </button>
        )}
      </div>

      {/* ------------------ Search & Filter Bar ------------------ */}
      <div className="filter-card mb-4">
        <div className="row g-3">
          <div className="col-lg-6 col-md-5">
            <div className="input-group search-input-group">
              <span className="input-group-text">🔍</span>
              <input
                className="form-control custom-input"
                placeholder="Search Resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-lg-3 col-md-3">
            <select
              className="form-select custom-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">Category ▼ (All)</option>
              <option>Government Scheme</option>
              <option>Relocation</option>
              <option>Education</option>
              <option>Housing</option>
              <option>Counselling</option>
              <option>Emergency</option>
            </select>
          </div>

          <div className="col-lg-3 col-md-4">
            <select
              className="form-select custom-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort ▼ (Newest)</option>
              <option value="oldest">Sort ▼ (Oldest)</option>
              <option value="title">Sort ▼ (Title A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ------------------ Cards List Section ------------------ */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <div className="row">
          {filteredResources.length > 0 ? (
            filteredResources.map((item) => (
              <div className="col-xl-4 col-md-6 mb-4" key={item._id}>
                <div className="card modern-resource-card h-100 border-0 d-flex flex-column">
                  
                  {/* Banner Image (if available) */}
                  {item.resourceImage && (
                    <img
                      src={item.resourceImage}
                      alt={item.title}
                      className="card-banner-img"
                    />
                  )}

                  <div className="card-body d-flex flex-column p-4">
                    {/* Category Badge */}
                    <div className="mb-2">
                      <span className="category-tag">🏛 {item.category}</span>
                    </div>

                    {/* Title & Description */}
                    <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                    <p className="text-muted small flex-grow-1 mb-3">
                      {item.description}
                    </p>

                    {/* Contact & Website Information */}
                    <div className="contact-card-box mb-3">
                      {item.contactName && (
                        <div className="contact-item fw-semibold text-dark">
                          👤 {item.contactName}
                        </div>
                      )}
                      {item.contactEmail && (
                        <div className="contact-item">
                          📧 {item.contactEmail}
                        </div>
                      )}
                      {item.contactPhone && (
                        <div className="contact-item">
                          📞 {item.contactPhone}
                        </div>
                      )}
                      {item.website && (
                        <div className="contact-item mt-1">
                          🌐{" "}
                          <a
                            href={
                              item.website.startsWith("http")
                                ? item.website
                                : `https://${item.website}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-decoration-none fw-semibold text-success"
                          >
                            {item.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* PDF Download Button (Visible to ALL users if PDF exists) */}
                    {item.resourcePdf && (
                      <a
                        className="btn btn-outline-primary btn-sm w-100 fw-semibold mt-auto py-2"
                        href={item.resourcePdf}
                        target="_blank"
                        rel="noreferrer"
                      >
                        📄 Download PDF
                      </a>
                    )}
                  </div>

                  {/* 👤 ADMIN ONLY: Edit & Delete Action Buttons */}
                  {isAdmin && (
                    <div className="card-footer bg-light border-top d-flex justify-content-end gap-2 py-2 px-3">
                      <button
                        className="btn btn-sm btn-outline-warning fw-semibold px-3"
                        onClick={() => {
                          setEditingId(item._id);
                          setForm({
                            title: item.title || "",
                            description: item.description || "",
                            category: item.category || "Government Scheme",
                            contactName: item.contactName || "",
                            contactEmail: item.contactEmail || "",
                            contactPhone: item.contactPhone || "",
                            website: item.website || "",
                          });
                          setShowModal(true);
                        }}
                      >
                        ✏ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger fw-semibold px-3"
                        onClick={() => deleteResource(item._id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  )}

                </div>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="col-12 py-3">
              <div className="modern-empty-state">
                <div className="empty-icon-circle">📂</div>
                <h4 className="fw-bold text-dark">No Resources Found</h4>
                <p className="text-muted mb-0">
                  Try adjusting your search criteria or category filter.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------ Add / Edit Resource Modal (Admin Only) ------------------ */}
      {showModal && isAdmin && (
        <div
          className="modal d-block custom-glass-modal"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editingId ? "✏️ Edit Resource" : "➕ Add Resource"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeModal}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Title <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control custom-input"
                      placeholder="e.g., Army Welfare Fund"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      rows="3"
                      className="form-control custom-input"
                      placeholder="Financial support for military families..."
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select custom-select"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    >
                      <option>Government Scheme</option>
                      <option>Relocation</option>
                      <option>Education</option>
                      <option>Housing</option>
                      <option>Counselling</option>
                      <option>Emergency</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Contact Name</label>
                    <input
                      className="form-control custom-input"
                      placeholder="e.g., Army Office"
                      value={form.contactName}
                      onChange={(e) =>
                        setForm({ ...form, contactName: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Contact Email</label>
                    <input
                      type="email"
                      className="form-control custom-input"
                      placeholder="army@example.com"
                      value={form.contactEmail}
                      onChange={(e) =>
                        setForm({ ...form, contactEmail: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Contact Phone</label>
                    <input
                      className="form-control custom-input"
                      placeholder="9876543210"
                      value={form.contactPhone}
                      onChange={(e) =>
                        setForm({ ...form, contactPhone: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Website</label>
                    <input
                      className="form-control custom-input"
                      placeholder="example.com"
                      value={form.website}
                      onChange={(e) =>
                        setForm({ ...form, website: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Upload Image</label>
                    <input
                      type="file"
                      className="form-control custom-input"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Upload PDF</label>
                    <input
                      type="file"
                      className="form-control custom-input"
                      accept=".pdf"
                      onChange={(e) => setPdf(e.target.files[0])}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light px-4">
                <button className="btn btn-secondary px-4 fw-semibold" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="btn btn-custom-add px-4"
                  onClick={saveResource}
                >
                  Save Resource
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;