import { vocab } from "./fetchVocab.js";

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("keepAlive", { periodInMinutes: 1 });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "lookupWord") {
    vocab(message.word).then((res) => console.log(res));
  }
});

//ban msg ve cho content
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-feature") {
    console.log("🎯 Tổ hợp Ctrl + Q đã được nhấn!");

    // Lấy từ đang được bôi đen từ content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "get_selected_text" });
      }
    });
  }
});

// Hàm lấy từ bôi đen và gửi về background
