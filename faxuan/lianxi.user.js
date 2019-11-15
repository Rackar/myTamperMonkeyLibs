// ==UserScript==
// @name         法宣练习页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://xf.faxuan.net/sps/exercises/t/exercies*
// @grant        none
// ==/UserScript==

(function() {
  "use strict";
  function closeCurrentPage() {
    var userAgent = navigator.userAgent;
    if (
      userAgent.indexOf("Firefox") != -1 ||
      userAgent.indexOf("Chrome") != -1
    ) {
      window.location.href = "about:blank";
      window.close();
    } else {
      window.opener = null;
      window.open("", "_self");
      window.close();
    }
  }
  setTimeout(function() {
    // console.log("monkey");
    // console.log(trs);

    sps.myCommit();

    setTimeout(function() {
      var trs = $("div#popwinContent a#popwinConfirm");
      trs.click();
      setTimeout(closeCurrentPage, 2000);
    }, 1000);

    // doAllClassListen(arrNeed);
  }, 4000);
})();
