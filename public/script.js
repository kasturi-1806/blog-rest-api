const postForm = document.getElementById("post-form");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const authorInput = document.getElementById("author");
const categoryInput = document.getElementById("category");

const submitButton = document.getElementById("submit-button");
const cancelButton = document.getElementById("cancel-button");
const refreshButton = document.getElementById("refresh-button");

const postsContainer = document.getElementById("posts-container");
const message = document.getElementById("message");
const formTitle = document.getElementById("form-title");

let editingPostId = null;

// Load all posts from the API
async function loadPosts() {
  try {
    postsContainer.innerHTML = "<p>Loading posts...</p>";

    const response = await fetch("/posts");

    if (!response.ok) {
      throw new Error("Unable to load posts.");
    }

    const posts = await response.json();

    displayPosts(posts);
  } catch (error) {
    postsContainer.innerHTML = `<p>${error.message}</p>`;
  }
}

// Display posts on the page
function displayPosts(posts) {
  if (posts.length === 0) {
    postsContainer.innerHTML = "<p>No blog posts available.</p>";
    return;
  }

  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const postCard = document.createElement("article");

    postCard.className = "post-card";

    postCard.innerHTML = `
      <h3>${escapeHtml(post.title)}</h3>

      <div class="post-details">
        <strong>Author:</strong> ${escapeHtml(post.author)}
        &nbsp; | &nbsp;
        <strong>Category:</strong> ${escapeHtml(post.category)}
        &nbsp; | &nbsp;
        <strong>Created:</strong> ${escapeHtml(post.createdDate)}
      </div>

      <div class="post-content">
        ${escapeHtml(post.content)}
      </div>

      <div class="post-actions">
        <button class="edit-button" onclick="editPost(${post.id})">
          Edit
        </button>

        <button class="delete-button" onclick="deletePost(${post.id})">
          Delete
        </button>
      </div>
    `;

    postsContainer.appendChild(postCard);
  });
}

// Escape HTML before displaying API data
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Create a new post or update an existing post
async function handleFormSubmit(event) {
  event.preventDefault();

  const postData = {
    title: titleInput.value.trim(),
    content: contentInput.value.trim(),
    author: authorInput.value.trim(),
    category: categoryInput.value.trim()
  };

  if (
    !postData.title ||
    !postData.content ||
    !postData.author ||
    !postData.category
  ) {
    showMessage(
      "Title, content, author and category are required.",
      true
    );
    return;
  }

  try {
    let response;

    if (editingPostId === null) {
      response = await fetch("/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
      });
    } else {
      response = await fetch(`/posts/${editingPostId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
      });
    }

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Operation failed.", true);
      return;
    }

    if (editingPostId === null) {
      showMessage("Post created successfully.");
    } else {
      showMessage("Post updated successfully.");
    }

    resetForm();
    loadPosts();
  } catch (error) {
    showMessage("Unable to connect to the server.", true);
  }
}

// Populate the form for editing
async function editPost(id) {
  try {
    const response = await fetch(`/posts/${id}`);

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Unable to load post.", true);
      return;
    }

    editingPostId = data.id;

    titleInput.value = data.title;
    contentInput.value = data.content;
    authorInput.value = data.author;
    categoryInput.value = data.category;

    formTitle.textContent = "Edit Blog Post";
    submitButton.textContent = "Update Post";
    cancelButton.hidden = false;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  } catch (error) {
    showMessage("Unable to load post.", true);
  }
}

// Delete a post
async function deletePost(id) {
  const confirmed = confirm(
    "Are you sure you want to delete this post?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`/posts/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Unable to delete post.", true);
      return;
    }

    showMessage("Post deleted successfully.");

    loadPosts();
  } catch (error) {
    showMessage("Unable to connect to the server.", true);
  }
}

// Reset the form back to create mode
function resetForm() {
  postForm.reset();

  editingPostId = null;

  formTitle.textContent = "Create Blog Post";
  submitButton.textContent = "Create Post";
  cancelButton.hidden = true;
}

// Show a simple message
function showMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#b64242" : "#2f5d50";
}

// Event listeners
postForm.addEventListener("submit", handleFormSubmit);

cancelButton.addEventListener("click", () => {
  resetForm();
});

refreshButton.addEventListener("click", () => {
  loadPosts();
});

// Load posts when the page opens
loadPosts();