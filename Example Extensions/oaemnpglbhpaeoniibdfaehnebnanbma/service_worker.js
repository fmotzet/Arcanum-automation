//-----------------------------------------------
// Global.
var DEFAULT_CACHE_TTL = 60;
var QUERY_TIMEOUT = 6;
var MAX_CONN_ERR_CNT = 20;
var ERR_KW = "127.100.100.1";
var SUCC_KW = "127.100.100.100";
var SIGNAL_PING = "ping.signal.nxfilter.org";
var BLOCKIP_URL = "https://redip.nxfilter.org/redip.jsp?action=get";

var g_debug_flag = true;
var g_domain_cache = {};
var g_conn_err_cnt = 0;
var g_block_ip = "";
var g_tab_id = 0;

var g_start_page = "";
var g_start_page_parse_cnt = 0;

var log = new NxLog();
var cfg = new Config();

//###############################################
// Function.
String.prototype.format = function () {
  var formatted = this;
  for (var i = 0; i < arguments.length; i++) {
    var regexp = new RegExp("\\{" + i + "\\}", "gi");
    formatted = formatted.replace(regexp, arguments[i]);
  }
  return formatted;
};

//-----------------------------------------------
function str_is_empty(str) {
  return typeof str == "undefined" || str == null || str == "";
}

//-----------------------------------------------
function str_is_not_empty(str) {
  return !str_is_empty(str);
}

//-----------------------------------------------
function str_starts_with(str, prefix) {
  return str.indexOf(prefix) == 0;
}

//-----------------------------------------------
function str_ends_with(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

//-----------------------------------------------
function null2str(obj) {
  if (typeof obj == "undefined") {
    return "";
  }
  return obj == null ? "" : obj;
}

//-----------------------------------------------
function null2bool(obj) {
  if (typeof obj == "undefined") {
    return false;
  }
  return obj == null ? false : obj;
}

//-----------------------------------------------
function get_date14_win() {
  var d = new Date();

  var yyyy = d.getFullYear();

  var mm = d.getMonth() + 1;
  if (mm < 10) {
    mm = "0" + mm;
  }

  var dd = d.getDate();
  if (dd < 10) {
    dd = "0" + dd;
  }

  var hh = d.getHours();
  if (hh < 10) {
    hh = "0" + hh;
  }

  var mi = d.getMinutes();
  if (mi < 10) {
    mi = "0" + mi;
  }

  var ss = d.getSeconds();
  if (ss < 10) {
    ss = "0" + ss;
  }

  return yyyy + "/" + mm + "/" + dd + " " + hh + ":" + mi + ":" + ss;
}

//-----------------------------------------------
function get_date10_win() {
  var d = new Date();

  var yyyy = d.getFullYear();

  var mm = d.getMonth() + 1;
  if (mm < 10) {
    mm = "0" + mm;
  }

  var dd = d.getDate();
  if (dd < 10) {
    dd = "0" + dd;
  }

  var hh = d.getHours();
  if (hh < 10) {
    hh = "0" + hh;
  }

  var mi = d.getMinutes();
  if (mi < 10) {
    mi = "0" + mi;
  }

  var ss = d.getSeconds();
  if (ss < 10) {
    ss = "0" + ss;
  }

  return mm + "/" + dd + " " + hh + ":" + mi + ":" + ss;
}

//-----------------------------------------------
function get_date_hhmm() {
  var d = new Date();

  var hh = d.getHours();
  if (hh < 10) {
    hh = "0" + hh;
  }

  var mi = d.getMinutes();
  if (mi < 10) {
    mi = "0" + mi;
  }

  return hh + "" + mi;
}

//-----------------------------------------------
function get_location(href) {
  var location = document.createElement("a");
  location.href = href;

  if (str_is_empty(location.host)) {
    location.href = location.href;
  }
  return location;
}

//-----------------------------------------------
function hx_lookup(domain) {
  if (str_is_empty(get_hx_url())) {
    log.error("hx_lookup, Invalid hx_url!");
    return;
  }

  if (g_conn_err_cnt > MAX_CONN_ERR_CNT) {
    log.info("hx_lookup, We don't see a proper server running.");
    return;
  }

  g_conn_err_cnt++;

  var tgt_url = get_hx_url() + "?action=/IBR&domain=" + domain;

  fetch(tgt_url)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      log.debug("hx_lookup, Lookup for " + domain + ", " + text);

      if (text == "/BLOCK") {
        g_conn_err_cnt = 0;

        log.debug("hx_lookup, Adding cache-block for " + domain);
        add_domain_cache(domain, true);

        // We need to forward it here if it's a first query not cached.
        redi_new_url(get_block_url(domain));
      } else if (text == "/LOGIN") {
        redi_new_url(get_login_url());
      } else if (text == "/LOGOUT") {
        redi_new_url(get_logout_url());
      } else if (text == "/ADMIN") {
        redi_new_url(get_admin_url());
      } else {
        g_conn_err_cnt = 0;
      }
    })
    .catch(function () {
      log.error("hx_lookup, Connection error!");
    });
}

