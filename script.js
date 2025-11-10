/* --------------------------
   DOM Element Selection
   --------------------------
   Using getElementById to grab HTML elements so
   we can read input values, update content, and handle user actions.
   Covers Lesson 2: DOM Manipulation basics.
*/
const form = document.getElementById('postForm'); // main form for adding/editing posts
const titleInput = document.getElementById('title'); // input for post title
const contentInput = document.getElementById('content'); // textarea for post content
const titleError = document.getElementById('titleError'); // span to show title validation
const contentError = document.getElementById('contentError'); // span to show content validation
const postsContainer = document.getElementById('posts'); // div to display all posts
const noPostsMsg = document.getElementById('no-posts'); // message shown when no posts exist
const submitBtn = document.getElementById('submit-btn'); // main submit button
const cancelEditBtn = document.getElementById('cancel-edit'); // cancel editing button

/* --------------------------
    State Variables
   --------------------------
   Using let to store dynamic values. 
   posts: array to hold all post objects
   editingId: null if creating a new post, holds post id when editing
   This covers Lesson 3: Variables and Data Types
*/
let posts = []; 
let editingId = null;

/* --------------------------
    Helper Functions
   --------------------------
   Simple reusable functions to make code cleaner and readable.
   Lesson 4: Functions and Reuse
*/

/* generateId()
   Creates a simple unique identifier using current time and a random number.
   This helps track each post for editing or deleting.
   Covers Lesson 4: Functions, return values
*/
function generateId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
}

/* clearErrors()
   Clears any validation messages in the form.
   Called before checking inputs to prevent old messages from lingering.
   Lesson 5: DOM updates and innerText/textContent
*/
function clearErrors() {
  titleError.textContent = '';
  contentError.textContent = '';
}

/* resetForm()
   Resets input fields after creating or editing a post.
   Sets editingId back to null, updates button text, and hides cancel button.
   Lesson 5: Using functions to reset UI
*/
function resetForm() {
  form.reset(); // clears all input fields
  editingId = null; // exit edit mode
  submitBtn.textContent = 'Add Post'; // reset submit button label
  cancelEditBtn.classList.add('hidden'); // hide cancel edit button
  clearErrors(); // remove any previous error messages
}

/* validateForm(title, content)
   Checks if title and content are not empty.
   Returns true if both are filled, otherwise false.
   Displays messages if fields are empty.
   Covers Lesson 3: Conditional logic and validation
*/
function validateForm(title, content) {
  clearErrors(); // remove previous messages
  let valid = true; // assume valid until proven otherwise

  //check if the title input is empty or only spaces
  if (!title || title.trim() === '') {
    titleError.textContent = 'Please enter a title.'; // show message for title
    valid = false; 
    // !title → true if title is empty, null, or undefined
    // title.trim() removes spaces at the start and end
    // title.trim() === '' → true if user typed only spaces
    // The || means “or”: if either condition is true, the title is invalid
    // Set the valid variable to false
    // This stops the form from submitting because inputs are invalid
  }

  if (!content || content.trim() === '') {
    contentError.textContent = 'Please enter content.'; //  Display an error message next to the content field
    valid = false;
    // !content → true if content is empty, null, or undefined
    // content.trim() removes spaces at the start and end
    // content.trim() === '' → true if user typed only spaces
    // This stops the form from submitting until corrected
  }

  return valid; // true if both inputs are filled
}

/* --------------------------
   Render Posts
   --------------------------
   Dynamically displays all posts stored in the posts array.
   Uses a simple for loop to create div elements for each post.
   
*/
function renderPosts() {
  postsContainer.innerHTML = ''; // clear previous posts

  if (posts.length === 0) {
    noPostsMsg.style.display = 'block'; // show message if no posts
    return;
  } else {
    noPostsMsg.style.display = 'none'; // hide message when posts exist
  }

  // Loop through each post in the array
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    // container div for each post
    const postDiv = document.createElement('div'); 
    postDiv.classList.add('post'); // add CSS class for styling
    postDiv.setAttribute('data-id', post.id); // store post ID for JS actions

    // Insert HTML for title, content, and buttons
    postDiv.innerHTML =
      '<h3>' + post.title + '</h3>' +
      '<p>' + post.content + '</p>' +
      '<div class="controls">' +
      '<button class="btn-edit" data-action="edit">Edit</button>' +
      '<button class="btn-delete" data-action="delete">Delete</button>' +
      '</div>';

    // Append the post div to the container
    postsContainer.appendChild(postDiv);
  }
}

/* --------------------------
   Handle Form Submission
   --------------------------
   This function handles creating new posts or updating existing ones.
   Covers Lesson 5: Event handling and form submission
*/
function handleFormSubmit(event) {
  event.preventDefault(); // stop the form from reloading the page

  const title = titleInput.value; // read current input value
  const content = contentInput.value; // read current textarea value

  // Validate form before proceeding
  if (!validateForm(title, content)) {
    return; // stop if invalid
  }

  if (editingId) {
    // We are editing an existing post
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === editingId) {
        posts[i].title = title; // update title
        posts[i].content = content; // update content
        break; // stop loop after finding post
      }
    }
  } else {
    // Creating a new post
    const newPost = {
      id: generateId(),
      title: title,
      content: content
    };
    posts.push(newPost); // add new post to array
  }

  renderPosts(); // update the posts on the page
  resetForm(); // clear form fields and reset UI
}

/* --------------------------
   Handle Edit/Delete Clicks
   --------------------------
   Uses one event listener on the container (event delegation) 
   to handle clicks on any edit or delete button.
   Covers Lesson 5: Event delegation
*/
function handlePostsClick(event) {
  const action = event.target.getAttribute('data-action'); // check if button clicked
  if (!action) return; // ignore clicks outside buttons

  // Find parent post div
  let postDiv = event.target;
  while (postDiv && !postDiv.classList.contains('post')) {
    postDiv = postDiv.parentElement;
  }
  if (!postDiv) return;

  const id = postDiv.getAttribute('data-id'); // get post ID

  if (action === 'delete') {
    // Delete post from array
    posts = posts.filter(function(post) {
      return post.id !== id;
    });
    renderPosts(); // re-render posts
  } else if (action === 'edit') {
    // Edit post: fill form with existing values
    const postToEdit = posts.find(function(post) {
      return post.id === id;
    });
    if (!postToEdit) return;

    titleInput.value = postToEdit.title; // populate title
    contentInput.value = postToEdit.content; // populate content
    editingId = id; // mark post being edited
    submitBtn.textContent = 'Save Changes'; // update button text
    cancelEditBtn.classList.remove('hidden'); // show cancel button
  }
}

/* --------------------------
   Cancel Edit Button
   --------------------------
   Reverts form to normal create mode
   Lesson 5: Functions for UI updates
*/
function handleCancelEdit() {
  resetForm();
}

/* --------------------------
   Initialize App
   --------------------------
   Adds event listeners and renders initial posts
   Lesson 5: Event listeners and initialization
*/
function init() {
  renderPosts(); // display posts (empty at start)
  form.addEventListener('submit', handleFormSubmit); // listen for submit
  postsContainer.addEventListener('click', handlePostsClick); // listen for edit/delete
  cancelEditBtn.addEventListener('click', handleCancelEdit); // listen for cancel button
}

// Start app when script loads
init();
