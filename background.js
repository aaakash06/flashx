// Initialize storage with empty flashcards array if it doesn't exist
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["flashcards"], (result) => {
    if (!result.flashcards) {
      chrome.storage.local.set({ flashcards: [] });
    }
  });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CREATE_FLASHCARD") {
    // Create a new flashcard object
    const newFlashcard = {
      id: Date.now().toString(),
      content: message.content,
      url: message.url,
      title: message.title,
      createdAt: new Date().toISOString(),
    };

    // Add the new flashcard to storage
    chrome.storage.local.get(["flashcards"], (result) => {
      const flashcards = result.flashcards || [];
      flashcards.unshift(newFlashcard); // Add to beginning of array
      chrome.storage.local.set({ flashcards }, () => {
        sendResponse({ success: true });
      });
    });
    return true; // Required for async response
  }
});
