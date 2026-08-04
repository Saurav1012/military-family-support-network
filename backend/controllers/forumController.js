import Forum from "../models/Forum.js";

/* ==========================================
   Create Forum Post
========================================== */
export const createPost = async (req, res) => {
  try {
    const { title, content, topic, category, location } = req.body;

    const post = await Forum.create({
      title,
      content,
      topic: topic || category || "General",
      location: location || "General",
      author: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Forum post created successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ==========================================
   Get All Forum Posts
========================================== */
export const getPosts = async (req, res) => {
  try {
    const posts = await Forum.find()
      .populate("author", "name role city state")
      .sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ==========================================
   Add Comment to Post (🟢 NEW)
========================================== */
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const post = await Forum.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const newComment = {
      user: req.user._id,
      userName: req.user.name || "Member",
      text: text.trim(),
    };

    post.comments.push(newComment);
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comments: post.comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ==========================================
   Like / Unlike Forum Post
========================================== */
export const toggleLike = async (req, res) => {
  try {
    const post = await Forum.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post unliked",
        likesCount: post.likes.length,
      });
    }

    post.likes.push(req.user._id);
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post liked",
      likesCount: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ==========================================
   Toggle Pin Post (Admin Only) (🟢 NEW)
========================================== */
export const togglePinPost = async (req, res) => {
  try {
    const post = await Forum.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    post.isPinned = !post.isPinned;
    await post.save();

    return res.status(200).json({
      success: true,
      message: post.isPinned ? "Post pinned" : "Post unpinned",
      isPinned: post.isPinned,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ==========================================
   Delete Forum Post
========================================== */
export const deletePost = async (req, res) => {
  try {
    const post = await Forum.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.toLowerCase() === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await post.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};