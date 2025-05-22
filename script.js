// --- Book Class ---
class Book {
  constructor(title, author, pages, read, id = crypto.randomUUID()) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read; // "YES" or "NO"
    this.id = id; // Ensure id is assigned
  }

  toggleRead() {
    // Corrected logic:
    this.read = this.read === "YES" ? "NO" : "YES";
    console.log(`Toggled read status for ${this.title} to: ${this.read}`);
  }
}

// --- Library Class ---
class Library {
  constructor() {
    this.books = []; // Array to store all book objects

    // DOM Element References
    this.libraryContentDiv = document.querySelector('.library-content');
    this.addBookBTN = document.querySelector(".button-add-book");
    this.dialog = document.querySelector(".myDialog");
    this.form = document.getElementById("nameForm");
    this.titleInput = document.getElementById('titleInput');
    this.authorInput = document.getElementById('authorInput');
    this.pagesInput = document.getElementById('pagesInput');
    this.readCheckbox = document.getElementById('checkbox');

    this.initEventListeners();
    this.loadInitialBooks(); // Load initial books and render
  }

  addBook(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);
    this.books.push(newBook);
    console.log('Added book:', newBook);
    console.log('Current Library:', this.books);
    this.render(); // Re-render after adding a book
    return newBook;
  }

  removeBook(bookId) {
    const bookIndex = this.books.findIndex(book => book.id === bookId);
    if (bookIndex > -1) {
      this.books.splice(bookIndex, 1);
      console.log(`Removed book with ID: ${bookId}`);
      console.log('Current Library:', this.books);
      this.render(); // Re-render after removing a book
    } else {
      console.warn(`Could not find book with ID ${bookId} to remove.`);
    }
  }

  toggleBookReadStatus(bookId) {
    const book = this.books.find(b => b.id === bookId);
    if (book) {
      book.toggleRead();
      this.render(); // Re-render to reflect the change in the UI
    } else {
      console.warn(`Could not find book with ID ${bookId} to toggle read status.`);
    }
  }

  createBookCard(book) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = book.id;

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('card-title');
    const titleH1 = document.createElement('h1');
    titleH1.textContent = book.title;
    titleDiv.appendChild(titleH1);
    card.appendChild(titleDiv);

    const authorDiv = document.createElement('div');
    authorDiv.classList.add('card-author');
    const authorP = document.createElement('p');
    authorP.textContent = book.author;
    authorDiv.appendChild(authorP);
    card.appendChild(authorDiv);

    const pagesDiv = document.createElement('div');
    pagesDiv.classList.add('card-pages-number');
    const pagesP = document.createElement('p');
    pagesP.textContent = `${book.pages} pages`;
    pagesDiv.appendChild(pagesP);
    card.appendChild(pagesDiv);

    const readStatusButton = document.createElement('button');
    readStatusButton.classList.add('button-read-status');
    const readStatusP = document.createElement('p');
    readStatusP.textContent = book.read === 'YES' ? 'Read' : 'Unread';
    readStatusButton.appendChild(readStatusP);
    readStatusButton.addEventListener('click', () => {
      this.toggleBookReadStatus(book.id); // Use Library method
    });
    card.appendChild(readStatusButton);

    const removeButton = document.createElement('button');
    removeButton.classList.add('button-remove-book');
    const removeP = document.createElement('p');
    removeP.textContent = 'Remove';
    removeButton.appendChild(removeP);
    removeButton.addEventListener('click', () => {
      this.removeBook(book.id); // Use Library method
    });
    card.appendChild(removeButton);

    return card;
  }

  render() {
    console.log("Rendering library...");
    this.libraryContentDiv.innerHTML = ''; // Clear existing cards

    if (this.books.length === 0) {
      console.log("Library is empty.");
      // Optional: Display a message
      // const emptyMessage = document.createElement('p');
      // emptyMessage.textContent = "Your library is empty. Add some books!";
      // this.libraryContentDiv.appendChild(emptyMessage);
    } else {
      this.books.forEach(book => {
        const bookCard = this.createBookCard(book);
        this.libraryContentDiv.appendChild(bookCard);
      });
    }
    console.log("Rendering complete.");
  }

  initEventListeners() {
    this.addBookBTN.addEventListener("click", () => {
      this.form.reset();
      this.dialog.showModal();
    });

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = this.titleInput.value;
      const author = this.authorInput.value;
      const pages = this.pagesInput.value;
      const readStatus = this.readCheckbox.checked ? "YES" : "NO";

      this.addBook(title, author, pages, readStatus);
      this.dialog.close();
      // No need to call render() here as addBook() already does it.
    });
  }

  loadInitialBooks() {
    // Add some initial books for testing/demonstration.
    this.addBook("The Hobbit", "J.R.R. Tolkien", 295, "YES");
    this.addBook("1984", "George Orwell", 328, "NO");
    this.addBook("To Kill a Mockingbird", "Harper Lee", 281, "YES");
    // Note: render() will be called by each addBook, so a final explicit render()
    // after all initial books isn't strictly necessary if addBook handles it.
    // If addBook didn't call render, we would call this.render() here.
  }
}

// --- Application Initialization ---

// Create an instance of the Library. This will also set up event listeners and render initial books.
const myAppLibrary = new Library();