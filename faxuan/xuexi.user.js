// ==UserScript==
// @name         法宣学习页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://xf.faxuan.net/sps/courseware/t/courseware_1_t.html*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  setTimeout(function () {
    var trs = $("div.kclx ul#lx-box-id a");
    if (trs.length) {
      //如果有练习，就直接点两次完成练习。
      trs[0].click();
      setTimeout(function () {
        trs[0].click();
      }, 15000);
    }

    console.log(trs);

    setTimeout(function () {
      sps.exitStudy("timer");

      setTimeout(function () {
        var tds = $("div#popwinContent a#popwinConfirm");
        tds.click();
      }, 2000);
    }, 10 * 60 * 1000 + 10000);
  }, 4000);
  // Your code here...
})();
