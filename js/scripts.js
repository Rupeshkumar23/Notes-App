const notesContainer = document.querySelector(".notes-container");
const createBtn = document.querySelector(".btn");
const textarea = document.querySelector("textarea");
const emptyNotes = document.querySelector(".empty-notes");
const themeToggle = document.getElementById("theme-toggle");

// Theme switching functionality
function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeToggle.checked = true;
    }
}

themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
        document.body.classList.add("dark-theme");
        localStorage.setItem("theme", "dark");
    } else {
        document.body.classList.remove("dark-theme");
        localStorage.setItem("theme", "light");
    }
});

// Load theme when the page loads
loadTheme();

// Format date for note timestamp
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return new Date(date).toLocaleDateString(undefined, options);
}

// Load notes from localStorage when the page loads
function showNotes() {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    
    if (notes.length === 0) {
        emptyNotes.style.display = "block";
    } else {
        emptyNotes.style.display = "none";
    }

    notesContainer.innerHTML = "";
    
    notes.forEach((noteObj, index) => {
        let noteElement = document.createElement("div");
        noteElement.classList.add("note");
        noteElement.innerHTML = `
            <p>${noteObj.text}</p>
            <div class="note-timestamp">${formatDate(noteObj.timestamp)}</div>
            <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="delete" class="delete-icon" data-index="${index}">
        `;
        notesContainer.appendChild(noteElement);
    });
}

// Show notes when the page loads
showNotes();

// Event listener for the create button
createBtn.addEventListener("click", () => {
    if (textarea.value.trim() === "") {
        alert("Please enter a note.");
        return;
    }

    // Get existing notes from localStorage or initialize as empty array
    let notes = JSON.parse(localStorage.getItem("notes") || "[]");
    
    // Create a note object with text and timestamp
    const noteObj = {
        text: textarea.value,
        timestamp: new Date().toISOString()
    };
    
    // Add new note to the array
    notes.push(noteObj);
    
    // Save updated notes array to localStorage
    localStorage.setItem("notes", JSON.stringify(notes));
    
    // Clear the textarea
    textarea.value = "";
    
    // Refresh the notes display
    showNotes();
});

// Event delegation for delete buttons
notesContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
        const index = e.target.getAttribute("data-index");
        let notes = JSON.parse(localStorage.getItem("notes") || "[]");
        
        // Remove the note at the specified index
        notes.splice(index, 1);
        
        // Save the updated notes array to localStorage
        localStorage.setItem("notes", JSON.stringify(notes));
        
        // Refresh the notes display
        showNotes();
    }
});

// Handle Enter key with Shift key to create a new line
textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        createBtn.click();
    }
});