const fs = require("fs").promises;
const path = require("path");

const postsFilePath = path.join(__dirname, "../data/posts.json");

async function readPosts() {
  const data = await fs.readFile(postsFilePath, "utf8");
  return JSON.parse(data);
}

async function writePosts(posts) {
  await fs.writeFile(
    postsFilePath,
    JSON.stringify(posts, null, 2),
    "utf8"
  );
}

function validatePostData(data) {
  return (
    data &&
    typeof data.title === "string" &&
    data.title.trim() !== "" &&
    typeof data.content === "string" &&
    data.content.trim() !== "" &&
    typeof data.author === "string" &&
    data.author.trim() !== "" &&
    typeof data.category === "string" &&
    data.category.trim() !== ""
  );
}

// GET /posts
async function getPosts(req, res, next) {
  try {
    const posts = await readPosts();

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

// GET /posts/:id
async function getPostById(req, res, next) {
  try {
    const posts = await readPosts();
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid post ID"
      });
    }

    const post = posts.find((post) => post.id === id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
}

// POST /posts
async function createPost(req, res, next) {
  try {
    const { title, content, author, category } = req.body;

    if (!validatePostData(req.body)) {
      return res.status(400).json({
        message: "Title, content, author and category are required"
      });
    }

    const posts = await readPosts();

    const nextId =
      posts.length > 0
        ? Math.max(...posts.map((post) => post.id)) + 1
        : 1;

    const newPost = {
      id: nextId,
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      category: category.trim(),
      createdDate: new Date().toISOString().split("T")[0]
    };

    posts.push(newPost);

    await writePosts(posts);

    res.status(201).json({
      message: "Post created successfully",
      post: newPost
    });
  } catch (error) {
    next(error);
  }
}

// PUT /posts/:id
async function updatePost(req, res, next) {
  try {
    const { title, content, author, category } = req.body;
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid post ID"
      });
    }

    if (
      title === undefined ||
      content === undefined ||
      author === undefined ||
      category === undefined
    ) {
      return res.status(400).json({
        message: "Title, content, author and category are required"
      });
    }

    if (!validatePostData(req.body)) {
      return res.status(400).json({
        message: "Title, content, author and category cannot be empty"
      });
    }

    const posts = await readPosts();

    const postIndex = posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    posts[postIndex] = {
      ...posts[postIndex],
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      category: category.trim()
    };

    await writePosts(posts);

    res.status(200).json({
      message: "Post updated successfully",
      post: posts[postIndex]
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /posts/:id
async function deletePost(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid post ID"
      });
    }

    const posts = await readPosts();

    const postIndex = posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    const deletedPost = posts.splice(postIndex, 1)[0];

    await writePosts(posts);

    res.status(200).json({
      message: "Post deleted successfully",
      post: deletedPost
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};