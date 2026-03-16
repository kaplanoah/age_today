chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "get-age-today",
    title: "Get Age Today",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== "get-age-today") return;
  chrome.storage.local.set({ contextMenuDate: info.selectionText }, () => {
    chrome.action.openPopup();
  });
});
