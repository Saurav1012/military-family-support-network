import React, { useEffect, useState, useContext } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

import "./Events.css";

const emptyForm = {
  title: "",
  description: "",
  category: "Webinar",
  date: "",
  time: "",
  location: "",
  organizer: "",
  status: "Upcoming",
};

const Events = () => {
  const { user } = useContext(AuthContext);

  // Admin Check
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);

  // Modal & Form
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [banner, setBanner] = useState(null);

  // User RSVP Track
  const [registeredEvents, setRegisteredEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [search, category, statusFilter, events]);

  const fetchEvents = async () => {
    try {
      const { data } = await API.get("/events");
      setEvents(data.events || data || []);
    } catch (err) {
      toast.error("Unable to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let data = [...events];

    if (category !== "All") {
      data = data.filter((item) => item.category === category);
    }

    if (statusFilter !== "All") {
      data = data.filter((item) => item.status === statusFilter);
    }

    if (search.trim() !== "") {
      const keyword = search.toLowerCase();
      data = data.filter(
        (item) =>
          item.title?.toLowerCase().includes(keyword) ||
          item.description?.toLowerCase().includes(keyword) ||
          item.location?.toLowerCase().includes(keyword)
      );
    }

    setFilteredEvents(data);
  };

  // RSVP Toggle Handler
  const toggleRSVP = (eventId) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(registeredEvents.filter((id) => id !== eventId));
      toast.success("RSVP Cancelled");
    } else {
      setRegisteredEvents([...registeredEvents, eventId]);
      toast.success("Successfully Registered for Event! 🎉");
    }
  };

  // Admin Save/Update
  const saveEvent = async () => {
    if (!form.title || !form.date || !form.location) {
      toast.error("Please fill required fields (*)");
      return;
    }

    try {
      let formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (banner) formData.append("banner", banner);

      if (editingId) {
        await API.put(`/events/${editingId}`, formData);
        toast.success("Event updated successfully");
      } else {
        await API.post("/events", formData);
        toast.success("Event created successfully");
      }

      closeModal();
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving event");
    }
  };

  // Admin Delete
  const deleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await API.delete(`/events/${id}`);
        toast.success("Event deleted");
        fetchEvents();
      } catch (error) {
        toast.error("Error deleting event");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setBanner(null);
  };

  // Helper Badge Color
  const getBadgeClass = (status) => {
    switch (status) {
      case "Live":
        return "badge-status badge-live";
      case "Completed":
        return "badge-status badge-completed";
      default:
        return "badge-status badge-upcoming";
    }
  };

  return (
    <div className="container-fluid px-4 py-4 events-wrapper">
      {/* ------------------ Header Section ------------------ */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="fs-3">📅</span>
            <h2 className="event-header-title mb-0">Military Events & Workshops</h2>
          </div>
          <p className="text-muted mb-0">
            Join military family webinars, welfare drives, networking meets, and community support sessions.
          </p>
        </div>

        {/* 👤 ADMIN ONLY: Add Event Button */}
        {isAdmin && (
          <button
            className="btn btn-custom-add"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
              setShowModal(true);
            }}
          >
            + Create New Event
          </button>
        )}
      </div>

      {/* ------------------ Admin Stat Highlights ------------------ */}
      {isAdmin && (
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="stat-card d-flex align-items-center gap-3">
              <div className="stat-icon bg-primary bg-opacity-10 text-primary">📅</div>
              <div>
                <h6 className="text-muted mb-0">Total Events</h6>
                <h3 className="fw-bold mb-0">{events.length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card d-flex align-items-center gap-3">
              <div className="stat-icon bg-success bg-opacity-10 text-success">🟢</div>
              <div>
                <h6 className="text-muted mb-0">Upcoming Events</h6>
                <h3 className="fw-bold mb-0">
                  {events.filter((e) => e.status === "Upcoming" || !e.status).length}
                </h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card d-flex align-items-center gap-3">
              <div className="stat-icon bg-warning bg-opacity-10 text-warning">🎟️</div>
              <div>
                <h6 className="text-muted mb-0">Total RSVPs</h6>
                <h3 className="fw-bold mb-0">{registeredEvents.length} Active</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ Search & Filters ------------------ */}
      <div className="filter-card mb-4">
        <div className="row g-3">
          <div className="col-lg-6 col-md-5">
            <input
              className="form-control custom-input"
              placeholder="🔍 Search events by title, description, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-lg-3 col-md-3">
            <select
              className="form-select custom-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option>Webinar</option>
              <option>Workshop</option>
              <option>Welfare Drive</option>
              <option>Sports & Fitness</option>
              <option>Meetup</option>
            </select>
          </div>

          <div className="col-lg-3 col-md-4">
            <select
              className="form-select custom-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Upcoming">🟢 Upcoming</option>
              <option value="Live">🔴 Live Now</option>
              <option value="Completed">⚪ Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* ------------------ Event Cards Grid ------------------ */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="row">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((item) => {
              const isRSVP = registeredEvents.includes(item._id);

              return (
                <div className="col-xl-4 col-md-6 mb-4" key={item._id}>
                  <div className="card modern-event-card h-100 border-0 d-flex flex-column">
                    {/* Event Banner */}
                    <img
                      src={
                        item.banner ||
                        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={item.title}
                      className="event-banner-img"
                    />

                    <div className="card-body d-flex flex-column p-4">
                      {/* Top Badges */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-light text-primary fw-bold">
                          📌 {item.category || "General"}
                        </span>
                        <span className={getBadgeClass(item.status || "Upcoming")}>
                          {item.status === "Live" ? "🔴 Live" : item.status || "Upcoming"}
                        </span>
                      </div>

                      <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                      <p className="text-muted small flex-grow-1 mb-3">
                        {item.description}
                      </p>

                      {/* Event Details Box */}
                      <div className="event-info-box mb-3">
                        <div className="event-info-item fw-semibold text-dark">
                          📅 {item.date ? new Date(item.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) : "TBA"} {item.time && `| ⏰ ${item.time}`}
                        </div>
                        <div className="event-info-item">
                          📍 {item.location || "Online / TBD"}
                        </div>
                        {item.organizer && (
                          <div className="event-info-item">
                            👤 Organized by: <strong className="text-dark">{item.organizer}</strong>
                          </div>
                        )}
                      </div>

                      {/* 👥 USER ACTION: RSVP / Register Button */}
                      <button
                        className={`btn w-100 btn-rsvp ${
                          isRSVP ? "btn-success" : "btn-outline-primary"
                        }`}
                        onClick={() => toggleRSVP(item._id)}
                      >
                        {isRSVP ? "✅ Registered (Cancel RSVP)" : "🎟️ Register / RSVP"}
                      </button>
                    </div>

                    {/* 👤 ADMIN ACTION: Edit / Delete */}
                    {isAdmin && (
                      <div className="card-footer bg-light border-top d-flex justify-content-end gap-2 py-2 px-3">
                        <button
                          className="btn btn-sm btn-outline-warning fw-semibold px-3"
                          onClick={() => {
                            setEditingId(item._id);
                            setForm({
                              title: item.title || "",
                              description: item.description || "",
                              category: item.category || "Webinar",
                              date: item.date ? item.date.split("T")[0] : "",
                              time: item.time || "",
                              location: item.location || "",
                              organizer: item.organizer || "",
                              status: item.status || "Upcoming",
                            });
                            setShowModal(true);
                          }}
                        >
                          ✏ Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger fw-semibold px-3"
                          onClick={() => deleteEvent(item._id)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12 py-3">
              <div className="modern-empty-state">
                <div className="empty-icon-circle">🎟️</div>
                <h4 className="fw-bold text-dark">No Events Found</h4>
                <p className="text-muted mb-0">
                  Try switching categories or clearing search filters.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------ Create/Edit Event Modal (ADMIN ONLY) ------------------ */}
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
                  {editingId ? "✏️ Edit Event" : "➕ Create New Event"}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Event Title *</label>
                    <input
                      className="form-control custom-input"
                      placeholder="e.g., Annual Military Family Support Webinar"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Description *</label>
                    <textarea
                      rows="3"
                      className="form-control custom-input"
                      placeholder="Enter event details and agenda..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Category</label>
                    <select
                      className="form-select custom-select"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      <option>Webinar</option>
                      <option>Workshop</option>
                      <option>Welfare Drive</option>
                      <option>Sports & Fitness</option>
                      <option>Meetup</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Event Status</label>
                    <select
                      className="form-select custom-select"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      <option value="Upcoming">🟢 Upcoming</option>
                      <option value="Live">🔴 Live Now</option>
                      <option value="Completed">⚪ Completed</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Date *</label>
                    <input
                      type="date"
                      className="form-control custom-input"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Time</label>
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="e.g., 10:00 AM IST"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Location / Link *</label>
                    <input
                      className="form-control custom-input"
                      placeholder="e.g., Google Meet Link or Auditorium Hall"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Organizer Name</label>
                    <input
                      className="form-control custom-input"
                      placeholder="e.g., Army Welfare Welfare Society"
                      value={form.organizer}
                      onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Event Banner Image</label>
                    <input
                      type="file"
                      className="form-control custom-input"
                      accept="image/*"
                      onChange={(e) => setBanner(e.target.files[0])}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light px-4">
                <button className="btn btn-secondary px-4 fw-semibold" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn btn-custom-add px-4" onClick={saveEvent}>
                  Save Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;