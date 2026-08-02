import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

import {
  FaHeart,
  FaTrash,
  FaSearch,
  FaPlus,
} from "react-icons/fa";

import "./Forum.css";

const Forum = () => {

  const user = JSON.parse(localStorage.getItem("user"));

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    topic: "Family",
    location: "",
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get("/forum");
      setPosts(data.posts);
    } catch (error) {
      toast.error("Unable to load posts");
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    try {
      await API.post("/forum", form);

      toast.success("Post Created");

      setShowModal(false);

      setForm({
        title: "",
        content: "",
        topic: "Family",
        location: "",
      });

      fetchPosts();

    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  const likePost = async (id) => {
    try {
      await API.put(`/forum/${id}/like`);
      fetchPosts();
    } catch (error) {
      toast.error("Unable to like");
    }
  };

  const deletePost = async (id) => {
    try {
      await API.delete(`/forum/${id}`);
      toast.success("Deleted");
      fetchPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Access denied");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success"></div>
      </div>
    );

  return (
    <div className="container py-4">

      <div className="d-flex justify-content-between mb-4">

        <div className="input-group w-50">

          <span className="input-group-text">
            <FaSearch />
          </span>

          <input
            className="form-control"
            placeholder="Search Posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <button
          className="btn btn-success"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> New Post
        </button>

      </div>

      <div className="row">

        {posts
          .filter((p) =>
            p.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((post) => (

            <div
              className="col-lg-6 mb-4"
              key={post._id}
            >

              <div className="card shadow h-100">

                <div className="card-body">

                  <h5>{post.title}</h5>

                  <p>{post.content}</p>

                  <small>

                    {post.author.name}

                    {" • "}

                    {post.location}

                  </small>

                  <div className="mt-3 d-flex justify-content-between">

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => likePost(post._id)}
                    >
                      <FaHeart />

                      {" "}

                      {post.likes.length}
                    </button>

                    {(user.role === "admin" ||
                      user.id === post.author._id) && (

                      <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => deletePost(post._id)}
                      >
                        <FaTrash />
                      </button>

                    )}

                  </div>

                </div>

              </div>

            </div>

          ))}

      </div>

      {showModal && (

        <div className="modal d-block">

          <div className="modal-dialog">

            <div className="modal-content">

              <div className="modal-header">

                <h5>Create Post</h5>

                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />

              </div>

              <div className="modal-body">

                <input
                  className="form-control mb-3"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                />

                <textarea
                  className="form-control mb-3"
                  placeholder="Content"
                  rows="4"
                  value={form.content}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      content: e.target.value,
                    })
                  }
                />

                <input
                  className="form-control mb-3"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                />

                <select
                  className="form-select"
                  value={form.topic}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      topic: e.target.value,
                    })
                  }
                >
                  <option>Deployment</option>
                  <option>Family</option>
                  <option>Education</option>
                  <option>Counselling</option>
                  <option>Relocation</option>
                </select>

              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-success"
                  onClick={createPost}
                >
                  Publish
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Forum;