//-----------------------------------------------
function wait_conn(callback, sock, interval) {
  if (sock.readyState === 1) {
    callback();
  } else {
    setTimeout(function () {
      wait_conn(callback, sock, interval);
    }, interval);
  }
}

//-----------------------------------------------
function unix_timestamp() {
  return Math.round(new Date().getTime() / 1000);
}

//-----------------------------------------------
function add_domain_cache(domain, block_flag) {
  var dd = {};
  dd.domain = domain;
  dd.block_flag = block_flag;
  dd.timestamp = unix_timestamp();

  g_domain_cache[domain] = dd;
}

//-----------------------------------------------
function get_cached_domain(domain) {
  var dd = g_domain_cache[domain];

  if (
    dd != null &&
    dd.block_flag &&
    parseInt(dd.timestamp) >= unix_timestamp() - DEFAULT_CACHE_TTL
  ) {
    return dd;
  }
  return null;
}

//-----------------------------------------------
function is_blocked_recently(domain) {
  log.debug("is_blocked_recently, Checking for " + domain);

  var dd = get_cached_domain(domain);
  if (dd == null) {
    hx_lookup(domain);
    return false;
  }

  log.debug("Found cache for " + domain + ", " + dd.block_flag);
  return dd.block_flag;
}

//-----------------------------------------------
function get_hx_url() {
  if (!is_valid_ip(g_block_ip)) {
    log.error("get_hx_url, No g_block_ip set!");
    return "";
  }
  return "http://" + g_block_ip + "/hxlistener";
}

//-----------------------------------------------
function old_set_block_ip() {
  if (str_is_not_empty(g_block_ip)) {
    log.info("set_block_ip, We already have g_block_ip = " + g_block_ip);
    return;
  }

  fetch(BLOCKIP_URL)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      if (is_valid_ip(text)) {
        g_block_ip = text;
        log.info("set_block_ip, By remote lookup, g_block_ip = " + g_block_ip);

        // Save options.
        var items = { oldIp: g_block_ip };
        chrome.storage.sync.set(items, function () {
          log.info("New option saved from set_block_ip.");
        });

        // Don't load it again.
        // We already set g_block_ip.
        //cfg.load();
      } else {
        if (is_valid_ip(cfg.oldIp)) {
          log.info("set_block_ip, By oldIp, g_block_ip = " + g_block_ip);
          g_block_ip = cfg.oldIp;
        }
      }
    })
    .catch(function () {
      log.error("Connection error!");
    });
}

//-----------------------------------------------
function save_block_ip(tgt_url) {
  fetch(tgt_url)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      if (is_valid_ip(text)) {
        // Save options.
        var items = { server: g_block_ip };
        chrome.storage.sync.set(items, function () {
          log.info("save_block_ip, New option saved.");
        });

        // Don't load it again.
        // We already set g_block_ip.
        //cfg.load();
      }
    })
    .catch(function () {
      log.error("save_block_ip, Connection error!");
    });
}

//-----------------------------------------------
function set_block_ip() {
  if (str_is_not_empty(g_block_ip)) {
    log.info("set_block_ip, We already have g_block_ip = " + g_block_ip);
    return;
  }

  fetch(BLOCKIP_URL)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      if (is_valid_ip(text)) {
        g_block_ip = text;
        log.info("set_block_ip, By remote lookup, g_block_ip = " + g_block_ip);

        var tgt_url = get_hx_url() + "?action=/GBI";
        save_block_ip(tgt_url);
      }
    })
    .catch(function () {
      log.error("set_block_ip, Connection error!");
    });
}

//-----------------------------------------------
function get_block_url(domain) {
  if (str_is_empty(g_block_ip)) {
    log.error("get_block_url, No g_block_ip set!");
    return "";
  }

  return "http://" + g_block_ip + "/block,chrome.jsp?domain=" + domain;
}

//-----------------------------------------------
function get_login_url() {
  if (str_is_empty(g_block_ip)) {
    log.error("get_login_url, No g_block_ip set!");
    return "";
  }

  return "http://" + g_block_ip + "/block,login.jsp";
}

//-----------------------------------------------
function get_logout_url() {
  if (str_is_empty(g_block_ip)) {
    log.error("get_logout_url, No g_block_ip set!");
    return "";
  }

  return "http://" + g_block_ip + "/block,login.jsp?actionFlag=logout";
}

//-----------------------------------------------
function get_admin_url() {
  if (str_is_empty(g_block_ip)) {
    log.error("get_login_url, No g_block_ip set!");
    return "";
  }

  return "http://" + g_block_ip + "/admin.jsp";
}

