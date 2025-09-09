async function deleteDomainCookies(e) {
  let o = 0;
  try {
    const r = await chrome.cookies.getAll({ domain: e });
    if (0 === r.length) return "No cookies found";
    var t = r.map(deleteCookie);
    await Promise.all(t), (o = t.length);
  } catch (e) {
    return "Unexpected error: " + e.message;
  }
  return `Deleted ${o} cookie(s).`;
}
function deleteCookie(e) {
  var o = (e.secure ? "https:" : "http:") + "//" + e.domain + e.path;
  return chrome.cookies.remove({ url: o, name: e.name, storeId: e.storeId });
}
export { deleteDomainCookies };
