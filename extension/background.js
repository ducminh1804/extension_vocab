import { vocab } from "./fetchVocab.js";

chrome.runtime.onInstalled.addListener(() => {
  console.log("chao mung ban da cai dat extension");
  chrome.alarms.create("keepAlive", { periodInMinutes: 1 });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "lookupWord") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        vocab(message.word).then((res) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "show_word_info",
            data: res,
          });
          sendResponse({ data: res });
        });
      }
    });
  }
  return true;
});

// ban msg ve cho content
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-feature") {
    console.log("🎯 Tổ hợp Ctrl + Q đã được nhấn!");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "get_selected_text" });
      }
    });
  }
});
