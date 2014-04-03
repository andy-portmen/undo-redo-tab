var storage, get, popup, window, Deferred, content_script, tab, contextMenu, version;

/*
Storage Items:
  "history"
  "from"
  "to"
  "isTextSelection"
  "isDblclick"
  "enableHistory"
  "numberHistoryItems"
*/

/********/
if (typeof require !== 'undefined') {
  var firefox = require("./firefox.js");
  storage = firefox.storage;
  get = firefox.get;
  popup = firefox.popup;
  window = firefox.window;
  content_script = firefox.content_script;
  tab = firefox.tab;
  contextMenu = firefox.contextMenu;
  version = firefox.version;
  Deferred = firefox.Promise.defer;
}
else {
  storage = _chrome.storage;
  get = _chrome.get;
  popup = _chrome.popup;
  content_script = _chrome.content_script;
  tab = _chrome.tab;
  contextMenu = _chrome.contextMenu;
  version = _chrome.version;
  Deferred = task.Deferred;
}
/********/

if (storage.read("version") != version()) {
  storage.write("version", version());
  tab.open("http://add0n.com/duplicate-tab.html");
}

var created_tabs = {};
var removed_tabs = {};
var ID = [];

function iSin(n,a) {
  for (var i = 0; i < a.length; i++)
    if (a[i] == n) return true;
  return false;
}

chrome.tabs.onCreated.addListener(function () {
  chrome.tabs.onUpdated.addListener(function(tabId , info) {
    var http  = info.url.indexOf("http") != -1;
    var https = info.url.indexOf("https") != -1;
    var www   = info.url.indexOf("www") != -1;
    if (info.status == "loading" && (http || https || www)) {
      created_tabs[tabId] = info.url;
    }
  });   
});

chrome.tabs.onRemoved.addListener(function (id) {
  removed_tabs[id] = created_tabs[id];
  if (!iSin(id,ID)) {ID.push(id);}
});

popup.receive("undo", function () {
  if (ID.length > 0) {
    var lastTabId = ID[ID.length - 1];
    tab.open(removed_tabs[lastTabId]);
    ID.splice(ID.length-1, 1);
  }
});

popup.receive("redo", function () {
  chrome.tabs.query(
    {active:true, windowType:"normal", currentWindow: true},
    function(e){tab.open(created_tabs[e[0].id]);}
  );
});
