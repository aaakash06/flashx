// DOM Elements
const flashcardsList = document.getElementById("flashcards-list");
const createFlashcardButton = document.getElementById("createFlashcard");

// Create flashcard element
const createFlashcardElement = (flashcard) => {
  const card = document.createElement("div");
  card.className = "flashcard";
  card.dataset.id = flashcard.id;

  const content = document.createElement("div");
  content.className = "flashcard-content";
  content.textContent = flashcard.content;

  const actions = document.createElement("div");
  actions.className = "flashcard-actions";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteFlashcard(flashcard.id));

  const sourceLink = document.createElement("button");
  sourceLink.textContent = "View Source";
  sourceLink.addEventListener("click", () => {
    chrome.tabs.create({ url: flashcard.url });
  });

  actions.appendChild(sourceLink);
  actions.appendChild(deleteButton);

  card.appendChild(content);
  card.appendChild(actions);

  return card;
};

// Load flashcards from storage
const loadFlashcards = () => {
  chrome.storage.local.get(["flashcards"], (result) => {
    const flashcards = result.flashcards || [];
    flashcardsList.innerHTML = "";

    if (flashcards.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.textContent =
        "No flashcards yet. Select text on any webpage to create one!";
      emptyState.style.cssText = `
        text-align: center;
        color: #6B7280;
        padding: 2rem;
        font-size: 0.875rem;
      `;
      flashcardsList.appendChild(emptyState);
      return;
    }

    flashcards.forEach((flashcard) => {
      flashcardsList.appendChild(createFlashcardElement(flashcard));
    });
  });
};

// Delete a flashcard
const deleteFlashcard = (id) => {
  chrome.storage.local.get(["flashcards"], (result) => {
    const flashcards = result.flashcards.filter((card) => card.id !== id);
    chrome.storage.local.set({ flashcards }, () => {
      loadFlashcards();
    });
  });
};

// Create flashcard button click handler
createFlashcardButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "SHOW_CREATE_BUTTON" });
    window.close();
  });
});

// Load flashcards when popup opens
document.addEventListener("DOMContentLoaded", loadFlashcards);
