document.addEventListener('mouseup', function (e) {
  const selectedText = window.getSelection().toString().trim();

  if (selectedText.length > 0) {
      const popup = document.createElement('div');
      popup.textContent = 'Save Highlight?';
      popup.style.position = 'absolute';
      popup.style.top = (e.pageY + 10) + 'px';
      popup.style.left = (e.pageX + 10) + 'px';
      popup.style.backgroundColor = '#4CAF50';
      popup.style.color = 'white';
      popup.style.padding = '8px';
      popup.style.borderRadius = '5px';
      popup.style.cursor = 'pointer';
      popup.style.zIndex = '9999';
      popup.style.fontSize = '14px';
      document.body.appendChild(popup);

      popup.addEventListener('click', function () {
          chrome.storage.local.get({ highlights: [] }, function (result) {
              const highlights = result.highlights;
              highlights.push({ text: selectedText });
              chrome.storage.local.set({ highlights: highlights }, function () {
                  console.log('Highlight saved:', selectedText);
              });
          });
          document.body.removeChild(popup);
      });

      setTimeout(() => {
          if (document.body.contains(popup)) {
              document.body.removeChild(popup);
          }
      }, 4000);
  }
});
