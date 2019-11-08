export default class {

  getTabs() {
    return new Promise(
      (resolve) => chrome.tabs.query({}, tabs => resolve({ tabs }))
    );
  }

  switchToTab(tab) {
    chrome.tabs.update(tab.id, { selected: true });
    chrome.windows.update(tab.windowId, { focused: true });
  }

  closeTab(tab) {
    chrome.tabs.remove(tab.id);
  }

}