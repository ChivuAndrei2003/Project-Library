// script.js

// --- Data Storage ---

// Array to store all book objects. This is the central place where your library data lives.
const myLibrary = [];

// --- Book Object ---

// Constructor function for creating Book objects.
// A constructor is like a blueprint for creating objects with specific properties and methods.
function Book(title, author, pages, read, id) {
  // 'this' refers to the specific instance of the Book object being created.
  this.title = title;       // The title of the book (String)
  this.author = author;     // The author of the book (String)
  this.pages = pages;       // The number of pages (Number/String)
  this.read = read;         // Read status, should be "YES" or "NO" (String)
  
  this.id = id || crypto.randomUUID();
}

// Method to toggle the read status of a book instance.
Book.prototype.toggleRead = function() {
 
  this.read = this.read === "YES" ? "NO" : "YES";
  console.log(`Toggled read status for ${this.title} to: ${this.read}`); // Log change
};

// --- Library Management Functions ---
function addBookToLibrary(title, author, pages, read) {

  const newBook = new Book(title, author, pages, read);
  // Add the newly created book object to the end of the myLibrary array.
  myLibrary.push(newBook);
  console.log('Added book:', newBook); // Log added book
  console.log('Current Library:', myLibrary); // Log current state of the array
  // Return the newly created book object (optional, but can be useful).
  return newBook;
}

// Function to remove a book from the myLibrary array by its ID.
function removeBookFromLibrary(bookId) {
  // Find the index (position) of the book with the matching ID in the array.
  const bookIndex = myLibrary.findIndex(book => book.id === bookId);
  // Check if a book with that ID was actually found (index will be -1 if not found).
  if (bookIndex > -1) {
    // Remove 1 element from the array starting at the found index.
    myLibrary.splice(bookIndex, 1);
    console.log(`Removed book with ID: ${bookId}`); // Log removal
    console.log('Current Library:', myLibrary); // Log current state
  } else {
    console.warn(`Could not find book with ID ${bookId} to remove.`); // Warn if not found
  }
}

// --- DOM Manipulation & Rendering ---

// Get references to the necessary HTML elements.
const libraryContentDiv = document.querySelector('.library-content'); // Container for book cards
const addBookBTN = document.querySelector(".button-add-book");      // "Add book" button
const dialog = document.querySelector(".myDialog");                 // The pop-up dialog/modal
const form = document.getElementById("nameForm");                   // The form inside the dialog
const titleInput = document.getElementById('titleInput');           // Form input for title
const authorInput = document.getElementById('authorInput');         // Form input for author
const pagesInput = document.getElementById('pagesInput');           // Form input for pages
const readCheckbox = document.getElementById('checkbox');           // Form checkbox for read status

// Function to create the HTML element (a 'card') for a single book object.
function createBookCard(book) {
  // Create the main container div for the card.
  const card = document.createElement('div');
  card.classList.add('card'); // Add the 'card' class for styling.
  card.dataset.id = book.id; // Store the book's unique ID on the element using a data-* attribute.

  // Create and append the title element.
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('card-title');
  const titleH1 = document.createElement('h1');
  titleH1.textContent = book.title; // Set text from the book object.
  titleDiv.appendChild(titleH1);
  card.appendChild(titleDiv);

  // Create and append the author element.
  const authorDiv = document.createElement('div');
  authorDiv.classList.add('card-author');
  const authorP = document.createElement('p');
  authorP.textContent = book.author; // Set text from the book object.
  authorDiv.appendChild(authorP);
  card.appendChild(authorDiv);

  // Create and append the pages element.
  const pagesDiv = document.createElement('div');
  pagesDiv.classList.add('card-pages-number');
  const pagesP = document.createElement('p');
  pagesP.textContent = `${book.pages} pages`; // Set text from the book object.
  pagesDiv.appendChild(pagesP);
  card.appendChild(pagesDiv);

  // Create the "Read/Unread" status button.
  const readStatusButton = document.createElement('button');
  readStatusButton.classList.add('button-read-status');
  const readStatusP = document.createElement('p');
  // Set initial text based on the book's 'read' property.
  readStatusP.textContent = book.read === 'YES' ? 'Read' : 'Unread';
  readStatusButton.appendChild(readStatusP);
  // Add event listener for toggling read status.
  readStatusButton.addEventListener('click', () => {
    book.toggleRead(); // Update the 'read' property in the book object.
    // Update the button's text immediately to reflect the change.
    readStatusP.textContent = book.read === 'YES' ? 'Read' : 'Unread';
  });
  card.appendChild(readStatusButton);

  // Create the "Remove" button.
  const removeButton = document.createElement('button');
  removeButton.classList.add('button-remove-book');
  const removeP = document.createElement('p');
  removeP.textContent = 'Remove';
  removeButton.appendChild(removeP);
  // Add event listener for removing the book.
  removeButton.addEventListener('click', () => {
    removeBookFromLibrary(book.id); // Remove book from the myLibrary array.
    renderLibrary(); // Re-render the entire library display.
   
  });
  card.appendChild(removeButton);

  // Return the fully constructed card element.
  return card;
}

// Function to render the entire library to the DOM.
// It clears the current display and rebuilds it from the myLibrary array.
function renderLibrary() {
  console.log("Rendering library..."); // Log when rendering starts
  // Clear any existing cards from the display area.
  libraryContentDiv.innerHTML = ''; // Remove all child elements.

  // Check if the library is empty.
  if (myLibrary.length === 0) {
    console.log("Library is empty.");
  } else {
    // Loop through each book object in the myLibrary array.
    myLibrary.forEach(book => {
      // Create the HTML card element for the current book.
      const bookCard = createBookCard(book);
      // Append the created card to the library display area.
      libraryContentDiv.appendChild(bookCard);
    });
  }
  console.log("Rendering complete.");
}

// --- Event Listeners ---

// Event listener for the "Add book" button.
addBookBTN.addEventListener("click", () => {
  form.reset(); // Clear the form fields before showing.
  dialog.showModal(); // Open the dialog window.
});

// Event listener for the form submission inside the dialog.
form.addEventListener("submit", (event) => {
  // Prevent the default form submission behavior (which would try to navigate).
  event.preventDefault();

  // Retrieve the values entered by the user in the form fields.
  const title = titleInput.value;
  const author = authorInput.value;
  const pages = pagesInput.value; // Get pages value
  // Determine the read status based on whether the checkbox is checked.
  const readStatus = readCheckbox.checked ? "YES" : "NO";

  // Add the new book data to our library array.
  addBookToLibrary(title, author, pages, readStatus);

  // Close the dialog window.
  dialog.close();

  // Re-render the library display to include the new book.
  renderLibrary();

  // No need to reset form here, dialog.close() usually preserves state
  // until reopened, and we reset it before showing anyway.
});

// --- Initial Setup ---
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, "YES");
addBookToLibrary("1984", "George Orwell", 328, "NO");
addBookToLibrary("To Kill a Mockingbird", "Harper Lee", 281, "YES");

// Call renderLibrary() once when the script loads to display any initial books.
renderLibrary();
