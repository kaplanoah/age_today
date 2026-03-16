chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "get-age-today",
    title: "Get Age Today",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "open-age-today",
    title: "Open Age Today",
    contexts: ["page"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "get-age-today") {
    chrome.storage.local.set({ contextMenuDate: info.selectionText }, () => {
      chrome.action.openPopup();
    });
  } else if (info.menuItemId === "open-age-today") {
    chrome.action.openPopup();
  }
});
