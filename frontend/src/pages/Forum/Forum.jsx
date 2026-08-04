import React, { useState, useEffect, useContext } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import "./Forum.css"; // Ensure file name matches your local CSS file

const Forums = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Create Post Modal
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    topic: "General",
    location: "",
  });

  // Comment Drawer/Modal State
  const [activeCommentsPost, setActiveCommentsPost] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [search, selectedCategory, posts]);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get("/forum");
      const fetchedPosts = data.posts || data || [];
      setPosts(fetchedPosts);

      // Agar comment modal open hai toh usko bhi sync update karein
      if (activeCommentsPost) {
        const updatedActive = fetchedPosts.find(
          (p) => p._id === activeCommentsPost._id
        );
        if (updatedActive) setActiveCommentsPost(updatedActive);
      }
    } catch (err) {
      toast.error("Failed to load forum posts");
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let list = [...posts];

    // Category / Topic Filter Fix
    if (selectedCategory !== "All") {
      list = list.filter(
        (p) => (p.topic || p.category) === selectedCategory
      );
    }

    // Search Filter Fix
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.content?.toLowerCase().includes(q) ||
          p.author?.name?.toLowerCase().includes(q) ||
          p.authorName?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q)
      );
    }

    // Pinned posts top par rahenge
    list.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    setFilteredPosts(list);
  };

  // Create Post
  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      toast.error("Title and Content are required!");
      return;
    }

    try {
      await API.post("/forum", newPost);
      toast.success("Post published successfully! 🚀");
      setShowModal(false);
      setNewPost({ title: "", content: "", topic: "General", location: "" });
      fetchPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    }
  };

  // Toggle Like
  const handleLike = async (postId) => {
    try {
      await API.put(`/forum/${postId}/like`);
      fetchPosts();
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  // ADMIN ONLY: Pin Post
  const handleTogglePin = async (postId) => {
    try {
      await API.put(`/forum/${postId}/pin`);
      toast.success("Post pin status updated");
      fetchPosts();
    } catch (error) {
      toast.error("Failed to pin post");
    }
  };

  // Delete Post (Admin OR Post Owner)
  const handleDelete = async (postId, authorObj) => {
    const authorId = authorObj?._id || authorObj;

    if (!isAdmin && user?._id !== authorId) {
      toast.error("You are not authorized to delete this post");
      return;
    }

    if (window.confirm("Are you sure you want to delete this forum post?")) {
      try {
        await API.delete(`/forum/${postId}`);
        toast.success("Post deleted");
        fetchPosts();
      } catch (error) {
        toast.error("Failed to delete post");
      }
    }
  };

  // 🟢 FIXED: Add Comment Handler
  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;

    try {
      const { data } = await API.post(`/forum/${postId}/comment`, {
        text: commentText,
      });

      toast.success("Comment added! 💬");
      setCommentText("");

      // Instant Modal UI Update
      if (activeCommentsPost) {
        const newCommentObj = {
          text: commentText,
          userName: user?.name || "You",
          createdAt: new Date(),
        };

        const updatedComments = data.comments || [
          ...(activeCommentsPost.comments || []),
          newCommentObj,
        ];

        setActiveCommentsPost((prev) => ({
          ...prev,
          comments: updatedComments,
        }));
      }

      fetchPosts(); // Refresh backend data in background
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  return (
    <div className="forum-page-wrapper p-4">
      {/* ------------------ Top Banner ------------------ */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">💬 Military Support Forum</h2>
          <p className="text-muted mb-0">
            Connect, discuss, ask questions, and support fellow military families.
          </p>
        </div>
        <button className="btn btn-new-post" onClick={() => setShowModal(true)}>
          + Create New Post
        </button>
      </div>

      {/* ------------------ Search & Category Filter Bar ------------------ */}
      <div className="row g-3 mb-4">
        <div className="col-lg-5">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">🔍</span>
            <input
              type="text"
              className="form-control border-start-0 py-2"
              placeholder="Search by keyword, author, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-lg-7 d-flex gap-2 align-items-center overflow-auto pb-1">
          {["All", "General", "Deployment", "Housing", "Medical", "Career", "Family", "Counselling"].map(
            (cat) => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* ------------------ Posts Grid ------------------ */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="row g-4">
          {filteredPosts.map((post) => {
            const authorData = post.author || post.user;
            const authorName = authorData?.name || post.authorName || "Anonymous Member";
            const authorRole = authorData?.role || post.user?.role;
            const isOwner = user?._id === (authorData?._id || authorData);

            return (
              <div className="col-12 col-md-6 col-lg-6" key={post._id}>
                <div className={`card forum-card h-100 p-4 ${post.isPinned ? "is-pinned" : ""}`}>
                  {/* Top Author Info */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="author-avatar">
                        {authorName[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="fw-bold text-dark mb-0">{authorName}</h6>
                          {authorRole?.toLowerCase() === "admin" && (
                            <span className="admin-badge">🛡️ Admin</span>
                          )}
                        </div>
                        <small className="text-muted">
                          📍 {post.location || "General"} •{" "}
                          {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                        </small>
                      </div>
                    </div>

                    {/* Admin Pin Badge & Actions */}
                    <div className="d-flex align-items-center gap-2">
                      {post.isPinned && <span className="pinned-badge">📌 Pinned</span>}

                      {(isAdmin || isOwner) && (
                        <button
                          className="btn btn-sm text-danger p-1 border-0"
                          title="Delete Post"
                          onClick={() => handleDelete(post._id, authorData)}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Post Topic Tag */}
                  <div className="mb-2">
                    <span className="badge bg-light text-dark border">
                      #{post.topic || post.category || "General"}
                    </span>
                  </div>

                  {/* Title & Content */}
                  <h5 className="fw-bold text-dark mb-2">{post.title}</h5>
                  <p className="text-secondary flex-grow-1 small mb-4">{post.content}</p>

                  {/* Bottom Footer Action Bar */}
                  <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-forum-action"
                        onClick={() => handleLike(post._id)}
                      >
                        ❤️ {post.likes?.length || 0} Likes
                      </button>

                      <button
                        className="btn btn-forum-action"
                        onClick={() => setActiveCommentsPost(post)}
                      >
                        💬 {post.comments?.length || 0} Comments
                      </button>
                    </div>

                    {/* ADMIN Action: Pin/Unpin Toggle */}
                    {isAdmin && (
                      <button
                        className="btn btn-sm btn-outline-primary fw-semibold"
                        onClick={() => handleTogglePin(post._id)}
                      >
                        {post.isPinned ? "📌 Unpin" : "📌 Pin"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-5 bg-white rounded-3 border">
          <h5 className="fw-bold text-dark">No Forum Discussions Found</h5>
          <p className="text-muted mb-0">Be the first one to start a conversation!</p>
        </div>
      )}

      {/* ------------------ Create Post Modal ------------------ */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">✍️ Create New Discussion</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Discussion Title *</label>
                  <input
                    className="form-control"
                    placeholder="e.g., Need advice regarding housing allowance"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label fw-semibold">Topic / Category</label>
                    <select
                      className="form-select"
                      value={newPost.topic}
                      onChange={(e) => setNewPost({ ...newPost, topic: e.target.value })}
                    >
                      <option>General</option>
                      <option>Deployment</option>
                      <option>Family</option>
                      <option>Education</option>
                      <option>Counselling</option>
                      <option>Housing</option>
                      <option>Medical</option>
                      <option>Career</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold">Location / Station</label>
                    <input
                      className="form-control"
                      placeholder="e.g., Delhi Cantt"
                      value={newPost.location}
                      onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Post Details *</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    placeholder="Describe your issue or question in detail..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-light fw-semibold" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-new-post px-4" onClick={handleCreatePost}>
                  Publish Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ Comments Modal / Drawer ------------------ */}
      {activeCommentsPost && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-dark">
                  💬 Comments ({activeCommentsPost.comments?.length || 0})
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setActiveCommentsPost(null)}
                ></button>
              </div>
              <div className="modal-body p-4" style={{ maxHeight: "400px", overflowY: "auto" }}>
                <h6 className="fw-bold mb-3">{activeCommentsPost.title}</h6>
                {activeCommentsPost.comments && activeCommentsPost.comments.length > 0 ? (
                  activeCommentsPost.comments.map((c, i) => (
                    <div key={i} className="bg-light p-3 rounded mb-2 border">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="fw-bold text-dark small">
                          {c.userName || c.user?.name || "Member"}
                        </span>
                        <small className="text-muted">
                          {new Date(c.createdAt || Date.now()).toLocaleTimeString()}
                        </small>
                      </div>
                      <p className="mb-0 small text-secondary">{c.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center py-3">
                    No comments yet. Start the discussion!
                  </p>
                )}
              </div>
              <div className="modal-footer border-top p-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Write a supportive response..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment(activeCommentsPost._id)}
                  />
                  <button
                    className="btn btn-success fw-bold px-4"
                    onClick={() => handleAddComment(activeCommentsPost._id)}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forums;