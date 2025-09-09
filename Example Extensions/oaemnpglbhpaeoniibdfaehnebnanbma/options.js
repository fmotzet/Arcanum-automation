//-----------------------------------------------
// Global.
var ERR_KW = "127.100.100.1";
var SUCC_KW = "127.100.100.100";
var SIGNAL_PING = "ping.signal.nxfilter.org";

//-----------------------------------------------
function str_is_empty(str) {
  return typeof str == "undefined" || str == null || str == "";
}

//-----------------------------------------------
function str_is_not_empty(str) {
  return !str_is_empty(str);
}

//-----------------------------------------------
function is_valid_ip(ip) {
  return ip.search("^[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}$") > -1;
}

//-----------------------------------------------
function save_conn() {
  var server = $("#server").val();

  // We can save an empty server IP to use auto-discovery.
  // But not an invalid IP.
  if (!str_is_empty(server) && !is_valid_ip(server)) {
    alert("Invalid server IP!");
    return false;
  }

  var items = { server: server };
  chrome.storage.sync.set(items, function () {
    // Send message to service worker.
    chrome.runtime.sendMessage({ msg: "/CFG" }, function (response) {
      alert("New option saved. You may need to reload CxForward.");
    });
  });
}

//-----------------------------------------------
function load_gui() {
  var keys = ["server"];

  chrome.storage.sync.get(keys, function (items) {
    $("#server").val(items.server);
  });
}

//-----------------------------------------------
function do_test() {
  var server = $("#server").val();

  if (!is_valid_ip(server)) {
    alert("Invalid server IP!");
    return false;
  }

  var tgt_url =
    "http://" +
    server +
    "/hxlistener?token=192.168.0.100&domain=" +
    SIGNAL_PING;

  fetch(tgt_url)
    .then(function (response) {
      if (response.status != 200) {
        alert("Connection error!");
        return;
      }

      return response.text();
    })
    .then(function (text) {
      if (text == ERR_KW) {
        alert("Login error! - " + server);
      } else if (text == SUCC_KW) {
        alert("Test success!");
      } else {
        alert("Unknown error! - " + server);
      }
    })
    .catch(function () {
      alert("Connection error!");
    });
}

//###############################################
$(document).ready(function () {
  // Load values.
  load_gui();

  $("#btn_test_conn").click(function () {
    do_test();
  });

  $("#btn_save_conn").click(function () {
    save_conn();
  });
});

//-----------------------------------------------
setTimeout(function () {
  $("body").show();
}, 200);
