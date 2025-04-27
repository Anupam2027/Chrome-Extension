document.addEventListener('DOMContentLoaded', () => {
  const highlightsDiv = document.getElementById('highlights');
  const summarizeBtn = document.getElementById('summarize');
  const clearAllBtn = document.getElementById('clearAll');
  const summaryDiv = document.getElementById('summary');

  function loadHighlights() {
      highlightsDiv.innerHTML = ''; // Clear old highlights

      chrome.storage.local.get(['highlights'], (result) => {
          if (result.highlights && result.highlights.length > 0) {
              result.highlights.forEach((highlight, index) => {
                  const div = document.createElement('div');
                  div.className = 'highlight';
                  div.textContent = highlight.text;

                  // Create Delete Button
                  const deleteBtn = document.createElement('button');
                  deleteBtn.textContent = 'Delete';
                  deleteBtn.className = 'delete-btn';
                  deleteBtn.addEventListener('click', () => {
                      deleteHighlight(index);
                  });

                  div.appendChild(deleteBtn);
                  highlightsDiv.appendChild(div);
              });
          } else {
              highlightsDiv.textContent = 'No highlights found.';
          }
      });
  }

  function deleteHighlight(index) {
      chrome.storage.local.get(['highlights'], (result) => {
          if (result.highlights) {
              result.highlights.splice(index, 1); // Remove the selected highlight
              chrome.storage.local.set({ highlights: result.highlights }, () => {
                  loadHighlights(); // Reload highlights after deleting
              });
          }
      });
  }

  function clearAllHighlights() {
      chrome.storage.local.set({ highlights: [] }, () => {
          loadHighlights();
          summaryDiv.textContent = '';
      });
  }

  summarizeBtn.addEventListener('click', () => {
      chrome.storage.local.get(['highlights'], (result) => {
          if (result.highlights && result.highlights.length > 0) {
              const combinedText = result.highlights.map(h => h.text).join(' ');

              const summary = combinedText.length > 150 ? combinedText.substring(0, 150) + '...' : combinedText;

              summaryDiv.textContent = summary;
          } else {
              summaryDiv.textContent = 'No highlights to summarize.';
          }
      });
  });

  clearAllBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete all highlights?')) {
          clearAllHighlights();
      }
  });

  loadHighlights();
});
