document.addEventListener("mouseup", async (event) => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    if (sessionStorage.getItem(selectedText.toLowerCase()) != null) {
      const { examples, ipa, meanings } = JSON.parse(
        sessionStorage.getItem(selectedText.toLowerCase())
      );
      generateTooltip(examples, ipa, meanings, event);
    } else {
      console.log("Selected Word:", selectedText);
      try {
        chrome.runtime.sendMessage(
          { type: "lookupWord", word: selectedText },
          (response) => {
            console.log("Word Info:", response.data);
            if (response) {
              const { examples, ipa, meanings } = response.data;
              generateTooltip(examples, ipa, meanings, event);
              // Tạo container chính
              sessionStorage.setItem(
                selectedText.toLowerCase(),
                JSON.stringify(response.data)
              );
            } else {
              tooltip.style.display = "none";
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "get_selected_text":
      const selectedText = window.getSelection().toString().trim();
      const dataReturn = sessionStorage.getItem(selectedText);
      boldWords(selectedText);
      //gui cho tu in dam // line 26
      sendResponse({ key: selectedText, value: dataReturn });
      break;

    default:
      break;
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

const tooltip = document.createElement("div");
tooltip.style.position = "absolute";
tooltip.style.background = "white";
tooltip.style.color = "black";
tooltip.style.padding = "5px";
tooltip.style.borderRadius = "5px";
tooltip.style.display = "none";
tooltip.style.fontSize = "15px";
tooltip.style.pointerEvents = "none";
document.body.appendChild(tooltip);

document.addEventListener("mousedown", () => {
  tooltip.style.display = "none";
});

const generateTooltip = (examples, ipa, meanings, event) => {
  const divParent = document.createElement("div");
  divParent.style.cssText = `
          background: #222;
          color: white;
          padding: 12px;
          border-radius: 8px;
          width: 80vw;
          font-size: 14px;
          max-width: 800px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
          position: absolute;
          z-index: 9999;`;

  // Hiển thị IPA
  if (ipa) {
    const ipaDiv = document.createElement("div");
    ipaDiv.style.cssText = `
            font-style: italic;
            color: #f87171;
            font-size: 16px;
            margin-bottom: 8px;`;
    ipaDiv.innerHTML = `<strong>IPA:</strong> <em>${ipa}</em>`;
    divParent.appendChild(ipaDiv);
  }

  // Hiển thị Meanings
  if (meanings.length > 0) {
    const meaningsDiv = document.createElement("div");
    meaningsDiv.innerHTML = `<strong>Meanings:</strong>`;
    meaningsDiv.style.marginBottom = "8px";

    const ul = document.createElement("ul");
    ul.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 0;
    margin-top: 5px;
    list-style: none;
  `;

    meanings.forEach((meaning) => {
      const li = document.createElement("li");
      li.innerText = meaning;
      li.style.cssText = `
      background: #333;
      padding: 6px 10px;
      border-radius: 5px;
      color: white;
      font-size: 14px;
    `;
      ul.appendChild(li);
    });

    meaningsDiv.appendChild(ul);
    divParent.appendChild(meaningsDiv);
  }

  // Hiển thị Examples
  if (examples.length > 0) {
    const examplesDiv = document.createElement("div");
    examplesDiv.innerHTML = `<strong>Examples:</strong>`;
    examplesDiv.style.marginTop = "10px";

    examples.forEach((example) => {
      const exampleDiv = document.createElement("div");
      exampleDiv.style.cssText = `
              margin-top: 10px;
              padding: 8px;
              background: #333;
              border-radius: 6px;`;

      const strong = document.createElement("strong");
      strong.innerText = example.sentence;
      strong.style.color = "#38bdf8";
      strong.style.display = "block";

      const explanation = document.createElement("p");
      explanation.innerText = example.explanation;
      explanation.style.marginTop = "5px";

      exampleDiv.appendChild(strong);
      exampleDiv.appendChild(explanation);
      examplesDiv.appendChild(exampleDiv);
    });

    divParent.appendChild(examplesDiv);
  }

  tooltip.innerHTML = "";
  tooltip.appendChild(divParent);

  tooltip.style.left = `20%`;
  tooltip.style.top = `${event.pageY + 10}px`;
  tooltip.style.display = "block";
};