//-----------------------------------------------
function redi_new_url(url) {
  log.info("redi_new_url, " + url);
  /*
	if(g_tab_id == null || g_tab_id <= 0){
		chrome.tabs.update({url: url});
		return;
	}
	*/

  /*
	chrome.tabs.query({}, function(tabs) {
		for(let i = 0; i < tabs.length; i++){
			if (tabs[i].id === g_tab_id) {
				chrome.tabs.update(g_tab_id, {url: url});
				return;
			}
		}
		log.error("redi_new_url, No tab exists for tabid = " + g_tab_id);
	});
	*/

  setTimeout(function () {
    chrome.tabs.update({ url: url });
  }, 100);

  //chrome.tabs.update({url: url});
}

//-----------------------------------------------
function is_valid_ip(ip) {
  return ip.search("^[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}$") > -1;
}

//###############################################
// NxLog.
function NxLog() {
  //-----------------------------------------------
  this.debug = function (line) {
    if (!g_debug_flag) {
      return;
    }
    console.log("DEBUG [{0}] {1}".format(get_date10_win(), line));
  };

  //-----------------------------------------------
  this.info = function (line) {
    console.log("INFO [{0}] {1}".format(get_date10_win(), line));
  };

  //-----------------------------------------------
  this.error = function (line) {
    console.log("ERROR [{0}] {1}".format(get_date10_win(), line));
  };
}

//###############################################
// Config.
function Config() {
  this.server = "";
  this.load_time = 0;

  // Binding this to self.
  var self = this;

  //-----------------------------------------------
  this.load = function () {
    var keys = ["server"];

    chrome.storage.sync.get(keys, function (items) {
      self.server = null2str(items.server);

      if (str_is_empty(self.server)) {
        g_block_ip = "";
      } else {
        g_block_ip = self.server;
      }

      self.print();
    });

    this.load_time = unix_timestamp();
  };

  //-----------------------------------------------
  this.is_valid = function () {
    return str_is_not_empty(this.server);
  };

  //-----------------------------------------------
  this.print = function () {
    log.debug("Config.server = " + this.server);
    log.debug("Config.load_time = " + this.load_time);
  };
}

//-----------------------------------------------
function parse_start_page() {
  log.debug("parse_start_page.");
  if (str_is_empty(g_start_page) || !str_starts_with(g_start_page, "http")) {
    log.info("parse_start_page, We don't have a start page!");
    return;
  }

  var tgt_url = g_start_page;
  if (tgt_url.indexOf("?") > -1) {
    tgt_url += "&" + unix_timestamp();
  } else {
    tgt_url += "?" + unix_timestamp();
  }

  fetch(tgt_url)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      var lines = text.split(/\n/);
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.indexOf("<body") > -1 || line.indexOf("<BODY") > -1) {
          break;
        }

        if (line.indexOf("<meta") > -1 && line.indexOf("cxforward") > -1) {
          line = line.replace(/^.+content/, "");
          line = line.replace(/\s+/g, "");
          line = line.replace(/[='"\/>]/g, "");

          log.debug("parse_start_page, parsed line = " + line);
          var server = line;

          if (
            str_is_empty(server) ||
            server.indexOf("/") > -1 ||
            !is_valid_ip(server)
          ) {
            log.error("parse_start_page, Invalid IP!");
            return;
          }

          // Save options.
          var items = { server: server };
          chrome.storage.sync.set(items, function () {
            log.info("parse_start_page, New option saved.");
          });

          cfg.load();

          return;
        }
      }
    })
    .catch(function () {
      log.error("parse_start_page, Connection error!");
    });
}

//###############################################
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  if (str_is_empty(g_start_page) && tabs[0] != null) {
    g_start_page = tabs[0].url;
    log.debug("g_start_page = " + g_start_page);

    if (g_start_page_parse_cnt++ < 3) {
      parse_start_page();
    }
  }
});

//-----------------------------------------------
chrome.webNavigation.onBeforeNavigate.addListener(
  function (details) {
    // 'details.url.indexOf(g_block_ip) > -1' bypasses this function when there's no server IP set.
    // It's not intended but works for us.
    console.log(details.url);
    //console.log(g_block_ip);
    if (
      details.url == null ||
      details.url.indexOf(".") == -1 ||
      details.url.indexOf(g_block_ip) > -1
    ) {
      return;
    }

    g_tab_id = details.tabId;
    var host = new URL(details.url).hostname;

    if (details.frameId == 0 && details.url.indexOf(".") > -1) {
      log.info("onBeforeNavigate, " + details.url);

      if (is_blocked_recently(host)) {
        // We need to forward it here if it's from cache.
        return { redirectUrl: redi_new_url(get_block_url(host)) };
      }
    }
  },
  {
    urls: ["https://*/*"],
  },
  ["blocking"]
);

//-----------------------------------------------
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === "/CFG") {
    cfg.load();
  }
  sendResponse("whatever");
});

//-----------------------------------------------
// Main.
log.info("Init..");
cfg.load();

setTimeout(function () {
  set_block_ip();
}, 1000 * 3);

/*
setInterval(function(){
	set_block_ip();
}, 1000 * 60);
*/
