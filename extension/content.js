document.addEventListener("mouseup", async () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    console.log("Selected Word:", selectedText);
    chrome.runtime.sendMessage(
      { type: "lookupWord", word: selectedText },
      (response) => {
        if (response && response.data) {
          console.log("Word Info:", response.data);
        }
      }
    );
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "get_selected_text") {
    const selectedText = window.getSelection().toString().trim();
    boldWords(selectedText);
    console.log("tu dc gui len tu bg:", selectedText);
  }
});

function boldWords(targetWord) {
  const elements = document.body.querySelectorAll("*:not(script):not(style)");
  elements.forEach((el) => {
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const regex = new RegExp(`\\b${targetWord}\\b`, "g");
        if (regex.test(node.textContent)) {
          const newHTML = node.textContent.replace(
            regex,
            `<span style="font-weight: bold; color: red;">${targetWord}</span>` // Thêm style inline
          );
          const wrapper = document.createElement("span");
          wrapper.innerHTML = newHTML;
          el.replaceChild(wrapper, node);
        }
      }
    });
  });
}
