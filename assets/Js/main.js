// Book Class

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class

class UI {
  static displayBook() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }
  static addBookToList(book) {
    const list = document.getElementById("book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><button class = "btn btn-danger btn-sm delete" onclick = "deleteBook(this)" >Delete</button></td>
    `;
    list.appendChild(row);
  }
  static deleteBook(book) {
    if (book.classList.contains("delete")) {
      book.parentElement.parentElement.remove();
    }
  }
  static showAlert(msg, color) {
    const div = document.createElement("div");
    div.className = `alert alert-${color}`;
    div.appendChild(document.createTextNode(msg));
    const container = document.querySelector(".container");
    const form = document.getElementById("book-form");
    container.insertBefore(div, form);
    // Vanish in 3 secound
    setTimeout(() => document.querySelector(".alert").remove(), 1000);
  }
  static clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

// Store Class

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((ele, ind) => {
      if (ele.isbn === isbn) {
        books.splice(ind, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display a book

document.addEventListener("DOMContentLoaded", UI.displayBook());

// Event: Add a Book

document.getElementById("book-form").addEventListener("submit", (e) => {
  /// Prevent actual submit
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  // Validate
  if (title === `` || author === "" || isbn === "") {
    UI.showAlert("Plase fill in all fields", "danger");
  } else {
    // Instantiate a Book

    const book = new Book(title, author, isbn);

    // Add Book to UI
    UI.addBookToList(book);
    // Add Book to LocalStorage
    Store.addBook(book);
    // Show success message
    UI.showAlert(`The ${book.title} book successfully Added`, "success");
    // Clear Fields
    UI.clearFields();
  }
});

// Event: remove a book

document.getElementById("book-list").addEventListener("click", (e) => {
  // Remove book from Store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});
function deleteBook(t) {
  // Remove book from UI
  UI.deleteBook(t);
  // Show success message
  UI.showAlert(`The book successfully removed`, "success");
}
