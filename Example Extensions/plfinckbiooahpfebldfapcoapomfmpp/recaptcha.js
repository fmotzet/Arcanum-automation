(async () => {
  const { Time: e, BG: t } = await import(chrome.runtime.getURL("utils.js"));
  for (;;) {
    await e.sleep(1e3);
    var a = await t.exec("get_settings");
    a && a.solve_method;
  }
})();
