/********/
var background = {};
if (typeof chrome !== 'undefined') {
  background.send = function (id, data) {
    chrome.extension.sendRequest({method: id, data: data});
  }
  background.receive = function (id, callback) {
    chrome.extension.onRequest.addListener(function(request, sender, callback2) {
      if (request.method == id) {
        callback(request.data);
      }
    });
  }
  window.setTimeout(function () {
    //$("").focus();
  }, 100);
}
else {
  background.send = function (id, data) {
    self.port.emit(id, data);
  }
  background.receive = function (id, callback) {
    self.port.on(id, callback);
  }
  self.port.on("show", function () {
    //$("").focus();
  });
}
/********/

function $ (id) {
  return document.getElementById(id);
}

$('undo-td').addEventListener('click', function () {
    background.send("undo");
}, false);

$('redo-td').addEventListener('click', function () {
    background.send("redo");
}, false);