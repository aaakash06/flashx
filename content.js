// Create a floating button that appears when text is selected
const createFloatingButton = () => {
  const button = document.createElement("button");
  button.className = "flashx-floating-button";
  button.innerHTML = "Create Flashcard";
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 8px 16px;
    background-color: #4F46E5;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    z-index: 10000;
  `;
  return button;
};

// Add hover effects to the floating button
const addButtonHoverEffects = (button) => {
  button.addEventListener("mouseenter", () => {
    button.style.transform = "translateY(-2px)";
    button.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "translateY(0)";
    button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
  });
};

// Handle text selection
let selectedText = "";
let floatingButton = null;

function handleSelection() {
  const selection = window.getSelection();
  const text = selection.toString().trim();

  if (text && text.length > 0) {
    selectedText = text;

    // if (!floatingButton) {
    //   floatingButton = createFloatingButton();
    //   addButtonHoverEffects(floatingButton);
    //   document.body.appendChild(floatingButton);
    // }
  } else {
    if (floatingButton) {
      floatingButton.remove();
      floatingButton = null;
    }
  }
}

function handleCreation() {
  // Send message to background script to save the flashcard
  chrome.runtime.sendMessage({
    type: "CREATE_FLASHCARD",
    content: selectedText,
    url: window.location.href,
    title: document.title,
  });

  // Remove the floating button
  if (floatingButton) {
    floatingButton.remove();
    floatingButton = null;
  }

  // Show a success notification
  const notification = document.createElement("div");
  notification.className = "flashx-notification";
  notification.textContent = "Flashcard created!";
  notification.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 8px 16px;
  background-color: #10B981;
  color: white;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  z-index: 10000;
  animation: fadeInOut 2s ease-in-out;
`;

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2000);
}

function handleSelectionAndCreation() {
  console.log("handleSelectionAndCreation");
  handleSelection();
  if (selectedText) handleCreation();
}

document.addEventListener("mouseup", handleSelection);

// Handle flashcard creation
document.addEventListener("click", (e) => {
  if (e.target.className === "flashx-floating-button" && selectedText) {
    handleCreation();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.shiftKey && event.key === "X") {
    handleSelectionAndCreation();
  }
});
