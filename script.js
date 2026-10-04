const form = document.querySelector("#note-form");
const input = document.querySelector("#note-input");
const category = document.querySelector("#note-category");
const list = document.querySelector("#notes-list");
const count = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

const STORAGE_KEY = "quicknotes";

let notes = loadNotes();

function loadNotes() {
  const saved = localStorage.getItem(STORAGE_KEY);

  return saved ? JSON.parse(saved) : [];
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function render(notesToDisplay = notes) {
  list.innerHTML = "";

  notesToDisplay.forEach((note) => {
    const li = document.createElement("li");
    li.classList.add("note");
    li.classList.add(`category-${note.category}`);

    const text = document.createElement("span");
    text.classList.add("note-text");
    text.textContent = note.text;

    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("note-category");
    categoryLabel.textContent = `Category: ${note.category}`;

    const date = document.createElement("span");
    date.classList.add("note-date");
    date.textContent = note.createdAt;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");

    deleteButton.addEventListener("click", () => deleteNote(note.id));

    li.appendChild(text);
    li.appendChild(categoryLabel);
    li.appendChild(date);
    li.appendChild(deleteButton);

    list.appendChild(li);
  });

  updateCount();
}

function updateCount() {
  if (notes.length === 0) {
    count.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    count.textContent = "You have 1 note.";
  } else {
    count.textContent = `You have ${notes.length} notes.`;
  }
}

function addNote(text, selectedCategory) {
  const newNote = {
    id: Date.now(),
    text: text,
    category: selectedCategory,
    createdAt: new Date().toLocaleString(),
  };

  notes.push(newNote);
  saveNotes();
  render();
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent =
      "Notes must be 200 characters or fewer.";
    return;
  }

  errorMessage.textContent = "";

  addNote(text, category.value);

  input.value = "";
  input.focus();
});

searchInput.addEventListener("input", () => {
  const searchText = searchInput.value.trim().toLowerCase();

  if (searchText === "") {
    render();
    return;
  }

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchText)
  );

  if (filteredNotes.length === 0) {
    list.innerHTML = "";

    const message = document.createElement("li");
    message.textContent = "No notes match your search.";
    list.appendChild(message);

    return;
  }

  render(filteredNotes);
});

render();