
const form = document.getElementById("noteForm");
const title = document.getElementById("title");
const content = document.getElementById("content");
const tags = document.getElementById("tags");
const notesDiv = document.getElementById("notes");
const message = document.getElementById("message");

let editingId = null;

// Get all notes
async function getNotes() {
  const response = await fetch("/notes");
  const notes = await response.json();

  notesDiv.innerHTML = "";

  notes.forEach(note => {
    const card = document.createElement("div");
    card.className = "note";

    const heading = document.createElement("h3");
    heading.textContent = note.title;

    const text = document.createElement("p");
    text.textContent = note.content;

    const tagText = document.createElement("p");
    tagText.textContent = "Tags: " + note.tags.join(", ");

    const created = document.createElement("small");
    created.textContent = "Created: " +
      new Date(note.createdAt).toLocaleString();

    const updated = document.createElement("p");
    updated.textContent = "Updated: " +
      new Date(note.updatedAt).toLocaleString();

    card.append(heading, text, tagText, created, updated);

    // Edit the whole note with PUT
    const editButton = document.createElement("button");
    editButton.textContent   = "Edit All";

    editButton.onclick = () => {
      title.value = note.title;
      content.value = note.content;

      Array.from(tags.options).forEach(option => {
        option.selected = note.tags.includes(option.value);
      });

      editingId = note.id;
      form.querySelector("button").textContent = "Save Changes";
    };

    // Edit only the title with PATCH
    const patchButton = document.createElement("button");
    patchButton.textContent = "Change Title";

    patchButton.onclick = async () => {
      const newTitle = prompt("Enter a new title", note.title);

      if (newTitle === null) return;

      if (!newTitle.trim()) {
        alert("Title cannot be empty");
        return;
      }

      const response = await fetch("/notes/" + note.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle })
      });

      //read backend response
      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Could not update title");
        return;
      }

      getNotes();
    };

    // Delete a note
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete";

    deleteButton.onclick = async () => {
      if (!confirm("Delete this note?")) return;

      const response = await fetch("/notes/" + note.id, {
        method: "DELETE"
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Could not delete note");
        return;
      }

      getNotes();
    };

    card.append(editButton, patchButton, deleteButton);
    notesDiv.appendChild(card);
  });
}

// Create a note with POST or replace it with PUT
form.onsubmit = async event => {
  event.preventDefault();

  const selectedTags = Array.from(tags.selectedOptions, option => option.value);

  const note = {
    title: title.value,
    content: content.value,
    tags: selectedTags
  };

  const url = editingId === null
    ? "/notes"
    : "/notes/" + editingId;

  const method = editingId === null ? "POST" : "PUT";

  const response = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note)
  });

  const result = await response.json();

  if (!response.ok) {
    message.textContent = result.message || "Something went wrong";
    return;
  }

  message.textContent = "Note saved successfully";

  form.reset();
  editingId = null;
  form.querySelector("button").textContent = "Create Note";

  getNotes();
};

// Load notes when the page opens
getNotes();
