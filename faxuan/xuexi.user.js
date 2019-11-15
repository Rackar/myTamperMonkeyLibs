// ==UserScript==
// @name         法宣学习页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://xf.faxuan.net/sps/courseware/t/courseware_1_t.html*
// @grant        none
// ==/UserScript==

(function() {
  "use strict";

  setTimeout(function() {
    var trs = $("div.kclx ul#lx-box-id a");
    trs[0].click();
    console.log(trs);

    setTimeout(function() {
      sps.exitStudy("timer");

      setTimeout(function() {
        var trs = $("div#popwinContent a#popwinConfirm");
        trs.click();
      }, 1000);
    }, 10 * 60 * 1000 + 10000);
  }, 4000);
  // Your code here...
})();
